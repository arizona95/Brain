import numpy as np
import matplotlib.pyplot as plt
import math
# membrane


dt = 0.001
WT = int(0.1/dt)
dx = 0.1
D = 0.95
X = 500
R = 1
ohm_S = math.pow(math.e,-1/R)
ohm_mu = 1.9


#set ion
ion_dens = np.zeros(X)
input_ion = np.zeros(WT)
input_ion[0] = X

# set flow matrix
brown_flow_matrix = np.zeros((X,X))
ohm_force_matrix = np.zeros((X,X))

for i in range(X) :
	for j in range(X):

		# Fic's law : d(dens(t,x)) / dt = d^2(dens(t,x)) / (dx)^2 - efected by brown movemnet

		if abs(i-j) ==1 :
			brown_flow_matrix[i][j] += 0.5*D*dt/(dx*dx)

		if abs(i-j) ==0 :
			if i == 0 or i == X-1 :
				brown_flow_matrix[i][j] += -0.5*D*dt/(dx*dx)
			else :
				brown_flow_matrix[i][j] += -1*D*dt/(dx*dx)

		# ohm flow - efected by electronic force
		if abs(i-j) !=0 :
			ohm_force_matrix[i][j] += -ohm_mu*(abs(i-j)/(i-j))*math.pow(ohm_S,abs(i-j))

print(brown_flow_matrix)
print(np.sum(brown_flow_matrix))

print(ohm_force_matrix)

# set electronic density
photon_dens = np.zeros(X)
# there is minus protein in membrane
photon_dens = photon_dens-X/2

def show():
	global brown_flow_matrix, ion_dens, WT,photon_dens, ohm_force_matrix
	print(WT)
	ion_ohm_flow = np.zeros(X)
	ohm_flow_matrix = np.zeros(X)
	for i in range(WT):

		#plt.figure(figsize=(10, 8))

		ion_dens[int(X/3)] += input_ion[i]
		ion_dens[int(X/3)+1] += input_ion[i]
		ion_dens[int(X/3)+2] += input_ion[i]
		brown_flow = np.dot(ion_dens, brown_flow_matrix)

		ion_ohm_flow = np.dot(photon_dens+ion_dens, ohm_force_matrix)
		ion_ohm_flow[:int(X/20)]=0
		ion_ohm_flow[-int(X/20):]=0
		ohm_left_flow = (np.abs(ion_ohm_flow)-ion_ohm_flow)/2
		ohm_left_flow[0]=0
		ohm_right_flow = (np.abs(ion_ohm_flow)+ion_ohm_flow)/2
		ohm_right_flow[-1]=0
		ohm_flow = -1*ohm_left_flow + np.concatenate((ohm_left_flow[1:], np.zeros(1))) -1*ohm_right_flow + np.concatenate((np.zeros(1), ohm_right_flow[:-1]))

		plt.subplot(411)
		plt.plot(ion_dens)

		plt.subplot(412)
		plt.plot(brown_flow)

		plt.subplot(413)
		plt.plot(ohm_flow)

		plt.subplot(414)
		plt.plot(ion_ohm_flow)


		plt.pause(0.00001*dt)

		if i %10 ==0 : 
			print(i)
			print(np.sum(brown_flow))
			print(np.sum(ohm_flow))
			print(np.sum(ion_dens))


		ion_dens += brown_flow
		ion_dens += ohm_flow
		#input()
		plt.clf()


	plt.show()

show()
print("finish")