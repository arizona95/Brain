
from Args import Args
import pandas

class Edge : 

	def __init__(self, edge_info) :

		self.label = edge_info["label"]
		self.r = edge_info["reactant"]
		self.p = edge_info["product"]
		self.k3 = edge_info["added_energe"]
		self.k4 = edge_info["response_coefficient"]
		self.k5 = edge_info["ohm_or_diff"]
		self.t = edge_info["delay_time"]