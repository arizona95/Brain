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
import json
from threading import Lock, Thread
import time

print('Simulator running!!!!!!')


class Simulator():

    def __init__(self):
        self.neuralNetwork = {}
        self.inputTable = []
        self.clickInput = None
        self.simulatorThread = None
        self.simulatorTime = 0
        self.debugMode = False



    def Work(self):
        print('Work Start')

        #setting

        age=0
        while True:

            #break
            if self.simulatorTime<=0 :
                continue

            #simualting
            time.sleep(1)
            age=age+1
            self.simulatorTime = self.simulatorTime -1
            print('age: '+str(age))

    def run(self, networkInfo, inputTable, debugMode):
        self.neuralNetwork = networkInfo
        # temp
        # input -> lif neuron

        self.inputTable = inputTable
        self.debugMode = debugMode

        try :
            self.simulatorThread.kill()
            self.simulatorTime = 0
            self.age = 0

        except : print('there is no thread')

        self.simulatorThread = Thread(target=self.Work)
        self.simulatorThread.start()

    def debugChange(self, debugMode):
        self.debugMode = debugMode

    def manipulateSimulatorRunning(self, simulatorTime) :
        self.simulatorTime = simulatorTime

    def clickInput(self, clickInput):
        self.clickInput = clickInput



simulatorObject = Simulator()

class SimulatorMakerAPI(APIResource):
    global simulatorObject

    def post(self):

        print('SimulatorMakerAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()

        print(args)


        simulatorObject.run(args.config["modelPath"], input, args.config["debug"])


        return '', status.HTTP_200_OK


api.add_resource(
    SimulatorMakerAPI,
    '/simulatorMaker',
    endpoint='simulatorMaker',
)



class SimulatorManipulationAPI(APIResource):
    global simulatorObject

    def post(self):

        print('SimulatorManipulationAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()

        print(args)

        if args.config["manipulation"] == "run" :
            simulatorObject.manipulateSimulatorRunning(100000000)
        elif args.config["manipulation"] == "stop" :
            simulatorObject.manipulateSimulatorRunning(0)
        elif args.config["manipulation"] == "step" :
            simulatorObject.manipulateSimulatorRunning(1)
        elif args.config["manipulation"] == "forward":
            simulatorObject.manipulateSimulatorRunning(int(args.config["forward"]))


        #stopOrRun = args.config["stopOrRun"]
        #simulatorTime = args.config["simulatorTime"]

        #simulatorObject.manipulateSimulatorRunning(stopOrRun, simulatorTime)


        return '', status.HTTP_200_OK


api.add_resource(
    SimulatorManipulationAPI,
    '/SimulatorManipulation',
    endpoint='SimulatorManipulation',
)

class SimulatorClickInputAPI(APIResource):
    global simulatorObject

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
    global simulatorObject

    def post(self):

        print('SimulatorDebugSettingAPI\n\n')

        parser = reqparse.RequestParser()
        parser.add_argument('config', type=dict, location='json', required=True)
        args = parser.parse_args()

        print(args)


        #stopOrRun = args.config["stopOrRun"]
        #simulatorTime = args.config["simulatorTime"]

        #simulatorObject.manipulateSimulatorRunning(stopOrRun, simulatorTime)


        return '', status.HTTP_200_OK


api.add_resource(
    SimulatorDebugSettingAPI,
    '/SimulatorDebugSetting',
    endpoint='SimulatorDebugSetting',
)
