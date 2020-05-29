import os
import json
from Args import Args
from Utill import Utill
import numpy as np

class NeuronElement :

	def __init__(self, graph):

		self.Utill = Utill()
		self.Args = Args()
		self.graph = graph


	def build_neuron_element(self) :

		# add neuron element layer
		self.graph.add_hierarchy("neuron_element") 

		neuron_model_node_dict = self.graph.hierarchical_graph["neuron_model"].node_dict
		for neuron_model_node_label in neuron_model_node_dict :
			neuron_model_node = neuron_model_node_dict[neuron_model_node_label]

			#make node
			neuron_model_info = self.Utill.load_from_db(neuron_model_node['neuron'], "modeldb")

			for neuron_element_node in neuron_model_info["nodes"] :

				#1. Local node
				neuron_element_node["label"] = neuron_model_node["label"]+self.Args.label_concat_letter+neuron_element_node["label"]
				neuron_element_node["location"] = neuron_model_node["location"]+neuron_element_node["location"]
				neuron_element_node["initial"] = float(neuron_element_node["initial"])
				neuron_element_node["value"] = {'v': np.array([],float), 'dv': np.array([],float), 'ndv': np.array([],float)}

				#2. global node
				if neuron_element_node["locality"] == self.Args.locality_string['global']:
					neuron_element_node["value"] = { 'v': np.array([neuron_element_node["initial"]],float), 'dv': np.array([0],float),  'ndv': np.array([0],float)}

				#make input queue cause of time interval

				#3. input value
				if neuron_element_node["role"] == self.Args.role_string["input"] :
					#cycle queue  : synaps_num * queue_size
					neuron_element_node["queue"] = np.array([]) 
					neuron_element_node["time_interval"] =  np.array([])  #save element or neuron? 


				# make global input spike synaps

				self.graph.add_node(neuron_element_node, "neuron_element")
				self.graph.add_group_edge(neuron_element_node["label"], neuron_model_node["label"])

			for neuron_element_edge in neuron_model_info["edges"] :
				neuron_element_edge["from"] = neuron_model_node["label"]+self.Args.label_concat_letter+neuron_element_edge["from"]
				neuron_element_edge["to"] = neuron_model_node["label"]+self.Args.label_concat_letter+neuron_element_edge["to"]
				neuron_element_edge["label"] = neuron_element_edge["from"] + self.Args.label_maker_str + neuron_element_edge["to"]

				self.graph.add_edge(neuron_element_edge, "neuron_element")

		neuron_model_edge_dict = self.graph.hierarchical_graph["neuron_model"].edge_dict
		for neuron_model_edge_label in neuron_model_edge_dict :
			neuron_model_edge = neuron_model_edge_dict[neuron_model_edge_label]

			# make link
			self.graph.add_edge_down_layer_by_label_locality(neuron_model_edge["from"], neuron_model_edge["to"], neuron_model_edge["locality"], "neuron_element")


