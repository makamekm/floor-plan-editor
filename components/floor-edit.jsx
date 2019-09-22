import React from 'react'
import { observer } from 'mobx-react'
import { useInstance } from 'react-ioc'
import InlineTextEdit from './inline-text-edit';
import { FloorEditService } from '../services/floor-edit.service';
import FloorDeleteDialog from './floor-delete-dialog';

const FloorEdit = () => {
  const floorEditService = useInstance(FloorEditService);

  return (
    <FloorDeleteDialog>
      {open => <>
        <div className="item header">
          Floor name
        </div>
        <div className="item is-field">
          <InlineTextEdit
            placeholder="Write Name..."
            value={floorEditService.data.name}
            onChange={value => {
              floorEditService.data.name = value;
            }}
          />
        </div>
        <div className="item header">
          Operations
        </div>
        <div className="item clickable" onClick={() => open()}>
          Delete
        </div>
        
        <style jsx>{`
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
        `}</style>
      </>}
    </FloorDeleteDialog>
  )
}

export default observer(FloorEdit)
