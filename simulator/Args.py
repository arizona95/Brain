import os
import math
import numpy as np

class Args:

	def __init__(self):
		# time that unit of simulation
		self.d_time = 0.001 
		self.estimate_mat_size = 10000

		self.neuron_update_cycle = 1000


		self.layer_throw_concat_letter = "||"
		self.group_label_numbering="#"
		self.group_init_letter="G"
		self.locality_add_letter = "~"
		self.label_concat_letter = "/"
		self.label_maker_str = " -> "
		self.synaps_id_maker = " -> "
		self.synaps_id_indexer = " S"
		self.global_synaps_id_indexer = " G"

		self.role_string = {
			"input":"@Input",
			"output":"@Output",
			"inner":"@Inner",
			"i/o_put":"@Input@Output",
		}

		self.locality_string = {
			"global":"Global",
			"local":"Local",
		}

		self.function_neuron_element = {
			"output_global_spike": self.role_string["output"]+self.locality_add_letter+self.locality_string["global"]+self.locality_add_letter+"Spike",
			"input_global_spike": self.role_string["input"]+self.locality_add_letter+self.locality_string["global"]+self.locality_add_letter+"Spike",	
			"input_local_spike": self.role_string["input"]+self.locality_add_letter+self.locality_string["local"]+self.locality_add_letter+"Spike",	
			"suicide_neuron" : self.role_string["output"]+self.locality_add_letter+self.locality_string["global"]+self.locality_add_letter+"Suicide",
			"suicide_synaps" : self.role_string["output"]+self.locality_add_letter+self.locality_string["global"]+self.locality_add_letter+"Suicide",
			"add_synaps" : self.role_string["output"]+self.locality_add_letter+self.locality_string["global"]+self.locality_add_letter+"Generator", 
		}

		self.cash_regist_list=["neuron_group", "neuron_model"]

		self.db_name_filter_key = {
			"networkdb":{
				"nodes":["label", "group", "Type", "Option", "groupNum", "original_label"],
				"edges":["connection", "percent"],
			},
			"groupdb":{
				"nodes":["label", "neuron", "role", "locality", "original_label"],
				"edges":["locality"],
			},
			"modeldb":{
				"nodes":["label", "locality", "role","group","bound_max","bound_min","Random","initial", "original_label"],
				"edges":[],
			},
		}

		self.neuron_max_synaps_num = 8
		self.neuron_min_synaps_time_interval = 2
		self.neuron_max_synaps_time_interval = 20
		self.neuron_global_synaps_time_interval = 5
		self.time_interval_cycle_queue_size = self.calculate_cycle_queue_size()
		self.time_interval_cycle_queue_moduler = self.time_interval_cycle_queue_size -1
		self.init_queue = np.array([[0 for col in range(self.time_interval_cycle_queue_size)]])



	def calculate_cycle_queue_size(self) :
		time_interval_bit_num = int(math.log(self.neuron_max_synaps_time_interval, 2)) 

		if math.pow(2,time_interval_bit_num ) != self.neuron_max_synaps_time_interval :
			time_interval_bit_num=time_interval_bit_num+1

		return int(math.pow(2,time_interval_bit_num ))





