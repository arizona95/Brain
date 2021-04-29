import json
import numpy as np
import collections
import math

class Simulator : 

	def __init__(self) :

		self.age = 0
		self.T = 300
		


	def initial_build(self,) :

		self.n = len(self.graph_node)
		self.e = len(self.graph_edge)
		self.v = 1
		self.s = len(self.graph_snode)
		self.m = len(self.material)


		self.x = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.x_s = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.dx = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.q = pd.Series(np.zeros(self.n), index=self.graph_node.keys())
		self.s_q = pd.DataFrame(np.zeros(( self.s,  self.n )), index=self.graph_snode.keys() , columns=self.graph_node.keys())
		self.k1 = pd.DataFrame(np.zeros(( self.n,  self.e )), index=self.graph_node.keys() , columns=self.graph_edge.keys())
		self.k2 = pd.DataFrame(np.zeros(( self.e, self.n )), index=self.graph_edge.keys(), columns=self.graph_node.keys() )
		self.kv = pd.DataFrame(np.zeros(( self.v,  self.s )), index=self.graph_edge.keys() , columns=self.graph_snode.keys())
		self.k3 = pd.DataFrame(np.zeros(( self.e,  self.v )), index=self.graph_edge.keys() , columns=self.graph_snode.keys())
		self.k4 = pd.Series(np.zeros(self.e), index=self.graph_edge.keys())
		self.k5 = pd.Series(np.zeros(self.e), index=self.graph_edge.keys())
		self.k6 = pd.DataFrame(np.zeros(( self.e,  self.v )), index=self.graph_edge.keys() , columns=self.graph_snode.keys())
		#self.loc = pd.DataFrame(np.zeros(( self.s, self.Args.loc_d )), index=self.graph_snode.keys()) 
		self.s_matrix = pd.DataFrame(np.zeros(( self.s,  self.n )), index=self.graph_snode.keys() , columns=self.graph_node.keys())
		self.m_matrix = pd.DataFrame(np.zeros(( self.n,  self.m )), index=self.graph_node.keys() , columns=self.material.keys())

		for node_label, node in self.graph_node.items() :
			self.x[node_label] = node.c
			self.q[node_label] = node.q
			for material_label, material_num in node.m :
				self.m_matrix[material_label][node_label] = material_num

		for edge_label, edge in self.graph_edge.items():
			self.k4[edge_label] = edge.k4
			self.k5[edge_label] = edge.k5

			for reactant in edge.r :
				self.k1[edge_label][reactant[0]] = -reactant[1]
				self.k2[reactant[0]][edge_label] = reactant[1]
		
			for product in edge.p :
				self.k1[edge_label][product[0]] = product[1]

		for snode_label, snode in self.graph_snode.items():
			#for d in range(self.Args.loc_d) :
			#	self.loc[d][snode_label]= snode.loc[d]

			for node_label in snode.node_included :
				self.s_matrix[node_label][snode_label] =1
				self.s_q[node_label][snode_label] = self.q[node_label]
				self.x_s[node_label] = self.graph_snode[snode_label].size

		#for snode_label_from, snode_from in self.graph_snode.items():
		#	for snode_label_to, snode_to in self.graph_snode.items():
		#		if snode_label_from != snode_label_to :
		#			fl = self.loc.T[snode_label_from]
		#			tl = self.loc.T[snode_label_to]
		#			dis = math.sqrt(((fl-tl)*(fl-tl)).sum())
		#			#ef = (1/(dis+0.000001))*(fl-tl)
		#
		#			self.d[snode_label_from][snode_label_to] = 1/dis

		self.e_x = np.exp(self.x)
		self.one_k5 = 1-self.k5

		self.k3 # makeit!!!!!
		
		# maintain materials
		self.init_materials =self.m_matrix.T.dot(self.x * self.x_s) 


	def one_step(self) :

		self.V = self.k3.dot(self.d.dot( self.s_q.dot(self.x * self.x_s )))

		self.dx = self.k1 * ( np.exp( self.k2 * np.log(self.x) +  self.V ) * self.k4 * ( self.k5* self.T + self.one_k5 * self.V ) )

		self.x = self.x + self.dx
		self.age = self.age+1



	def show_simulator(self):
		NG = nx.DiGraph()
		for node in self.graph_node :
			NG.add_node(node["label"])

		for edge in self.graph_edge :
			NG.add_edge(edge["label"])


	def material_check(self):
		# maintain materials
		now_materials = self.m_matrix.T.dot(self.x * self.x_s)
		print_materials = pd.concat([self.init_materials,now_materials, self.init_materials-now_materials ], axis =1)
		print_materials = print_materials.rename({ 0: "init", 1:"now", 2:"changed" }, axis='columns')
		print(print_materials)

