from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from flask_dance.contrib.google import make_google_blueprint
from flask_dance.contrib.github import make_github_blueprint

load_dotenv()

mongo = PyMongo()
jwt = JWTManager()
oauth = OAuth()

def create_app():
    app = Flask(__name__)
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.secret_key = os.getenv('FLASK_SECRET_KEY')

    mongo.init_app(app)
    jwt.init_app(app)
    CORS(app, supports_credentials=True)
    oauth.init_app(app)
    
    # Update Google OAuth configuration
    app.config['GOOGLE_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID')
    app.config['GOOGLE_CLIENT_SECRET'] = os.getenv('GOOGLE_CLIENT_SECRET')
    
    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile',
            'redirect_uri': f"{os.getenv('BACKEND_URL')}/api/auth/google/callback"
        }
    )
     
     # Configure GitHub OAuth
    app.config['GITHUB_CLIENT_ID'] = os.getenv('GITHUB_CLIENT_ID')
    app.config['GITHUB_CLIENT_SECRET'] = os.getenv('GITHUB_CLIENT_SECRET')

    # Keep GitHub OAuth configuration
    oauth.register(
        name='github',
        client_id=os.getenv('GITHUB_CLIENT_ID'),
        client_secret=os.getenv('GITHUB_CLIENT_SECRET'),
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'},
    )


    # app.config['GOOGLE_OAUTH_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID')
    # app.config['GOOGLE_OAUTH_CLIENT_SECRET'] = os.getenv('GOOGLE_CLIENT_SECRET')
    # google_bp = make_google_blueprint(scope=['profile', 'email'])
    # app.register_blueprint(google_bp, url_prefix='/login')

    # app.config['GITHUB_OAUTH_CLIENT_ID'] = os.getenv('GITHUB_CLIENT_ID')
    # app.config['GITHUB_OAUTH_CLIENT_SECRET'] = os.getenv('GITHUB_CLIENT_SECRET')
    # github_bp = make_github_blueprint()
    # app.register_blueprint(github_bp, url_prefix='/login')

    with app.app_context():
        db = mongo.db
        
        # Create users collection and schema
        if 'users' not in db.list_collection_names():
            db.create_collection('users')
        db.command({
            'collMod': 'users',
            'validator': {
                '$jsonSchema': {
                    'bsonType': 'object',
                    'required': ['email', 'password_hash', 'name', 'role', 'active'],
                    'properties': {
                        'email': {'bsonType': 'string'},
                        'password_hash': {'bsonType': 'string'},
                        'name': {'bsonType': 'string'},
                        'role': {'bsonType': 'string'},
                        'active': {'bsonType': 'bool'},
                        'oauth_provider': {'bsonType': ['string', 'null']},
                        'oauth_id': {'bsonType': ['string', 'null']},
                        'reset_token': {'bsonType': ['string', 'null']},
                        'reset_token_expires': {'bsonType': ['date', 'null']}
                    }
                }
            },
            'validationLevel': 'strict'
        })

        # Create health_profiles collection and schema
        if 'health_profiles' not in db.list_collection_names():
            db.create_collection('health_profiles')
        db.command({
            'collMod': 'health_profiles',
            'validator': {
                '$jsonSchema': {
                    'bsonType': 'object',
                    'required': ['user_id', 'age', 'gender', 'height', 'weight', 'activity_level', 'last_updated'],
                    'properties': {
                        'user_id': {'bsonType': 'string'},
                        'age': {'bsonType': 'int'},
                        'gender': {'bsonType': 'string'},
                        'height': {'bsonType': 'double'},
                        'weight': {'bsonType': 'double'},
                        'activity_level': {'bsonType': 'string'},
                        'dietary_restrictions': {'bsonType': 'array'},
                        'health_goals': {'bsonType': 'array'},
                        'last_updated': {'bsonType': 'date'}
                    }
                }
            },
            'validationLevel': 'strict'
        })

        # Create meal_plans collection and schema
        if 'meal_plans' not in db.list_collection_names():
            db.create_collection('meal_plans')
        db.command({
            'collMod': 'meal_plans',
            'validator': {
                '$jsonSchema': {
                    'bsonType': 'object',
                    'required': ['user_id', 'meals', 'duration', 'start_date', 'status'],
                    'properties': {
                        'user_id': {'bsonType': 'string'},
                        'meals': {'bsonType': 'array'},
                        'duration': {'bsonType': 'int'},
                        'start_date': {'bsonType': 'date'},
                        'status': {'bsonType': 'string'}
                    }
                }
            },
            'validationLevel': 'strict'
        })

        from app.controllers import auth_controller
        app.register_blueprint(auth_controller.bp)
        
        # Initialize database collections
        init_database(mongo.db)

    from app.controllers import auth_controller, profile_controller, meal_plan_controlller
    app.register_blueprint(auth_controller.bp)
    app.register_blueprint(profile_controller.bp)
    app.register_blueprint(meal_plan_controlller.bp)

    #Initialize database collections
    init_database(mongo.db)
    
    
    return app
def init_database(db):
    # Create collections if they don't exist
    if 'users' not in db.list_collection_names():
        db.create_collection('users')
        db.users.create_index('email', unique=True)
        db.users.create_index([('oauth_provider', 1), ('oauth_id', 1)], unique=True)
