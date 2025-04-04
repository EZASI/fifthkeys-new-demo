/**
 * AI Service - Natural Language Processing
 * 
 * This file contains the Python implementation of the NLP service
 * for the GuestDNA module of the FifthKeys platform.
 */

import os
import json
import numpy as np
import pandas as pd
from datetime import datetime
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK resources
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('vader_lexicon')

class NLPService:
    def __init__(self):
        """Initialize the NLP service with required components"""
        self.sentiment_analyzer = SentimentIntensityAnalyzer()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Load hotel-specific vocabulary if available
        self.hotel_vocabulary = self._load_hotel_vocabulary()
        
        # Initialize guest preference categories
        self.preference_categories = [
            'room_type', 'amenities', 'food_beverage', 
            'service', 'location', 'activities'
        ]
        
    def _load_hotel_vocabulary(self):
        """Load hotel-specific vocabulary for better context understanding"""
        try:
            vocab_path = os.path.join(os.path.dirname(__file__), 'data/hotel_vocabulary.json')
            if os.path.exists(vocab_path):
                with open(vocab_path, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading hotel vocabulary: {e}")
            return {}
    
    def analyze_sentiment(self, text):
        """
        Analyze sentiment of text input
        
        Args:
            text (str): Text to analyze
            
        Returns:
            dict: Sentiment analysis results
        """
        if not text:
            return {
                'compound': 0,
                'positive': 0,
                'neutral': 0,
                'negative': 0
            }
            
        sentiment = self.sentiment_analyzer.polarity_scores(text)
        return {
            'compound': sentiment['compound'],
            'positive': sentiment['pos'],
            'neutral': sentiment['neu'],
            'negative': sentiment['neg']
        }
    
    def extract_preferences(self, text):
        """
        Extract guest preferences from text
        
        Args:
            text (str): Text to analyze
            
        Returns:
            dict: Extracted preferences by category
        """
        if not text:
            return {category: [] for category in self.preference_categories}
            
        # Tokenize and preprocess text
        tokens = word_tokenize(text.lower())
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token.isalpha()]
        tokens = [token for token in tokens if token not in self.stop_words]
        
        # Extract preferences by category
        preferences = {category: [] for category in self.preference_categories}
        
        # Simple rule-based extraction (would be replaced with ML model in production)
        room_keywords = ['room', 'suite', 'view', 'bed', 'king', 'queen', 'double']
        amenity_keywords = ['wifi', 'pool', 'gym', 'spa', 'bathroom', 'shower', 'toiletries']
        fb_keywords = ['breakfast', 'dinner', 'lunch', 'restaurant', 'bar', 'coffee', 'food']
        service_keywords = ['staff', 'service', 'reception', 'concierge', 'housekeeping', 'check-in']
        location_keywords = ['location', 'downtown', 'beach', 'airport', 'central', 'quiet']
        activity_keywords = ['tour', 'excursion', 'activity', 'entertainment', 'show', 'concert']
        
        for token in tokens:
            if token in room_keywords:
                preferences['room_type'].append(token)
            elif token in amenity_keywords:
                preferences['amenities'].append(token)
            elif token in fb_keywords:
                preferences['food_beverage'].append(token)
            elif token in service_keywords:
                preferences['service'].append(token)
            elif token in location_keywords:
                preferences['location'].append(token)
            elif token in activity_keywords:
                preferences['activities'].append(token)
        
        return preferences
    
    def generate_response(self, query, guest_profile=None, hotel_info=None):
        """
        Generate a response to a guest query
        
        Args:
            query (str): Guest query
            guest_profile (dict): Guest profile information
            hotel_info (dict): Hotel information
            
        Returns:
            dict: Response with answer and metadata
        """
        # In a production environment, this would call a more sophisticated 
        # language model like GPT or a fine-tuned model specific to hospitality
        
        # Simple rule-based response for demonstration
        query_lower = query.lower()
        
        # Analyze query intent
        if any(word in query_lower for word in ['checkout', 'check out', 'leaving']):
            answer = "Check-out time is at 11:00 AM. Would you like to request a late check-out?"
            intent = "checkout_info"
            
        elif any(word in query_lower for word in ['breakfast', 'dining', 'restaurant']):
            answer = "Breakfast is served at The Grand Restaurant from 6:30 AM to 10:30 AM."
            intent = "dining_info"
            
        elif any(word in query_lower for word in ['wifi', 'internet', 'connection']):
            answer = "You can connect to our WiFi network 'Hotel_Guest' using your room number and last name."
            intent = "wifi_info"
            
        elif any(word in query_lower for word in ['pool', 'swim', 'swimming']):
            answer = "Our pool is open from 7:00 AM to 10:00 PM. Towels are provided poolside."
            intent = "amenity_info"
            
        elif any(word in query_lower for word in ['spa', 'massage', 'treatment']):
            answer = "Our spa offers a variety of treatments. Would you like me to book an appointment for you?"
            intent = "spa_booking"
            
        else:
            answer = "I'm here to assist you with any questions about our hotel services. How can I help you today?"
            intent = "general"
        
        # Personalize response if guest profile is available
        if guest_profile and 'firstName' in guest_profile:
            answer = f"Hello {guest_profile['firstName']}, {answer}"
        
        return {
            'answer': answer,
            'intent': intent,
            'timestamp': datetime.now().isoformat(),
            'sentiment': self.analyze_sentiment(query)
        }
    
    def analyze_guest_interactions(self, interactions):
        """
        Analyze a collection of guest interactions to extract insights
        
        Args:
            interactions (list): List of interaction objects
            
        Returns:
            dict: Analysis results
        """
        if not interactions:
            return {
                'sentiment_trend': [],
                'common_topics': [],
                'preferences': {category: [] for category in self.preference_categories}
            }
        
        # Convert to DataFrame for analysis
        df = pd.DataFrame(interactions)
        
        # Analyze sentiment trend
        df['sentiment'] = df['text'].apply(lambda x: self.analyze_sentiment(x)['compound'])
        sentiment_trend = df.groupby(pd.Grouper(key='timestamp', freq='D'))['sentiment'].mean().reset_index()
        sentiment_trend = sentiment_trend.to_dict('records')
        
        # Extract common topics and preferences
        all_text = ' '.join(df['text'].tolist())
        preferences = self.extract_preferences(all_text)
        
        # Count word frequencies for topic extraction
        tokens = word_tokenize(all_text.lower())
        tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token.isalpha()]
        tokens = [token for token in tokens if token not in self.stop_words]
        
        word_freq = {}
        for token in tokens:
            if token in word_freq:
                word_freq[token] += 1
            else:
                word_freq[token] = 1
        
        # Get top topics
        common_topics = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:10]
        common_topics = [{'topic': topic, 'frequency': freq} for topic, freq in common_topics]
        
        return {
            'sentiment_trend': sentiment_trend,
            'common_topics': common_topics,
            'preferences': preferences
        }

