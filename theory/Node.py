
from Args import Args
from pandas import Series, DataFrame

class Node : 

	def __init__(self, node_info) :

		self.label = node_info.label
		self.m = node_info.material
		self.s = 0
		self.q = node_info.coulomb
		self.h = node_info.entalphy
		self.c = node_info.density
		#self.p = node_info.momentum


