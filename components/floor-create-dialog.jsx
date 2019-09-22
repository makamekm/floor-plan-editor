import React from 'react'
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import { FloorService } from '../services/floor.service';
import { observer } from 'mobx-react';
import { useObservable, useObserver } from 'mobx-react-lite';
import InlineTextEdit from './inline-text-edit';

const FloorCreateDialog = ({children}) => {
  const data = useObservable({isOpen: false, name: ""});
  const floorService = useInstance(FloorService);

  return useObserver(() => <>
      {children(() => {
        data.isOpen = true;
        data.name = "";
      })}
      <WindowPanel
        active={data.isOpen}
        onClickOutside={() => {
          data.isOpen = false;
        }}>
        <div className="list">
          <div className="item header">
            Create Floor
          </div>
          <div className="item is-field">
            <InlineTextEdit
              placeholder="Write Floor Name..."
              value={data.name}
              onChange={value => {
                data.name = value;
              }}
            />
          </div>
          <div
            className={"item clickable" + (data.name.length < 1 ? " is-disabled" : "")}
            onClick={async () => {
              await floorService.createFloor(data.name);
              data.isOpen = false;
            }}>
            Create
          </div>
        </div>
      </WindowPanel>
  
      <style jsx>{`
        .list {
          width: calc(100vw - 20px);
          max-width: 400px;
          overflow: auto;
          max-height: calc(var(--vh, 1vh) * 100 - 20px);
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

        .item.clickable.is-disabled {
          pointer-events: none;
          opacity: 0.4;
        }
      `}</style>
    </>
  )
}

export default observer(FloorCreateDialog);