import os

from flask_script import Manager

from api.app.wsgi import app
from config import app_config

project_root = app_config.PROJECT_ROOT
api_root = os.path.join(project_root, 'api')
manager = Manager(usage=u'API commands')


@manager.command
def run():
    debug = getattr(app_config, 'DEBUG', True)
    app.run(
        host=getattr(app_config, 'API_HOST', '127.0.0.1'),
        port=getattr(app_config, 'API_PORT', 5000),
        debug=debug,
        use_debugger=debug,
        use_reloader=True,
        threaded=True,
    )

