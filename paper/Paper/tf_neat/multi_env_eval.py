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

    def eval_genome(self, genome, config, debug=False):

        fitnesses = np.zeros(self.batch_size)
        states = [env.reset() for env in self.envs]
        dones = [False] * self.batch_size
        net = self.make_net(genome, config, self.batch_size)


        ## make G set
        L=1
        react_rules = []
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
                    react_or_not = 2*self.max_state*net.activate([np.array(gi+gj+[0]*(2*self.c_v + 4*self.s_v))])[0][0]- self.max_state
                    if react_or_not >=0 :
                        new_g = list(np.array(gi[:-1])+np.array(gj[:-1]))+[int(react_or_not)]
                        add_G.append(new_g)
                        react_rules.append([gi,gj, new_g])
            G=G+add_G

        ##make A matrix

        A = dict()
        for i, gi in enumerate(G):
            element_name = ''.join(str(e) for e in gi)
            A[''.join(str(e) for e in gi)] = 5*float(net.activate([np.array([0]*(2*self.c_v) + gi + [0]*(1*self.c_v + 4*self.s_v))])[0][1])


        #make S set

        S = []
        for si in list(map(lambda x: list(x), list(itertools.product([0, 1], repeat=self.s_v)))) :
            space_or_not = 2*net.activate([np.array( [0]*(4*self.c_v+ 3*self.s_v) +si)])[0][6]-1
            if space_or_not>=0 :
                S.append(si)


        #make D matrix
        D = [[0 for x in range(len(S))] for y in range(len(S))]
        print(f"D mat: {D}")

        for i, si in enumerate(S) :
            for j, sj in enumerate(S) :
                if i!=j:
                    distance = float(net.activate([np.array( [0]*(3*self.c_v) +si+sj+ [0]*(1*self.c_v+ 2*self.s_v) )])[0][2])
                    D[i][j] = distance
                    D[j][i] = distance


        #make M matrix
        node = {}  # name:[x0, c, s, a, xh, h]

        for i, gi in enumerate(G) :
            for j, sj in enumerate(S) :

                active_result = net.activate([np.array( [0]*(3*self.c_v+ 2*self.s_v) +gi+sj +[0]*(1*self.s_v) )])[0]
                x0 = 20*active_result[3]-10
                xh = 20*active_result[4]-10
                h = active_result[5]
                if xh <=0 : h =0

                if x0 >0 :
                    node_name = ''.join(str(e) for e in gi)+'-'+''.join(str(e) for e in si)
                    node[node_name] = [
                        x0, #x0
                        gi[:-1],  # c
                        si,  # s
                        A[''.join(str(e) for e in gi)],  # a
                        max(xh,0),  # xh
                        h,  # h
                    ]

        ##pd.DataFrame.from_dict(data)

        #make edge

        #chemical flow

        for i, si in enumerate(S) :
            space_node_dict = dict()
            for node_name in node :
                if node[node_name][2] == si :
                    space_node_dict[node_name] = node[node_name][1]


        # make simulator entity
        dict_x_0 = dict()
        dict_M = dict()
        for node_name in node :
            dict_x_0[node_name] = node[node_name][0]
            dict_M[node_name] = node[node_name][1]




        print(f"react_rules : {react_rules}")
        print(f"G set : {G}")
        print(f"A set : {A}")
        print(f"S set: {S}")
        print(f"D mat: {D}")
        pprint.pprint(f"node list : {node}")
        pprint.pprint(f"dict_x_0 : {dict_x_0}")

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
