
import json
from pandas import Series, DataFrame


neuron_model_info_expression = {

    "material_info" : [
        #ion, protein
        "na",
        "k",
        "cl",
        "minus_protein"
        
        #channel
        "ch_na",
        "ch_k",
        "ch_leak_k",
        "ch_na_k"
        
        #channel activator
        "ch_na_activator",  #m
        "ch_na_inactivator",  #h
        "ch_na_inactivator_activator",  #j
        "ch_k_activator",   #n
        
        #energe
        "atp" ,
    ],    

    "node_info" : [
        #ion, protein
        ["na_in" ,  [["na",1]], 1, 0 ,  10],
        ["na_out",  [["na",1]], 1, 0 ,  140],
        ["k_in",  [["k",1]], 1, 0 , 150],
        ["k_out",  [["k",1]], 1, 0 , 5],
        ["cl_in",  [["cl",1]], -1, 0 , 15],
        ["cl_out",  [["cl",1]], -1, 0 , 100],
        ["minus_protein_in",  [["minus_protein",1]], 1, 0 , 100],
        
        # Voltage Gated Na+ Channel
        ["ch_na_inactivate",  [["ch_na",1]], -1, 0 ,  1],
        ["ch_na_activate",  [["ch_na",1], ["ch_na_activator",3], ["ch_na_inactivator",1]], 0, 0 , 0],
        ["ch_na_activator_activate",  [["ch_na_activator",1]], 0, 0, 0 ],   # m_a
        ["ch_na_activator_inactivate",  [["ch_na_activator",1]], 0, 0, 1 ],  # m_b
        ["ch_na_inactivator_activate",  [["ch_na_inactivator",1]], 0, 0, 0 ],  # h_a
        ["ch_na_inactivator_inactivate",  [["ch_na_inactivator",1], ["ch_na_inactivator_activator",1]], 0, 0, 1 ],  # h_b
        ["ch_na_inactivator_activator_activate",  [["ch_na_inactivator_activator",1]], 0, 0, 0 ],  # j_a
        ["ch_na_inactivator_activator_inactivate",  [["ch_na_inactivator_activator",1]], 0, 0, 0 ],  # j_b
        
        # Voltage Gated K+ Channel 
        ["ch_k_inactivate",  [["ch_k",1]], 0, 0 , 1],
        ["ch_k_activate",  [["ch_k",1], ["ch_k_activator",4]], 0, 0, 0 ],
        ["ch_k_activator_activate",  [["ch_k_activator",1]], 0, 0, 0 ],  # n_a
        ["ch_k_activator_inactivate",  [["ch_k_activator",1]], 0, 0, 1 ],  # n_b
        
        # K+ Leak Channel 
        ["ch_leak_k_activate",  [["ch_leak_k",1]], 0, 0, 1 ],
        
        # Na+/K+ pump
        ["ch_na_k_activate",[["ch_na_k",1]], 0, 0, 1 ],
         
         # energe
         ["atp", [["atp",1]], 0, 0 ,0.5],
         ["adp", [["atp",1]], 0, 0 ,0.5],
    ],

    # edge label 규칙
    # 1A+3B->2C+4D 
    #  K = e^-p*k[A][B]^3
    # [ [["A",1],["B",3]],  [["C",2],["D",4]], energe_add, k, p]
    # [ [k2,k1], k3, k, k4]

    "edge_info" : [
        ## Voltage Gated Na+ Channel
        # m_a <-> m_b 
        [ [["ch_na_activator_activate",1]], [["ch_na_activator_inactivate",1]], 1/18, 4, 0],
        [ [["ch_na_activator_inactivate",1]], [["ch_na_activator_activate",1]], -1/20,  0.22, 0],
        
        # j_a <-> j_b
        [ [["ch_na_inactivator_inactivate",1]], [["ch_na_inactivator_activate",1]], 1/10, 20, 0,],
        [ [["ch_na_inactivator_inactivate",1]], [["ch_na_inactivator_activate",1]], 0, 1, 0],

        # h_a <-> h_b 
        [ [["ch_na_inactivator_activate",1], ["ch_na_inactivator_inactivate",1]], [["ch_na_inactivator_inactivate",1]], 0, 1,0],
        [ [["ch_na_inactivator_inactivate",1]], [["ch_na_inactivator_activate",1], ["ch_na_inactivator_inactivate",1]], 1/20, 7/100,0],
        
        # ch_na_inactivate <-> ch_na_activate_rest
        [ [["ch_na_inactivate",1],["ch_na_activator_activate",3],["ch_na_inactivator_activate",1]], [["ch_k_activate_rest",1]] , 0, 1,0],
        [ [["ch_k_activate_rest",1]], [["ch_na_inactivate",1],["ch_na_activator_activate",3],["ch_na_inactivator_activate",1]] , 0, 1,0],
        
        # na_in <- na_out by Voltage Gated Na+ Channel
        #by ohm's law
        # j = (row) * v 
        # v = -(mu) * E
        [ [["ch_na_activate",1], ["na_in",1]], [["ch_na_activate",1], ["na_out",1]] , 0, 1,1],

        #by diffusion
        [ [["ch_na_activate",1], ["na_in",1]], [["ch_na_activate",1], ["na_out",1]] , 0, 1,0],
        [ [["ch_na_activate",1], ["na_out",1]], [["ch_na_activate",1], ["na_in",1]] , 0, 1,0],
        
        ## Voltage Gated K+ Channel 
        # n_a <-> n_b 
        [ [["ch_k_activator_activate",1]], [["ch_k_activator_inactivate",1]], 1/80, 1/8,0],
        [ [["ch_k_activator_inactivate",1]], [["ch_k_activator_activate",1]], -1/30, 0.058,0],
        
        # ch_k_inactivate <-> ch_k_activate_rest
        [ [["ch_k_inactivate",1],["ch_k_activator_activate",4]], [["ch_k_activate_rest",1]] , 0, 1,0],
        [ [["ch_k_activate_rest",1]], [["ch_k_inactivate",1],["ch_k_activator_activate",4]] , 0, 1,0],
        
        # k_in -> k_out by Voltage Gated K+ Channel 
        #by ohm's law
        [ [["ch_k_activate",1], ["k_in",1]], [["ch_k_activate",1], ["k_out",1]] , 0, 1, 1],

        #by diffusion
        [ [["ch_k_activate",1], ["k_in",1]], [["ch_k_activate",1], ["k_out",1]] , 0, 1, 0],
        [ [["ch_k_activate",1], ["k_out",1]], [["ch_k_activate",1], ["k_in",1]] , 0, 1, 0],


        ## K+ Leak Channel 
        # k_in <-> k_out by K+ Leak Channel 
        #by diffusion
        [ [["ch_leak_k_activate",1], ["k_in",1]], [["ch_leak_k_activate",1], ["k_out",1]] , 0, 1, 0],
        [ [["ch_leak_k_activate",1], ["k_out",1]], [["ch_leak_k_activate",1], ["k_in",1]] , 0, 1, 0],
        
        ## Na+/K+ pump
        # k_in <- k_out , na_in -> na_out by Na+/K+ pump - using energe
        [ [["ch_na_k_activate",1], ["na_in",3], ["k_out",2], ["atp",1]], [["ch_na_k_activate",1],["na_out",3],["k_in",2] ["adp",1]], 0, 1, 0 ],
        
        # energe by mitocondria
        [[["adp",1]],[["atp",1]]],
        
    ],

    "snode_info" : [
        ["cell_in",\
         ["na_in", "k_in", "cl_in" ,"minus_protein_in", "ch_na_activator_activate" "ch_na_activator_inactivate","ch_na_inactivator_activate",\
         "ch_na_inactivator_inactivate", "ch_k_activator_activate", "ch_k_activator_inactivate"], [0,0]],
        ["cell_out",\
         ["na_out","k_out","cl_out"], [0,1]],
        ["cell_membrane",\
         ["ch_na_inactivate", "ch_na_activate_run", "ch_na_activate_rest", "ch_na_activator_activate", "ch_k_inactivate", "ch_k_activate_run",\
          "ch_k_activate_rest", "ch_leak_k_activate_run", "ch_leak_k_activate_rest", "ch_na_k_activate_run", "ch_na_k_activate_rest"], [0,2]]
    ],



}
neuron_model_info = dict()
neuron_model_info["node_info"] = list()
for node_info in neuron_model_info_expression["node_info"] :
    node_dict = dict()
    node_dict["label"] = node_info[0]
    node_dict["material"] = node_info[1]
    node_dict["coulomb"] = node_info[2]
    node_dict["entalphy"] = node_info[3]
    node_dict["density"] = node_info[4]
    neuron_model_info["node_info"].append(node_dict)

neuron_model_info["edge_info"] = list()
for edge_info in neuron_model_info_expression["edge_info"] :
    edge_dict = dict()
    edge_dict["label"] = 
    edge_dict["reactant"] = edge_info[0]
    edge_dict["product"] = edge_info[1]
    neuron_model_info["edge_info"].append(edge_dict)

neuron_model_info["snode_info"] = list()
for snode_info in neuron_model_info_expression["snode_info"] :
    snode_dict = dict()
    snode_dict["label"] = snode_info[0]
    snode_dict["reactant"] = snode_info[1]
    snode_dict["product"] = snode_info[2]
    neuron_model_info["snode_info"].append(snode_dict)

with open("HX_model.json", 'w', encoding = 'utf-8') as HX_model_file :
    json.dump(neuron_model_info, HX_model_file, indent="\t")