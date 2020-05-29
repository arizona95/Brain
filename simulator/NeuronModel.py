import os
import json
from Args import Args
from Utill import Utill

import sys
import random
import numpy as np

class NeuronModel :

	def __init__(self, graph):

		self.Utill = Utill()
		self.Args = Args()
		self.graph = graph

	def build_neuron_model(self):

		# add neuron model layer
		self.graph.add_hierarchy("neuron_model") 

		neuron_group_node_dict = self.graph.hierarchical_graph["neuron_group"].node_dict
		for neuron_group_node_label in neuron_group_node_dict :
			neuron_group_node = neuron_group_node_dict[neuron_group_node_label]

			# make node by neuron group info
			neuron_group_info = self.Utill.load_from_db(neuron_group_node['neuron_group'], "groupdb")

			for neuron_model_node in neuron_group_info['nodes'] :
				neuron_model_node['label'] = neuron_group_node['label']+self.Args.label_concat_letter+neuron_model_node['label']
				neuron_model_node['location'] = neuron_group_node['location']+neuron_model_node['location']
				neuron_model_node['local_synaps']=np.array([])
				neuron_model_node['local_synaps_index'] = 0
				neuron_model_node['local_synaps_num'] = 0

				neuron_model_node['global_synaps']=np.array([])
				neuron_model_node['global_synaps_index'] = 0
				neuron_model_node['global_synaps_num'] = 0


				self.graph.add_node(neuron_model_node, "neuron_model")
				self.graph.add_group_edge(neuron_model_node["label"], neuron_group_node["label"])

			# make edge by neuron group info
			for neuron_model_edge in neuron_group_info['edges'] :
				neuron_model_edge['from'] = neuron_group_node['label']+self.Args.label_concat_letter+neuron_model_edge['from']
				neuron_model_edge['to'] = neuron_group_node['label']+self.Args.label_concat_letter+neuron_model_edge['to']
				neuron_model_edge['label'] = neuron_model_edge['from'] + self.Args.label_maker_str + neuron_model_edge['to']

				self.graph.add_edge(neuron_model_edge, "neuron_model")


		neuron_group_edge_dict = self.graph.hierarchical_graph["neuron_group"].edge_dict
		for neuron_group_edge_label in neuron_group_edge_dict :
			neuron_group_edge = neuron_group_edge_dict[neuron_group_edge_label]

			# make link
			self.graph.add_edge_down_layer_by_label_role(neuron_group_edge["from"],neuron_group_edge["to"],"neuron_model")




	def add_synaps(self):
		# add synaps to neuron

		neuron_model_node_dict = self.graph.hierarchical_graph["neuron_model"].node_dict
		for neuron_model_node_label in neuron_model_node_dict :

			synaps_add_judge = False # if True, this neuronn make synaps
			neuron_model_node = neuron_model_node_dict[neuron_model_node_label]
			add_synaps_node_indexer = self.graph.hierarchical_down_group_indexer[neuron_model_node_label]["add_synaps"]

			# if neuron has max synaps : this algorithm can be erased
			if neuron_model_node['local_synaps_num'] > self.Args.neuron_max_synaps_num :
				continue

			for neuron_element_func_node_label in add_synaps_node_indexer :
				neuron_element_func_node = self.graph.node_label_dict[neuron_element_func_node_label]
				# there is several algorithm, this program define add synaps if Synaps Generator is not zero
				if neuron_element_func_node["value"]['v'][0] != 0 :
					synaps_add_judge = True

				break # this algorithm is most fast

			if synaps_add_judge == True :

				# judge which neuron to connect synaps
				connection_neuron_model_candidate_dict = self.graph.neuron_model_local_from_dict[neuron_model_node_label]
				print(neuron_model_node_label)
				print("------")
				print(connection_neuron_model_candidate_dict.keys())
				print("\n")
				# choice is random, but it can be changed
				connection_neuron_model_choice_label = random.choice(list(connection_neuron_model_candidate_dict.keys()))

				# synaps id
				new_synaps_id = connection_neuron_model_choice_label+self.Args.synaps_id_maker+neuron_model_node_label+self.Args.synaps_id_indexer+str(neuron_model_node['local_synaps_index'])
				neuron_model_node['local_synaps'] = np.concatenate((neuron_model_node['synaps'],np.array([new_synaps_id])))
				neuron_model_node['local_synaps_index'] = neuron_model_node['local_synaps_index']+1
				neuron_model_node['local_synaps_num'] = neuron_model_node['local_synaps_num']+1

				# add synaps to node element
				for neuron_element_node_label in self.graph.neuron_model_synaps_dict[neuron_model_node_label] :
					neuron_element_node = self.graph.node_label_dict[neuron_element_node_label]
					neuron_element_node["value"]['v'] = np.concatenate((neuron_element_node["value"]['v'],np.array([neuron_element_node["initial"]],float)))
					neuron_element_node["value"]['dv'] = np.concatenate((neuron_element_node["value"]['dv'],np.array([0],float)))
					neuron_element_node["value"]['ndv'] = np.concatenate((neuron_element_node["value"]['ndv'],np.array([0],float)))

				# time interval logic
				new_synaps_time_interval = random.randint(self.Args.neuron_min_synaps_time_interval,self.Args.neuron_max_synaps_time_interval)
				input_local_spike_node_indexer = self.graph.hierarchical_down_group_indexer[neuron_model_node_label]["input_local_spike"]

				for input_local_spike_node_label in input_local_spike_node_indexer :
					input_local_spike_node = self.graph.node_label_dict[input_local_spike_node_label]

					# add synaps queue
					input_local_spike_node["queue"] = np.concatenate((input_local_spike_node["queue"], self.Args.init_queue))
					input_local_spike_node["time_interval"] = np.concatenate((input_local_spike_node["time_interval"], np.array([new_synaps_time_interval],float)))

					break



	def suicide_synaps(self):
		#suicide synaps to neuron

		neuron_model_node_dict = self.graph.hierarchical_graph["neuron_model"].node_dict
		for neuron_model_node_label in neuron_model_node_dict :

			neuron_model_node = neuron_model_node_dict[neuron_model_node_label]
			suicide_synaps_node_indexer = self.graph.hierarchical_down_group_indexer[neuron_model_node_label]["suicide_synaps"]
			for synaps_id in neuron_model_node['synaps'] :

				#synaps_index = np.where()

				synaps_suicide_judge = False



	def step(self, real_or_estimate, random_value):
		# 1 step simulate
		print('toDo')

	def debugModeChange(self, debugMode):
		# change debug mode
		print('toDo')





