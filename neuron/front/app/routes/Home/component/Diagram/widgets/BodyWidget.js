import * as _ from 'lodash';
import * as React from 'react';
import styled from '@emotion/styled';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { DefaultNodeModel } from '@projectstorm/react-diagrams';
import DemoCanvasWidget from '../helpers/DemoCanvasWidget';
import TrayItemWidget from './TrayItemWidget';
import TrayWidget from './TrayWidget';

const Body = styled.div`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	min-height: 90vh;
`;

const Header = styled.div`
	display: flex;
	background: rgb(30, 30, 30);
	flex-grow: 0;
	flex-shrink: 0;
	color: white;
	font-family: Helvetica, Arial, sans-serif;
	padding: 10px;
	align-items: center;
`;

const Content = styled.div`
	display: flex;
	flex-grow: 1;
`;

const Layer = styled.div`
	position: relative;
	flex-grow: 1;
`;


export default class BodyWidget extends React.Component {
  render() {

    return (
      <Body>
        <Header>
          <div className="title">Storm React Diagrams - DnD demo</div>
        </Header>
        <Content>
          <TrayWidget>
            <TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)"/>
            <TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)"/>
          </TrayWidget>
          <Layer
            onDrop={event => {
              console.log('drop!')
              var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
              console.log(data)
              console.log(event)
              var nodesCount = _.keys(
                this.props.app
                  .getDiagramEngine()
                  .getModel()
                  .getNodes(),
              ).length;

              var node: DefaultNodeModel = null;
              if (data.type === 'in') {
                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
                node.addInPort('In');
              } else {
                node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
                node.addOutPort('Out');
              }
              var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
              node.setPosition(point);
              this.props.app
                .getDiagramEngine()
                .getModel()
                .addNode(node);
               this.forceUpdate();
            }}
            onDragOver={event => {
              event.preventDefault();
            }}>
            <DemoCanvasWidget>
              <CanvasWidget engine={this.props.app.getDiagramEngine()}/>
            </DemoCanvasWidget>
          </Layer>
        </Content>
      </Body>
    );
  }
}
