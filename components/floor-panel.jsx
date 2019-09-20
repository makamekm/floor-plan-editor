import React from 'react'
import Panel from './panel';
import ToggleButtonType from './toggle-type';
import FloorList from './floor-list';
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import { FloorService } from '../services/floor.service';
import { FloorListService } from '../services/floor-list.service';
import { observer } from 'mobx-react';

const FloorPanel = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);

  const id = floorService.floor.data && floorService.floor.data.id;
  const isCreate = id == null;
  const name = floorService.floor.data && floorService.floor.data.name;

  return (
    <div>
      <Panel>
        <ToggleButtonType
          activeState={isCreate ? 'not-save' : 'save'}
          items={[{
            key: 'save',
            name: isCreate ? 'Save Plan' : name,
          }, {
            key: 'menu',
            name: '=',
          }]}
          onToggle={key => {
            if (key === 'menu') {
              floorListService.opened = true;
            } else if (key === 'save') {
              floorService.createFloor();
            }
          }}
        />
        <WindowPanel
          active={floorListService.opened}
          onClickOutside={() => {
            floorListService.opened = false;
          }}>
          <div className="list">
            <FloorList/>
          </div>
        </WindowPanel>
      </Panel>
  
      <style jsx>{`
        .list {
          width: 400px;
        }
      `}</style>
    </div>
  )
}

export default observer(FloorPanel);