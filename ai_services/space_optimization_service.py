/**
 * AI Service - Space Optimization
 * 
 * This file contains the Python implementation of the Space Optimization service
 * for the HotelTwin module of the FifthKeys platform.
 */

import os
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.optimize import linear_sum_assignment
import networkx as nx

class SpaceOptimizationService:
    def __init__(self):
        """Initialize the Space Optimization service with required components"""
        # Load configuration if available
        self.config = self._load_config()
        
        # Initialize optimization parameters
        self.space_types = [
            'guest_room', 'restaurant', 'meeting_room', 'lobby', 
            'corridor', 'back_of_house', 'spa', 'gym', 'pool'
        ]
        
        # Default space efficiency metrics
        self.default_efficiency = {
            'guest_room': 0.75,
            'restaurant': 0.65,
            'meeting_room': 0.70,
            'lobby': 0.60,
            'corridor': 0.90,
            'back_of_house': 0.80,
            'spa': 0.65,
            'gym': 0.70,
            'pool': 0.55
        }
        
        # Default energy consumption metrics (kWh per square meter per day)
        self.default_energy = {
            'guest_room': 15,
            'restaurant': 25,
            'meeting_room': 18,
            'lobby': 20,
            'corridor': 8,
            'back_of_house': 12,
            'spa': 30,
            'gym': 22,
            'pool': 35
        }
        
    def _load_config(self):
        """Load configuration from file if available"""
        try:
            config_path = os.path.join(os.path.dirname(__file__), 'config/space_optimization_config.json')
            if os.path.exists(config_path):
                with open(config_path, 'r') as f:
                    return json.load(f)
            return {}
        except Exception as e:
            print(f"Error loading configuration: {e}")
            return {}
    
    def analyze_space_utilization(self, space_data, sensor_data):
        """
        Analyze space utilization based on sensor data
        
        Args:
            space_data (dict): Information about hotel spaces
            sensor_data (list): Occupancy sensor data
            
        Returns:
            dict: Space utilization analysis
        """
        try:
            # Convert sensor data to DataFrame
            sensor_df = pd.DataFrame(sensor_data)
            
            # Ensure required columns exist
            if 'timestamp' not in sensor_df.columns or 'space_id' not in sensor_df.columns or 'value' not in sensor_df.columns:
                return {'error': 'Sensor data missing required columns (timestamp, space_id, value)'}
            
            # Convert timestamp to datetime
            sensor_df['timestamp'] = pd.to_datetime(sensor_df['timestamp'])
            
            # Group by space and calculate metrics
            space_metrics = {}
            
            for space_id, space_info in space_data.items():
                space_sensors = sensor_df[sensor_df['space_id'] == space_id]
                
                if not space_sensors.empty:
                    # Calculate average occupancy
                    avg_occupancy = space_sensors['value'].mean()
                    
                    # Calculate peak occupancy and time
                    peak_idx = space_sensors['value'].idxmax()
                    peak_occupancy = space_sensors.loc[peak_idx, 'value']
                    peak_time = space_sensors.loc[peak_idx, 'timestamp']
                    
                    # Calculate occupancy by hour of day
                    space_sensors['hour'] = space_sensors['timestamp'].dt.hour
                    hourly_occupancy = space_sensors.groupby('hour')['value'].mean().to_dict()
                    
                    # Calculate occupancy by day of week
                    space_sensors['day_of_week'] = space_sensors['timestamp'].dt.dayofweek
                    daily_occupancy = space_sensors.groupby('day_of_week')['value'].mean().to_dict()
                    
                    # Calculate utilization efficiency
                    capacity = space_info.get('capacity', 100)
                    utilization_rate = (avg_occupancy / capacity) * 100 if capacity > 0 else 0
                    
                    space_metrics[space_id] = {
                        'space_name': space_info.get('name', f'Space {space_id}'),
                        'space_type': space_info.get('type', 'unknown'),
                        'area': space_info.get('area', 0),
                        'capacity': capacity,
                        'avg_occupancy': round(avg_occupancy, 2),
                        'peak_occupancy': round(peak_occupancy, 2),
                        'peak_time': peak_time.isoformat(),
                        'utilization_rate': round(utilization_rate, 2),
                        'hourly_occupancy': {str(h): round(occ, 2) for h, occ in hourly_occupancy.items()},
                        'daily_occupancy': {str(d): round(occ, 2) for d, occ in daily_occupancy.items()},
                        'data_points': len(space_sensors)
                    }
                else:
                    space_metrics[space_id] = {
                        'space_name': space_info.get('name', f'Space {space_id}'),
                        'space_type': space_info.get('type', 'unknown'),
                        'area': space_info.get('area', 0),
                        'capacity': space_info.get('capacity', 0),
                        'avg_occupancy': 0,
                        'peak_occupancy': 0,
                        'peak_time': None,
                        'utilization_rate': 0,
                        'hourly_occupancy': {},
                        'daily_occupancy': {},
                        'data_points': 0,
                        'note': 'No sensor data available for this space'
                    }
            
            # Calculate overall metrics
            total_area = sum(space_info.get('area', 0) for space_info in space_data.values())
            total_capacity = sum(space_info.get('capacity', 0) for space_info in space_data.values())
            
            weighted_utilization = 0
            if total_area > 0:
                for space_id, metrics in space_metrics.items():
                    space_area = space_data[space_id].get('area', 0)
                    weighted_utilization += (metrics['utilization_rate'] * space_area / total_area)
            
            return {
                'success': True,
                'analysis_date': datetime.now().isoformat(),
                'total_spaces': len(space_data),
                'total_area': total_area,
                'total_capacity': total_capacity,
                'overall_utilization_rate': round(weighted_utilization, 2),
                'space_metrics': space_metrics
            }
            
        except Exception as e:
            return {'error': f'Error analyzing space utilization: {str(e)}'}
    
    def generate_heatmap(self, sensor_data, space_layout):
        """
        Generate a heatmap of space utilization
        
        Args:
            sensor_data (list): Occupancy sensor data
            space_layout (dict): Layout information for the space
            
        Returns:
            dict: Heatmap data
        """
        try:
            # Convert sensor data to DataFrame
            sensor_df = pd.DataFrame(sensor_data)
            
            # Ensure required columns exist
            if 'x' not in sensor_df.columns or 'y' not in sensor_df.columns or 'value' not in sensor_df.columns:
                return {'error': 'Sensor data missing required columns (x, y, value)'}
            
            # Extract layout dimensions
            width = space_layout.get('width', 100)
            height = space_layout.get('height', 100)
            resolution = space_layout.get('resolution', 1)
            
            # Create a grid for the heatmap
            grid_width = int(width / resolution)
            grid_height = int(height / resolution)
            heatmap_grid = np.zeros((grid_height, grid_width))
            
            # Populate the grid with sensor data
            for _, row in sensor_df.iterrows():
                x = int(row['x'] / resolution)
                y = int(row['y'] / resolution)
                
                # Ensure coordinates are within grid bounds
                if 0 <= x < grid_width and 0 <= y < grid_height:
                    heatmap_grid[y, x] += row['value']
            
            # Normalize the grid
            if np.max(heatmap_grid) > 0:
                heatmap_grid = heatmap_grid / np.max(heatmap_grid)
            
            # Convert to list format for JSON serialization
            heatmap_data = heatmap_grid.tolist()
            
            return {
                'success': True,
                'width': width,
                'height': height,
                'resolution': resolution,
                'grid_width': grid_width,
                'grid_height': grid_height,
                'heatmap_data': heatmap_data
            }
            
        except Exception as e:
            return {'error': f'Error generating heatmap: {str(e)}'}
    
    def optimize_space_layout(self, space_data, constraints):
        """
        Optimize space layout based on utilization data and constraints
        
        Args:
            space_data (dict): Information about hotel spaces including utilization
            constraints (dict): Optimization constraints
            
        Returns:
            dict: Optimized layout recommendations
        """
        try:
            # Extract optimization parameters
            optimization_type = constraints.get('optimization_type', 'efficiency')
            min_area_change = constraints.get('min_area_change', -20)  # percentage
            max_area_change = constraints.get('max_area_change', 20)   # percentage
            
            # Prepare recommendations
            recommendations = {}
            
            for space_id, space_info in space_data.items():
                space_type = space_info.get('type', 'unknown')
                current_area = space_info.get('area', 0)
                current_capacity = space_info.get('capacity', 0)
                utilization_rate = space_info.get('utilization_rate', 0)
                
                if current_area <= 0 or current_capacity <= 0:
                    continue
                
                # Calculate optimal area based on utilization
                area_change_percent = 0
                capacity_change_percent = 0
                
                if optimization_type == 'efficiency':
                    # If utilization is high, increase area
                    if utilization_rate > 80:
                        area_change_percent = min(max_area_change, (utilization_rate - 80) * 0.5)
                    # If utilization is low, decrease area
                    elif utilization_rate < 50:
                        area_change_percent = max(min_area_change, (utilization_rate - 50) * 0.5)
                    
                    # Adjust capacity proportionally
                    capacity_change_percent = area_change_percent
                    
                elif optimization_type == 'cost':
                    # Focus on reducing underutilized spaces
                    if utilization_rate < 40:
                        area_change_percent = max(min_area_change, (utilization_rate - 40) * 0.75)
                    
                    # Adjust capacity to maintain density
                    capacity_change_percent = area_change_percent
                    
                elif optimization_type == 'revenue':
                    # Prioritize high-revenue spaces
                    revenue_potential = space_info.get('revenue_potential', 1)
                    
                    if revenue_potential > 1.5 and utilization_rate > 70:
                        # High revenue potential and good utilization - expand
                        area_change_percent = min(max_area_change, 15)
                    elif revenue_potential < 0.8 and utilization_rate < 60:
                        # Low revenue potential and poor utilization - reduce
                        area_change_percent = max(min_area_change, -15)
                    
                    # Adjust capacity proportionally
                    capacity_change_percent = area_change_percent
                
                # Calculate new area and capacity
                new_area = current_area * (1 + area_change_percent / 100)
                new_capacity = current_capacity * (1 + capacity_change_percent / 100)
                
                # Get default efficiency for this space type
                default_efficiency = self.default_efficiency.get(space_type, 0.7)
                
                # Calculate impact
                current_efficiency = utilization_rate / 100
                new_efficiency = min(0.95, current_efficiency * (1 - area_change_percent / 200))
                efficiency_change = (new_efficiency - current_efficiency) * 100
                
                # Calculate financial impact (simplified)
                area_cost = 1000  # Cost per square meter
                revenue_per_guest = 50  # Revenue per guest
                
                cost_impact = (new_area - current_area) * area_cost
                revenue_impact = (new_capacity * new_efficiency - current_capacity * current_efficiency) * revenue_per_guest * 365
                
                # Prepare recommendation
                recommendations[space_id] = {
                    'space_name': space_info.get('name', f'Space {space_id}'),
                    'space_type': space_type,
                    'current_area': round(current_area, 2),
                    'recommended_area': round(new_area, 2),
                    'area_change': round(new_area - current_area, 2),
                    'area_change_percent': round(area_change_percent, 2),
                    'current_capacity': round(current_capacity, 0),
                    'recommended_capacity': round(new_capacity, 0),
                    'capacity_change': round(new_capacity - current_capacity, 0),
                    'current_efficiency': round(current_efficiency * 100, 2),
                    'projected_efficiency': round(new_efficiency * 100, 2),
                    'efficiency_change': round(efficiency_change, 2),
                    'financial_impact': {
                        'cost_impact': round(cost_impact, 0),
                        'annual_revenue_impact': round(revenue_impact, 0),
                        'payback_period': round(cost_impact / revenue_impact, 2) if revenue_impact > 0 else float('inf')
                    }
                }
            
            return {
                'success': True,
                'optimization_type': optimization_type,
                'recommendations': recommendations
            }
            
        except Exception as e:
            return {'error': f'Error optimizing space layout: {str(e)}'}
    
    def analyze_energy_usage(self, space_data, energy_data):
        """
        Analyze energy usage by space
        
        Args:
            space_data (dict): Information about hotel spaces
            energy_data (list): Energy consumption sensor data
            
        Returns:
            dict: Energy usage analysis
        """
        try:
            # Convert energy data to DataFrame
            energy_df = pd.DataFrame(energy_data)
            
            # Ensure required columns exist
            if 'timestamp' not in energy_df.columns
(Content truncated due to size limit. Use line ranges to read in chunks)