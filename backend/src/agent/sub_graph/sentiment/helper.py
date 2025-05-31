from nltk.sentiment import SentimentIntensityAnalyzer
from typing import Dict

def vader_sentiment(text: str) -> Dict[str, float]:
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(text)