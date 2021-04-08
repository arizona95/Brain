
from Args import Args
import pandas

class Snode : 

	def __init__(self, snode_info) :

		self.label = snode_info["label"]
		self.node_included = snode_info["node_included"]
		self.loc = snode_info["location"]
		#self.p = node_info.momentum


