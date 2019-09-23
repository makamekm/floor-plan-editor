import React, { Component } from 'react';
import Sidebar from 'react-sidebar';
import { Blueprint } from '../models/blueprint';
import ToggleButtonType from './toggle-type';
import Panel from './panel';
import Loading from './loading';
import FloorPanel from './floor-panel';
import InlineTextEdit from './inline-text-edit';
import InlineTextareaEdit from './inline-textarea-edit';
import List from './list';
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
    return (
      <Sidebar
        pullRight
        styles={{ sidebar: { background: "white" } }}
        open={this.state.isToolbarOpen}
        onSetOpen={open => this.setState({ isToolbarOpen: open })}
        sidebar={
          <List onClick={(item) => {
            this.blueprintService.addItem(item.key);
            this.setState({ isToolbarOpen: false });
          }}>
            {ItemArray.map(item => ({
              key: item,
              body: (<>+ &nbsp;{ItemNameDict[item]}</>),
              isClickable: true,
            }))}
          </List>
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
              <div className="list-overflow">
                <List borderRadius="5px" onClick={(item) => {
                  this.blueprintService.addItem(item.key);
                }}>
                  {ItemArray.map(item => ({
                    key: item,
                    body: (<>+ &nbsp;{ItemNameDict[item]}</>),
                    isClickable: true,
                  }))}
                </List>
              </div>
            </Panel>
          </div>

          <div className="property-panel">
            {this.blueprintService.selected ? <Panel>
              <List borderRadius="5px">
                {[
                  {
                    key: 'header',
                    body: ItemNameDict[this.blueprintService.selected.type],
                    isHeader: true,
                  },
                  {
                    key: 'name',
                    body: (
                      <InlineTextEdit
                        placeholder="Write Name..."
                        value={this.blueprintService.selected.name}
                        onChange={value => {
                          this.blueprintService.selected.name = value;
                          this.blueprintService.applyChanges();
                        }}
                      />
                    ),
                    isField: true,
                  },
                  {
                    key: 'header-description',
                    body: "Description",
                    isHeader: true,
                  },
                  {
                    key: 'description',
                    body: (
                      <InlineTextareaEdit
                        borderRadius="0 0 5px 5px"
                        placeholder="Write Description..."
                        value={this.blueprintService.selected.description}
                        onChange={value => {
                          this.blueprintService.selected.description = value;
                          this.blueprintService.applyChanges();
                        }}
                      />
                    ),
                    isField: true,
                  }
                ]}
              </List>
            </Panel> : null}
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
              height: calc(var(--vh, 1vh) * 100);
            }

            .list-overflow {
              overflow: auto;
              max-height: calc(var(--vh, 1vh) * 100 - 20px);
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
        </div>
      </Sidebar>
    )
  }
}

export default BlueprintView
