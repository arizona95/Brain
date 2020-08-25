

class Graph :
	def __init__(self) :
		self.node_dict=dict()
		self.edge_dict=dict()
		self.node_from_dict = dict()
		self.node_to_dict = dict()

	def init_graph(self, graph):
		for node in graph["nodes"] :
			self.add_node(node)

		for edge in graph["edges"] :
			self.add_edge(edge)

	def add_node(self, node):
		add_node_label = node["label"]
		self.node_dict[add_node_label] = node
		self.node_from_dict[add_node_label] = {}
		self.node_to_dict[add_node_label] = {}

	def delete_node(self, node):
		del_node_label = node["label"]
		del self.node_dict[del_node_label]
		del self.node_from_dict[del_node_label]
		del self.node_to_dict[del_node_label]

		del_edge_list=list()
		to_node_list=list()
		from_node_list=list()
		for edge_label, edge_info in self.edge_dict.items() :
			if edge_info["from"] == del_node_label:
				del_edge_list.append(edge_label)
				to_node_list.append(edge_info["to"])
			if edge_info["to"] == del_node_label:
				del_edge_list.append(edge_label)
				from_node_list.append(edge_info["from"])

		for edge_label in del_edge_list :
			del self.edge_dict[edge_label]

		for node_label in to_node_list :
			del self.node_from_dict[node_label][del_node_label]

		for node_label in from_node_list :
			del self.node_to_dict[node_label][del_node_label]

	def add_edge(self, edge) :
		add_edge_label = edge["label"]
		self.edge_dict[add_edge_label] = edge
		self.node_to_dict[edge["from"]][edge["to"]] =self.node_dict[edge["to"]]
		self.node_from_dict[edge["to"]][edge["from"]] =self.node_dict[edge["from"]]

	def delete_edge(self, edge) :
		add_edge_label = edge["label"]
		del self.edge_dict[add_edge_label]
		del self.node_to_dict[edge["from"]][edge["to"]] 
		del self.node_from_dict[edge["to"]][edge["from"]] 

	def from_node(self, node):
		return self.node_from_dict[node["label"]]

	def to_node(self, node) :
		return self.node_to_dict[node["label"]]