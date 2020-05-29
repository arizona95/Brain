###################################################
'''
Neural Network
Neuron Group
Neuron Model
Neuron Element
'''
###################################################

import os
from Args import Args
from Graph import Graph
from Utill import Utill
import numpy as np

class HierarchicalGraph :
	def __init__(self) :

		self.Args = Args()
		self.Utill = Utill()
		self.depth = 0
		self.hierarchy = dict()  							# {Neural Network:0, Neuron Group:1, Neuron:2, ,...}
		self.hierarchical_graph = dict()  					# {Neural Network:Graph(), Neuron Group:Graph(), Neuron:Graph(), ,...}

		self.hierarchical_group_dict = dict()				# {{label: "~", "from":, "to"}}
		self.hierarchical_up_group_dict = dict()			# {"neuronA":neoronGroupB..}
		self.hierarchical_down_group_dict = dict()			# {"neuronA":{proteinA, proteinB,...}}
		self.hierarchical_down_group_input_dict = dict()	# {"neuronA":{proteinA, proteinB,...}}
		self.hierarchical_down_group_output_dict = dict()	# {"neuronA":{proteinA, proteinB,...}}
		self.node_label_dict = dict()						# {"neuronA":{'label':"neuronA", ...}...}

		#index for synaps add
		self.neuron_model_local_from_dict = dict()			# index for select candidate in neuron
		self.neuron_model_synaps_dict = dict()				# index for add synaps in neuron - local element


		self.hierarchical_down_group_indexer = dict()		#indexer

		#job list
		self.local_to_local_job_list= dict()  	# todo
		self.local_to_global_job_list = dict()	# todo
		self.global_to_local_job_list = dict()	# todo

		self.age = 0
		self.pointer = 0

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
		self.hierarchical_down_group_input_dict[node["label"]] = {}
		self.hierarchical_down_group_output_dict[node["label"]] = {}
		self.hierarchical_graph[hierarchy_name].add_node(node)

		# make index initialization
		if hierarchy_name == "neuron_model" :
			self.hierarchical_down_group_indexer[node["label"]] = dict()
			self.neuron_model_local_from_dict[node["label"]] = dict()
			self.neuron_model_synaps_dict[node["label"]] = dict()
			for func in self.Args.function_neuron_element :
				self.hierarchical_down_group_indexer[node["label"]][func] = dict()

	def add_edge_from_to(self, from_node_label, to_node_label, hierarchy_name = None) :
		new_edge ={"label":from_node_label + self.Args.label_maker_str + to_node_label, "from":from_node_label, "to":to_node_label}
		self.add_edge(new_edge, hierarchy_name)


	def add_edge(self, edge, hierarchy_name = None):
		#add horigental edge

		if hierarchy_name == None :
			hierarchy_name = self.node_label_dict[edge["from"]]["hierarchy_name"]

		self.hierarchical_graph[hierarchy_name].add_edge(edge)

		
		if hierarchy_name == "neuron_model" :
			# index for select candidate in neuron
			if edge["locality"] == self.Args.locality_string["local"] :
				self.neuron_model_local_from_dict[edge["to"]][edge["from"]] = self.node_label_dict[edge["from"]]





	def add_group_edge(self, down_node_label, up_node_label):
		#add vertical edge
		group_edge = {"label":down_node_label + " -> "+up_node_label, "from":down_node_label, "to":up_node_label}
		self.hierarchical_group_dict[group_edge["label"]] = group_edge
		down_node = self.node_label_dict[down_node_label]
		self.hierarchical_up_group_dict[down_node_label] = self.node_label_dict[up_node_label]
		self.hierarchical_down_group_dict[up_node_label][down_node_label] = down_node

		if "role" in down_node :
			if down_node["role"] == self.Args.role_string["input"] : self.hierarchical_down_group_input_dict[up_node_label][down_node_label] = down_node
			elif down_node["role"] == self.Args.role_string["output"] : self.hierarchical_down_group_output_dict[up_node_label][down_node_label] = down_node
			elif down_node["role"] == self.Args.role_string["i/o_put"] : 
				self.hierarchical_down_group_input_dict[up_node_label][down_node_label] = down_node
				self.hierarchical_down_group_output_dict[up_node_label][down_node_label] = down_node

		#indexing
		if self.node_label_dict[up_node_label]["hierarchy_name"] == "neuron_model" :
			for func in self.Args.function_neuron_element :
				if self.Utill.leaf_label(self.node_label_dict[down_node_label]["label"]) == self.Args.function_neuron_element[func] :
					self.hierarchical_down_group_indexer[up_node_label][func][down_node_label] = self.node_label_dict[down_node_label]

			# index for add if synaps added
			if down_node["locality"] == self.Args.locality_string["local"] :
				self.neuron_model_synaps_dict[up_node_label][down_node_label] = self.node_label_dict[down_node_label]


	def add_edge_down_layer_by_label_role(self, up_node_from_label, up_node_to_label, hierarchy_name = None) :
		from_down_group_output_dict = self.hierarchical_down_group_output_dict[up_node_from_label]
		to_down_group_input_dict = self.hierarchical_down_group_input_dict[up_node_to_label]

		for from_down_group_node_label in from_down_group_output_dict :
			for to_down_group_node_label in to_down_group_input_dict :
				if self.Utill.check_leaf_group_label_same(from_down_group_node_label, to_down_group_node_label) :
					new_edge ={
						"label": from_down_group_node_label + self.Args.label_maker_str + to_down_group_node_label, 
						"from": from_down_group_node_label, 
						"to": to_down_group_node_label,
						"locality": self.node_label_dict[from_down_group_node_label]["locality"]
					}
					self.add_edge(new_edge, hierarchy_name)
					

	def add_edge_down_layer_by_label_locality(self, up_node_from_label, up_node_to_label,locality, hierarchy_name = None) :
		from_down_group_output_dict = self.hierarchical_down_group_output_dict[up_node_from_label]
		to_down_group_input_dict = self.hierarchical_down_group_input_dict[up_node_to_label]
		up_node_to_node = self.node_label_dict[up_node_to_label]

		#1. add synaps : global output => global input
		if locality == self.Args.locality_string["global"] :
			new_synaps_id = up_node_from_label+self.Args.synaps_id_maker+up_node_to_label+self.Args.global_synaps_id_indexer+str(up_node_to_node['global_synaps_index'])
			up_node_to_node['global_synaps'] = np.concatenate((up_node_to_node['global_synaps'],np.array([new_synaps_id])))
			up_node_to_node['global_synaps_index'] = up_node_to_node['global_synaps_index']+1
			up_node_to_node['global_synaps_num'] = up_node_to_node['global_synaps_num']+1

		for from_down_group_node_label in from_down_group_output_dict :
			for to_down_group_node_label in to_down_group_input_dict :
				if self.Utill.check_leaf_model_label_be_connect(from_down_group_node_label, to_down_group_node_label, locality) :
					self.add_edge_from_to(from_down_group_node_label, to_down_group_node_label, hierarchy_name)

					if locality == self.Args.locality_string["global"] :
						# 2. make queue to neuron element node
						to_down_group_node = self.node_label_dict[to_down_group_node_label]
						to_down_group_node["queue"] = np.concatenate((to_down_group_node["queue"], self.Args.init_queue))



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


	def graph_board_write_node(self, graph_board_str, node_info) : 

		node_str = "node {\n  name: \""+node_info["label"]+"\"\n  op: \"matmul\"\n"

		for input_label in node_info["input"]:
			node_str = node_str + "\tinput: \""+input_label+"\"\n"

		node_str = node_str+"}\n"

		return graph_board_str + node_str


	def throw_up_label(self, original_label, throw_depth):
		up_label = self.Args.layer_throw_concat_letter.join(original_label.split(self.Args.label_concat_letter)[:throw_depth])
		if throw_depth != 0 : up_label = up_label + self.Args.layer_throw_concat_letter
		return up_label + self.Args.label_concat_letter.join(original_label.split(self.Args.label_concat_letter)[throw_depth:])


	def make_graph_board(self, throw_depth=0):

		graph_board_str = ""

		hierarchy_list = ["neuron_network","neuron_group", "neuron_model", "neuron_element"]

		for hierarchy_name in ["neuron_element"] : #self.hierarchy :
			hierarchy_one_layer_graph = self.hierarchical_graph[hierarchy_name]

			for node_label in hierarchy_one_layer_graph.node_dict :
				node_info = dict()
				node_info["label"] = self.throw_up_label(node_label, throw_depth)
				node_info["input"] = []

				for from_node_label in hierarchy_one_layer_graph.node_from_dict[node_label] :
					throwed_from_node_label = self.throw_up_label(from_node_label, throw_depth)
					if throwed_from_node_label != "" :
						node_info["input"].append(throwed_from_node_label)

				if node_info["label"] != "" :
					graph_board_str = self.graph_board_write_node(graph_board_str, node_info)

		my_file_path = os.path.dirname(os.path.abspath(__file__))
		graph_board_path = os.path.join("\\".join(my_file_path.split('\\')[:-1]), "neuron","GraphBoard","demo","data","graph_run_brain.pbtxt")

		with open(graph_board_path, "w") as graph_board_file :
			graph_board_file.write(graph_board_str)



	def debug_by_networkx(self) :
		import networkx as nx
		import matplotlib.pyplot as plt

		G = nx.DiGraph()
		for node_label in self.node_label_dict :
			loc = [0,0]
			for location in  self.node_label_dict[node_label]["location"] : 
				loc[0] = 2*(loc[0]+location[0] - 50)
				loc[1] = 2*(loc[1]+location[1] - 500)

			G.add_node(node_label, pos = tuple(loc))

		for group_edge_label in self.hierarchical_group_dict :
			group_edge = self.hierarchical_group_dict[group_edge_label]
			G.add_edge(group_edge["from"], group_edge["to"])

		for hierarchy_name in self.hierarchy :
			for edge_label in self.hierarchical_graph[hierarchy_name].edge_dict :
				edge = self.hierarchical_graph[hierarchy_name].edge_dict[edge_label]
				G.add_edge(edge["from"], edge["to"])


		pos = nx.get_node_attributes(G, 'pos')

		nx.draw_networkx_nodes(
        G, pos,  
        node_size=3, cmap=plt.cm.Blues
                      )

		nx.draw_networkx_edges(
        G, pos, width=0.1, arrowsize=1, min_target_margin=-50)

		for node_name in pos :
			pos[node_name] = (pos[node_name][0]+10, pos[node_name][1]+10)


		#nx.draw_networkx_labels( G, pos, font_family='sans-serif', font_color='black', font_size=3, font_weight='bold')
		#plt.show()
		plt.savefig('nx_fig.png', dpi = 1500)




