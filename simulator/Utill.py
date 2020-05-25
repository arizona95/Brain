import json
import os
from Args import Args


class Utill :

	def __init__(self):

		self.Args = Args()
		self.cash_regist_list=["neuron_group", "neuron_model"]
		self.cash= cash_regist()
		self.db_root_path = self.db_root_path_load()

		self.db_name_filter_key = {
			"networkdb":{
				"nodes":["label","neuronGroup"],
				"edges":[],
			},
			"groupdb":{
				"nodes":["label", "Type", "Option", "neuron", "neuronNum", "outputNum"],
				"edges":["Type","Option"],
			},
			"modeldb":{
				"nodes":["label"],
				"edges":[],
			},
		}



	def cash_regist(self):

		# cash regist by cash_regist_list

		cash = dict()
		for cash_name in self.cash_regist_list :
			cash[cash_name]={}

		return cash


	def db_root_path_load(self) :

		# load database root path

		my_file_path = os.path.dirname(os.path.abspath(__file__))
		return os.path.join("\\".join(my_file_path.split('\\')[:-1]), "database")


	def load_from_db(self, filename, db_name):

		# load from database

		info = {}

		#cash search
		if db_name in self.cash_regist_list :
			if filename in self.cash[db_name] :
				info = self.cash[db_name][filename]
				return info

		# if not in cash
		file_path = os.path.join(self.db_root_path,  db_name, filename + 'json')
		with open(file_path,'r') as json_file :
			dirty_info = json.load(json_file)["graph"]
			info = self.make_clean_info(dirty_info, db_name)

		#cash register
		if db_name in self.cash_regist_list :
			self.cash[db_name][filename] = info

		return info

	def make_clean_info(self,dirty_info, db_name):

		# ban unuseless info, Edge id -> Edge label
		id_to_label = dict()
		clean_info = {"nodes":[],"edges":[]}

		for dirty_node in dirty_info["nodes"]:

			# to search node label by id - for Edge information
			id_to_label[dirty_node["id"]] = dirty_node["label"]

			# filtering node
			clean_node = dict()
			if db_name in self.db_name_filter_key :
				for filter_key in self.db_name_filter_key[db_name]["nodes"] :
					clean_node[filter_key] = dirty_node[filter_key],

			# add location
			if "x" in dirty_node and "y" in dirty_node :
				clean_node["location"] = [[dirty_node["x"],dirty_node["y"]]]

			clean_info["nodes"].append(clean_node)

		for dirty_edge in dirty_info["edges"]:

			#filtering edge
			clean_edge= dict()
			if db_name in self.db_name_filter_key :
				for filter_key in self.db_name_filter_key[db_name]["edges"] :
					clean_edge[filter_key] = dirty_edge[filter_key],

			# add from, to, label
			if "from" in dirty_edge and "to" in dirty_edge:
				from_label = id_to_label[dirty_edge["from"]]
				to_label = id_to_label[dirty_edge["to"]]
				clean_edge["label"] = from_label + self.Args.label_maker_str + to_label
				clean_edge["from"] = from_label
				clean_edge["to"] = to_label

			clean_info["edges"].append(clean_edge)

		return clean_info