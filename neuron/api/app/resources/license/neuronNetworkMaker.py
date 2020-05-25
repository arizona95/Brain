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

class NetworkAddAPI(APIResource):

    def post(self):

        print('NetworkAddAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newNetworkName = args.config['networkName']

        myPath = os.path.dirname(os.path.abspath(__file__))
        networkDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "database\\networkdb")
        newNetworkPath = os.path.join(networkDBRootPath, newNetworkName+".json")

        Network.create(name=newNetworkName, networkPath=newNetworkPath).commit()

        defaultGraph=\
        {
            "graph":{
                "nodes":[],
                "edges":[],
            }
        }

        with open(newNetworkPath, 'w') as networkJsonFile :
            json.dump(defaultGraph, networkJsonFile)


        return '', status.HTTP_200_OK


api.add_resource(
    NetworkAddAPI,
    '/networkAdd',
    endpoint='networkAdd',
)

class NetworkDeleteAPI(APIResource):

    def post(self):

        print('NetworkDeleteAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newNetworkId = args.config['id']

        neuronNetworkData = Network.query.filter(Network.id == newNetworkId).first()
        if neuronNetworkData is not None:
            neuronNetworkData.delete()
        else:
            raise NotFound

        os.remove(args.config['networkPath'])

        return '', status.HTTP_200_OK


api.add_resource(
    NetworkDeleteAPI,
    '/networkDelete',
    endpoint='networkDelete',
)

class NetworkImportAPI(APIResource):

    def post(self):

        print('NetworkImportAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        with open(config['networkPath'], 'r') as networkJsonFile:
            networkJson = json.load(networkJsonFile)


        return networkJson, status.HTTP_200_OK


api.add_resource(
    NetworkImportAPI,
    '/networkImport',
    endpoint='networkImport',
)


class NetworkSaveAsAPI(APIResource):

    def post(self):

        print('NetworkSaveAsAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        newNetworkName = config['networkName']
        myPath = os.path.dirname(os.path.abspath(__file__))
        networkDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "database\\networkdb")
        newNetworkPath = os.path.join(networkDBRootPath, newNetworkName + ".json")

        Network.create(name=newNetworkName, networkPath=newNetworkPath).commit()


        graphNodes = []
        graphEdges = []

        for key in config['nodes']: graphNodes.append(config['nodes'][key])
        for key in config['edges']: graphEdges.append(config['edges'][key])

        changedGraph = \
        {
            "graph": {
                "nodes": graphNodes,
                "edges": graphEdges,
            }

        }

        with open(newNetworkPath, 'w') as networkJsonFile :
            json.dump(changedGraph, networkJsonFile)

        return '', status.HTTP_200_OK


api.add_resource(
    NetworkSaveAsAPI,
    '/networkSaveAs',
    endpoint='networkSaveAs',
)

class NetworkExportAPI(APIResource):

    def post(self):

        print('NetworkExportAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        changedGraph= \
        {
            "graph": {
                "nodes": config['nodes'],
                "edges": config['edges'],
            }

        }


        with open(config['networkInfo']['networkPath'], 'w') as networkJsonFile:
            json.dump(changedGraph, networkJsonFile)


        return '', status.HTTP_200_OK


api.add_resource(
    NetworkExportAPI,
    '/networkExport',
    endpoint='networkExport',
)