# Create an instance of the NLP service
nlp_service = NLPService()

# Function to handle API requests
def process_request(request_data):
    """
    Process API requests to the NLP service
    
    Args:
        request_data (dict): Request data
        
    Returns:
        dict: Response data
    """
    request_type = request_data.get('type')
    
    if request_type == 'sentiment_analysis':
        text = request_data.get('text', '')
        return nlp_service.analyze_sentiment(text)
        
    elif request_type == 'preference_extraction':
        text = request_data.get('text', '')
        return nlp_service.extract_preferences(text)
        
    elif request_type == 'generate_response':
        query = request_data.get('query', '')
        guest_profile = request_data.get('guest_profile')
        hotel_info = request_data.get('hotel_info')
        return nlp_service.generate_response(query, guest_profile, hotel_info)
        
    elif request_type == 'analyze_interactions':
        interactions = request_data.get('interactions', [])
        return nlp_service.analyze_guest_interactions(interactions)
        
    else:
        return {'error': 'Invalid request type'}

# Example usage
if __name__ == "__main__":
    # Example sentiment analysis
    text = "I really enjoyed my stay at the hotel. The room was beautiful and the staff was very friendly."
    sentiment = nlp_service.analyze_sentiment(text)
    print(f"Sentiment analysis: {sentiment}")
    
    # Example response generation
    query = "What time is breakfast served?"
    response = nlp_service.generate_response(query)
    print(f"Response: {response['answer']}")
