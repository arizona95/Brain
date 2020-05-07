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
    }
  }

  componentDidMount() {
    this.props.networkFetch();
  }

  componentWillReceiveProps(nextProps) {

      console.log("componentWillReceiveProps")

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
                  onChange={() => this.props.simulatorDebugSetting({debug:this.state.debug}).then(()=>this.onChangeDebug())}
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
          <Col xs={10} sm={10} md={8} style = {{"padding": "0px"}}>
            <iframe key={1} src="http://localhost:8001/demo/index.html" width="1600vw" height="1180vh"/>
          </Col>
          <Col xs={2} sm={2} md={2} style = {{"padding": "0px"}}>
            <ListGroup style = {{ width :"15vw"}}>
              <Row>
                <ListGroupItem
                      style={{ "backgroundColor": "#16E7E5", margin: "2px", width: "13vw" }}
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
                      aaa</span>
                    </ListGroupItem>
              </Row>
            </ListGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Simulator;
