// @flow

import { Col, Container, Input, Row, Toggle, Table, CardBody } from 'components';
import _ from 'lodash';
import React from 'react';
import styles from './DataLoad.scss';

class DataLoad extends React.Component<Props> {
  constructor(props){
      super(props);
    }

  render(){
    const bordcolor = '#444444 '
    return(
      <CardBody className={styles.cardBody}>
      <Row>
        <div style = {{height:'1vh'}}>
        </div>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={11}>
        <Table>
          <thead >
          <tr >
            <th colSpan="3" ref={(el) => {
                  if (el) {
                    el.style.setProperty('border-top-color', bordcolor, 'important');
                    el.style.setProperty('border-bottom-color', bordcolor, 'important');
                  }
                }}><h5>Data Kinds</h5></th>
          </tr>
          </thead>
          <tbody>
          {
            _.map(this.props.logCategory[this.props.selectedModel.id], (logCategory, index) => (
              <tr key={index} >
                <td ref={(el) => {
                  if (el) {
                    el.style.setProperty('border-bottom', '1px solid');
                    el.style.setProperty('border-color', bordcolor, 'important');
                  }
                }}>
                  <span className="ml-2 text-inverse"><h5>{logCategory.name}</h5></span>
                </td>
                <td ref={(el) => {
                  if (el) {
                    el.style.setProperty('border-bottom', '1px solid');
                    el.style.setProperty('border-right', '1px solid', 'important');
                    el.style.setProperty('border-color', bordcolor, 'important');
                  }
                }}>
                  <label className="d-flex align-items-middle mb-0">
                    <Toggle
                      defaultChecked={logCategory.include}
                      value={index}
                      onChange={()=>{this.props.onChangeLogCategory(logCategory.id);}}/>
                  </label>
                </td>

                  {
                    logCategory.include === true ?(
                      <table style={{width:'100%'}}>
                      {
                        _.map(logCategory.feature , (feature, id) => {
                          const num = Object.keys(logCategory.feature).length
                          return(
                          <tr>
                            {
                              num-1 == id ?(
                              <td style={{ 'border-top': 'none', 'border-bottom':'1px solid', 'width':'80%', 'border-bottom-color': bordcolor }}>
                                <span className="ml-2 text-inverse">{feature.name}</span>
                              </td>
                              ):(
                              <td style={{ 'border': 'none' }}>
                                <span className="ml-2 text-inverse">{feature.name}</span>
                              </td>
                              )
                            }
                            {
                              num-1 == id ?(
                              <td style={{ 'border-top': 'none', 'border-bottom':'1px solid', 'width':'80%', 'border-bottom-color': bordcolor }}>
                                <label className="d-flex align-items-middle mb-0">
                                  <Toggle
                                    defaultChecked={feature.include}
                                    value={index}
                                    onChange={()=>{this.props.onChangeFeature(logCategory.id, feature.id);}}/>
                                </label>
                              </td>
                              ):(
                              <td style={{ 'border': 'none' }}>
                                <label className="d-flex align-items-middle mb-0">
                                  <Toggle
                                    defaultChecked={feature.include}
                                    value={index}
                                    onChange={()=>{this.props.onChangeFeature(logCategory.id,feature.id);}}/>
                                </label>
                              </td>
                              )
                            }
                          </tr>
                        )})
                      }
                      </table>
                    ):(
                      <td style={{ 'border-top': 'none', 'border-bottom':'1px solid', 'border-bottom-color': bordcolor }}>
                      </td>
                    )

                  }
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

export default DataLoad;
