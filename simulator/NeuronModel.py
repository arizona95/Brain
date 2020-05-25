import os
import json
from Args import Args

class NeuronModel :

	def __init__(self, graph, neuron_node):

		self.Args = Args()
		self.d_time = self.Args.d_time

		self.neuron_node = neuron_node
		self.build_neuron_model(graph)

		self.age = 0
		self.synaps_list = []
		self.local_node_value = {}
		self.global_node_value = {}
		self.local_node_d_value = {}
		self.global_node_d_value = {}
		self.debug = False

	def build_neuron_model(self, graph):

		for neuron_model_node in self.neuron_node['model_info']["nodes"]:

			new_neuron_model_node = {
				'label': os.path.join(self.neuron_node["label"],neuron_model_node["label"]),
				'location':self.neuron_node["location"]+[[-50,-500]]+[[neuron_model_node["x"]/10,neuron_model_node["y"]/10]],
				'neuron_model': self,
			}

			graph.add_node(new_neuron_model_node, "neuron_model")

			graph.add_group_edge(new_neuron_model_node["label"], self.neuron_node["label"])

	def addSynaps(self):
		# add synaps to neuron
		print('toDo')

	def moveNeuron(self):
		# move neuron
		print('toDo')

	def initNeuron(self):
		# init neuron
		print('toDo')

	def step(self, real_or_estimate, random_value):
		# 1 step simulate
		print('toDo')

	def judgeSuicide(self):
		# judge neuron Suicide
		print('toDo')

	def judgeMakeSynaps(self):
		# judge neuron make synaps
		print('toDo')

	def judgeDivideSynaps(self):
		# judge neuron divide synaps
		print('toDo')

	def debugModeChange(self, debugMode):
		# change debug mode
		print('toDo')





