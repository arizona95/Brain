import os

from flask import Blueprint, send_from_directory, jsonify, url_for, redirect
from flask_cors import CORS
from flask_restful import Api
from flask_swagger import swagger

from config import app_config
from api.app.resources.definitions import definitions

api = None


def init_api(app):
    global api
    api_bp = Blueprint('api', __name__)
    CORS(api_bp, **app_config.CORS)
    api = Api(api_bp)

    @app.route('/')
    def redirect_to_docs():
        return redirect(url_for('docs'))

    @app.route('/spec')
    def spec():
        swag = swagger(app)
        swag['info']['title'] = '%s API' % getattr(app_config, 'NAME')
        swag['consumes'] = [
            'application/x-www-form-urlencoded',
            'multipart/form-data',
        ]
        swag['definitions'] = definitions
        return jsonify(swag)

    @app.route('/docs')
    def docs():
        scheme = getattr(app_config, 'API_SCHEME', 'http')
        host = getattr(app_config, 'API_HOST', '127.0.0.1')
        port = getattr(app_config, 'API_PORT', 5000)
        base_url = '%s://%s:%s' % (scheme, host, port)
        spec_url = base_url + url_for('spec')
        redirect_url = '%s/docs/index.html?url=%s' % (base_url, spec_url)
        return redirect(redirect_url)

    @app.route('/docs/<path:filename>')
    def serve_swagger_static(filename):
        directory = os.path.join(app.static_folder, 'swagger/dist')
        return send_from_directory(directory, filename)
