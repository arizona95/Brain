###################################################
'''
Neural Network
Neuron Group
Neuron
protein




'''
###################################################


from Graph import Graph



class HierarchicalGraph :
	def __init__(self) :
		self.depth = 0
		self.hierarchy = dict()  					# {Neural Network:0, Neuron Group:1, Neuron:2, ,...}
		self.hierarchical_group_dict = dict()		# {{label: "~", "from":, "to"}}
		self.hierarchical_up_group_dict = dict()	# {"neuronA":neoronGroupB..}
		self.hierarchical_down_group_dict = dict()	# {"neuronA":{proteinA, proteinB,...}}
		self.hierarchical_graph = dict()  			# {Neural Network:Graph(), Neuron Group:Graph(), Neuron:Graph(), ,...}
		self.node_label_dict = dict()				# {"neuronA":{'label':"neuronA", ...}...}

	def init_graph(self, graph, hierarchy_name) :
		for node in graph["nodes"] :
			self.add_node(node, hierarchy_name)

		for edge in graph["edges"] :
			self.add_edge(edge, hierarchy_name)


	def add_hierarchy(self, hierarchy_name) :
		self.hierarchy[hierarchy_name] = self.depth
		self.depth = self.depth + 1
		self.hierarchical_graph[hierarchy_name] = Graph()

	def add_node(self, node, hierarchy_name):
		node["depth"] = self.hierarchy[hierarchy_name]
		node["hierarchy_name"] = hierarchy_name
		self.node_label_dict[node["label"]] = node
		self.hierarchical_down_group_dict[node["label"]] = {}
		self.hierarchical_graph[hierarchy_name].add_node(node)

	def add_edge(self, edge, hierarchy_name = None):
		#add horigental edge

		if hierarchy_name == None :
			hierarchy_name = self.node_label_dict[edge["from"]]["hierarchy_name"]

		self.hierarchical_graph[hierarchy_name].add_edge(edge)

	def add_group_edge(self, down_node_label, up_node_label):
		#add vertical edge
		group_edge = {"label":down_node_label + " -> "+up_node_label, "from":down_node_label, "to":up_node_label}
		self.hierarchical_group_dict[group_edge["label"]] = group_edge
		self.hierarchical_up_group_dict[down_node_label] = self.node_label_dict[up_node_label]
		self.hierarchical_down_group_dict[up_node_label][down_node_label] = self.node_label_dict[down_node_label]

	def add_from_edge_by_node(self, down_node_label, hierarchy_name = None):
		#add horigental edge by group [from]
		up_group_node = self.hierarchical_up_group_dict[down_node_label]
		for up_node in self.hierarchical_graph[up_group_node["hierarchy_name"]].node_from_dict :
			for down_node in self.hierarchical_down_group_dict[up_node["label"]] :
				down_from_label = down_node["label"]
				down_edge = {"label":down_from_label + " -> " + down_node_label, "from":down_from_label, "to":down_node_label}
				self.add_edge(down_edge, hierarchy_name)

	def add_to_edge_by_node(self, down_node_label, hierarchy_name = None):
		#add horigental edge by group [from]
		up_group_node = self.hierarchical_up_group_dict[down_node_label]
		for up_node in self.hierarchical_graph[up_group_node["hierarchy_name"]].node_to_dict :
			for down_node in self.hierarchical_down_group_dict[up_node["label"]] :
				down_to_label = down_node["label"]
				down_edge = {"label":down_node_label + " -> " + down_to_label, "from":down_node_label, "to":down_to_label}
				self.add_edge(down_edge, hierarchy_name)

	def add_from_edge_by_group(self, up_node_label, hierarchy_name = None):
		for down_node in self.hierarchical_down_group_dict[up_node_label]:
			add_from_edge_by_node(down_node["label"], hierarchy_name)

	def add_to_edge_by_group(self, up_node_label, hierarchy_name = None):
		for down_node in self.hierarchical_down_group_dict[up_node_label]:
			add_to_edge_by_node(down_node["label"], hierarchy_name)


	def debug_by_networkx(self) :
		import networkx as nx
		import matplotlib.pyplot as plt
		G = nx.DiGraph()
		for node_label in self.node_label_dict :
			loc = [0,0]
			for location in  self.node_label_dict[node_label]["location"] : 
				loc[0] = loc[0]+location[0]
				loc[1] = loc[1]+location[1]

			G.add_node(node_label, pos = tuple(loc))

		for group_edge_label in self.hierarchical_group_dict :
			group_edge = self.hierarchical_group_dict[group_edge_label]
			G.add_edge(group_edge["from"], group_edge["to"])

		for hierarchy_name in self.hierarchy :
			for edge_label in self.hierarchical_graph[hierarchy_name].edge_dict :
				edge = self.hierarchical_graph[hierarchy_name].edge_dict[edge_label]
				G.add_edge(edge["from"], edge["to"])


		pos = nx.get_node_attributes(G, 'pos')
		print(pos)
		nx.draw(G, pos, prog='dot')
		plt.show()




