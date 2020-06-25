// @flow
import {
  setPageLoading,

  simulatorMaker,
  simulatorManipulation,
  simulatorClickInput,
  simulatorDebugSetting,

} from 'actions';

import {
  Col,
  Container,
  Input,
  Row,
  ButtonGroup,
  Button,
  Card,
  CardBody,
  Table,
  ListGroup,
  ListGroupItem,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu, } from 'components';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'components/Recharts';
import _ from "lodash";

import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3030' )
import styles from "./commonStyle.scss"

class Debug extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      elseInfo: {},
      debugInfo: {},
      forward:1,
    }
  }

  componentDidMount() {
    this.props.setPageLoading(false);
    socket.on('debug_info',(debug_info)=>{
      console.log(debug_info)
      this.setState({
        ...this.state,
        debugInfo: debug_info["debug_info"],
        elseInfo: debug_info["else_info"],
      })
    })
  }

  onChangeForward = (forward)=> {
    this.setState({
      ...this.state,
      forward:forward,
    })
  }


  render(){
    console.log('Debug_state');
    console.log(this.state);
    console.log('Debug_props');
    console.log(this.props);

    return(
      <Card>
        <CardBody className = {styles.cardBody}>
          <Row>
            <Col xs={1} sm={1} md={1} style = {{"padding": "0px"}}>
            <h5>{"Age :"}{this.state.elseInfo.age}</h5>
            </Col>
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
                      ref={(el) => {if (el) {el.style.setProperty('color', '#ffffff', 'important');}}}>
                  <i className="fa fa-play"/></span>
            </Button>
            <Button
              style={{'width':'5vw', "backgroundColor": "#37B940"}}
              className="text-white"
              outline
              onClick={() => {this.props.simulatorManipulation({manipulation:'stop'});}}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {if (el) {el.style.setProperty('color', '#ffffff', 'important');}}}>
                  <i className="fa fa-pause"/></span>
            </Button>
            <Button
              style={{'width':'5vw', "backgroundColor": "#30BDB4"}}
              className="text-white"
              outline
              onClick={() => {this.props.simulatorManipulation({manipulation:'step'});}}
            >
              <span className="ml-1 text-inverse"
                      ref={(el) => {if (el) {el.style.setProperty('color', '#ffffff', 'important');}}}>
                  <i className="fa fa-chevron-right"/></span>
            </Button>
            <Button
              style={{'width':'5vw', "backgroundColor": "#660066"}}
              className="text-white"
              outline
              onClick={() => {this.props.simulatorManipulation({manipulation:'forward', forward:this.state.forward,});}}
            >
            <span className="ml-1 text-inverse"
                    ref={(el) => {if (el) {el.style.setProperty('color', '#ffffff', 'important');}}}>
                <i className="fa fa-forward"/></span>
            </Button>
            <Input
              style={{ width: '10vw',textAlign:'right' }}
              placeholder=""
              value={this.state.forward}
              onChange={(e) => this.onChangeForward(e.target.value)}
            />
          </ButtonGroup>
          </Row>
          <Table>
            <tr>
            {
              _.map(this.state.debugInfo, neuron_network_label=>(
                _.map(neuron_network_label.data, neuron_group_label=>(
                  _.map(neuron_group_label.data, neuron_model_label=>(
                    _.map(neuron_model_label.data, neuron_element_label=>(
                      <td>
                        <tr>
                          <span className="ml-1 tex-inverse" ref={(el) => {if (el) {el.style.setProperty('color', '#11b8aa', 'important')}}}>
                            {neuron_element_label.label}
                          </span>
                        </tr>
                        {
                          _.map(neuron_element_label.data, neuron_synaps_data=>(
                            <tr>
                              <h6>{neuron_synaps_data.label}</h6>
                                <LineChart width={350} height={250} data={neuron_synaps_data.data}
                                      margin={{top: 5, right: 0, left: 0, bottom: 0}}>
                                 <XAxis dataKey="name"/>
                                 <YAxis/>
                                 <CartesianGrid strokeDasharray="3 3"/>
                                 <Tooltip/>
                                 <Legend />
                                 <Line  dataKey="value" stroke="#8884d8"/>
                                </LineChart>
                            </tr>
                          ))
                        }
                      </td>
                    ))
                  ))
                ))
              ))
            }
            </tr>

          </Table>
        </CardBody>
      </Card>

    )
  }

}

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPageLoading: (loading: boolean) => dispatch(setPageLoading(loading)),

  simulatorMaker: (simulatorInfo): Promise<Object> => dispatch(simulatorMaker(simulatorInfo)),
  simulatorManipulation: (manipulationInfo): Promise<Object> => dispatch(simulatorManipulation(manipulationInfo)),
  simulatorClickInput: (clickInfo): Promise<Object> => dispatch(simulatorClickInput(clickInfo)),
  simulatorDebugSetting: (debugInfo): Promise<Object> => dispatch(simulatorDebugSetting(debugInfo)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Debug);