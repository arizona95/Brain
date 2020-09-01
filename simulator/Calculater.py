from Args import Args
from numba import cuda
from numba.cuda import to_device
import numpy as np
import sys

class Calculater :

	def __init__(self, Utill):

		self.Args = Args()
		self.Utill = Utill

	def make_RDF_function_list(self, db_name, dirty_edges) :

		self.RDF_function_list[db_name] = []


	### 
	"""

	calculate_function

	1: calculate by dictionary python
	2: calculate by redis

	"""
	###


	def calculate_function_method_1(self,db_name, edgeLabel, x):
		print("todo")

	#@cuda.reduce
	def calculate_function_method_2(self, X, Y,  to_locality, neuron_model_name, edge_label):

		# local -> local

		RDF_dict = self.Utill.RDF_function[neuron_model_name][edge_label]

		R_x = RDF_dict["R_x"]
		D_x = RDF_dict["D_x"]
		F_x = RDF_dict["F_x"]

		# R_x process
		# dy = R(x)*dt
		
		x = X['dv']
		R_x_dy = R_x[4]+R_x[5]*x
		R_x_dy = R_x[3]+R_x_dy*x
		R_x_dy = R_x[2]+R_x_dy*x
		R_x_dy = R_x[1]+R_x_dy*x
		R_x_dy = R_x[0]+R_x_dy*x
		dY = R_x_dy

		# D_x process
		# dy = D(y-x)*dt
		x = Y['v'] - X['v']
		D_x_dy = D_x[4]+D_x[5]*x
		D_x_dy = D_x[3]+D_x_dy*x
		D_x_dy = D_x[2]+D_x_dy*x
		D_x_dy = D_x[1]+D_x_dy*x
		D_x_dy = D_x[0]+D_x_dy*x
		dY = dY+ D_x_dy*self.Args.d_time

		# F_x process
		# dy = F(y)*dt
		x = Y['v']
		F_x_dy = F_x[4]+F_x[5]*x
		F_x_dy = F_x[3]+F_x_dy*x
		F_x_dy = F_x[2]+F_x_dy*x
		F_x_dy = F_x[1]+F_x_dy*x
		F_x_dy = F_x[0]+F_x_dy*x
		dY = dY+ F_x_dy*self.Args.d_time

		if to_locality == self.Args.locality_string["local"] : Y['ndv'] = Y['ndv'] + dY
		elif to_locality == self.Args.locality_string["global"] : Y['ndv'] = Y['ndv'] + sum(dY)

		if edge_label == "@Input~Global~Spike -> Inner" :
			print("rdf")
			print(RDF_dict)
			print("X")
			print(X)
			print("Y")
			print(Y)
			print("y-x")
			print( Y['v'] - X['v'])
			x = Y['v'] - X['v']
			D_x_dy = D_x[4]+D_x[5]*x
			D_x_dy = D_x[3]+D_x_dy*x
			D_x_dy = D_x[2]+D_x_dy*x
			D_x_dy = D_x[1]+D_x_dy*x
			D_x_dy = D_x[0]+D_x_dy*x
			print("D_x_dy")
			print(D_x_dy)
			print("==========================")

		
