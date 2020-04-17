// @flow

import { Col, Container, Input, Row, Toggle, Table, CardBody } from 'components';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styled from 'styled-components';


class FeatureSelect extends React.Component<Props> {
  constructor(props){
      super(props);
    }

  render(){

    return(
      <CardBody>
        <Row>
          <div style = {{height:'5vh'}}>
          </div>
        </Row>
        <Row>
        <Col xs={12} sm={12} md={2}/>
        <Col xs={12} sm={12} md={8}>
          <Table>
            <thead>
            <tr>
              <th colSpan="2"><h5>Feature Select</h5></th>
            </tr>
            </thead>
            <tbody>
            {
              _.map(this.props.feature, (feature, index) => (
                <tr key={index}>
                  <td>
                    <span className="ml-2 text-inverse">{feature.name}</span>
                  </td>
                  <td>
                    <label className="d-flex align-items-middle mb-0">
                      <Toggle
                        defaultChecked={feature.include}
                        value={index}
                        onChange={()=>{this.props.onChangeFeature(feature.id);}}/>
                    </label>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </Table>
        </Col>
        </Row>
      </CardBody>
    )
  }
}

export default FeatureSelect;