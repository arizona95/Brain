testGraph = Graph()

testNodeB = [1,2,3,4,5,6,7,8]
testEdgeB = [(2,1), (3,1),(4,1),(1,5),(1,6),(1,7), (4,7)]

testNodeA = []
for node in testNodeB :
    testNodeA.append({'label':node})
    
testEdgeA = []
id = 0
for edge in testEdgeB :
    testEdgeA.append({'from':edge[0], 'to':edge[1], 'label':id})
    id = id+1

testGraphA = {"nodes":testNodeA, "edges":testEdgeA}

testGraph.initGraph(testGraphA)