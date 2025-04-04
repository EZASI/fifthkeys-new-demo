/**
 * AI Service - Revenue Optimization
 * 
 * This file contains the Python implementation of the Revenue Optimization service
 * for the RevenuePulse module of the FifthKeys platform.
 */

import os
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
import joblib

class RevenueOptimizationService:
    def __init__(self):
        """Initialize the Revenue Optimization service with required components"""
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        
        # Load pre-trained models if available
        self._load_models()
        
        # Define feature sets for different prediction tasks
        self.price_features = [
            'day_of_week', 'month', 'is_weekend', 'is_holiday', 
            'days_to_arrival', 'length_of_stay', 'room_type',
            'occupancy_rate', 'competitor_price_index', 'event_score'
        ]
        
        self.demand_features = [
            'day_of_week', 'month', 'is_weekend', 'is_holiday',
            'price_index', 'marketing_spend', 'competitor_price_index',
            'event_score', 'weather_score', 'historical_demand'
        ]
        
    def _load_models(self):
        """Load pre-trained models if available"""
        try:
            models_path = os.path.join(os.path.dirname(__file__), 'models')
            if os.path.exists(models_path):
                # Load price optimization model
                price_model_path = os.path.join(models_path, 'price_optimization_model.joblib')
                if os.path.exists(price_model_path):
                    self.models['price'] = joblib.load(price_model_path)
                
                # Load demand forecasting model
                demand_model_path = os.path.join(models_path, 'demand_forecasting_model.joblib')
                if os.path.exists(demand_model_path):
                    self.models['demand'] = joblib.load(demand_model_path)
                
                # Load revenue optimization model
                revenue_model_path = os.path.join(models_path, 'revenue_optimization_model.joblib')
                if os.path.exists(revenue_model_path):
                    self.models['revenue'] = joblib.load(revenue_model_path)
                
                print(f"Loaded {len(self.models)} pre-trained models")
            else:
                print("No pre-trained models found")
        except Exception as e:
            print(f"Error loading models: {e}")
    
    def _save_model(self, model_type, model):
        """Save a trained model"""
        try:
            models_path = os.path.join(os.path.dirname(__file__), 'models')
            os.makedirs(models_path, exist_ok=True)
            
            model_path = os.path.join(models_path, f'{model_type}_model.joblib')
            joblib.dump(model, model_path)
            print(f"Saved {model_type} model to {model_path}")
        except Exception as e:
            print(f"Error saving model: {e}")
    
    def train_price_optimization_model(self, historical_data):
        """
        Train a price optimization model using historical data
        
        Args:
            historical_data (DataFrame): Historical pricing and occupancy data
            
        Returns:
            dict: Training results and metrics
        """
        if historical_data.empty:
            return {'error': 'No training data provided'}
        
        try:
            # Prepare features and target
            X = historical_data[self.price_features]
            y = historical_data['optimal_price']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Define preprocessing for numeric and categorical features
            numeric_features = ['days_to_arrival', 'length_of_stay', 'occupancy_rate', 
                               'competitor_price_index', 'event_score']
            categorical_features = ['day_of_week', 'month', 'is_weekend', 'is_holiday', 'room_type']
            
            numeric_transformer = Pipeline(steps=[
                ('scaler', StandardScaler())
            ])
            
            categorical_transformer = Pipeline(steps=[
                ('onehot', OneHotEncoder(handle_unknown='ignore'))
            ])
            
            preprocessor = ColumnTransformer(
                transformers=[
                    ('num', numeric_transformer, numeric_features),
                    ('cat', categorical_transformer, categorical_features)
                ])
            
            # Create and train the model
            model = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('regressor', GradientBoostingRegressor(
                    n_estimators=100, 
                    learning_rate=0.1, 
                    max_depth=5, 
                    random_state=42
                ))
            ])
            
            model.fit(X_train, y_train)
            
            # Evaluate the model
            train_score = model.score(X_train, y_train)
            test_score = model.score(X_test, y_test)
            
            # Save the model
            self.models['price'] = model
            self._save_model('price_optimization', model)
            
            return {
                'success': True,
                'train_score': train_score,
                'test_score': test_score,
                'message': 'Price optimization model trained successfully'
            }
            
        except Exception as e:
            return {
                'error': f'Error training price optimization model: {str(e)}'
            }
    
    def train_demand_forecasting_model(self, historical_data):
        """
        Train a demand forecasting model using historical data
        
        Args:
            historical_data (DataFrame): Historical demand data
            
        Returns:
            dict: Training results and metrics
        """
        if historical_data.empty:
            return {'error': 'No training data provided'}
        
        try:
            # Prepare features and target
            X = historical_data[self.demand_features]
            y = historical_data['demand']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Define preprocessing for numeric and categorical features
            numeric_features = ['price_index', 'marketing_spend', 'competitor_price_index',
                               'event_score', 'weather_score', 'historical_demand']
            categorical_features = ['day_of_week', 'month', 'is_weekend', 'is_holiday']
            
            numeric_transformer = Pipeline(steps=[
                ('scaler', StandardScaler())
            ])
            
            categorical_transformer = Pipeline(steps=[
                ('onehot', OneHotEncoder(handle_unknown='ignore'))
            ])
            
            preprocessor = ColumnTransformer(
                transformers=[
                    ('num', numeric_transformer, numeric_features),
                    ('cat', categorical_transformer, categorical_features)
                ])
            
            # Create and train the model
            model = Pipeline(steps=[
                ('preprocessor', preprocessor),
                ('regressor', RandomForestRegressor(
                    n_estimators=100, 
                    max_depth=10, 
                    random_state=42
                ))
            ])
            
            model.fit(X_train, y_train)
            
            # Evaluate the model
            train_score = model.score(X_train, y_train)
            test_score = model.score(X_test, y_test)
            
            # Save the model
            self.models['demand'] = model
            self._save_model('demand_forecasting', model)
            
            return {
                'success': True,
                'train_score': train_score,
                'test_score': test_score,
                'message': 'Demand forecasting model trained successfully'
            }
            
        except Exception as e:
            return {
                'error': f'Error training demand forecasting model: {str(e)}'
            }
    
    def predict_optimal_prices(self, input_data):
        """
        Predict optimal prices based on input features
        
        Args:
            input_data (DataFrame): Input features for prediction
            
        Returns:
            dict: Predicted optimal prices and confidence scores
        """
        if 'price' not in self.models:
            return {'error': 'Price optimization model not trained'}
        
        try:
            # Ensure all required features are present
            for feature in self.price_features:
                if feature not in input_data.columns:
                    return {'error': f'Missing required feature: {feature}'}
            
            # Make predictions
            X = input_data[self.price_features]
            predictions = self.models['price'].predict(X)
            
            # Calculate confidence scores (simplified)
            confidence_scores = np.ones(len(predictions)) * 0.85  # Placeholder
            
            # Prepare results
            results = []
            for i, (_, row) in enumerate(input_data.iterrows()):
                results.append({
                    'date': row.get('date', f'Day {i+1}'),
                    'room_type': row.get('room_type', 'Standard'),
                    'optimal_price': round(predictions[i], 2),
                    'confidence_score': confidence_scores[i],
                    'min_price': round(predictions[i] * 0.9, 2),
                    'max_price': round(predictions[i] * 1.1, 2)
                })
            
            return {
                'success': True,
                'predictions': results
            }
            
        except Exception as e:
            return {
                'error': f'Error predicting optimal prices: {str(e)}'
            }
    
    def forecast_demand(self, input_data):
        """
        Forecast demand based on input features
        
        Args:
            input_data (DataFrame): Input features for prediction
            
        Returns:
            dict: Forecasted demand and confidence scores
        """
        if 'demand' not in self.models:
            return {'error': 'Demand forecasting model not trained'}
        
        try:
            # Ensure all required features are present
            for feature in self.demand_features:
                if feature not in input_data.columns:
                    return {'error': f'Missing required feature: {feature}'}
            
            # Make predictions
            X = input_data[self.demand_features]
            predictions = self.models['demand'].predict(X)
            
            # Calculate confidence scores (simplified)
            confidence_scores = np.ones(len(predictions)) * 0.8  # Placeholder
            
            # Prepare results
            results = []
            for i, (_, row) in enumerate(input_data.iterrows()):
                results.append({
                    'date': row.get('date', f'Day {i+1}'),
                    'forecasted_demand': round(predictions[i], 0),
                    'confidence_score': confidence_scores[i],
                    'min_demand': round(predictions[i] * 0.85, 0),
                    'max_demand': round(predictions[i] * 1.15, 0)
                })
            
            return {
                'success': True,
                'predictions': results
            }
            
        except Exception as e:
            return {
                'error': f'Error forecasting demand: {str(e)}'
            }
    
    def run_revenue_simulation(self, scenario_data):
        """
        Run a revenue simulation based on different pricing scenarios
        
        Args:
            scenario_data (dict): Scenario parameters
            
        Returns:
            dict: Simulation results
        """
        try:
            # Extract scenario parameters
            base_price = scenario_data.get('base_price', 100)
            price_variations = scenario_data.get('price_variations', [-20, -10, 0, 10, 20])
            demand_elasticity = scenario_data.get('demand_elasticity', -0.7)
            base_demand = scenario_data.get('base_demand', 100)
            costs = scenario_data.get('costs', {'fixed': 2000, 'variable': 20})
            days = scenario_data.get('days', 30)
            
            # Run simulation for each price variation
            results = []
            for variation in price_variations:
                price = base_price * (1 + variation / 100)
                
                # Calculate demand based on price elasticity
                demand = base_demand * (1 + demand_elasticity * (variation / 100))
                demand = max(0, demand)  # Ensure non-negative demand
                
                # Calculate revenue and profit
                revenue = price * demand * days
                total_costs = costs['fixed'] + (costs['variable'] * demand * days)
                profit = revenue - total_costs
                
                results.append({
                    'price_variation': variation,
                    'price': round(price, 2),
                    'demand': round(demand, 0),
                    'occupancy': round((demand / base_demand) * 100, 1),
                    'revenue': round(revenue, 0),
                    'costs': round(total_costs, 0),
                    'profit': round(profit, 0),
                    'profit_margin': round((profit / revenue) * 100, 1) if revenue > 0 else 0
                })
            
            # Find optimal price point
            optimal_result = max(results, key=lambda x: x['profit'])
            
            return {
                'success': True,
                'scenarios': results,
                'optimal_scenario': optimal_result
            }
            
        except Exception as e:
            return {
                'error': f'Error running revenue simulation: {str(e)}'
            }
    
    def analyze_competitor_pricing(self, hotel_data, competitor_data):
        """
        Analyze competitor pricing and market positioning
        
        Args:
            hotel_data (dict): Hotel pricing data
            competitor_data (list): List of competitor pricing data
            
        Returns:
            dict: Analysis results
        """
        try:
            # Extract data
            hotel_prices = hotel_data.get('prices', {})
            hotel_name = hotel_data.get('name', 'Your Hotel')
            
            # Prepare data for analysis
            room_types = set(hotel_prices.keys())
            for competitor in competitor_data:
                room_types.update(competitor.get('prices', {}).keys())
            
            # Analyze each room type
            results = {}
            for room_type in room_types:
                hotel_price = hotel_prices.get(room_type, 0)
                competitor_prices = [
                    {
                        'name': comp.get('name', f'Competitor {i+1}'),
                        'price': comp.get('prices', {}).get(room_type, 0)
                    }
                    for i, comp in enumerate(competitor_data)
                    if comp.get('prices', {}).get(room_type, 0) > 0
                ]
                
                # Calculate statistics
           
(Content truncated due to size limit. Use line ranges to read in chunks)