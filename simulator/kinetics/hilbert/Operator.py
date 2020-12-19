import os
from Args import Args
import numpy as np
import math

class Operator:

	def __init__(
		self, 
		T_op=None,
		time=0) :

		self.Args = Args()
		self.dim = self.Args.dim 
		if T_op is not None : self.T_op = T_op
		else : self.T_op = numpy.zeros((self.dim, self,dim))

		

