from flask_restful import reqparse
import argparse
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Neuron,
)

from db.schemas import NeuronSchema

import werkzeug
from flask import request
import os
import json

class ModelFetchAPI(APIResource):

    def post(self):

        print('ModelFetchAPI\n\n')

        neuronQuery = (Neuron.query)
        data = NeuronSchema(many=True).dump(neuronQuery)

        return data, status.HTTP_200_OK


api.add_resource(
    ModelFetchAPI,
    '/modelFetch',
    endpoint='modelFetch',
)

class ModelAddAPI(APIResource):

    def post(self):

        print('ModelAddAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newModelName = args.config['modelName']

        myPath = os.path.dirname(os.path.abspath(__file__))
        modelDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "database\\modeldb")
        newModelPath = os.path.join(modelDBRootPath, newModelName+".json")

        Neuron.create(name=newModelName, modelPath=newModelPath).commit()

        defaultGraph=\
        {
            "graph":{
                "nodes":[],
                "edges":[],
            }
        }

        with open(newModelPath, 'w') as modelJsonFile :
            json.dump(defaultGraph, modelJsonFile)


        return '', status.HTTP_200_OK


api.add_resource(
    ModelAddAPI,
    '/modelAdd',
    endpoint='modelAdd',
)

class ModelDeleteAPI(APIResource):

    def post(self):

        print('ModelDeleteAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newModelId = args.config['id']

        neuronModelData = Neuron.query.filter(Neuron.id == newModelId).first()
        if neuronModelData is not None:
            neuronModelData.delete()
        else:
            raise NotFound

        os.remove(args.config['modelPath'])

        return '', status.HTTP_200_OK


api.add_resource(
    ModelDeleteAPI,
    '/modelDelete',
    endpoint='modelDelete',
)




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
        modelDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "database\\modeldb")
        newModelPath = os.path.join(modelDBRootPath, newModelName + ".json")

        Neuron.create(name=newModelName, modelPath=newModelPath).commit()



        changedGraph = \
        {
            "graph": {
                "nodes": config['nodes'],
                "edges": config['edges'],
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
