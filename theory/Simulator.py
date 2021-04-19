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
		self.Args = Args()
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


		self.x = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.dx = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.q = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.s_q = pd.DataFrame(np.zeros(( self.s,  self.n )), index=self.graph_snode.keys() , columns=self.graph_node.keys())
		self.k1 = pd.DataFrame(np.zeros(( self.n,  self.e )), index=self.graph_node.keys() , columns=self.graph_edge.keys())
		self.k2 = pd.DataFrame(np.zeros(( self.e, self.n )), index=self.graph_edge.keys(), columns=self.graph_node.keys() )
		self.k4 = pd.Series(np.zeros(self.e), index=self.graph_edge.keys())
		self.k5 = pd.Series(np.zeros(self.e), index=self.graph_edge.keys())
		self.loc = pd.DataFrame(np.zeros(( self.s, self.Args.loc_d )), index=self.graph_snode.keys()) 

		for node_label, node in self.graph_node.items() :
			self.x[node_label] = node.c
			self.q[node_label] = node.q

		for edge_label, edge in self.graph_edge.items():
			self.k4[edge_label] = edge.k4
			self.k5[edge_label] = edge.k5

			for reactant in edge.r :
				self.k1[edge_label][reactant[0]] = -reactant[1]
				self.k2[reactant[0]][edge_label] = reactant[1]
		
			for product in edge.p :
				self.k1[edge_label][product[0]] = product[1]

		for snode_label, snode in self.graph_snode.items():
			for d in range(self.Args.loc_d) :
				self.loc[d][snode_label]= snode.loc[d]

			for node_label in snode.node_included :
				self.s_q[node_label][snode_label] = self.q[node_label]

		self.e_x = np.exp(self.x)
		self.one_k5 = 1-self.k5
		





	def show_simulator(self):
		NG = nx.DiGraph()
		for node in self.graph_node :
			NG.add_node(node["label"])

		for edge in self.graph_edge :
			NG.add_edge(edge["label"])



