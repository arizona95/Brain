import os

from config import config

__all__ = ('app_config',)

try:
    from config.local import LocalConfig
except ImportError:
    LocalConfig = None

flask_env = os.environ.get('FLASK_ENV', 'development')
if LocalConfig is not None:
    app_config = LocalConfig
else:
    app_config = config.app_config[flask_env]
