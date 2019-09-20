import React from 'react'
import Panel from './panel';
import ToggleButtonType from './toggle-type';
import { useInstance } from 'react-ioc';
import { FloorService } from '../services/floor.service';
import { FloorListService } from '../services/floor-list.service';

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
              // floorService.
            } else if (key === 'save') {
              floorService.createFloor();
            }
          }}
        />
      </Panel>
  
      <style jsx>{`
  
      `}</style>
    </div>
  )
}

export default FloorPanel