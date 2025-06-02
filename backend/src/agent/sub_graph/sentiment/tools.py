from langchain.schema import HumanMessage, AIMessage
from langchain_google_vertexai import ChatVertexAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool

from src.agent.sub_graph.sentiment.helper import vader_sentiment
from src.core.config import settings



@tool("translate_to_english", parse_docstring=True)
def translate_to_english(text: str) -> dict:
    """
    Translates any non-English text to English using Google's Gemini model.
    
    This tool should be used as a preprocessing step when the AI agent encounters
    non-English text that needs analysis by English-only tools (e.g., sentiment analysis).
    Ensures compatibility with downstream natural language processing components.
    
    Args:
        text (str): Text to translate (any language)
    
    Returns:
        dict: Result object with either success or error status.
        - If success:
            {
                'status': 'success',
                'data': {
                    'translated_text': str  # English translation
                }
            }
        - If error:
            {
                'status': 'error',
                'error': str  # Error message
            }
    
    Possible errors include: empty input text, translation failure,
    or API quota limitations.
    
    Example:
        {
            'status': 'success',
            'data': {'translated_text': 'Company reports strong earnings'}
        }
        {
            'status': 'error',
            'error': 'Empty text provided for translation'
        }
    """
    try:
        # Validate input
        if not text.strip():
            return {'status': 'error', 'error': 'Empty text provided for translation'}
        
        # Configure model if not provided
        
        # model = ChatVertexAI(model_name="gemini-2.0-flash", temperature=0)
        model = ChatGoogleGenerativeAI(model=settings.AGENT_MODEL, temperature=0)
        
        # Create translation prompt
        prompt = [
            HumanMessage(
                content=f"Translate the following text to English. Preserve all numbers, "
                        f"symbols, and special characters. Only respond with the translation.\n\n"
                        f"Text: {text}"
            )
        ]
        
        # Get translation
        result: AIMessage = model.invoke(prompt)
        translated_text = result.content.strip()
        
        return {
            'status': 'success',
            'data': {'translated_text': translated_text}
        }
        
    except Exception as e:
        return {
            'status': 'error',
            'error': f"Translation failed: {str(e)}"
        }
    
@tool("analyze_sentiment", parse_docstring=True)
def analyze_sentiment(text: str):
    """
    Analyzes English text to generate a sentiment score between -1 (negative) and 1 (positive).

    This tool should be used when the AI agent needs to quantify market sentiment from news headlines,
    earnings call transcripts, or social media content to inform stock return predictions. The score
    helps correlate real-time information with potential price movements, particularly valuable when
    assessing breaking news impact or screening multiple sources for bullish/bearish signals.

    Args:
        text (str): Input text to analyze (must be in English). Non-English content should be
                    translated by the agent before calling this function.

    Returns:
        dict: Result object with either success or error status.
        - If success:
            {
                'status': 'success',
                'data': {
                    'sentiment_score': float  # Range: -1.0 (bearish) to 1.0 (bullish)
                }
            }
        - If error:
            {
                'status': 'error',
                'error': str  # Error message detailing failure reason
            }

        Possible errors include: non-English text input, empty text string,
        or NLP service connection failures.

    Example:
        {
            'status': 'success',
            'data': {'sentiment_score': 0.78}  # Strong positive sentiment
        }
        {
            'status': 'error',
            'error': 'Text input must be in English (received Spanish)'
        }
        {
            'status': 'error',
            'error': 'Empty text input provided'
        }
    """
    try:
        sentiment = vader_sentiment(text)
        score = sentiment.get('compound')
        return {
            "status": "success",
            "data": {
                "sentiment_score": score,
            }
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }



toolkit = [translate_to_english, analyze_sentiment]