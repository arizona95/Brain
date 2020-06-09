// @flow
import '!style-loader!css-loader!rc-slider/assets/index.css';
import Slider from 'rc-slider';

import {
  Col,
  Container,
  Input,
  Row,
  ButtonGroup,
  Button,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Toggle,
  Table,} from 'components';

import styles from './commonStyle.scss';
import _ from 'lodash';
import React from 'react';

import Graph from "react-graph-vis";
import MathJax from 'react-mathjax2';
import d3 from "d3";


class Simulator extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      forward:1,
      debug:true,
      debugShow:{},
    }
  }

  componentDidMount() {
    this.props.networkFetch();
  }

  componentWillReceiveProps(nextProps) {

    console.log("componentWillReceiveProps")
    this.setState({
      ...this.state,
      debugShow:nextProps.debugShow,
    })

  }

  onChangeForward = (forward)=> {
    this.setState({
      ...this.state,
      forward:forward,
    })
  }

  onChangeDebug = ()=>{
    this.setState({
      ...this.state,
      debug: this.state.debug==true? false:true,
    })
  }

  onChangeFold = (depth,label_list)=>{
    var changedDebugShow = this.state.debugShow

    if(depth ==0)
    {
      changedDebugShow = {
        ...changedDebugShow,
        [label_list[0]]:{
          ...changedDebugShow[label_list[0]],
          fold : changedDebugShow[label_list[0]].fold==0?1 :0,
        }
      }
    }
    else if(depth ==1)
    {
      var neuron_group_data = changedDebugShow[label_list[0]].data
      changedDebugShow = {
        ...changedDebugShow,
        [label_list[0]]:{
          ...changedDebugShow[label_list[0]],
          data: {
            ...neuron_group_data,
            [label_list[1]]: {
              ...neuron_group_data[label_list[1]],
              fold: neuron_group_data[label_list[1]].fold == 0 ? 1 : 0,
            }
          }
        }
      }
    }
    else if(depth ==2)
    {
      var neuron_group_data = changedDebugShow[label_list[0]].data
      var neuron_model_data = neuron_group_data[label_list[1]].data
      changedDebugShow = {
        ...changedDebugShow,
        [label_list[0]]:{
          ...changedDebugShow[label_list[0]],
          data: {
            ...neuron_group_data,
            [label_list[1]]: {
              ...neuron_group_data[label_list[1]],
              data:{
                ...neuron_model_data,
                [label_list[2]]:{
                  ...neuron_model_data[label_list[2]],
                  fold: neuron_model_data[label_list[2]].fold == 0 ? 1:0,
                }
              }
            }
          }
        }
      }
    }

    this.setState({
      ...this.state,
      debugShow : changedDebugShow
    })

  }


  render() {

    console.log('simulator_state')
    console.log(this.state)
    console.log('simulator_props')
    console.log(this.props)

    return (
      <div>
        <Row style = {{"margin": "0px"}}>
          <Col xs={1} sm={1} md={2} style = {{"padding": "0px"}}>
          <ButtonGroup>
            <Button
              style={{'width':'5vw', "backgroundColor": "#f27f87"}}
              className="text-white"
              outline
              onClick={() => {
                this.props.simulatorManipulation({manipulation:'run'});
              }}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-play"/></span>
            </Button>
            <Button
              style={{'width':'5vw', "backgroundColor": "#37B940"}}
              className="text-white"
              outline
              onClick={() => {
                this.props.simulatorManipulation({manipulation:'stop'});
              }}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-pause"/></span>
            </Button>
            <Button
              style={{'width':'5vw', "backgroundColor": "#30BDB4"}}
              className="text-white"
              outline
              onClick={() => {
                this.props.simulatorManipulation({manipulation:'step'});
              }}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {
                        if (el) {
                          el.style.setProperty('color', '#ffffff', 'important');
                        }
                      }}>
                  <i className="fa fa-chevron-right"/></span>
            </Button>
          </ButtonGroup>
            <Row>
              <div style = {{height:'1vh'}}>
              </div>
            </Row>
            <Row style={{"margin":"0px"}}>
          <Button
            style={{'width':'5vw', "backgroundColor": "#660066"}}
            className="text-white"
            outline
            onClick={() => {
              this.props.simulatorManipulation({manipulation:'forward', forward:this.state.forward,});
            }}
          >
            <span className="ml-1 text-inverse"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty('color', '#ffffff', 'important');
                      }
                    }}>
                <i className="fa fa-forward"/></span>
            </Button>
            <Input
              style={{ width: '10vw',textAlign:'right' }}
              placeholder=""
              value={this.state.forward}
              onChange={(e) => this.onChangeForward(e.target.value)}
            />
            </Row>
            <Row>
              <div style = {{height:'1vh'}}>
              </div>
            </Row>
            <Row style={{"margin":"0px"}}>
              <Col xs={1} sm={1} md={1}/>
              <h5>{"DEBUG"}</h5>
              <Col xs={1} sm={1} md={1}/>
              <Toggle
                  checked={this.state.debug}
                  onChange={() => this.props.simulatorDebugSetting({
                    mode:"debug_mode_change",
                    data:this.state.debug,
                  }).then(()=>this.onChangeDebug())}
               />
            </Row>
            <Row>
              <div style = {{height:'1vh'}}>
              </div>
            </Row>
          <ListGroup style = {{ width :"15vw"}}>
            {
              _.map(this.props.neuronNetworkList, (networkInfo, index) => (
                <Row style={{"margin":"0px"}}>
                  {
                    networkInfo.id == this.props.nowNeuronNetworkId ? (
                    <ListGroupItem
                      key={index}
                      style={{ "backgroundColor": "#ffb6c1", margin: "2px", width: "15vw" }}
                      tag="button"
                      onClick={() => {
                        this.props.simulatorMaker({
                          ...networkInfo,
                          debug:this.state.debug,
                        }).then(()=> this.props.setNowNeuronNetworkId(networkInfo.id));
                      }}
                      action href="#">
                    <span className="ml-1 text-inverse"
                          ref={(el) => {
                            if (el) {
                              el.style.setProperty('color', '#000000', 'important');
                            }
                          }}>
                      {networkInfo.name}</span>
                    </ListGroupItem>) :(
                      <ListGroupItem
                      key={index}
                      style={{ "backgroundColor": "#66484d", margin: "2px", width: "15vw" }}
                      tag="button"
                      onClick={() => {
                        this.props.simulatorMaker({
                          ...networkInfo,
                          debug:this.state.debug,
                        }).then(()=> this.props.setNowNeuronNetworkId(networkInfo.id));
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
          <Col xs={10} sm={10} md={7} style = {{"padding": "0px"}}>
            <iframe key={1} src={"http://localhost:8001/demo/index.html?"+this.props.refreshTensorboard} width="1100vw" height="1180vh"/>
          </Col>
          <Col xs={2} sm={2} md={3} style={{ "padding": "0px" }}>
          <td onClick={() => window.open("Debug", "_blank")}>Debug</td>
          {
            _.map(this.state.debugShow, (neuron_network_label, index)=>(
              <div>
              <Row>
                {
                  neuron_network_label.fold == 0?(
                  <Button
                    style={{ 'width': '2vw', "backgroundColor": "#111111", "borderColor": "#111111" }}
                    className="text-white"
                    outline
                    onClick={() => {
                      this.onChangeFold(0,[neuron_network_label.label])
                    }}
                  ><i className="fa fa-minus"/>
                  </Button>) :(
                  <Button
                    style={{ 'width': '2vw', "backgroundColor": "#111111", "borderColor": "#111111" }}
                    className="text-white"
                    outline
                    onClick={() => {
                      this.onChangeFold(0,[neuron_network_label.label])
                    }}
                  ><i className="fa fa-plus"/>
                  </Button>
                  )
                }
                <ListGroup style={{ width: "13vw" }}>
                    <ListGroupItem
                      style={{ "backgroundColor": "#ffb6c1", margin: "0px", width: "13vw" }}
                      tag="button"
                      onClick={() => {
                        console.log('haha')
                      }}
                      action href="#">
                      <span className="ml-1 text-inverse"
                            ref={(el) => {
                              if (el) {
                                el.style.setProperty('color', '#000000', 'important');
                              }
                            }}>
                        {neuron_network_label.label}</span>
                    </ListGroupItem>
                </ListGroup>
                <Button
                  style={{'width':'2vw', "backgroundColor": "#66484d",}}
                  className="text-white"
                  outline
                  onClick={() => {
                    this.props.simulatorDebugSetting({
                      mode: "debug_remove",
                      data: neuron_network_label.label,
                    })
                  }}
                ><i className="fa fa-close (alias)"/>
                </Button>
              </Row>
                {
                  neuron_network_label.fold == 0 ?(
                  _.map(neuron_network_label.data, (neuron_group_label, index)=>(
                    <div>
                        <Row>
                          <Col xs={2} sm={2} md={1}/>
                            {
                              neuron_group_label.fold == 0?(
                              <Button
                                style={{ 'width': '2vw', "backgroundColor": "#111111", "borderColor": "#111111" }}
                                className="text-white"
                                outline
                                onClick={() => {
                                  this.onChangeFold(1,[neuron_network_label.label,neuron_group_label.label])
                                }}
                              ><i className="fa fa-minus"/>
                              </Button>) :(
                              <Button
                                style={{ 'width': '2vw', "backgroundColor": "#111111", "borderColor": "#111111" }}
                                className="text-white"
                                outline
                                onClick={() => {
                                  this.onChangeFold(1,[neuron_network_label.label,neuron_group_label.label])
                                }}
                              ><i className="fa fa-plus"/>
                              </Button>
                              )
                            }
                            <ListGroup style={{ width: "13vw" }}>
                              <ListGroupItem
                                style={{ "backgroundColor": "#a1ffc8", margin: "0px", width: "13vw" }}
                                tag="button"
                                onClick={() => {
                                  console.log('haha')
                                }}
                                action href="#">
                                <span className="ml-1 text-inverse"
                                      ref={(el) => {
                                        if (el) {
                                          el.style.setProperty('color', '#000000', 'important');
                                        }
                                      }}>
                                  {neuron_group_label.label}</span>
                              </ListGroupItem>
                            </ListGroup>
                            <Button
                              style={{'width':'2vw', "backgroundColor": "#285244",}}
                              className="text-white"
                              outline
                              onClick={() => {
                                this.props.simulatorDebugSetting({
                                  mode: "debug_remove",
                                  data: neuron_group_label.label,
                                })
                              }}
                            ><i className="fa fa-close (alias)"/>
                            </Button>
                        </Row>
                      {
                        neuron_group_label.fold == 0? (
                        _.map(neuron_group_label.data, (neuron_model_label, index)=>(
                        <div>
                          <Row>
                          <Col xs={2} sm={2} md={2}/>
                            {
                              neuron_model_label.fold == 0?(
                              <Button
                                style={{ 'width': '2vw', "backgroundColor": "#111111", "borderColor": "#111111" }}
                                className="text-white"
                                outline
                                onClick={() => {
                                  this.onChangeFold(2,[neuron_network_label.label,neuron_group_label.label,neuron_model_label.label])
                                }}
                              ><i className="fa fa-minus"/>
                              </Button>) :(
                              <Button
                                style={{ 'width': '2vw', "backgroundColor": "#111111", "borderColor": "#111111" }}
                                className="text-white"
                                outline
                                onClick={() => {
                                  this.onChangeFold(2,[neuron_network_label.label,neuron_group_label.label,neuron_model_label.label])
                                }}
                              ><i className="fa fa-plus"/>
                              </Button>
                              )
                            }
                            <ListGroup style={{ width: "13vw" }}>
                              <ListGroupItem
                                style={{ "backgroundColor": "#16E7E5", margin: "0px", width: "13vw" }}
                                tag="button"
                                onClick={() => {
                                  console.log('haha')
                                }}
                                action href="#">
                                <span className="ml-1 text-inverse"
                                      ref={(el) => {
                                        if (el) {
                                          el.style.setProperty('color', '#000000', 'important');
                                        }
                                      }}>
                                  {neuron_model_label.label}</span>
                              </ListGroupItem>
                            </ListGroup>
                            <Button
                              style={{'width':'2vw', "backgroundColor": "#354D4D",}}
                              className="text-white"
                              outline
                              onClick={() => {
                                this.props.simulatorDebugSetting({
                                  mode: "debug_remove",
                                  data: neuron_model_label.label,
                                })
                              }}
                            ><i className="fa fa-close (alias)"/>
                            </Button>
                          </Row>
                          {
                            neuron_model_label.fold == 0? (
                            _.map(neuron_model_label.data, (neuron_element_label, index)=>(
                            <div>
                              <Row>
                              <Col xs={2} sm={2} md={4}/>
                                <ListGroup style={{ width: "13vw" }}>
                                  <ListGroupItem
                                    style={{ "backgroundColor": "#bbbbbb", margin: "0px", width: "13vw" }}
                                    tag="button"
                                    onClick={() => {
                                      console.log('haha')
                                    }}
                                    action href="#">
                                    <span className="ml-1 text-inverse"
                                          ref={(el) => {
                                            if (el) {
                                              el.style.setProperty('color', '#000000', 'important');
                                            }
                                          }}>
                                      {neuron_element_label.label}</span>
                                  </ListGroupItem>
                                </ListGroup>
                                <Button
                                  style={{'width':'2vw', "backgroundColor": "#222222",}}
                                  className="text-white"
                                  outline
                                  onClick={() => {
                                    this.props.simulatorDebugSetting({
                                      mode: "debug_remove",
                                      data: neuron_element_label.label,
                                    })
                                  }}
                                ><i className="fa fa-close (alias)"/>
                                </Button>
                              </Row>
                            </div>
                            ))
                            ):(<div/>)
                          }
                        </div>
                        ))
                        ):(<div/>)

                      }
                    </div>
                  ))
                  ):(<div/>)
                }
              </div>
            ) )
          }
          </Col>
        </Row>
      </div>
    );
  }
}

export default Simulator;
