from flask_restful import reqparse
import argparse
from werkzeug.exceptions import NotFound
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Network,
)

from db.schemas import NetworkSchema
import werkzeug
from flask import request
import os
import json

class NetworkFetchAPI(APIResource):

    def post(self):

        print('NetworkFetchAPI\n\n')

        neuronQuery = (Network.query)
        data = NetworkSchema(many=True).dump(neuronQuery)

        return data, status.HTTP_200_OK


api.add_resource(
    NetworkFetchAPI,
    '/networkFetch',
    endpoint='networkFetch',
)
