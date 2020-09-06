import json
import os
from Args import Args
from DNA import DNA
import numpy as np

class GA :

	def __init__(self) :

		self.Generation = np.array([])
		self.Generation_cnt = 1
		self.Args = Args()

	def make_1th_generation(self):

		for index in range(self.Args.population) :
			self.Generation =1 # make generation

	def next_generation(self):
		next_generation =1

		


