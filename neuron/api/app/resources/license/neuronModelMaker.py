from flask_restful import reqparse
import argparse
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Neuron,
)
import werkzeug
from flask import request
import os
import json

class ModelImportAPI(APIResource):

    def post(self):

        print('ModelImportAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        with open(config['modelPath'], 'r') as modelJsonFile:
            modelJson = json.load(modelJsonFile)


        return modelJson, status.HTTP_200_OK


api.add_resource(
    ModelImportAPI,
    '/modelImport',
    endpoint='modelImport',
)


class ModelSaveAsAPI(APIResource):

    def post(self):

        print('ModelSaveAsAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        newModelName = config['modelName']
        myPath = os.path.dirname(os.path.abspath(__file__))
        modelDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "simulator\\modeldb")
        newModelPath = os.path.join(modelDBRootPath, newModelName + ".json")

        Neuron.create(name=newModelName, modelPath=newModelPath).commit()


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

        with open(newModelPath, 'w') as modelJsonFile :
            json.dump(changedGraph, modelJsonFile)

        return '', status.HTTP_200_OK


api.add_resource(
    ModelSaveAsAPI,
    '/modelSaveAs',
    endpoint='modelSaveAs',
)

class ModelExportAPI(APIResource):

    def post(self):

        print('ModelExportAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        graphNodes=[]
        graphEdges=[]
        print(config)
        changedGraph= \
        {
            "graph": {
                "nodes": config['nodes'],
                "edges": config['edges'],
            }

        }


        with open(config['modelInfo']['modelPath'], 'w') as modelJsonFile:
            json.dump(changedGraph, modelJsonFile)


        return '', status.HTTP_200_OK


api.add_resource(
    ModelExportAPI,
    '/modelExport',
    endpoint='modelExport',
)
