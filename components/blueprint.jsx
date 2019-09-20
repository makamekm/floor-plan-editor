import React, { Component } from 'react';
import { Blueprint } from '../models/blueprint';
import ToggleButtonType from './toggle-type';
import Panel from './panel';
import Loading from './loading';
import FloorPanel from './floor-panel';
import { inject } from 'react-ioc';
import { BlueprintService } from '../services/blueprint.service';
import { observer } from 'mobx-react';
import { FloorService } from '../services/floor.service';
import { FloorListService } from '../services/floor-list.service';

const itemTypeList = [
  {
    key: 'move',
    name: 'Move',
  },
  {
    key: 'draw',
    name: 'Draw',
  },
  {
    key: 'delete',
    name: 'Delete',
  },
]

@observer
class BlueprintView extends Component {

  @inject(FloorService) floorService;
  @inject(FloorListService) floorListService;
  @inject(BlueprintService) blueprintService;

  componentDidMount() {
    this.blueprint = new Blueprint(this.ref);
    this.blueprintService.setBlueprint(this.blueprint);
  }

  componentWillUnmount() {
    this.blueprintService.unsetBlueprint(this.blueprint);
  }

  render() {
    return (
      <div className="view">
        <canvas
          ref={(ref) => {
            this.ref = ref;
          }}
        />

        <div className="mode-panel">
          <ToggleButtonType
            activeState={this.blueprintService.mode}
            items={itemTypeList}
            onToggle={mode => this.blueprintService.changeMode(mode)}
          />
        </div>

        <div className="items-panel">
          <Panel>
            <div className="list">
              <div className="item clickable">
                + &nbsp;Table
              </div>
              <div className="item clickable">
                + &nbsp;Computer
              </div>
              <div className="item clickable">
                + &nbsp;Warning
              </div>
            </div>
          </Panel>
        </div>

        <div className="property-panel">
          <Panel>
            <div className="list">
              <div className="item header">
                Table
              </div>
              <div className="item">
                Owner: Karpov Maxim
              </div>
              <div className="item">
                Date added: 11/12/2019
              </div>
              <div className="item header">
                Description
              </div>
              <div className="item">
                The best table has ever made
              </div>
            </div>
          </Panel>
        </div>

        <div className="floor-panel">
          <FloorPanel/>
        </div>

        <Loading active={
          this.floorService.loading
          || this.floorListService.loading
        }></Loading>
  
        <style jsx>{`
          .view {
            position: relative;
            width: 100vw;
            height: 100vh;
          }

          .mode-panel {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          }

          .items-panel {
            position: absolute;
            top: 20px;
            right: 20px;
            border-radius: 5px;
            width: 300px;
          }

          .property-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            border-radius: 5px;
            width: 300px;
          }

          .floor-panel {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
          }

          .list {
            overflow: auto;
            max-height: calc(100vh - 20px);
          }

          .item {
            padding-left: 20px;
            padding-right: 20px;
            transition: background-color 0.1s;
            will-change: background-color;
            user-select: none;
            padding-top: 10px;
            padding-bottom: 10px;
            font-family: Open Sans;
            font-style: normal;
            font-size: 12px;
            line-height: 12px;
            border-bottom: 1px solid #f1f1f1;
          }

          .item:last-child {
            border-bottom: none;
          }

          .item:first-child {
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          }
  
          .item:last-child {
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
          }

          .item.header {
            font-weight: 600;
            text-transform: uppercase;
            text-align: center;
          }

          .item.clickable {
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
          }
    
          .item.clickable:hover {
            background-color: #F1FCFF;
          }
    
          .item.clickable:active {
            background-color: #e0f6ff;
          }
        `}</style>
      </div>
    )
  }
}

export default BlueprintView
