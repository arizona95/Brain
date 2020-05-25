// @flow
import '!style-loader!css-loader!rc-slider/assets/index.css';

import {
  Button,
  ButtonGroup,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
  Toggle,
  UncontrolledButtonDropdown,
} from 'components';
import d3 from 'd3';
import _ from 'lodash';
import React from 'react';

import Graph from 'react-graph-vis';
import MathJax from 'react-mathjax2';

import styles from './commonStyle.scss';

window.d3 = d3;


class NeuronNetworkMaker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: {
        layout: {
          // hierarchical: true,
        },
        edges: {
          color: '#000000',
        },
        nodes: {
          color: '#888f99',
        },
        physics: {
          enabled: false,
        },
        interaction: { multiselect: true, dragView: true, selectConnectedEdges: false },
        manipulation: {
          enabled: true, initiallyActive: true,
          addNode: this.addNodeCallBackFunc,
          deleteNode: this.deleteNodeCallBackFunc,
          addEdge: this.addEdgeCallBackFunc,
          deleteEdge: this.deleteEdgeCallBackFunc,
          editEdge: this.editEdgeCallBackFunc,
        },
      },
      events: {
        selectNode: this.selectNodeCallBackFunc,
        deselectNode: this.deSelectNodeCallBackFunc,
        selectEdge: this.selectEdgeCallBackFunc,
        deselectEdge: this.deSelectEdgeCallBackFunc,
        dragEnd: this.dragEndNodeCallBackFunc,
      },
      selectInitialGraph: 0,
      selectingNode: false,
      selectingEdge: false,
      selectNodeId: -1,
      selectEdgeId: -1,
      reRenderNeed: false,
      destroyNeed: false,
      traceNetwork: { nodes: [], edges: [] },
    };

    this.setNetworkInstance = this.setNetworkInstance.bind(this);
  }

  componentDidMount() {
    this.props.groupFetch();
    this.props.networkFetch();
  }

  setNetworkInstance = (nw) => {
    this.setState({
      network: nw,
    });
  };

  componentWillReceiveProps(nextProps) {

    if (this.props.nowNeuronNetworkId != nextProps.nowNeuronNetworkId) {
      this.setState({
        ...this.state,
        traceNetwork: nextProps.nowNeuronNetworkGraph,
        selectInitialGraph: 0,
        selectingNode: false,
        selectingEdge: false,
        selectNodeId: -1,
        selectEdgeId: -1,
        reRenderNeed: false,
      });
    }

  }

  addNodeCallBackFunc = (nodeData, callback) => {
    console.log('addNode!');

    var nodeName = prompt('Node Name :');
    nodeData.label = nodeName;

    console.log(nodeData);

    var newNodes = this.state.traceNetwork.nodes;

    var newNodeData = {
      ...nodeData,
      description: 'new Node ',
      Type: 'Layer',
      Option:'no-Connection',
      shape: 'image',
      image: 'http://localhost:3030/static/neuronGroup/InnerGroup.png',
      visual: 'Inner',
      group: '',
      groupNum: 1,
    };

    newNodes.push(newNodeData);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        nodes: newNodes,
      },
    });

    callback(newNodeData);
  };

  deleteNodeCallBackFunc = (graphData, callback) => {
    console.log('deleteNode!');

    console.log(graphData);

    var newNodes = this.state.traceNetwork.nodes.filter(node => node.id != graphData.nodes[0]);
    console.log(newNodes);

    var newEdges = this.state.traceNetwork.edges;
    newEdges = newEdges.filter(edge => edge.from != graphData.nodes[0] && edge.to != graphData.nodes[0]);


    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: newNodes,
        edges: newEdges,
      },
      selectingNode: false,
      selectNodeId: -1,
    });

    callback(graphData);
  };

  addEdgeCallBackFunc = (edgeData, callback) => {
    console.log('addEdge!');

    console.log(edgeData);

    // if edge exist, continue
    if( this.state.traceNetwork.edges.filter(edge => edge.from == edgeData.from && edge.to == edgeData.to ).length !=0 ) return

    var date = new Date();
    var components = [
      date.getYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ];

    var id = components.join('');

    edgeData = { ...edgeData, id: id };

    var newEdges = this.state.traceNetwork.edges;


    const fromStr = this.state.traceNetwork.nodes.filter(node => node.id == edgeData.from)[0].label;
    const toStr = this.state.traceNetwork.nodes.filter(node => node.id == edgeData.to)[0].label;


    var newEdgeData = {
      ...edgeData,
      description: 'new Edge : ' + fromStr + ' -> ' + toStr,
      connection:'full-connection',
      percent:50,
    };

    if( this.state.traceNetwork.edges.filter(edge => edge.from == edgeData.to && edge.to == edgeData.from ).length !=0 )
    {
      newEdgeData = {
        ...newEdgeData,
        smooth:{
          'enabled':true,
          'type':'curvedCW',
          'roundness':0.1,
        }
      }

      var mappingEdge = this.state.traceNetwork.edges.filter(edge => edge.from == edgeData.to && edge.to == edgeData.from )[0]
      newEdges = newEdges.filter(edge => edge.from != edgeData.to || edge.to != edgeData.from )

      mappingEdge = {
        ...mappingEdge,
        smooth:{
          'enabled':true,
          'type':'curvedCW',
          'roundness':0.1,
        }
      }
      newEdges.push(mappingEdge)
    }

    newEdges.push(newEdgeData);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        edges: newEdges,
      },
    });

    callback(newEdgeData);
  };



  deleteEdgeCallBackFunc = (edgeData, callback) => {
    console.log('deleteEdge!');

    console.log(edgeData);

    var newEdges = this.state.traceNetwork.edges.filter(edge => edge.id != edgeData.edges[0]);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        edges: newEdges,
      },
      selectingEdge: false,
      selectEdgeId: -1,
    });

    callback(edgeData);
  };

  editEdgeCallBackFunc = (edgeData, callback) => {
    console.log('editEdge!');

    console.log(edgeData);

    var newEdges = this.state.traceNetwork.edges.filter(edge => edge.id != edgeData.id);

    var editedEdge = this.state.traceNetwork.edges.filter(edge => edge.id == edgeData.id)[0];

    var newEdgeData = {
      ...editedEdge,
      ...edgeData,
      description: 'edit Edge',
    };
    newEdges.push(newEdgeData);

    this.setState({
      ...this.state,
      traceNetwork: {
        ...this.state.traceNetwork,
        edges: newEdges,
      },
    });

    callback(edgeData);
  };

  dragEndNodeCallBackFunc = (dragData) => {
    console.log('drag End!!!@@@');
    console.log(dragData);
    if (dragData.nodes.length != 0) {
      var traceNetworkNode = this.state.traceNetwork.nodes.filter(node => node.id != dragData.nodes[0]);

      var newtraceNetworkNode = {
        ...this.state.traceNetwork.nodes.filter(node => node.id == dragData.nodes[0])[0],
        x: dragData.pointer.canvas.x,
        y: dragData.pointer.canvas.y,
      };

      traceNetworkNode.push(newtraceNetworkNode);

      this.setState({
        ...this.state,
        traceNetwork: {
          nodes: traceNetworkNode,
          edges: this.state.traceNetwork.edges,
        },
      });
    }
  };

  selectNodeCallBackFunc = (nodeData) => {
    console.log('selectNode!');
    console.log(nodeData);

    this.setState({
      ...this.state,
      selectingNode: true,
      selectNodeId: nodeData.nodes[0],
    });
  };

  deSelectNodeCallBackFunc = () => {
    console.log('deSelectNode!');
    this.setState({
      ...this.state,
      selectingNode: false,
    });
  };

  selectEdgeCallBackFunc = (edgeData) => {
    console.log('selectEdge!');
    console.log(edgeData);

    console.log(this.state.traceNetwork.edges.filter(edge => edge.id == edgeData.edges[0]));

    this.setState({
      ...this.state,
      selectingEdge: true,
      reRenderNeed: true,
      selectEdgeId: edgeData.edges[0],

    });
  };

  deSelectEdgeCallBackFunc = () => {
    console.log('deSelectEdge!');
    this.setState({
      ...this.state,
      selectingEdge: false,
    });
  };

  onClickEdgeParameterChange = (key, value) => {
    var traceNetworkEdge = this.state.traceNetwork.edges.filter(edge => edge.id != this.state.selectEdgeId);
    var selectNetworkEdge = this.state.traceNetwork.edges.filter(edge => edge.id == this.state.selectEdgeId)[0]


    var newtraceNetworkEdge = {
      ...selectNetworkEdge,
      [key]: value,
    };

    traceNetworkEdge.push(newtraceNetworkEdge);

    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: this.state.traceNetwork.nodes,
        edges: traceNetworkEdge,
      },
    });

  };

  onChangeNodeParameterChange = (key, value) => {
    var traceNetworkNode = this.state.traceNetwork.nodes.filter(node => node.id != this.state.selectNodeId);
    var selectedNode = this.state.traceNetwork.nodes.filter(node => node.id == this.state.selectNodeId)[0];
    var DIR = 'http://localhost:3030/static/neuronGroup/';

    var newtraceNetworkNode = {
      ...selectedNode,
      [key]: value,
    };

    if(newtraceNetworkNode.Type == 'Box'){
      newtraceNetworkNode = {...newtraceNetworkNode, 'image': DIR + 'BoxGroup.png'}
    }
    else if(newtraceNetworkNode.groupNum != 1) {
      newtraceNetworkNode = {...newtraceNetworkNode, 'image': DIR + newtraceNetworkNode.visual+'Layer.png'}
    }
    else{
      newtraceNetworkNode = {...newtraceNetworkNode, 'image': DIR + newtraceNetworkNode.visual+'Group.png'}
    }

    traceNetworkNode.push(newtraceNetworkNode);

    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: traceNetworkNode,
        edges: this.state.traceNetwork.edges,
      },
    });
  };

  onChangeEdgeParameterChange = (key, value) => {
    var traceNetworkEdge = this.state.traceNetwork.edges.filter(edge => edge.id != this.state.selectEdgeId);

    var newtraceNetworkEdge = {
      ...this.state.traceNetwork.edges.filter(edge => edge.id == this.state.selectEdgeId)[0],
      [key]: value,
    };

    traceNetworkEdge.push(newtraceNetworkEdge);

    this.setState({
      ...this.state,
      traceNetwork: {
        nodes: this.state.traceNetwork.nodes,
        edges: traceNetworkEdge,
      },
    });

  };


  render() {

    console.log('neuron_network_state');
    console.log(this.state);
    console.log('neuron_network_props');
    console.log(this.props);


    var DIR = 'http://localhost:3030/static/neuronGroup/';

    if (this.state.destroyNeed == true) {
      this.state.network.setData({ nodes: [], edges: [] });
      this.setState({
        ...this.state,
        destroyNeed: false,
      });
    }

    var graph = { nodes: [], edges: [] };
    if (this.props.neuronNetworkList[this.props.nowNeuronNetworkId] != undefined) {
      graph = this.props.nowNeuronNetworkGraph;
    }

    console.log(this.props.nowNeuronNetworklId)

    var selectedEdge = {};

    if (this.state.selectEdgeId == -1) {
      selectedEdge = {
        description: 'none',
      };
    } else {
      selectedEdge = this.state.traceNetwork.edges.filter(edge => edge.id == this.state.selectEdgeId)[0];
    }

    var selectedNode = {};

    if (this.state.selectNodeId == -1) {
      selectedNode = {
        description: 'none',
      };
    } else {
      selectedNode = this.state.traceNetwork.nodes.filter(node => node.id == this.state.selectNodeId)[0];
    }

    console.log(selectedNode);
    console.log(selectedEdge);





    return (
      <div>
        <Row style={{ 'margin': '0px' }}>
          <Col xs={2} sm={2} md={2} style={{ 'padding': '0px' }}>
            <ButtonGroup>
              <Button
                style={{ 'width': '5vw', 'backgroundColor': '#f27f87' }}
                className="text-white"
                outline
                onClick={() => {
                  var networkName = prompt('Network Name :');
                  this.props.networkAdd({ networkName: networkName }).then(() => this.props.networkFetch());
                }}
              >
              <span className="ml-1 text-inverse"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('color', '#ffffff', 'important');
                      }
                    }}>
                  <i className="fa fa-plus"/></span>
              </Button>
              <Button
                style={{ 'width': '5vw', 'backgroundColor': '#37B940' }}
                className="text-white"
                outline
                onClick={() => {
                  var networkName = prompt('Network Name :');
                  this.props.networkSaveAs({
                    networkName: networkName,
                    nodes: this.state.traceNetwork.nodes,
                    edges: this.state.traceNetwork.edges,
                  }).then(() => this.props.networkFetch());
                }}
              >
              <span className="ml-1 text-inverse"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('color', '#ffffff', 'important');
                      }
                    }}>
                  <i className="fa fa-paste (alias)"/></span>
              </Button>
              <Button
                style={{ 'width': '5vw', 'backgroundColor': '#30BDB4' }}
                className="text-white"
                outline
                onClick={() => {
                  console.log(this.state.network);
                  this.props.networkExport({
                    networkInfo: this.props.neuronNetworkList[this.props.nowNeuronNetworkId],
                    nodes: this.state.traceNetwork.nodes,
                    edges: this.state.traceNetwork.edges,
                  });
                }}
              >
              <span className="ml-1 text-inverse"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('color', '#ffffff', 'important');
                      }
                    }}>
                  <i className="fa fa-save (alias)"/></span>
              </Button>
            </ButtonGroup>

            <ListGroup style={{ width: '15vw' }}>
              {
                _.map(this.props.neuronNetworkList, (networkInfo, index) => (
                  <Row>
                    <UncontrolledButtonDropdown style={{ width: '2.5vw' }}>
                      <DropdownToggle color="secondary" outline caret>
                        <i className="fa fa-gear"/>
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem
                          data-id={index}
                          onClick={() => this.props.networkDelete(networkInfo).then(
                            () => this.props.networkFetch(),
                          )}
                        >
                          <span className="text-danger">
                            <i className="fa fa-fw fa-remove mr-2"/>
                            모델 삭제
                          </span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                    {
                      networkInfo.id == this.props.nowNeuronNetworkId ? (
                        <ListGroupItem
                          key={index}
                          style={{ 'backgroundColor': '#ffb6c1', margin: '2px', width: '13vw' }}
                          tag="button"
                          onClick={() => {
                            this.props.networkImport(networkInfo).then(() => this.props.setNowNeuronNetworkId(networkInfo.id));
                          }}
                          action href="#">
                    <span className="ml-1 text-inverse"
                          ref={(el) => {
                            if (el) {
                              el.style.setProperty('color', '#000000', 'important');
                            }
                          }}>
                      {networkInfo.name}</span>
                        </ListGroupItem>) : (
                        <ListGroupItem
                          key={index}
                          style={{ 'backgroundColor': '#66484d', margin: '2px', width: '13vw' }}
                          tag="button"
                          onClick={() => {
                            this.props.networkImport(networkInfo).then(() => this.props.setNowNeuronNetworkId(networkInfo.id));
                          }}
                          action href="#">
                    <span className="ml-1 text-inverse"
                          ref={(el) => {
                            if (el) {
                              el.style.setProperty('color', '#000000', 'important');
                            }
                          }}>
                      {networkInfo.name}</span>
                        </ListGroupItem>
                      )
                    }
                  </Row>
                ))
              }
            </ListGroup>
          </Col>
          <Col xs={6} sm={6} md={6}>
            <div className={styles.cardBody} id="graph" style={{ height: '82vh', width: '47vw' }}>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/vis/4.19.1/vis-network.min.css"/>
              <Graph
                getNetwork={this.setNetworkInstance}
                graph={graph}
                options={this.state.options}
                events={this.state.events}
              />
            </div>
            <Row>
              <div style={{ height: '1vh' }}>
              </div>
            </Row>
            {
              this.state.selectingEdge == true ? (
                  <div>
                    <h5 style={{ width: '10vw' }}><i className="fa fa-book"/> Description </h5>
                    <Input
                      style={{ width: '47vw' }}
                      placeholder=""
                      value={selectedEdge.description}
                      onChange={(e) => this.onClickEdgeParameterChange('description',e.target.value)}
                    >
                    </Input>
                  </div>)
                : this.state.selectingNode == true ? (
                  <div>
                    <h5 style={{ width: '10vw' }}><i className="fa fa-book"/> Description </h5>
                    <Input
                      style={{ width: '47vw' }}
                      placeholder=""
                      value={selectedNode.description}
                      onChange={(e) => this.onChangeNodeParameterChange('description',e.target.value)}
                    >
                    </Input>
                  </div>)
                : (<div></div>)
            }
          </Col>
          {
            this.state.selectingNode == true ? (
              <Col xs={2} sm={2} md={2}>
                  <Table>
                    <tr>
                    <td><h5>{'Name'}</h5></td>
                    <td colSpan="2">
                      <Input
                        style={{ width: '10vw' }}
                        placeholder=""
                        value={selectedNode.label}
                        onChange={(e) => this.onChangeNodeParameterChange('label', e.target.value)}
                      >
                      </Input>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Neuron'}</h5><h5>{'Group'}</h5></td>
                    <td colSpan={5}>
                      <h5 style={{ width: '10vw' }}>
                        <span className="ml-1 tex-inverse"
                              ref={(el) => {
                                if (el) {
                                  el.style.setProperty('color', '#11b8aa', 'important')
                                }
                              }}>
                    {selectedNode.group}
                  </span>

                      </h5>
                    </td>
                  </tr>
                  <tr>
                    <td><h5>{'Type'}</h5></td>
                    <td>
                      <Toggle
                        checked={selectedNode.Type == 'Layer'}
                        onChange={() => this.onChangeNodeParameterChange('Type', 'Layer')}
                      /><h6>{'Layer'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedNode.Type == 'Box'}
                        onChange={() => this.onChangeNodeParameterChange('Type', 'Box')}
                      /><h6>{'Box'}</h6>
                    </td>
                  </tr>
                    {selectedNode.Type == "Layer" ? (
                      <tr>
                        <td><h5>{'Option'}</h5></td>
                        <td>
                          <Toggle
                            checked={selectedNode.Option == 'no-Connection'}
                            onChange={() => this.onChangeNodeParameterChange('Option', 'no-Connection')}
                          /><h6>{'no-Connection'}</h6>
                        </td>
                        <td>
                          <Toggle
                            checked={selectedNode.Option == 'one-to-one-Connection'}
                            onChange={() => this.onChangeNodeParameterChange('Option', 'one-to-one-Connection')}
                          /><h6>{'one-to-one-Connection'}</h6>
                        </td>
                      </tr>) : (<div></div>)
                    }
                    {selectedNode.Type == "Layer" ? (
                      <tr>
                        <td></td>
                        <td>
                          <Toggle
                            checked={selectedNode.Option == 'full-Connection'}
                            onChange={() => this.onChangeNodeParameterChange('Option', 'full-Connection')}
                          /><h6>{'full-Connection'}</h6>
                        </td>
                      </tr>) : (<div></div>)
                    }
                    { selectedNode.Type =="Layer"?(
                      <tr>
                        <td><h5>{'Visual'}</h5></td>
                        <td>
                          <Toggle
                            checked={selectedNode.visual == 'Input'}
                            onChange={() => this.onChangeNodeParameterChange('visual', 'Input')}
                          /><h6>{'Input'}</h6>
                        </td>
                        <td>
                          <Toggle
                            checked={selectedNode.visual == 'Inner'}
                            onChange={() => this.onChangeNodeParameterChange('visual', 'Inner')}
                          /><h6>{'Inner'}</h6>
                        </td>
                      </tr>):(<div></div>)
                    }
                    { selectedNode.Type =="Layer"?(
                      <tr>
                        <td></td>
                        <td>
                          <Toggle
                            checked={selectedNode.visual == 'Output'}
                            onChange={() => this.onChangeNodeParameterChange('visual', 'Output')}
                          /><h6>{'Output'}</h6>
                        </td>
                      </tr>):(<div></div>)
                    }
                  <tr>
                    <td><h5>{'Group'}</h5><h5>{'Number'}</h5></td>
                    <td colSpan="5">
                      <Input
                        style={{ width: '5vw' }}
                        placeholder=""
                        value={selectedNode.groupNum}
                        onChange={(e) => this.onChangeNodeParameterChange('groupNum', e.target.value)}
                      >
                      </Input>
                    </td>
                  </tr>
                  </Table>
                </Col>
              ) : (<div></div>)
          }
          {
            this.state.selectingNode == true ? (
                <Col xs={2} sm={2} md={2}>
                {
                  _.map(this.props.neuronGroupList, (groupInfo, index) => (
                    <Row>
                      {
                        groupInfo.id == this.props.nowNeuronGroupId ? (
                          <Row style={{"margin":"0px"}}>
                            <Button
                                style={{ 'width': '2vw', 'backgroundColor': '#37B940', 'padding':'0px' }}
                                className="text-white"
                                outline
                                onClick={() => {
                                  this.onChangeNodeParameterChange('group', groupInfo.name)
                                }}
                              ><i className="fa fa-angle-left"/>
                              </Button>
                          <ListGroupItem
                            key={index}
                            style={{ 'backgroundColor': '#a1ffc8', margin: '2px', width: '13vw', 'paddingLeft':'0px', 'marginLeft':'0px' }}
                            tag="button"
                            onClick={() => {
                              this.props.setNowNeuronGroupId(groupInfo.id);
                            }}
                            action href="#">
                          <span className="ml-1 text-inverse"
                              ref={(el) => {
                                if (el) {
                                  el.style.setProperty('color', '#000000', 'important');
                                }
                              }}>
                          {groupInfo.name}</span>
                          </ListGroupItem>
                          </Row>
                        ) : (
                          <ListGroupItem
                            key={index}
                            style={{ 'backgroundColor': '#285244', margin: '2px', width: '15vw' }}
                            tag="button"
                            onClick={() => {
                              this.props.setNowNeuronGroupId(groupInfo.id);
                            }}
                            action href="#">
                      <span className="ml-1 text-inverse"
                            ref={(el) => {
                              if (el) {
                                el.style.setProperty('color', '#000000', 'important');
                              }
                            }}>
                        {groupInfo.name}</span>
                          </ListGroupItem>
                        )
                      }
                    </Row>
                  ))
                }
              </Col>
            ) : this.state.selectingEdge == true ? (
              <div>
                <Col xs={4} sm={4} md={4}>
                  <Table>
                  <tr>
                    <td><h5>{'Connection'}</h5></td>
                    <td>
                      <Toggle
                        checked={selectedEdge.connection == 'one-to-one-connection'}
                        onChange={() => this.onClickEdgeParameterChange('connection', 'one-to-one-connection')}
                      /><h6>{'one-to-one-connection'}</h6>
                    </td>
                    <td>
                      <Toggle
                        checked={selectedEdge.connection == 'full-connection'}
                        onChange={() => this.onClickEdgeParameterChange('connection', 'full-connection')}
                      /><h6>{'full-connection'}</h6>
                    </td></tr><tr><td/>
                    <td>
                      <Toggle
                        checked={selectedEdge.connection == 'N-percent-connection'}
                        onChange={() => this.onClickEdgeParameterChange('connection', 'N-percent-connection')}
                      /><h6>{'N-percent-connection'}</h6>
                    </td>
                  </tr>
                    {
                      selectedEdge.connection == 'N-percent'?(
                      <tr>
                        <td><h5>{'Connection'}</h5><h5>{'Percent'}</h5></td>
                        <td colSpan="5">
                          <Input
                            style={{ width: '5vw' }}
                            placeholder=""
                            value={selectedEdge.percent}
                            onChange={(e) => this.onChangeEdgeParameterChange('percent', e.target.value)}
                          >
                          </Input>
                        </td>
                      </tr>):(<div/>)
                    }
                  </Table>
                </Col>


              </div>): (<div></div>)

          }
        </Row>
      </div>
    );
  }
}

export default NeuronNetworkMaker;
