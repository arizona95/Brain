import time
from Simulator import Simulator
from threading import Lock, Thread

class SimulatorManager():

    def __init__(self):
        self.neuron_network_filename = ""
        self.simulator_thread = None
        self.remain_simulator_time = 0
        self.simulator = None

    def Work(self):
        print('Work Start')
        #setting

        age=0
        while True:

            #break
            if self.remain_simulator_time<=0 :
                continue

            #simualting
            time.sleep(0.1)

            self.simulator.one_step()

            print('age: '+str(self.simulator.graph.age))
            self.remain_simulator_time = self.remain_simulator_time-1

    def run(self, neuron_network_filename):
        self.neuron_network_filename = neuron_network_filename

        try :
            self.simulatorThread.kill()

        except : print('there is no thread')

        self.simulator = Simulator(self.neuron_network_filename)
        self.simulator.graph.make_graph_board(0)
        self.simulator.boarn()
        self.simulatorThread = Thread(target=self.Work)
        self.simulatorThread.start()

        return

    def manipulate_simulator_running(self, remain_simulator_time) :
        self.remain_simulator_time = remain_simulator_time

    def debug_set(self, debug_config):
        try :
            self.simulator.graph.debug_set(debug_config)
        except :
            print("there is no simualtor")
