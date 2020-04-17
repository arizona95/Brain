import sys
import os
import importlib

from flask import Response, Flask
from flask.json import JSONEncoder

from api.app import ext
from config import app_config
from db.base import db_session


def create_app():
    app = Flask(__name__)
    init_config(app)
    init_extensions(app)
    init_teardown(app)
    init_health_check(app)
    init_resources(app)
    #init_websockets(app)
    return app


def init_config(app):
    app.config.from_object(app_config)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


def init_teardown(app):
    @app.teardown_request
    def session_clear(response_or_exc):
        try:
            if response_or_exc is None:
                db_session.commit()
        finally:
            db_session.remove()
        return response_or_exc


def init_health_check(app):
    @app.route('/health_check')
    def system_check():
        return 'ok'


def init_extensions(app):
    ext.init_api(app)


def init_resources(app):
    """Import resources and register blueprints from `resources`.
    """
    top_package_name = 'resources'

    def recursive_import(packages, parent_path=None):
        exclude_modules = {'__init__.py', 'forms.py'}
        if parent_path is None:
            parent_path = os.path.join(app.root_path, top_package_name)

        for pkg in packages:
            pkg_path = os.path.join(parent_path, pkg)

            if os.path.isdir(pkg_path):
                sub_pkgs = os.listdir(pkg_path)
                recursive_import(sub_pkgs, pkg_path)
            else:
                if not pkg.endswith('.py') or pkg in exclude_modules:
                    continue

                module_path = (
                    __name__ +
                    pkg_path
                    .replace(os.path.normpath(app.root_path), '')
                    .replace(os.sep, '.')
                    .rstrip('.py')
                )
                if module_path in sys.modules:
                    importlib.reload(sys.modules[module_path])
                importlib.__import__(module_path, fromlist=['*'])

    top_packages = []
    try:
        top_packages = os.listdir(os.path.join(app.root_path, top_package_name))
    except OSError:
        app.logger.info("Directory '%s' not found." % top_package_name)

    recursive_import(top_packages)

    from api.app.ext import api
    app.register_blueprint(api.blueprint)

    @api.representation('application/json')
    def output_json(data, code, headers):
        resp = Response(
            response=JSONEncoder().encode(data),
            status=code,
            mimetype='application/json'
        )
        resp.headers.extend(headers or {})
        return resp
