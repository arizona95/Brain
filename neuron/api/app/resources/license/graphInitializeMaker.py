from flask_restful import reqparse
import argparse
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Graph,
)

from db.base import db_session
import werkzeug
from flask import request
import os
import json

class GraphSaveAsAPI(APIResource):

    def post(self):

        print('GraphSaveAsAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        newGraphName = args.config['graphName']
        newGraphJson = args.config['graphData']

        Graph.create(name=newGraphName, parameter=newGraphJson).commit()


        return '', status.HTTP_200_OK


api.add_resource(
    GraphSaveAsAPI,
    '/graphSaveAs',
    endpoint='graphSaveAs',
)

class GraphExportAPI(APIResource):

    def post(self):

        print('GraphExportAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        print(args.config)
        graphId = args.config['graphId']
        newGraphJson = args.config['graphData']

        graphData = Graph.query.filter(Graph.id == graphId)



        graphData.update({"parameter":newGraphJson})

        db_session.commit()

        return '', status.HTTP_200_OK


api.add_resource(
    GraphExportAPI,
    '/graphExport',
    endpoint='graphExport',
)
