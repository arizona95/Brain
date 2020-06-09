import json
import os
from Args import Args

class Utill :

	def __init__(self):

		self.Args = Args()
		self.cash_regist_list= self.Args.cash_regist_list
		self.cash= self.cash_regist()
		self.db_root_path = self.db_root_path_load()
		self.db_name_filter_key = self.Args.db_name_filter_key
		self.RDF_function = dict()



	def cash_regist(self):

		# cash regist by cash_regist_list

		cash = dict()
		for cash_name in self.cash_regist_list :
			cash[cash_name]={}

		return cash

	def leaf_label(self,label) :
		return label.split(self.Args.label_concat_letter)[-1]

	def check_leaf_group_label_same(self, label_one, label_two):

		#return leaf label is same
		origin_label_one = label_one.split(self.Args.label_concat_letter)[-1].split(self.Args.group_label_numbering)[0]
		origin_label_two = label_two.split(self.Args.label_concat_letter)[-1].split(self.Args.group_label_numbering)[0]
		if origin_label_one == origin_label_two : return True
		else : return False

	def check_leaf_model_label_be_connect(self, from_output_label, to_input_label, locality):

		#return leaf label is same
		## @Output~Global~Spike -> @Input~Local~Spike
		origin_from_output_label = from_output_label.split(self.Args.label_concat_letter)[-1].split(self.Args.locality_add_letter)[-1]
		changed_from_output_label = self.Args.role_string["input"]+self.Args.locality_add_letter+locality+self.Args.locality_add_letter+origin_from_output_label
		leaf_to_input_label = to_input_label.split(self.Args.label_concat_letter)[-1]
		if changed_from_output_label == leaf_to_input_label : return True
		else : return False

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
		file_path = os.path.join(self.db_root_path,  db_name, filename + '.json')
		with open(file_path,'r') as json_file :
			dirty_info = json.load(json_file)["graph"]
			info = self.make_clean_info(dirty_info, db_name)

			if db_name == "modeldb" :
				self.make_RDF_function(filename, db_name, dirty_info)

		#cash register
		if db_name in self.cash_regist_list :
			self.cash[db_name][filename] = info

		return info

	def make_clean_info(self,dirty_info, db_name):

		# ban unuseless info, Edge id -> Edge label
		id_to_label = dict()
		clean_info = {"nodes":[],"edges":[]}

		for dirty_node in dirty_info["nodes"]:

			# save original label
			dirty_node["original_label"] = dirty_node["label"]

			# add locality node add letter
			if db_name == "modeldb" :
				if dirty_node["role"] != self.Args.role_string["inner"] :
						dirty_node["label"]= dirty_node["role"]+\
											 self.Args.locality_add_letter+\
											 dirty_node["locality"]+\
											 self.Args.locality_add_letter+\
											 dirty_node["label"]

			# to search node label by id - for Edge information
			id_to_label[dirty_node["id"]] = dirty_node["label"]

			# filtering node
			clean_node = dict()
			if db_name in self.db_name_filter_key :
				for filter_key in self.db_name_filter_key[db_name]["nodes"] :
					try:
						clean_node[filter_key] = dirty_node[filter_key]
					except:
						print(dirty_node)
						exit()

			# add location
			if "x" in dirty_node and "y" in dirty_node :
				clean_node["location"] = [[dirty_node["x"],dirty_node["y"]]]

			clean_info["nodes"].append(clean_node)

		for dirty_edge in dirty_info["edges"]:

			#filtering edge
			clean_edge= dict()
			if db_name in self.db_name_filter_key :
				for filter_key in self.db_name_filter_key[db_name]["edges"] :
					clean_edge[filter_key] = dirty_edge[filter_key]

			# add from, to, label
			if "from" in dirty_edge and "to" in dirty_edge:
				from_label = id_to_label[dirty_edge["from"]]
				to_label = id_to_label[dirty_edge["to"]]
				clean_edge["label"] = from_label + self.Args.label_maker_str + to_label
				clean_edge["from"] = from_label
				clean_edge["to"] = to_label

			clean_info["edges"].append(clean_edge)


		return clean_info

	def RDF_dict_to_list(self, RDF_dict):

		RDF_list = []
		for rdf_key in RDF_dict :
			RDF_list.append(RDF_dict[rdf_key]["value"])

		return RDF_list


	def make_RDF_function(self, filename, db_name, dirty_info) :

		self.RDF_function[filename] = dict()

		id_to_label = dict()

		for dirty_node in dirty_info["nodes"]:
			# to search node label by id - for Edge information
			id_to_label[dirty_node["id"]] = dirty_node["label"]

		for dirty_edge in dirty_info["edges"]:
			if "from" in dirty_edge and "to" in dirty_edge:
				from_label = id_to_label[dirty_edge["from"]]
				to_label = id_to_label[dirty_edge["to"]]
				edge_label =  from_label + self.Args.label_maker_str + to_label
				self.RDF_function[filename] [edge_label] = {
					"R_x": self.RDF_dict_to_list(dirty_edge["R_x"]),
					"D_x": self.RDF_dict_to_list(dirty_edge["D_x"]),
					"F_x": self.RDF_dict_to_list(dirty_edge["F_x"]),
				}

	def make_list_to_line_chart_data(self, chart_list_data):
		chart_data = []

		for index, data in enumerate(chart_list_data) :
			chart_data.append({
				"name": str(index),
				"value": data*10000,
			})
		return chart_data

