import React from 'react'
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import { FloorService } from '../services/floor.service';
import List from './list';
import { observer } from 'mobx-react';
import { useObservable, useObserver } from 'mobx-react-lite';

const FloorDeleteDialog = ({children}) => {
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
                body: "Delete Floor",
                isHeader: true,
              },
              {
                key: 'description',
                body: "The floor will be removed completely and the changes can't be reverted",
              },
              {
                key: 'action',
                body: "Yes, Remove",
                onClick: async () => {
                  await floorService.deleteFloor(floorService.floor.data.id);
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

export default observer(FloorDeleteDialog);