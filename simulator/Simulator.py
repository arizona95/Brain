import os
import json
from Utill import Utill
from Args import Args
from HierarchicalGraph import HierarchicalGraph

from NeuronNetwork import NeuronNetwork
from NeuronGroup import NeuronGroup
from NeuronModel import NeuronModel
from NeuronElement import NeuronElement

class Simulator :

	def __init__(self, neuron_network_filename):

		self.Utill=Utill()
		self.Args = Args()

		self.graph = HierarchicalGraph()  	# make hierarchy graph

		self.neuron_network = NeuronNetwork(self.graph)
		self.neuron_group = NeuronGroup(self.graph)
		self.neuron_model = NeuronModel(self.graph)
		self.neuron_element = NeuronElement(self.graph)

		self.build(neuron_network_filename) #build hierarchial neuron layer

	def build(self, neuron_network_filename):

		self.neuron_network.build_neuron_network(neuron_network_filename)	# make neuron network layer
		self.neuron_group.build_neuron_group()								# make neuron group layer
		self.neuron_model.build_neuron_model()								# make neuron model layer
		self.neuron_element.build_neuron_element()							# make neuron element layer

	def boarn(self):
		for boarn_age in range(10):
			self.neuron_model.add_synaps()


	def one_step(self):
		if self.graph.age %self.Args.neuron_update_cycle == 0 : 

			###
			# 1. neuron suicide in box  (neuron group)
			# 2. neuron generate in box (neuron group)
			# 3. synaps sucide          (neuron element)
			# 4. synaps generate        (neuron element)
			self.neuron_model.suicide_synaps()
			self.neuron_model.add_synaps()
			#		* if synaps itself, time invert algorithm is different
			# 5. synaps split 			(neuron element)
			###

		self.neuron_group.step_neuron_network()

			# 1. time invert neuron -1
			# 2. for all edge, calculate 