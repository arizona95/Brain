# Copyright (c) 2018 Uber Technologies, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#     Unless required by applicable law or agreed to in writing, software
#     distributed under the License is distributed on an "AS IS" BASIS,
#     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#     See the License for the specific language governing permissions and
#     limitations under the License.

import numpy as np
import sys
import itertools
import pprint
import pandas as pd
from IPython.display import display, HTML
from scipy.integrate import odeint
import matplotlib.pyplot as plt


class MultiEnvEvaluator:
    def __init__(self, make_net, activate_net, batch_size=1, max_env_steps=None, make_env=None, envs=None):
        if envs is None:
            self.envs = [make_env() for _ in range(batch_size)]
        else:
            self.envs = envs
        self.make_net = make_net
        self.activate_net = activate_net
        self.batch_size = batch_size
        self.max_env_steps = max_env_steps

        self.c_v =3
        self.s_v=2
        self.max_state = 5
        self.vector_separator = "/"
        self.gene_space_separator = "-"


    def eval_genome(self, genome, config, debug=False):

        fitnesses = np.zeros(self.batch_size)
        states = [env.reset() for env in self.envs]
        dones = [False] * self.batch_size
        net = self.make_net(genome, config, self.batch_size)


        def net_output( input_vector ) :
            return net.activate([np.array(input_vector)])[0]

        def to_string(li) :
            return self.vector_separator.join(str(e) for e in li)


        ## 1. Generation Gene Map G_SET

        c_0 = [0] * (self.c_v -1)
        g_0 = [0] * self.c_v
        s_0 = [0] * self.s_v


        m_c = list()
        q_c = list()
        for i in range(self.c_v-1):
            c_vector = [0]*(self.c_v-1)
            c_vector[i] =1
            input_vector = c_vector + g_0 + s_0 + g_0 + s_0
            reslut = net_output(input_vector)
            m_c.append(float(reslut[0]))
            q_c.append(2*float(reslut[1])-1)

        L=1

        rule_num = 1
        react_rules = dict()
        G0 = []
        for i in range(self.c_v-1):
            add_g0 = [0]*(self.c_v-1)+[0]
            add_g0[i]=1
            G0.append(add_g0)

        G=G0
        for i in range(L) :
            add_G = []
            for gi in G :
                for gj in G :
                    input_vector = c_0 + gi + s_0 + gj + s_0
                    react_or_not = 2*self.max_state*net_output(input_vector)[2]- self.max_state
                    react_rate = float(net_output(input_vector)[3])
                    if react_or_not >=0 :
                        new_g = list(np.array(gi[:-1])+np.array(gj[:-1]))+[int(react_or_not)]
                        add_G.append(new_g)
                        react_rules["r"+str(rule_num)] = {
                            "rule": [gi,gj, new_g],
                            "k" : react_rate,
                        }
                        rule_num +=1
            G=G+add_G

        ## make A dict

        A = dict()
        for i, gi in enumerate(G):
            input_vector = c_0 + gi + s_0 + g_0 + s_0
            A[to_string(gi)] = 5*float(net_output(input_vector)[3])


        ## 2. Generation Space Map S_SET

        S = []
        S_substrate = list(map(lambda x: list(x), list(itertools.product([0, 1], repeat=self.s_v))))
        for si in S_substrate :
            input_vector = c_0 + g_0 + si + g_0 + s_0
            space_or_not = 2*net_output(input_vector)[4]-1
            if space_or_not>=0 :
                S.append(si)

        ## make V matrix

        V = dict()
        for i, si in enumerate(S) :
            ## fs(si) = f(0,si,0,0)[3]
            input_vector = c_0 + g_0 + si + g_0 + s_0
            V[to_string(si)] = float(net_output(input_vector)[5])


        ## make D matrix

        D = [[0 for x in range(len(S))] for y in range(len(S))]
        for i, si in enumerate(S) :
            for j, sj in enumerate(S) :
                if i!=j:
                    input_vector = c_0 + g_0 + si + g_0 + sj
                    distance = 2*float(net_output(input_vector)[6])
                    if distance <1 : ## neighbor
                        D[i][j] = distance
                        D[j][i] = distance
                    else :
                        D[i][j] = np.inf
                        D[j][i] = np.inf


        ## 3. Generation real node
        node = dict()  # name:[x0, c, s, a, xh, h]


        def node_name_of(gi, si) :
            return to_string(gi)+ self.gene_space_separator +to_string(si)

        for i, gi in enumerate(G) :
            for j, sj in enumerate(S) :
                input_vector = c_0 + gi + sj + g_0 + s_0
                result = net_output(input_vector)
                x0 = 20*float(result[7])-10
                xh = 20*float(result[8])-10
                h = float(result[9])
                if xh <=0 :
                    h =0
                    xh=0
                if x0 >0 :
                    node_name = node_name_of(gi, sj)
                    node[node_name] = [
                        x0, #x0
                        gi[:-1],  # c
                        sj,  # s
                        A[to_string(gi)] * V[to_string(sj)],  # a
                        xh,  # xh
                        h,  # h
                        gi,
                    ]

        ## Generation Edge

        M_T = dict()
        k = dict()
        v = dict()

        ## chemical flow : same space
        space_node = dict()
        for i, si in enumerate(S):
            space_node[to_string(si)] = dict()

        for node_name in node :
            space_node[to_string(node[node_name][2])][to_string(node[node_name][6])] = node[node_name][6]

        for react_rule_name in react_rules :
            react_rule = react_rules[react_rule_name]["rule"]
            for space_name in space_node :
                if  to_string(react_rule[0]) in space_node[space_name] and \
                    to_string(react_rule[1]) in space_node[space_name] and \
                    to_string(react_rule[2]) in space_node[space_name] :

                    #add M_T
                    M_T_add = dict()
                    for node_name in node:
                        M_T_add[node_name] = 0
                    M_T_add[to_string(react_rule[0])+self.gene_space_separator+space_name] += 1
                    M_T_add[to_string(react_rule[1])+self.gene_space_separator+space_name] += 1
                    M_T_add[to_string(react_rule[2])+self.gene_space_separator+space_name] = -1
                    M_T[react_rule_name + self.gene_space_separator + space_name] = M_T_add

                    # add k
                    k[react_rule_name + self.gene_space_separator + space_name] = react_rules[react_rule_name]["k"]

                    # add v
                    v[react_rule_name + self.gene_space_separator + space_name] = 0

        ## diffusion flow, hamiltonian flow : different space
        for i, space_name_i in enumerate(space_node):
            si = list( map(lambda x:int(x), space_name_i.split(self.vector_separator) ) )
            for j, space_name_j in enumerate(space_node):
                sj = list(map(lambda x: int(x), space_name_j.split(self.vector_separator)))
                #if neighbor space
                if i!=j and D[i][j] > 0 and D[i][j] <1 :
                    for n , node_name_n in enumerate(space_node[space_name_i]) :
                        for m, node_name_m in enumerate(space_node[space_name_j]) :
                            if node_name_n == node_name_m :
                                input_vector = c_0 +\
                                               space_node[space_name_i][node_name_n] +\
                                               si +\
                                               space_node[space_name_j][node_name_m] +\
                                               sj

                                ##print(f"input_vector: {input_vector}")
                                #diff edge
                                diff_k = 2*float(net_output(input_vector)[11])-1
                                if diff_k >0 : # edge connect

                                    # add M_T
                                    M_T_add = dict()
                                    for node_name in node:
                                        M_T_add[node_name] = 0
                                    M_T_add[node_name_n + self.gene_space_separator + space_name_i] = 1
                                    M_T_add[node_name_m + self.gene_space_separator + space_name_j] = -1
                                    M_T[node_name_n+\
                                        self.gene_space_separator + space_name_j +\
                                        self.gene_space_separator + space_name_i] = M_T_add

                                    # add k
                                    k[node_name_n+\
                                        self.gene_space_separator + space_name_j +\
                                        self.gene_space_separator + space_name_i] = diff_k

                                    # add v
                                    v[node_name_n+\
                                        self.gene_space_separator + space_name_j +\
                                        self.gene_space_separator + space_name_i] = 0

                                #hamilt edge
                                hamilt_k = 2 * float(net_output(input_vector)[12]) - 1
                                if hamilt_k>0 : # edge connect

                                    # add M_T
                                    M_T_add = dict()
                                    for node_name in node:
                                        M_T_add[node_name] = 0
                                    M_T_add[node_name_n + self.gene_space_separator + space_name_i] = 1
                                    M_T_add[node_name_m + self.gene_space_separator + space_name_j] = -1
                                    M_T[node_name_n + \
                                        self.gene_space_separator + space_name_j + \
                                        self.gene_space_separator + space_name_i] = M_T_add

                                    # add k
                                    k[node_name_n + \
                                      self.gene_space_separator + space_name_j + \
                                      self.gene_space_separator + space_name_i] = 0

                                    # add v
                                    v[node_name_n + \
                                      self.gene_space_separator + space_name_j + \
                                      self.gene_space_separator + space_name_i] = hamilt_k


        # make simulator entity
        sim = dict()
        sim["x_0"] = dict()
        sim["p_0"] = dict()
        sim["M"] = dict()
        sim["M_"] = dict()
        sim["S"] = dict()
        sim["D"] = dict()
        sim["a"] = dict()
        sim["k"] = dict()
        sim["v"] = dict()
        sim["c"] = dict()
        sim["x_h"] = dict()
        sim["h"] = dict()



        for node_name in node :
            sim["x_0"][node_name] = node[node_name][0]
            sim["p_0"][node_name] = 0
            sim["M"][node_name] = node[node_name][1]

            add_S = dict()
            for i, si in enumerate(S) :
                if to_string(si) == to_string(node[node_name][2]) :add_S[to_string(si)] =1
                else : add_S[to_string(si)] =0
            sim["S"][node_name] = add_S
            sim["a"][node_name] = node[node_name][3]
            sim["c"][node_name] = 1
            sim["x_h"][node_name] = node[node_name][4]
            sim["h"][node_name] = node[node_name][5]

        sim["x_0"] = pd.DataFrame.from_dict([sim["x_0"]]).T
        sim["p_0"] = pd.DataFrame.from_dict([sim["p_0"]]).T
        sim["M"] = pd.DataFrame.from_dict(sim["M"]).T
        sim["M_"] = pd.DataFrame.from_dict(M_T)
        sim["S"] = pd.DataFrame.from_dict(sim["S"]).T
        space_names = list(map(lambda x:to_string(x),S))
        sim["D"] = pd.DataFrame.from_dict(D)
        sim["D"].columns = space_names
        sim["D"] = sim["D"].T
        sim["D"].columns = space_names
        sim["m_c"] = pd.DataFrame.from_dict([m_c]).T
        sim["q_c"] = pd.DataFrame.from_dict([q_c]).T
        sim["a"] = pd.DataFrame.from_dict([sim["a"]]).T
        sim["k"] = pd.DataFrame.from_dict([k]).T
        sim["v"] = pd.DataFrame.from_dict([v]).T
        sim["c"] = pd.DataFrame.from_dict([sim["c"]]).T
        sim["x_h"] = pd.DataFrame.from_dict([sim["x_h"]]).T
        sim["h"] = pd.DataFrame.from_dict([sim["h"]]).T

        ### print, display

        print(f"react_rules : {react_rules}")
        print(f"G set : {G}")
        print(f"A set : {A}")
        print(f"S set: {S}")
        print(f"D mat: {D}")
        pprint.pprint(f"node list : {node}")

        for v in sim :
            print(v)
            display(sim[v])

        ## graph display

        ## simulate condition

        if len(sim["M_"]) ==0 : sys.exit()

        ### simulate!!

        ## pandas -> numpy
        for v in sim:
            sim[v] = sim[v].to_numpy()

        def relu(x):
            return np.maximum(0, x)

        def Energy(x, p):
            global a, V, m

            energy = np.dot(x.T, np.log(x)) + np.dot(a.T, x) + 0.5 * np.dot(x.T, np.dot(V, x)) + 0.5 * (
                np.dot((1 / m.T), (p * p * x)))

            return energy[0]

        def model(xp, t, sim):

            M_ = sim["M_"]
            a = sim["a"]
            k = sim["k"]
            v = sim["v"]
            c = sim["c"]
            x_h = sim["x_h"]
            h = sim["h"]

            q = sim["q"]
            V = sim["V"]
            m = sim["m"]


            xp_2d = xp.reshape(2, -1)
            x_m = np.array([xp_2d[0]]).T
            p_m = np.array([xp_2d[1]]).T

            ###
            grad_x = (np.log(x_m) + 1).T + a.T + np.dot(x_m.T, V) + (0.5 * (1 / m) * p_m * p_m).T
            grad_p = ((1 / m) * p_m * x_m).T

            chemical_flow_x = -np.dot(M_, (k.T * (np.exp(np.dot(grad_x, M_)) - 1) * (
                np.exp(-0.5 * np.dot(grad_x, M_) + 0.5 * np.dot(np.log(x_m.T), np.abs(M_))))).T)
            hamiltonian_flow_x = np.dot(M_, v * (np.dot(grad_p, M_).T))
            hamiltonian_flow_p = -np.dot(M_, v * (np.dot(grad_x, M_).T))
            colision_flow_p = -c * (grad_p).T
            external_homeostasis_flow_x = h * (x_h - x_m)

            ###
            flow_x, flow_p = chemical_flow_x + hamiltonian_flow_x, hamiltonian_flow_p + colision_flow_p
            ##flow_x, flow_p =hamiltonian_flow_x,  hamiltonian_flow_p + colision_flow_p
            ##flow_x, flow_p =hamiltonian_flow_x,  hamiltonian_flow_p
            dxpdt = np.array([flow_x, flow_p]).reshape(-1)
            return dxpdt

        #initial
        x, p = sim["x_0"], sim["p_0"]
        sim["q"] = np.dot(np.diag(np.dot(sim["M"], sim["q_c"]).T[0]),sim["S"])
        sim["V"] = np.dot(sim["q"], np.dot(1 / (sim["D"] + 1) - 1, sim["q"].T))
        sim["m"] = np.dot(sim["M"], sim["m_c"])

        xp0 = np.array([x, p]).reshape(-1)
        t = np.linspace(0, 10)
        xp = odeint(model, xp0, t, args=(sim,))

        def get_cmap(n, name='hsv'):
            return plt.cm.get_cmap(name, n)

        cmap = get_cmap(len(node))

        for i,node_name in enumerate(node) :
            plt.plot(t, xp[:, i], cmap(i), label=node_name)
        plt.xlabel('time')
        plt.legend(loc='best')
        plt.show()

        print(xp[0, :5])
        print(xp[-1, :5])

        sys.exit()




        step_num = 0
        while True:
            step_num += 1
            if self.max_env_steps is not None and step_num == self.max_env_steps:
                break
            if debug:
                actions = self.activate_net(
                    net["f_r"], states, debug=True, step_num=step_num)
            else:
                actions = self.activate_net(net["f_r"], states)
            assert len(actions) == len(self.envs)


            for i, (env, action, done) in enumerate(zip(self.envs, actions, dones)):
                if not done:
                    state, reward, done, _ = env.step(action)
                    fitnesses[i] += reward
                    if not done:
                        states[i] = state
                    dones[i] = done
            if all(dones):
                break

        return sum(fitnesses) / len(fitnesses)
