from flask_restful import reqparse
import argparse
from werkzeug.exceptions import NotFound
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Graph,
)

from db.schemas import GraphSchema
import werkzeug
from flask import request
import os
import json

class GraphFetchAPI(APIResource):

    def post(self):

        print('GraphFetchAPI\n\n')

        graphQuery = (Graph.query)
        data = GraphSchema(many=True).dump(graphQuery)

        return data, status.HTTP_200_OK


api.add_resource(
    GraphFetchAPI,
    '/graphFetch',
    endpoint='graphFetch',
)

class GraphAddAPI(APIResource):

    def post(self):

        print('GraphAddAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newGraphName = args.config['graphName']
        newGraphJson = args.config['graphData']

        Graph.create(name=newGraphName, parameter=newGraphJson).commit()



        return '', status.HTTP_200_OK


api.add_resource(
    GraphAddAPI,
    '/graphAdd',
    endpoint='graphAdd',
)

class GraphDeleteAPI(APIResource):

    def post(self):

        print('GraphAddAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        graphId = args.config['id']

        graphData = Graph.query.filter(Graph.id == graphId).first()
        if graphData is not None:
            graphData.delete()
        else:
            raise NotFound


        return '', status.HTTP_200_OK


api.add_resource(
    GraphDeleteAPI,
    '/graphDelete',
    endpoint='graphDelete',
)
