// @flow
import {
  setPageLoading,

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
import socketio from 'socket.io-client';
const socket = socketio.connect('http://localhost:3030')

class Debug extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      debugInfo: {},
      debugChart: {},
    }
  }

  componentDidMount() {
    this.props.setPageLoading(false);
    socket.on('debug_info',(debug_info)=>{
      this.setState({
        ...this.state,
        debugChart: debug_info
      })
    })
  }


  render(){
    console.log('Debug_state');
    console.log(this.state);
    console.log('Debug_props');
    console.log(this.props);

    const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];

    return(
      <div>

        <Table>
          <tr>
          {
            _.map(this.state.debugChart, neuron_network_label=>(
              _.map(neuron_network_label.data, neuron_group_label=>(
                _.map(neuron_group_label.data, neuron_model_label=>(
                  _.map(neuron_model_label.data, neuron_element_label=>(
                    <td>
                      <tr>
                        <h6>{neuron_element_label.label}</h6>
                      </tr>
                      {
                        _.map(neuron_element_label.data, neuron_synaps_data=>(
                          <tr>
                            <h6>{neuron_synaps_data.label}</h6>
                              <LineChart width={600} height={300} data={neuron_synaps_data.data}
                                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                               <XAxis dataKey="name"/>
                               <YAxis/>
                               <CartesianGrid strokeDasharray="3 3"/>
                               <Tooltip/>
                               <Legend />
                               <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{r: 8}}/>
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
      </div>
    )
  }

}

const mapStateToProps = state => ({
  data: state.data,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setPageLoading: (loading: boolean) => dispatch(setPageLoading(loading)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Debug);