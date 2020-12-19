import os
from Args import Args
import numpy as np
import math

class Vector:

	def __init__(
		self, 
		vector=None, 
		time=0) :

		self.Args = Args()
		self.dim = self.Args.dim 
		if vector is not None : self.psi = vector
		else : vector = np.zeros(self.dim)
		self.time = 0
		self.history = list()

	def __add__(self, vector): 
		return Vector(self.psi+ vector.psi) 

	def __sub__(self, vector): 
		return Vector(self.psi+ vector.psi) 

	def sum_prob_density(self):

		return np.sum(self.psi*self.psi)

	def time_add(self) :

		self.history.append(self.psi)

		self.time = self.time+1

	def plot_vector(self) :
		import matplotlib.pyplot as plt
		plt.plot(self.psi)
		plt.show()


	def animation_history(self) :
		import matplotlib.pyplot as plt
		from mpl_toolkits.mplot3d import Axes3D 
		import matplotlib.animation as animation
		import matplotlib

		#fig = plt.figure()
		#ax = fig.add_subplot(111, projection='3d')
		

