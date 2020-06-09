from flask_restful import reqparse
import argparse
from api.app import status
from api.app.ext import api
from api.app.resources import APIResource
from db.models import (
    Network,
)
import werkzeug
from flask import request
import os

import sys
myPath = os.path.dirname(os.path.abspath(__file__))
simulatorPath = os.path.join("\\".join(myPath.split('\\')[:-5]), "simulator")
sys.path.append(simulatorPath)
from SimulatorManager import SimulatorManager

simulatorManager = SimulatorManager()

class SimulatorMakerAPI(APIResource):
    global simulatorManager

    def post(self):

        print('SimulatorMakerAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()

        print(args)


        simulatorManager.run(args.config["name"])

        print("done")


        return '', status.HTTP_200_OK


api.add_resource(
    SimulatorMakerAPI,
    '/simulatorMaker',
    endpoint='simulatorMaker',
)



class SimulatorManipulationAPI(APIResource):
    global simulatorManager

    def post(self):

        print('SimulatorManipulationAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()

        print(args)

        if args.config["manipulation"] == "run" :
            simulatorManager.manipulate_simulator_running(100000000)
        elif args.config["manipulation"] == "stop" :
            simulatorManager.manipulate_simulator_running(0)
        elif args.config["manipulation"] == "step" :
            simulatorManager.manipulate_simulator_running(1)
        elif args.config["manipulation"] == "forward":
            simulatorManager.manipulate_simulator_running(int(args.config["forward"]))

        return '', status.HTTP_200_OK


api.add_resource(
    SimulatorManipulationAPI,
    '/SimulatorManipulation',
    endpoint='SimulatorManipulation',
)

class SimulatorClickInputAPI(APIResource):
    global simulatorManager

    def post(self):

        print('SimulatorClickInputAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()


        #clickInput = args.config["clickInput"]

        #simulatorObject.clickInput(clickInput)


        return '', status.HTTP_200_OK


api.add_resource(
    SimulatorClickInputAPI,
    '/SimulatorClickInput',
    endpoint='simulatorClickInput',
)


class SimulatorDebugSettingAPI(APIResource):
    global simulatorManager

    def post(self):

        print('SimulatorDebugSettingAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()

        #stopOrRun = args.config["stopOrRun"]
        #simulatorTime = args.config["simulatorTime"]

        debug_config={}
        if args.config["mode"] == "debug_include":
            debug_config = {"debug_include":[args.config["data"]]}
        elif args.config["mode"] == "debug_remove":
            debug_config = {"debug_remove": [args.config["data"]]}
        elif args.config["mode"] == "debug_mode_change":
            if args.config["data"] == "False":
                debug_config = {"debug_mode": "true"}
            else :
                debug_config = {"debug_mode": "false"}

        simulatorManager.debug_set(debug_config)

        return simulatorManager.simulator.graph.debug_show, status.HTTP_200_OK



api.add_resource(
    SimulatorDebugSettingAPI,
    '/SimulatorDebugSetting',
    endpoint='SimulatorDebugSetting',
)
