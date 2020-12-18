import os
import math
import numpy as np

class Args:

	def __init__(self):
		
		#dimension of hilbert space
		self.dim = 100

		self.dx = 1/self.dim
		self.dt = 1/100