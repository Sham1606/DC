from app import mongo
from bson import ObjectId
from datetime import datetime

class MealPlan:
    def __init__(self, user_id, meals, duration, start_date=None):
        self.user_id = user_id
        self.meals = meals
        self.duration = duration
        self.start_date = start_date or datetime.utcnow()
        self.status = 'active'

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'meals': self.meals,
            'duration': self.duration,
            'start_date': self.start_date,
            'status': self.status
        }

    def save(self):
        meal_plan_data = self.to_dict()
        result = mongo.db.meal_plans.insert_one(meal_plan_data)
        return str(result.inserted_id)

    @staticmethod
    def find_by_user_id(user_id):
        return list(mongo.db.meal_plans.find({'user_id': user_id}))

    @staticmethod
    def find_by_id(meal_plan_id):
        return mongo.db.meal_plans.find_one({'_id': ObjectId(meal_plan_id)})

    @staticmethod
    def update(meal_plan_id, updates):
        return mongo.db.meal_plans.update_one(
            {'_id': ObjectId(meal_plan_id)},
            {'$set': updates}
        )