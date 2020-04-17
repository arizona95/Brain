// @flow

import { Card,CardBody, Col, cardBody,  Row, Toggle, Table, Button, Progress, DropdownMenu, UncontrolledButtonDropdown,  DropdownToggle, DropdownItem, } from 'components';
import _ from 'lodash';
import React from 'react';
import styles from './commonStyle.scss';
import ReactTooltip from 'react-tooltip';


class SelectModel extends React.Component<Props> {
  constructor(props){
      super(props);
      this.state={
        initialText:'',
        initialVideo:'',
        adding:false,
        editLocate:0,
      }
    }

  render(){
    return(
      <CardBody>
        <Row>
          <div style = {{height:'3vh'}}>
          </div>
        </Row>
          <Row >
            <Col xs={12} sm={12} md={3}/>
            <Col xs={12} sm={12} md={8}>
              <Card>
                <div className={styles.cardBody1}>
                  <Table>
                    <thead>
                    <tr>
                      <th><h5>Model List</h5></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      _.map(this.props.modelList, (model, index) => (
                        <tr key={index}>
                          <td>
                            <Button
                              style={{'width':'10vw'}}
                              color="secondary"
                              className="text-white"
                              outline
                              active={model.id === this.props.selectedModel.id}
                              onClick={() => {this.props.onSelectModel(model.id)}}
                            >
                              <a data-tip data-for={index}> {model.name} </a>
                              <ReactTooltip id={index} aria-haspopup='true' role='example'>
                              { model.info.p.map(p=>(<p>{p}</p>)) }
                              <ul> { model.info.li.map(li=>(<li>{li}</li>)) } </ul>
                              </ReactTooltip>
                            </Button>
                          </td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>
          </Row>
      </CardBody>
    )
  }
}

export default SelectModel;
