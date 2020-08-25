import os

from config import secret


class Config(object):
    """Parent configuration class"""

    ENV = 'default'
    NAME = 'navy'
    PROJECT_ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    UPLOAD_DIR = os.path.join(PROJECT_ROOT, 'api', 'app', 'static', 'upload')
    DEBUG = False
    CSRF_ENABLED = True
    SECRET = secret.SECRET
    SQLALCHEMY_DATABASE_URI = secret.SQLALCHEMY_DATABASE_URI
    SQLALCHEMY_ECHO = False
    CORS = dict(
        resources={'/*': {'origins': "*"}},
        supports_credentials=True,
        expose_headers="Set-Cookie",
    )
    DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7


class DevelopmentConfig(Config):
    """Configurations for Development"""

    ENV = 'development'
    DEBUG = True
    SQLALCHEMY_ECHO = True


class TestingConfig(Config):
    """Configurations for Testing, with a separate test database."""

    ENV = 'testing'
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/test_db'
    DEBUG = True


class StagingConfig(Config):
    """Configurations for Staging."""

    ENV = 'staging'
    DEBUG = True


class ProductionConfig(Config):
    """Configurations for Production."""

    ENV = 'production'
    DEBUG = False
    TESTING = False


app_config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'staging': StagingConfig,
    'production': ProductionConfig,
}
