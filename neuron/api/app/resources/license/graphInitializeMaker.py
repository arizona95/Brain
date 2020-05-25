from flask_restful import reqparse
import argparse
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Graph,
)

from db.base import db_session

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
