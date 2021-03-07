import json

from Args import Args
from Node import Node
from Edge import Edge
from Snode import Snode
from Sedge import Sedge

class Simulator : 

	def __init__(self) :

		self.age = 0
		self.graph_s_node = list()
		self.graph_node = list()
		self.graph_edge = list()




		self.s_node = Snode(neuron_model_info.s_node_info)
		self.node = Node(neuron_model_info.node_info)
		self.edge = Edge(neuron_model_info.edge_info)

	def build(self, neuron_model_info_filename = "HX_model.json") :

		with open(neuron_model_info_filename,'r',encoding = 'utf-8') as neuron_model_info_file :
			neuron_model_info = json.load(neuron_model_info_file)

		#node_info import
		for node_info in neuron_model_info.node_info :
			self.graph_node.append( Node(node_info) )

		#edge_info import
		for edge_info in neuron_model_info.edge_info :
			self.graph_node.append( Edge(edge_info) )


	def show_simulator(self):
		doit =0



