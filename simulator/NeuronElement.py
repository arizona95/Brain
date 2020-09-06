import os
import json
import copy
from Args import Args
from Utill import Utill
import numpy as np
from Calculater import Calculater
from socketIO_client import SocketIO

class NeuronElement :

	def __init__(self, graph):

		self.Utill = Utill()
		self.Args = Args()
		self.Calculater = Calculater(self.Utill)
		self.graph = graph
		self.socketIO = SocketIO('localhost',3030)



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
				neuron_element_node["synaps_num"] = 0

				#2. global node
				if neuron_element_node["locality"] == self.Args.locality_string['global']:
					neuron_element_node["value"] = { 'v': np.array([neuron_element_node["initial"]],float), 'dv': np.array([0],float),  'ndv': np.array([0],float)}

				#make input queue cause of time interval

				#3. input value
				if neuron_element_node["role"] == self.Args.role_string["input"] :
					#cycle queue  : synaps_num * queue_size
					neuron_element_node["queue"] = np.zeros((0,self.Args.time_interval_cycle_queue_size))
					neuron_element_node["time_interval"] =  np.array([], int)  
					neuron_element_node["time_point"] =  np.array([], int) 
					neuron_element_node["output_pointer"] = list()



				# make global input spike synaps

				self.graph.add_node(neuron_element_node, "neuron_element")
				self.graph.add_group_edge(neuron_element_node["label"], neuron_model_node["label"])

			for neuron_element_edge in neuron_model_info["edges"] :
				neuron_element_edge["from"] = neuron_model_node["label"]+self.Args.label_concat_letter+neuron_element_edge["from"]
				neuron_element_edge["to"] = neuron_model_node["label"]+self.Args.label_concat_letter+neuron_element_edge["to"]
				neuron_element_edge["original_label"] = neuron_element_edge["label"]
				neuron_element_edge["label"] = neuron_element_edge["from"] + self.Args.label_maker_str + neuron_element_edge["to"]
				neuron_element_edge["neuron"] = neuron_model_node['neuron']

				self.graph.add_edge(neuron_element_edge, "neuron_element")

		neuron_model_edge_dict = self.graph.hierarchical_graph["neuron_model"].edge_dict
		for neuron_model_edge_label in neuron_model_edge_dict :
			neuron_model_edge = neuron_model_edge_dict[neuron_model_edge_label]

			# make link
			self.graph.add_edge_down_layer_by_label_locality(neuron_model_edge["from"], neuron_model_edge["to"], neuron_model_edge["locality"], "neuron_element")

	def one_step(self) :
		# one time step

		# calculate nodes
		job_num = len(self.graph.job_list)
		#print(f"there is {job_num} job")

		for X, Y,  to_locality, neuron_model_name, edge_label in self.graph.job_list : 
			self.Calculater.calculate_function_method_2(X, Y,  to_locality, neuron_model_name, edge_label)


		
		# time queue store and calculate input node
		job_num = len(self.graph.local_input_job_list)
		#print(f"there is {job_num} job")

		for input_local_node in self.graph.local_input_job_list : 

			# output_pointer => ndv
			for index in range(input_local_node["synaps_num"]) :
				input_local_node["queue"][index][input_local_node["time_point"]] = input_local_node["output_pointer"][index]['v']

			# get v, dv in queue
			input_value = input_local_node["queue"][:,self.graph.pointer]
			input_local_node["value"]["dv"] = input_value - input_local_node["value"]["v"]
			input_local_node["value"]["v"] = input_value

			# time point => circulate
			input_local_node["time_point"] = (input_local_node["time_point"]+1)& self.Args.time_interval_cycle_queue_moduler

		
		job_num = len(self.graph.global_input_job_list)
		#print(f"there is {job_num} job")

		for input_global_node in self.graph.global_input_job_list :

			# sum(output_pointer) => ndv
			for index in range(input_global_node["synaps_num"]) :
				input_global_node["queue"][index][input_global_node["time_point"]] = input_global_node["output_pointer"][index]['v']

			# get v, dv in queue  - global : sum inputs

			input_value = np.array([sum(input_global_node["queue"][:,self.graph.pointer])])
			input_global_node["value"]["dv"] = input_value - input_global_node["value"]["v"]
			input_global_node["value"]["v"] = input_value

			# time point => circulate
			input_global_node["time_point"] = (input_global_node["time_point"]+1)& self.Args.time_interval_cycle_queue_moduler

		# update node v, dv, ndv
		for neuron_element_label in self.graph.hierarchical_graph["neuron_element"].node_dict :
			neuron_element_value = self.graph.node_label_dict[neuron_element_label]["value"]
			neuron_element_value['dv'] = neuron_element_value['ndv']
			neuron_element_value['v'] = neuron_element_value['v']+neuron_element_value['dv']
			neuron_element_value['ndv'] = np.zeros(neuron_element_value['ndv'].shape)

		# debug
		if self.graph.debug == True :
			for neuron_model_label in self.graph.debug_dict :
				neuron_model_debug = self.graph.debug_dict[neuron_model_label]
				neuron_model_debug["current_age"] = neuron_model_debug["current_age"] + 1
				neuron_model_debug["debuging_age"] = neuron_model_debug["debuging_age"] + 1
				for neuron_element_label in neuron_model_debug["element_history"] :
					neuron_element_debug = neuron_model_debug["element_history"][neuron_element_label]
					neuron_element_value = self.graph.node_label_dict[neuron_element_label]["value"]['v']
					neuron_element_debug["value_history"] =np.concatenate((neuron_element_debug["value_history"], np.array([neuron_element_value])))

			# send debug info to front:

			#link debug show => debug list
			debug_info = copy.deepcopy(self.graph.debug_show)
			for neuron_network_label in debug_info :
				for neuron_group_label in debug_info[neuron_network_label]["data"] :
					for neuron_model_label in debug_info[neuron_network_label]["data"][neuron_group_label]["data"] :
						neuron_model_info = debug_info[neuron_network_label]["data"][neuron_group_label]["data"][neuron_model_label]
						neuron_model_info["start_age"] = self.graph.debug_dict[neuron_model_label]["start_age"]
						neuron_model_info["current_age"] = self.graph.debug_dict[neuron_model_label]["current_age"]
						neuron_model_info["debuging_age"] = self.graph.debug_dict[neuron_model_label]["debuging_age"]

						synaps_label_list = self.graph.node_label_dict[neuron_model_label]["local_synaps"]
						for neuron_element_label in neuron_model_info["data"]:
							neuron_model_info["data"][neuron_element_label]["data"] = dict()
							neuron_element_info = neuron_model_info["data"][neuron_element_label]
							neuron_element_info["locality"]= self.graph.node_label_dict[neuron_element_label]["locality"]
							value_history = self.graph.debug_dict[neuron_model_label]["element_history"][neuron_element_label]["value_history"][-self.graph.debug_show_time:].T.tolist()
							if neuron_element_info["locality"] == self.Args.locality_string['global'] :
								neuron_element_info["data"]["global_synaps"] = {"label": "global_synaps", "data": self.Utill.make_list_to_line_chart_data(value_history[0], self.graph.age)}
							else :
								for synaps_index, synaps_label in enumerate(self.graph.node_label_dict[neuron_model_label]["local_synaps"]) :
									neuron_element_info["data"][synaps_label] = {"label": synaps_label, "data": self.Utill.make_list_to_line_chart_data(value_history[synaps_index], self.graph.age)}
			else_info = {
				"age": self.graph.age,
			}

			print("test")
			print(else_info)
			print(debug_info)
			self.socketIO.emit('debug_info',{
				"debug_info": debug_info,
				"else_info": else_info
			})
			




		# add age
		self.graph.age = self.graph.age+1

		# cycle pointer
		self.graph.pointer = (self.graph.pointer+1) & self.Args.time_interval_cycle_queue_moduler

