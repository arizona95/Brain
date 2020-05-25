from flask_restful import reqparse
import argparse
from werkzeug.exceptions import NotFound
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Group,
)

from db.schemas import GroupSchema
import werkzeug
from flask import request
import os
import json

class GroupFetchAPI(APIResource):

    def post(self):

        print('GroupFetchAPI\n\n')

        neuronQuery = (Group.query)
        data = GroupSchema(many=True).dump(neuronQuery)

        return data, status.HTTP_200_OK


api.add_resource(
    GroupFetchAPI,
    '/groupFetch',
    endpoint='groupFetch',
)

class GroupAddAPI(APIResource):

    def post(self):

        print('GroupAddAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newGroupName = args.config['groupName']

        myPath = os.path.dirname(os.path.abspath(__file__))
        groupDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "database\\groupdb")
        newGroupPath = os.path.join(groupDBRootPath, newGroupName+".json")

        Group.create(name=newGroupName, groupPath=newGroupPath).commit()

        defaultGraph=\
        {
            "graph":{
                "nodes":[],
                "edges":[],
            }
        }

        with open(newGroupPath, 'w') as groupJsonFile :
            json.dump(defaultGraph, groupJsonFile)


        return '', status.HTTP_200_OK


api.add_resource(
    GroupAddAPI,
    '/groupAdd',
    endpoint='groupAdd',
)

class GroupDeleteAPI(APIResource):

    def post(self):

        print('GroupDeleteAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        newGroupId = args.config['id']

        neuronGroupData = Group.query.filter(Group.id == newGroupId).first()
        if neuronGroupData is not None:
            neuronGroupData.delete()
        else:
            raise NotFound

        os.remove(args.config['groupPath'])

        return '', status.HTTP_200_OK


api.add_resource(
    GroupDeleteAPI,
    '/groupDelete',
    endpoint='groupDelete',
)

class GroupImportAPI(APIResource):

    def post(self):

        print('GroupImportAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        with open(config['groupPath'], 'r') as groupJsonFile:
            groupJson = json.load(groupJsonFile)


        return groupJson, status.HTTP_200_OK


api.add_resource(
    GroupImportAPI,
    '/groupImport',
    endpoint='groupImport',
)


class GroupSaveAsAPI(APIResource):

    def post(self):

        print('GroupSaveAsAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()
        config = args.config

        #print('here')
        #print(config)

        newGroupName = config['groupName']
        myPath = os.path.dirname(os.path.abspath(__file__))
        groupDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "database\\groupdb")
        newGroupPath = os.path.join(groupDBRootPath, newGroupName + ".json")

        Group.create(name=newGroupName, groupPath=newGroupPath).commit()


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

        with open(newGroupPath, 'w') as groupJsonFile :
            json.dump(changedGraph, groupJsonFile)

        return '', status.HTTP_200_OK


api.add_resource(
    GroupSaveAsAPI,
    '/groupSaveAs',
    endpoint='groupSaveAs',
)

class GroupExportAPI(APIResource):

    def post(self):

        print('GroupExportAPI\n\n')

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


        with open(config['groupInfo']['groupPath'], 'w') as groupJsonFile:
            json.dump(changedGraph, groupJsonFile)


        return '', status.HTTP_200_OK


api.add_resource(
    GroupExportAPI,
    '/groupExport',
    endpoint='groupExport',
)