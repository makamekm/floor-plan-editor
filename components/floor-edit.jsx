import React from 'react'
import { observer } from 'mobx-react'
import { useInstance } from 'react-ioc'
import InlineTextEdit from './inline-text-edit';
import { FloorEditService } from '../services/floor-edit.service';
import FloorDeleteDialog from './floor-delete-dialog';
import List from './list';

const FloorEdit = () => {
  const floorEditService = useInstance(FloorEditService);

  return (
    <FloorDeleteDialog>
      {open => <List borderRadius="5px">
        {
          [
            {
              key: 'name-header',
              body: "Floor name",
              isHeader: true,
            },
            {
              key: 'name',
              body: (
                <InlineTextEdit
                  placeholder="Write name..."
                  value={floorEditService.data.name}
                  onChange={value => {
                    if (value.length > 0) {
                      floorEditService.data.name = value;
                    }
                  }}
                />
              ),
              isField: true,
            },
            {
              key: 'operations',
              body: "Operations",
              isHeader: true,
            },
            {
              key: 'delete',
              body: "Delete",
              onClick: () => open(),
              isClickable: true,
            }
          ]
        }
      </List>}
    </FloorDeleteDialog>
  )
}

export default observer(FloorEdit)
