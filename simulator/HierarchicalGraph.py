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
		self.neuron_model_local_input_dict = dict()			# index for add synaps in neuron - local input element
		self.neuron_element_local_input_dict = dict()		# index for add synaps - add output_pointer


		self.hierarchical_down_group_indexer = dict()		#indexer

		#job list
		self.job_list = list()							# job list

		self.local_input_job_list = list()				# input neuron element node
		self.global_input_job_list = list()				# input neuron element node

		self.age = 0
		self.pointer = 0

		self.debug = True
		self.debug_dict = dict()
		self.debug_show = dict()
		self.debug_show_time = 30

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
		self.hierarchical_down_group_dict[node["label"]] = dict()
		self.hierarchical_down_group_input_dict[node["label"]] = dict()
		self.hierarchical_down_group_output_dict[node["label"]] = dict()
		self.hierarchical_graph[hierarchy_name].add_node(node)

		# make index initialization
		if hierarchy_name == "neuron_model" :
			self.hierarchical_down_group_indexer[node["label"]] = dict()
			self.neuron_model_local_from_dict[node["label"]] = dict()
			self.neuron_model_synaps_dict[node["label"]] = dict()
			self.neuron_model_local_input_dict[node["label"]] = dict()
			for func in self.Args.function_neuron_element :
				self.hierarchical_down_group_indexer[node["label"]][func] = dict()

		if hierarchy_name == "neuron_element" and node["role"] == self.Args.role_string["input"] :
			if node["locality"] == self.Args.locality_string["global"]:
				self.global_input_job_list.append(node)
			if node["locality"] == self.Args.locality_string["local"]:
				self.neuron_element_local_input_dict[node["label"]] = dict()
				self.local_input_job_list.append(node)

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

		if hierarchy_name == "neuron_element" :
			# index for job
			from_neuron_element_node = self.node_label_dict[edge["from"]]
			to_neuron_element_node = self.node_label_dict[edge["to"]]

			if from_neuron_element_node["role"] == self.Args.role_string["output"] and to_neuron_element_node["role"] == self.Args.role_string["input"] :
				pass
			else : self.job_list.append([from_neuron_element_node["value"], to_neuron_element_node["value"], to_neuron_element_node["locality"], edge['neuron'], edge["original_label"]])



		# make calculate index dict 

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

				if down_node["role"] == self.Args.role_string["input"]  :
					self.neuron_model_local_input_dict[up_node_label][down_node_label] = self.node_label_dict[down_node_label]

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
						to_down_group_node["output_pointer"].append(self.node_label_dict[from_down_group_node_label]["value"])
						# time interval is static.
						to_down_group_node["time_interval"] = np.concatenate((to_down_group_node["time_interval"], np.array([self.Args.neuron_global_synaps_time_interval],int)))
						time_point = (self.Args.neuron_global_synaps_time_interval+ self.pointer) & self.Args.time_interval_cycle_queue_moduler
						to_down_group_node["time_point"] = np.concatenate((to_down_group_node["time_point"], np.array([time_point],int)))
						to_down_group_node["synaps_num"] = to_down_group_node["synaps_num"] + 1

					if  locality == self.Args.locality_string["local"] :
						self.neuron_element_local_input_dict[to_down_group_node_label][up_node_from_label] = self.node_label_dict[from_down_group_node_label]

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

	def debug_set(self,  debug_config):
		if "debug_mode" in debug_config :
			if debug_config["debug_mode"]=="true" :
				self.debug = True
			if debug_config["debug_mode"]=="false" :
				#init debug
				self.debug = False
				self.debug_dict = dict()

		if "debug_include" in debug_config :
			#add debug dict <- only neuron model label
			#add debug show <- network - group - model - element dict
			add_debug_list = []
			for debug_include_label in debug_config["debug_include"] :

				if debug_include_label in self.hierarchical_graph["neuron_network"].node_dict :
					neuron_network_label = debug_include_label

					if neuron_network_label not in self.debug_show :
						self.debug_show[neuron_network_label] = {"label": neuron_network_label , "data":dict(), "fold":0}

					for neuron_group_label in self.hierarchical_down_group_dict[neuron_network_label]:
						if neuron_group_label not in self.debug_show[neuron_network_label]["data"] :
							self.debug_show[neuron_network_label]["data"][neuron_group_label] = {"label": neuron_group_label , "data":dict(), "fold":0}
						for neuron_model_label in self.hierarchical_down_group_dict[neuron_group_label]:
							if neuron_model_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
								self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label] = {"label": neuron_model_label , "data":dict(), "fold":0}
							if neuron_model_label not in self.debug_dict :
								add_debug_list.append(neuron_model_label)
							for neuron_element_label in self.hierarchical_down_group_dict[neuron_model_label]:
								if neuron_element_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"]:
									self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"][neuron_element_label] = {"label": neuron_element_label , "data":dict()}

				elif debug_include_label in self.hierarchical_graph["neuron_group"].node_dict :
					neuron_group_label = debug_include_label
					neuron_network_label = self.hierarchical_up_group_dict[neuron_group_label]["label"]

					if neuron_network_label not in self.debug_show :
						self.debug_show[neuron_network_label] = {"label": neuron_network_label , "data":dict(), "fold":0}
					if neuron_group_label not in self.debug_show[neuron_network_label]["data"] :
						self.debug_show[neuron_network_label]["data"][neuron_group_label] = {"label": neuron_group_label , "data":dict(), "fold":0}

					for neuron_model_label in self.hierarchical_down_group_dict[neuron_group_label]:
						if neuron_model_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
							self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label] = {"label": neuron_model_label , "data":dict(), "fold":0}
						if neuron_model_label not in self.debug_dict :
							add_debug_list.append(neuron_model_label)
						for neuron_element_label in self.hierarchical_down_group_dict[neuron_model_label]:
							if neuron_element_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"]:
								self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"][neuron_element_label] = {"label": neuron_element_label , "data":dict()}

				elif debug_include_label in self.hierarchical_graph["neuron_model"].node_dict :
					neuron_model_label = debug_include_label
					neuron_group_label = self.hierarchical_up_group_dict[neuron_model_label]["label"]
					neuron_network_label = self.hierarchical_up_group_dict[neuron_group_label]["label"]


					if neuron_network_label not in self.debug_show :
						self.debug_show[neuron_network_label] = {"label": neuron_network_label , "data":dict(), "fold":0}
					if neuron_group_label not in self.debug_show[neuron_network_label]["data"] :
						self.debug_show[neuron_network_label]["data"][neuron_group_label] = {"label": neuron_group_label , "data":dict(), "fold":0}
					if neuron_model_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
						self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label] = {"label": neuron_model_label , "data":dict(), "fold":0}

					if neuron_model_label not in self.debug_dict :
						add_debug_list.append(neuron_model_label)
					for neuron_element_label in self.hierarchical_down_group_dict[neuron_model_label]:
						if neuron_element_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"]:
							self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"][neuron_element_label] = {"label": neuron_element_label , "data":dict()}

				elif debug_include_label in self.hierarchical_graph["neuron_element"].node_dict :
					neuron_element_label = debug_include_label
					neuron_model_label = self.hierarchical_up_group_dict[neuron_element_label]["label"]
					neuron_group_label = self.hierarchical_up_group_dict[neuron_model_label]["label"]
					neuron_network_label = self.hierarchical_up_group_dict[neuron_group_label]["label"]

					if neuron_network_label not in self.debug_show :
						self.debug_show[neuron_network_label] = {"label": neuron_network_label , "data":dict(), "fold":0}
					if neuron_group_label not in self.debug_show[neuron_network_label]["data"] :
						self.debug_show[neuron_network_label]["data"][neuron_group_label] = {"label": neuron_group_label , "data":dict(), "fold":0}
					if neuron_model_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
						self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label] = {"label": neuron_model_label , "data":dict(), "fold":0}
					if neuron_element_label not in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"]:
						self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"][neuron_element_label] = {"label": neuron_element_label , "data":dict()}

					if neuron_model_label not in self.debug_dict :
						add_debug_list.append(neuron_model_label)


			# add debug list
			for neuron_model_label in add_debug_list :
				#if neuron_model_label not in self.debug_dict :
				self.debug_dict[neuron_model_label] = {
					"start_age" : self.age,
					"current_age": self.age,
					"debuging_age" : 1,
					"element_history": dict()
				}
				for neuron_element_label in self.hierarchical_down_group_dict[neuron_model_label] :
					self.debug_dict[neuron_model_label]["element_history"][neuron_element_label] = {
						"value_history" : np.array([self.node_label_dict[neuron_element_label]["value"]["v"]])
					}





		if "debug_remove" in debug_config :
			#delete debug dict <- only neuron model label
			#debug show <- network - group - model - element dict
			delete_debug_list= []
			for debug_remove_label in debug_config["debug_remove"] :

				if debug_remove_label in self.hierarchical_graph["neuron_network"].node_dict :
					neuron_network_label = debug_remove_label

					if neuron_network_label in self.debug_show :
						del self.debug_show[neuron_network_label]
						for neuron_group_label in self.hierarchical_down_group_dict[neuron_network_label]:
							for neuron_model_label in self.hierarchical_down_group_dict[neuron_group_label]:
								if neuron_model_label in self.debug_dict :
									delete_debug_list.append(neuron_model_label)

				elif debug_remove_label in self.hierarchical_graph["neuron_group"].node_dict :
					neuron_group_label = debug_remove_label
					neuron_network_label = self.hierarchical_up_group_dict[neuron_group_label]["label"]

					if neuron_network_label in self.debug_show :
						if neuron_group_label in self.debug_show[neuron_network_label]["data"] :
							del self.debug_show[neuron_network_label]["data"][neuron_group_label]
							for neuron_model_label in self.hierarchical_down_group_dict[neuron_group_label]:
								if neuron_model_label in self.debug_dict :
									delete_debug_list.append(neuron_model_label)

				elif debug_remove_label in self.hierarchical_graph["neuron_model"].node_dict :
					neuron_model_label = debug_remove_label
					neuron_group_label = self.hierarchical_up_group_dict[neuron_model_label]["label"]
					neuron_network_label = self.hierarchical_up_group_dict[neuron_group_label]["label"]

					if neuron_network_label in self.debug_show :
						if neuron_group_label in self.debug_show[neuron_network_label]["data"] :
							if neuron_model_label in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
								del self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]
								if neuron_model_label in self.debug_dict :
									delete_debug_list.append(neuron_model_label)

				elif debug_remove_label in self.hierarchical_graph["neuron_element"].node_dict :
					neuron_element_label = debug_remove_label
					neuron_model_label = self.hierarchical_up_group_dict[neuron_element_label]["label"]
					neuron_group_label = self.hierarchical_up_group_dict[neuron_model_label]["label"]
					neuron_network_label = self.hierarchical_up_group_dict[neuron_group_label]["label"]

					if neuron_network_label in self.debug_show :
						if neuron_group_label in self.debug_show[neuron_network_label]["data"] :
							if neuron_model_label in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
								if neuron_element_label in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"] :
									del self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"][neuron_element_label]

			#delete debug dict by delete_debug_list
			for neuron_model_label in delete_debug_list :
				del self.debug_dict[neuron_model_label]

			# delete there is empty show list

			delete_neuron_model_label_list = []
			for neuron_network_label in self.debug_show :
				for neuron_group_label in self.debug_show[neuron_network_label]["data"] :
					for neuron_model_label in self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"] :
						if len(self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]["data"]) ==0 :
							delete_neuron_model_label_list.append([neuron_network_label, neuron_group_label, neuron_model_label])

			for neuron_network_label, neuron_group_label, neuron_model_label in delete_neuron_model_label_list :
				del self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]

			delete_neuron_group_label_list = []
			for neuron_network_label in self.debug_show :
				for neuron_group_label in self.debug_show[neuron_network_label]["data"] :
					if len(self.debug_show[neuron_network_label]["data"][neuron_group_label]["data"]) == 0 :
						delete_neuron_group_label_list.append([neuron_network_label, neuron_group_label])

			for neuron_network_label, neuron_group_label in delete_neuron_group_label_list :
				del self.debug_show[neuron_network_label]["data"][neuron_group_label]

			delete_neuron_network_label_list = []
			for neuron_network_label in self.debug_show :
				if len(self.debug_show[neuron_network_label]["data"]) == 0 :
					delete_neuron_network_label_list.append(neuron_network_label)

			for  neuron_network_label in delete_neuron_network_label_list :
				del self.debug_show[neuron_network_label]


	def debug_visualization(self, history_length, neuron_element_label):
		neuron_model_node = self.hierarchical_up_group_dict[neuron_element_label]
		neuron_model_label =neuron_model_node["label"]
		if neuron_model_label in self.debug_dict :
			if neuron_element_label in self.debug_dict[neuron_model_label]["element_history"] :
				value_history = self.debug_dict[neuron_model_label]["element_history"][neuron_element_label]["value_history"] 
				import matplotlib.pyplot as plt
				print(neuron_element_label)
				for synaps_index in range(value_history.shape[1]) :
					plt.title(neuron_model_node["local_synaps"][synaps_index])
					plt.plot(value_history[-history_length:,synaps_index])
					plt.show()
