import csv
import os
import re
from collections import defaultdict
from concurrent.futures import as_completed
from concurrent.futures.thread import ThreadPoolExecutor

from config import app_config
from db.base import db_session
from db.models import (
    Neuron,
    Graph,
    Group,
    Network,
)

import json

myPath = os.path.dirname(os.path.abspath(__file__))
modelDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-1]), "database\\modeldb")
modelDBJsonList = os.listdir(modelDBRootPath)
for JsonName in modelDBJsonList :
	Neuron.create(name=JsonName.split('.')[0],  modelPath= os.path.join(modelDBRootPath, JsonName) )



groupDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-1]), "database\\groupdb")
groupDBJsonList = os.listdir(groupDBRootPath)
for JsonName in groupDBJsonList :
	Group.create(name=JsonName.split('.')[0],  groupPath= os.path.join(groupDBRootPath, JsonName) )



networkDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-1]), "database\\networkdb")
networkDBJsonList = os.listdir(networkDBRootPath)
for JsonName in networkDBJsonList :
	Network.create(name=JsonName.split('.')[0],  networkPath= os.path.join(networkDBRootPath, JsonName) )

initialGraphs = [
	{
		"name":"e^x-1",
		"parameter":{
			0:{
				"id": 0,
				"name":"x^5",
				"value":0.00833,
				"lock":False,
			},
			1:{
				"id": 1,
				"name":"x^4",
				"value":0.04166,
				"lock":False,
			},
			2:{
				"id": 2,
				"name":"x^3",
				"value":0.16666,
				"lock":False,
			},
			3:{
				"id": 3,
				"name":"x^2",
				"value":0.50000,
				"lock":False,
			},
			4:{
				"id": 4,
				"name":"x^1",
				"value":1.00000,
				"lock":False,
			},
			5:{
				"id": 5,
				"name":"x^0",
				"value":0.00000,
				"lock":True,
			},
		}

	},
	{
		"name":"e^(0.6*x)-1",
		"parameter":{
			0:{
				"id": 0,
				"name":"x^5",
				"value":0.00065,
				"lock":False,
			},
			1:{
				"id": 1,
				"name":"x^4",
				"value":0.00540,
				"lock":False,
			},
			2:{
				"id": 2,
				"name":"x^3",
				"value":0.03600,
				"lock":False,
			},
			3:{
				"id": 3,
				"name":"x^2",
				"value":0.18000,
				"lock":False,
			},
			4:{
				"id": 4,
				"name":"x^1",
				"value":0.60000,
				"lock":False,
			},
			5:{
				"id": 5,
				"name":"x^0",
				"value":0.00000,
				"lock":True,
			},
		}

	},
	{
		"name":"1-1/e^x",
		"parameter":{
			0:{
				"id": 0,
				"name":"x^5",
				"value":0.00833,
				"lock":False,
			},
			1:{
				"id": 1,
				"name":"x^4",
				"value":0.04166,
				"lock":False,
			},
			2:{
				"id": 2,
				"name":"x^3",
				"value":0.16666,
				"lock":False,
			},
			3:{
				"id": 3,
				"name":"x^2",
				"value":-0.50000,
				"lock":False,
			},
			4:{
				"id": 4,
				"name":"x^1",
				"value":1.00000,
				"lock":False,
			},
			5:{
				"id": 5,
				"name":"x^0",
				"value":0.00000,
				"lock":True,
			},
		}

	},		

]

for initialGraph in initialGraphs :
	Graph.create(name=initialGraph["name"],  parameter = initialGraph["parameter"])

db_session.commit()
