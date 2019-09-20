import React from 'react'
import { observer } from 'mobx-react'
import { useInstance } from 'react-ioc'
import { FloorService } from '../services/floor.service'

const FloorList = () => {
  const floorService = useInstance(FloorService);
  return (
    <>
      <div className="list">
        {
          floorService.list.map(({key, name}) => {
            return (
              <div key={key} onClick={() => onToggle(key)}
                className={"item clickable" + (activeState === key ? ' active' : '')}>
                {name}
              </div>
            )
          })
        }
      </div>
      
      <style jsx>{`
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

        .item:active, .item.active {
          background-color: #2196F3;
          border-color: #2196F3;
          color: #FFFFFF;
        }

        .item.active {
          cursor: default;
          pointer-events: none;
        }
      `}</style>
    </>
  )
}

export default observer(FloorList)
