import os
from datetime import timedelta
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or ' b0763b930f2ae328416223c8f1d78240205f1c67e3ebe75c96ab385ec2a0306c'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/dietcraft'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or '965c014784f73ed4b6b6ec243b65d55406e60f86364281d60b81ca0ede48933f'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', True)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/dietcraft'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', True)
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')