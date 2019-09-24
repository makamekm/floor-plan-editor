import React from 'react'
import { observer } from 'mobx-react'
import { useInstance } from 'react-ioc'
import { FloorListService } from '../services/floor-list.service'
import { FloorService } from '../services/floor.service'
import { ProjectService } from '../services/project.service'
import { copyTextToClipboard } from '../utils/clipboard'
import BackIcon from "../icons/back.svg"
import CopyIcon from "../icons/copy.svg"
import WithIcon from './with-icon'

const FloorListRead = () => {
  const floorService = useInstance(FloorService);
  const projectService = useInstance(ProjectService);
  const floorListService = useInstance(FloorListService);

  const currentId = floorService.floor.data && floorService.floor.data.id;

  return <>
    <div onClick={() => projectService.openProjectList()}
      className={"item clickable"}>
      <WithIcon icon={BackIcon}>
        Open My Projects
      </WithIcon>
    </div>

    <div onClick={() => {
      copyTextToClipboard(window.location.href);
    }}
      className={"item clickable"}>
      <WithIcon icon={CopyIcon}>
        Copy Link
      </WithIcon>
    </div>

    {
      floorListService.list.map(({id, name}) => {
        return (
          <div key={id} onClick={() => floorService.openPublicFloor(id)}
            className={"item clickable" + (id === currentId ? ' active' : '')}>
            {name}
          </div>
        )
      })
    }
    
    <style jsx>{`
      .item {
        padding-left: 20px;
        padding-right: 20px;
        transition: background-color 0.1s, border-color 0.1s;
        will-change: background-color, border-color;
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

      .item.clickable:active, .item.clickable.active {
        background-color: #2196F3;
        border-color: #2196F3;
        color: #FFFFFF;
      }

      .item.active {
        cursor: default;
        pointer-events: none;
      }

      .item.clickable:active :global(.icon img), .item.clickable.active :global(.icon img) {
        filter: invert(1)
      }
    `}</style>
  </>
}

export default observer(FloorListRead)
