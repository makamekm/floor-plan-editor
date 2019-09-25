import React from 'react'
import WindowPanel from './window-panel';
import { useInstance } from 'react-ioc';
import List from './list';
import { observer } from 'mobx-react';
import { useObservable } from 'mobx-react-lite';
import InlineTextEdit from './inline-text-edit';
import { ProjectService } from '../services/project.service';

const ProjectCreateDialog = ({children}) => {
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
              body: "Create Project",
              isHeader: true,
            },
            {
              key: 'name',
              body: (
                <InlineTextEdit
                  placeholder="Write project name..."
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
                await projectService.createProject(data.name);
                data.isOpen = false;
              },
              isDisabled: data.name.length < 1,
              isClickable: true,
            }
          ]
        }
      </List>
    </WindowPanel>
  </>
}

export default observer(ProjectCreateDialog);