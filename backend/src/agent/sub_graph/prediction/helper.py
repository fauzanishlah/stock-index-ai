import mlflow
import mlflow.tensorflow
import tempfile
from mlflow.client import MlflowClient
import joblib
from datetime import timedelta
import pandas as pd
import numpy as np
from src.db.database import engine
from src.core.config import settings


MLFLOW_TRACKING_URL = settings.MLFLOW_TRACKING_URL
features = ['return', 'return_3d_avg', 'return_5d_avg', 'return_7d_avg', 'sentiment_fill_1_1d']

def load_model(ticker: str):
    print("MLFLOW_TRACKING_URL", MLFLOW_TRACKING_URL)
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URL)
    with tempfile.TemporaryDirectory() as tmp:
        loaded_model = mlflow.tensorflow.load_model(f"models:/model-{ticker}/latest", tmp)
    return loaded_model

def load_scaler(ticker: str):
    client = MlflowClient(tracking_uri=MLFLOW_TRACKING_URL)
    run_id = client.get_registered_model(f'model-{ticker}').latest_versions[0].run_id
    with tempfile.TemporaryDirectory() as tmp:
        path = client.download_artifacts(run_id=run_id, path='scaler', dst_path=tmp) 
        print(path)
        scaler = joblib.load(path + f"/scaler-{ticker}.pkl")
    return scaler

def load_data(ticker: str, n_days: int = 30):
    sql = f"""
        SELECT "Date", "return" AS return, "sentiment" AS sentiment, "company" AS company
        FROM data_stock_price
        WHERE "company" = '{ticker}'
        ORDER BY "Date" DESC
        LIMIT {n_days}
        ;
    """
    df = pd.read_sql(sql, engine)
    
    df.set_index('Date', inplace=True)
    df.sort_index(inplace=True)
    return df

def processing_data(df: pd.DataFrame):
    df.sort_index(inplace=True)
    df['sentiment_fill_1_1d'] = df['sentiment']
    df['return_3d_avg'] = df['return'].rolling(window=3, min_periods=1).mean()
    df['return_5d_avg'] = df['return'].rolling(window=5, min_periods=1).mean()
    df['return_7d_avg'] = df['return'].rolling(window=7, min_periods=1).mean()
    
    df = df[features]
    return df

def change_last_sentiment(df: pd.DataFrame, sentiment: float):
    df.loc[df.index[-1], 'sentiment'] = sentiment
    return df

def transform_data(df, scaler):
    scaled_data = scaler.transform(df[-30:])
    sequence = scaled_data.reshape(1, 30, len(features))
    return sequence
    
def reshape_y_value(y_value, n_features):
    return np.concatenate([y_value.reshape(-1, 1), np.zeros((len(y_value), n_features-1))], axis=1)

def create_predict_dataframe(*, ticker: str, sentiment: float, return_value: float, index: list):
    df = pd.DataFrame({
        "company": ticker,
        "sentiment": sentiment,
        "return": return_value,
    }, index=index)
    return df

def predict(ticker: str, sentiment: float = 0, n_days: int = 1):
    model = load_model(ticker=ticker)
    scaler = load_scaler(ticker=ticker)
    raw_data = load_data(ticker=ticker, n_days=40)
    raw_data = change_last_sentiment(raw_data, sentiment=sentiment)
    last_date = raw_data.index[-1].to_pydatetime()
    return_data = pd.DataFrame()
    
    for i in range(n_days):
        processed_data = processing_data(df=raw_data)
        scaled_data = transform_data(df=processed_data, scaler=scaler)    
        predict_value = model.predict(scaled_data)
        original_predict_value = scaler.inverse_transform(reshape_y_value(y_value = predict_value, n_features = len(features)))[:, 0]
        predict_date = last_date + timedelta(i+1)
        predict_data = create_predict_dataframe(ticker=ticker, sentiment=sentiment, return_value=original_predict_value, index=[predict_date])
        return_data = pd.concat([return_data, predict_data])
        raw_data = pd.concat([raw_data, predict_data])
        
    return return_data