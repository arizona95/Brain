import os
import json
from NeuronModel import NeuronModel
from Utill import Utill
from Args import Args


class NeuronGroup :
	def __init__(self, graph, neuron_group_node):

		self.Utill = Utill()
		self.Args = Args()
		self.neuron_group_node = neuron_group_node
		self.neuron_node_list = []

		self.build_neuron_group(graph)


	def build_neuron_group(self, graph):

		if self.neuron_group_node["Type"] == "Layer":
			neuronNum = int(self.neuron_group_node["neuronNum"])
			for neuron_id in range(neuronNum) :

				#load neuron info
				neuron_model_info = self.Utill.neuron_model_info(self.neuron_group_node['neuron'], )

				neuron_node = {
					'label':os.path.join(self.neuron_group_node["label"],"n"+str(neuron_id)), 
					'location':self.neuron_group_node["location"]+[[-50,-500]]+[[0,neuron_id * 10]],
				}

				self.neuron_node_list.append(neuron_node["label"])

				#add neuron graph
				graph.add_node(neuron_node, "neuron_model")
				graph.add_group_edge(neuron_node["label"], self.neuron_group_node["label"])

				#make neuron_model object
				neuron = NeuronModel(graph,neuron_node)

		elif self.neuron_group_node["Type"] == "Box":
			print("toDo")



