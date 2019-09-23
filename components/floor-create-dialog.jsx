import React from 'react'
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import { FloorService } from '../services/floor.service';
import List from './list';
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
        <List borderRadius="5px">
          {
            [
              {
                key: 'header',
                body: "Create Floor",
                isHeader: true,
              },
              {
                key: 'name',
                body: (
                  <InlineTextEdit
                    placeholder="Write Floor Name..."
                    value={data.name}
                    onChange={value => {
                      data.name = value;
                    }}
                  />
                ),
                isField: true,
              },
              {
                key: 'action',
                body: "Create",
                onClick: async () => {
                  await floorService.createFloor(data.name);
                  data.isOpen = false;
                },
                isClickable: true,
              }
            ]
          }
        </List>
      </WindowPanel>
    </>
  )
}

export default observer(FloorCreateDialog);