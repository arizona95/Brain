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
)

myPath = os.path.dirname(os.path.abspath(__file__))
modelDBRootPath = os.path.join("\\".join(myPath.split('\\')[:-1]), "simulator\\modeldb")
modelDBJsonList = os.listdir(modelDBRootPath)

print(modelDBJsonList)

for JsonName in modelDBJsonList :
	Neuron.create(name=JsonName.split('.')[0],  modelPath= os.path.join(modelDBRootPath, JsonName) )

db_session.commit()
