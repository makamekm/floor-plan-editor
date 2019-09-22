import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import { Blueprint } from '../models/blueprint';
import ToggleButtonType from './toggle-type';
import Panel from './panel';
import Loading from './loading';
import FloorPanel from './floor-panel';
import InlineTextEdit from './inline-text-edit';
import InlineTextareaEdit from './inline-textarea-edit';
import { inject } from 'react-ioc';
import { BlueprintService } from '../services/blueprint.service';
import { observer } from 'mobx-react';
import { FloorService } from '../services/floor.service';
import { FloorListService } from '../services/floor-list.service';
import { ItemNameDict, ItemArray } from '../models/floorplan-entities/item.dict';

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

  state = {
    isToolbarOpen: false,
  }

  @inject(FloorService) floorService;
  @inject(FloorListService) floorListService;
  @inject(BlueprintService) blueprintService;

  componentDidMount() {
    this.blueprint = new Blueprint(this.ref);
    this.blueprintService.setBlueprint(this.blueprint);
  }

  componentWillUnmount() {
    this.blueprintService.destructor();
  }

  render() {
    const style = (
      <style jsx>{`
        .view {
          position: relative;
          width: 100vw;
          height: calc(var(--vh, 1vh) * 100);
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
          max-width: calc(100vw - 40px);
          width: 230px;
        }

        .list.is-overflow {
          overflow: auto;
          max-height: calc(var(--vh, 1vh) * 100 - 20px);
        }

        .list {
          min-width: 200px;
        }

        .item {
          padding: 10px 15px;
          transition: background-color 0.1s;
          will-change: background-color;
          user-select: none;
          font-family: Open Sans;
          font-style: normal;
          font-size: 12px;
          line-height: 12px;
          border-bottom: 1px solid #f1f1f1;
        }

        .item.is-field {
          padding: 0;
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

        @media (max-width: 900px) {
          .items-panel {
            display: none;
          }

          .property-panel {
            top: 80px;
            right: 20px;
            width: unset;
          }
        }
      `}</style>
    );

    return (
      <Sidebar
        pullRight
        styles={{ sidebar: { background: "white" } }}
        open={this.state.isToolbarOpen}
        onSetOpen={open => this.setState({ isToolbarOpen: open })}
        sidebar={
          <div className="list is-overflow">
            {ItemArray.map(item => (
              <div key={item} className="item clickable" onClick={() => {
                this.blueprintService.addItem(item);
                this.setState({ isToolbarOpen: false });
              }}>
                + &nbsp;{ItemNameDict[item]}
              </div>
            ))}
            {style}
          </div>
        }
      >
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
              <div className="list is-overflow">
                {ItemArray.map(item => (
                  <div key={item} className="item clickable" onClick={() => {
                    this.blueprintService.addItem(item);
                  }}>
                    + &nbsp;{ItemNameDict[item]}
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="property-panel">
            {this.blueprintService.selected ? <Panel>
              <div className="list">
                <div className="item header">
                  {ItemNameDict[this.blueprintService.selected.type]}
                </div>
                <div className="item is-field">
                  <InlineTextEdit
                    placeholder="Write Name..."
                    value={this.blueprintService.selected.name}
                    onChange={value => {
                      this.blueprintService.selected.name = value;
                      this.blueprintService.applyChanges();
                    }}
                  />
                </div>
                <div className="item header">
                  Description
                </div>
                <div className="item is-field">
                  <InlineTextareaEdit
                    borderRadius="0 0 5px 5px"
                    placeholder="Write Description..."
                    value={this.blueprintService.selected.description}
                    onChange={value => {
                      this.blueprintService.selected.description = value;
                      this.blueprintService.applyChanges();
                    }}
                  />
                </div>
              </div>
            </Panel> : null}
          </div>

          <div className="floor-panel">
            <FloorPanel/>
          </div>

          <Loading active={
            this.floorService.loading
            || this.floorListService.loading
          }></Loading>

          {style}
        </div>
      </Sidebar>
    )
  }
}

export default BlueprintView
