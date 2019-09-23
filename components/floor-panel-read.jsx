import React from 'react'
import Panel from './panel';
import ToggleButtonType from './toggle-type';
import FloorListRead from './floor-list-read';
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import { FloorService } from '../services/floor.service';
import { FloorListService } from '../services/floor-list.service';
import { observer } from 'mobx-react';
import ListIcon from "../icons/search.svg"

const FloorPanelRead = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);

  const name = floorService.floor.data && floorService.floor.data.name;

  return (
    <>
      <Panel>
        <ToggleButtonType
          activeState={'name'}
          items={[{
            key: 'name',
            name: name,
          }, {
            key: 'menu',
            name: <div style={{lineHeight: 0}}><img src={ListIcon} alt=""/></div>,
          }]}
          onToggle={key => {
            if (key === 'menu') {
              floorListService.opened = true;
            }
          }}
        />
        <WindowPanel
          active={floorListService.opened}
          onClickOutside={() => {
            floorListService.opened = false;
          }}>
          <div className="list">
            <FloorListRead/>
          </div>
        </WindowPanel>
      </Panel>
  
      <style jsx>{`
        .list {
          width: calc(100vw - 20px);
          max-width: 400px;
          overflow: auto;
          max-height: calc(var(--vh, 1vh) * 100 - 20px);
        }
      `}</style>
    </>
  )
}

export default observer(FloorPanelRead);