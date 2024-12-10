import numpy as np
from sklearn.ensemble import RandomForestRegressor
from typing import Dict, Any

class NutritionRecommender:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self._initialize_model()

    def _initialize_model(self):
        # In a real application, this would load a pre-trained model
        # For now, we'll use a simple rule-based system
        pass

    def recommend_nutrition(self, health_profile: Dict[str, Any]) -> Dict[str, float]:
        """
        Calculate recommended daily nutrition based on health profile.
        """
        # Basic BMR calculation using Mifflin-St Jeor Equation
        weight = float(health_profile['weight'])
        height = float(health_profile['height'])
        age = int(health_profile['age'])
        gender = health_profile['gender']
        activity_level = health_profile['activity_level']

        # Calculate BMR
        if gender.lower() == 'male':
            bmr = 10 * weight + 6.25 * height - 5 * age + 5
        else:
            bmr = 10 * weight + 6.25 * height - 5 * age - 161

        # Activity level multipliers
        activity_multipliers = {
            'sedentary': 1.2,
            'lightly_active': 1.375,
            'moderately_active': 1.55,
            'very_active': 1.725,
            'extra_active': 1.9
        }

        # Calculate total daily energy expenditure
        tdee = bmr * activity_multipliers.get(activity_level, 1.2)

        # Calculate macronutrient distribution
        protein_calories = tdee * 0.3  # 30% of calories from protein
        carb_calories = tdee * 0.4    # 40% of calories from carbs
        fat_calories = tdee * 0.3     # 30% of calories from fat

        return {
            'calories': round(tdee, 2),
            'protein': round(protein_calories / 4, 2),  # 4 calories per gram of protein
            'carbs': round(carb_calories / 4, 2),      # 4 calories per gram of carbs
            'fat': round(fat_calories / 9, 2)          # 9 calories per gram of fat
        }

    def train(self, X: np.ndarray, y: np.ndarray) -> None:
        """
        Train the model with new data.
        """
        self.model.fit(X, y)

    def predict(self, features: np.ndarray) -> np.ndarray:
        """
        Make predictions using the trained model.
        """
        return self.model.predict(features)