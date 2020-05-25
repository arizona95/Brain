import os
import json
from Utill import Utill
from Args import Args
from NeuronGroup import NeuronGroup
from HierarchicalGraph import HierarchicalGraph

class NeuronNetwork :

	def __init__(self, neuron_network_filename):

		self.Utill=Utill()
		self.Args = Args()
		self.d_time = self.Args.d_time

		# 1.load neuron network
		self.network_info =  self.Utill.load_from_db(neuron_network_filename, "networkdb")

		# 2. make hierarchy graph
		self.graph = HierarchicalGraph()
		hierarchy_list = ["neuron_network","neuron_group", "neuron_model", "neuron_element"]
		for hierarchy_name in hierarchy_list :
			self.graph.addHierarchy(hierarchy_name)

		self.build_neuron_network()


	def build_neuron_network(self):

		self.graph.init_graph(self.network_info, "neuron_network")

		# make for all of network nodes
		for neuron_group_node in self.network_json["nodes"] :
			NeuronGroup(self.graph, neuron_group_node)





