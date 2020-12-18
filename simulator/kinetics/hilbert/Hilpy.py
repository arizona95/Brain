import os
from Args import Args
from Vector import Vector
from Operator import Operator
import numpy as np
import math

class Hilpy:

	def to_vector(vector):

		return Vector(vector)

	def sum_vector(vector1, vector2) :

		return Vector(vector1.psi+vector2.psi)


