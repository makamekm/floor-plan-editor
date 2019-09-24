import React from 'react'
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import List from './list';
import { observer } from 'mobx-react';
import { useObservable, useObserver } from 'mobx-react-lite';
import { ProjectService } from '../services/project.service';

const ProjectDeleteDialog = ({children}) => {
  const data = useObservable({isOpen: false, name: ""});
  const projectService = useInstance(ProjectService);

  return <>
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
              body: "Delete Project",
              isHeader: true,
            },
            {
              key: 'description',
              body: "The project will be removed completely and the changes can't be reverted",
            },
            {
              key: 'action',
              body: "Yes, Remove",
              onClick: async () => {
                await projectService.deleteProject();
                data.isOpen = false;
              },
              isClickable: true,
            }
          ]
        }
      </List>
    </WindowPanel>
  </>
}

export default observer(ProjectDeleteDialog);