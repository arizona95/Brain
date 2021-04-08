import json
import numpy as np
import collections
from Args import Args
from Node import Node
from Edge import Edge
from Snode import Snode
import pandas as pd
#from Sedge import Sedge

class Simulator : 

	def __init__(self) :

		self.age = 0
		self.graph_snode = collections.OrderedDict()
		self.graph_node = collections.OrderedDict()
		self.graph_edge = collections.OrderedDict()

		self.n = None # node num
		self.e = None # edge num
		self.s = None # space num

		self.x = None # Nodes
		self.e_x = None # e^x
		self.k1 = None # k1
		self.k2 = None # k2
		self.k3 = None # k3
		self.k4 = None # k4
		self.k5 = None # k5


	def build(self, neuron_model_info_filename = "HX_model.json") :

		with open(neuron_model_info_filename,'r',encoding = 'utf-8') as neuron_model_info_file :
			neuron_model_info = json.load(neuron_model_info_file)

		#node_info import
		for node_info in neuron_model_info["node_info"] :
			self.graph_node[node_info["label"]] = Node(node_info)

		#edge_info import
		for edge_info in neuron_model_info["edge_info"] :
			self.graph_edge[edge_info["label"]] =  Edge(edge_info) 

		for snode_info in neuron_model_info["snode_info"] :
			self.graph_snode[snode_info["label"]] =  Snode(snode_info) 

		self.n = len(self.graph_node)
		self.e = len(self.graph_edge)
		self.s = len(self.graph_snode)

		nodes_initial_density_list = list()
		for node_label, node in self.graph_node.items() :
			nodes_initial_density_list.append(node.c)


		self.x = pd.DataFrame(nodes_initial_density_list, index=self.graph_node.keys())

		self.e_x = np.exp(self.x)

		self.k1 = pd.DataFrame(np.zeros(( self.e, self.n )), index=self.graph_edge.keys(), columns=self.graph_node.keys())
		for edge_label, edge in self.graph_edge.items():
			for reactant in edge.r :
				self.k1[reactant[0]][edge_label] = -reactant[1]
		
			for product in edge.r :
				self.k1[product[0]][edge_label] = product[1]

		self.k2 = pd.DataFrame(np.zeros(( self.n, self.e )), index=self.graph_node.keys(), columns=self.graph_edge.keys())
		for edge_label, edge in self.graph_edge.items():
			for reactant in edge.r :
				self.k1[edge_label][reactant[0]] = reactant[1]

		edges_additional_potential_energe_list = list()
		for edge_label, edge in self.graph_edge.items() :
			edges_additional_potential_energe_list.append(edge.k3)
		self.k3 = pd.DataFrame(edges_additional_potential_energe_list, index=self.graph_edge.keys(), columns=self.graph_snode.keys())






	def show_simulator(self):
		NG = nx.DiGraph()
		for node in self.graph_node :
			NG.add_node(node["label"])

		for edge in self.graph_edge :
			NG.add_edge(edge["label"])



