import React, { Component } from 'react';
import { Blueprint } from '../models/blueprint';
import Panel from './panel';
import FloorPanelRead from './floor-panel-read';
import List from './list';
import { inject } from 'react-ioc';
import { BlueprintService } from '../services/blueprint.service';
import { observer } from 'mobx-react';
import { ItemNameDict } from '../models/floorplan-entities/item.dict';
import { FloorListService } from '../services/floor-list.service';
import { FloorService } from '../services/floor.service';
import { ProjectService } from '../services/project.service';

@observer
class BlueprintView extends Component {

  state = {
    isToolbarOpen: false,
  }

  @inject(BlueprintService) blueprintService;
  @inject(FloorService) floorService;
  @inject(FloorListService) floorListService;
  @inject(ProjectService) projectService;

  componentDidMount() {
    this.blueprint = new Blueprint(this.ref);
    this.blueprintService.setBlueprint(this.blueprint);
    this.blueprintService.changeMode('read');
  }

  componentWillUnmount() {
    this.blueprintService.destructor();
  }

  render() {
    return (
      <div className="view">
        <canvas
          ref={(ref) => {
            this.ref = ref;
          }}
        />

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
                  body: this.blueprintService.selected.name,
                },
                {
                  key: 'header-description',
                  body: "Description",
                  isHeader: true,
                },
                {
                  key: 'description',
                  body: this.blueprintService.selected.description,
                }
              ]}
            </List>
          </Panel> : null}
        </div>

        <div className="floor-panel">
          <FloorPanelRead/>
        </div>

        <style jsx>{`
          .view {
            position: relative;
            width: 100vw;
            height: calc(var(--vh, 1vh) * 100);
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
            .property-panel {
              top: 80px;
              right: 20px;
              width: unset;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default BlueprintView
