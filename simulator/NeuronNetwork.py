import os
import json
from Utill import Utill
from Args import Args

class NeuronNetwork :

	def __init__(self, graph):

		self.Utill=Utill()
		self.Args = Args()
		self.graph = graph

	def build_neuron_network(self, neuron_network_filename):

		# add neuron network layer
		self.graph.add_hierarchy("neuron_network") 
		# load neuron network
		neuron_network_info =  self.Utill.load_from_db(neuron_network_filename, "networkdb")
		# make neuron network layer
		self.graph.init_graph(neuron_network_info, "neuron_network")



