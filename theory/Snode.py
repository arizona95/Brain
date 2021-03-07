
from Args import Args
import pandas

class Node : 

	def __init__(self, node_info) :

		self.m = node_info.material
		self.label = node_info.name
		self.s = node_info.space_size
		self.q = node_info.coulomb
		self.h = node_info.entalphy
		self.c = node_info.density
		#self.p = node_info.momentum


