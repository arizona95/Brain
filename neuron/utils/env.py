from config import app_config, LocalConfig
from config.config import DevelopmentConfig, TestingConfig, StagingConfig, ProductionConfig

__all__ = (
    'is_development', 'is_testing', 'is_staging', 'is_production',
)

config_name = app_config.__name__


def is_development():
    return config_name == DevelopmentConfig.__name__ or config_name == LocalConfig.__name__


def is_testing():
    return config_name == TestingConfig.__name__


def is_staging():
    return config_name == StagingConfig.__name__


def is_production():
    return config_name == ProductionConfig.__name__
