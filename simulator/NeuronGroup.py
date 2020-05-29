import os
import json
from NeuronBox import NeuronBox
from Utill import Utill
from Args import Args


class NeuronGroup :
	def __init__(self, graph) :

		self.Utill = Utill()
		self.Args = Args()
		self.graph = graph

	def build_neuron_group(self):

		# add neuron group layer
		self.graph.add_hierarchy("neuron_group") 

		neuron_network_node_dict = self.graph.hierarchical_graph["neuron_network"].node_dict
		for neuron_network_node_label in neuron_network_node_dict:
			neuron_network_node = neuron_network_node_dict[neuron_network_node_label]

			#make node
			if neuron_network_node["Type"] == "Layer":
				groupNum = int(neuron_network_node["groupNum"])
				for group_id in range(groupNum) :

					neuron_group_node = {
						'label':neuron_network_node["label"]+self.Args.label_concat_letter+self.Args.group_init_letter+str(group_id),
						'neuron_group': neuron_network_node['group'],
						'location':neuron_network_node["location"]+[[0,group_id * -100]],
					}

					# add neuron graph
					self.graph.add_node(neuron_group_node, "neuron_group")
					self.graph.add_group_edge(neuron_group_node["label"], neuron_network_node["label"])

					# make link each other by Option
					# no-Connection , one-to-one-Connection, full-Connection
					if neuron_network_node["Option"] == "no-Connection":
						pass

					elif neuron_network_node["Option"] == "one-to-one-Connection":
						if group_id == 0 :
							before_group_label = neuron_group_node["label"]
						else :
							# <->
							self.graph.add_edge_from_to(before_group_label,neuron_group_node["label"],"neuron_group")
							self.graph.add_edge_from_to(neuron_group_node["label"],before_group_label,"neuron_group")
							before_group_label = neuron_group_node["label"]

					elif neuron_network_node["Option"] == "full-Connection":
						for neuron_before_id in range(group_id):
							before_group_label = neuron_network_node["label"]+self.Args.label_concat_letter+"n"+str(neuron_before_id)
							#<->
							self.graph.add_edge_from_to(before_group_label,neuron_group_node["label"],"neuron_group")
							self.graph.add_edge_from_to(neuron_group_node["label"],before_group_label,"neuron_group")

			elif self.neuron_group_node["Type"] == "Box":
				neuron_box = NeuronBox(self.graph, neuron_network_node)

		neuron_network_edge_dict = self.graph.hierarchical_graph["neuron_network"].edge_dict
		for neuron_network_edge_label in neuron_network_edge_dict:
			neuron_network_edge = neuron_network_edge_dict[neuron_network_edge_label]
			# make link

			#make link metrix each other by connection
			neuron_network_from_node_groupNum = int(neuron_network_node_dict[neuron_network_edge["from"]]["groupNum"])
			neuron_network_to_node_groupNum = int(neuron_network_node_dict[neuron_network_edge["to"]]["groupNum"])

			connection_metrix = [[0 for col in range(neuron_network_from_node_groupNum)] for row in range(neuron_network_to_node_groupNum)]

			if neuron_network_edge["connection"] == "one-to-one-connection" :
				for group_id in range(min(neuron_network_from_node_groupNum, neuron_network_to_node_groupNum)) :
					connection_metrix[group_id][group_id] = 1

			elif neuron_network_edge["connection"] == "full-connection" :
				for col in range(neuron_network_from_node_groupNum) :
					for row in range(neuron_network_to_node_groupNum) :
						connection_metrix[row][col] = 1

			elif neuron_network_edge["connection"] == "N-percent-connection" :
				import random
				n_percent = int(neuron_network_edge["percent"])/100
				for col in range(neuron_network_from_node_groupNum) :
					for row in range(neuron_network_to_node_groupNum) :
						if random.random() > n_percent :
							connection_metrix[row][col] = 1
			# elif [add more]

			# link by connection_metrix
			for col in range(neuron_network_from_node_groupNum) :
				for row in range(neuron_network_to_node_groupNum) :
					if connection_metrix[row][col] == 1 :
						neuron_group_from_node_label = neuron_network_edge["from"]+self.Args.label_concat_letter+self.Args.group_init_letter+str(col)
						neuron_group_from_to_label = neuron_network_edge["to"]+self.Args.label_concat_letter+self.Args.group_init_letter+str(row)
						self.graph.add_edge_from_to(neuron_group_from_node_label,neuron_group_from_to_label, "neuron_group")






