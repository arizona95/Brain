import os
import json
from NeuronModel import NeuronModel
from Utill import Utill
from Args import Args


class NeuronBox :
	def __init__(self, graph, neuron_network_node):
		self.Utill = Utill()
		self.Args = Args()
