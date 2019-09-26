import React, { memo } from 'react'
import { observer } from 'mobx-react'
import { useInstance } from 'react-ioc'
import InlineTextEdit from './inline-text-edit';
import ProjectDeleteDialog from './project-delete-dialog';
import List from './list';
import { ProjectService } from '../services/project.service';
import { useObservable } from 'mobx-react-lite';
import WindowPanel from './window-panel';

const ProjectEditDialog = ({
  children
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false});
  const projectService = useInstance(ProjectService);
  const projectName = projectService.project && projectService.project.name;

  return <>
    {children(() => {
      data.isOpen = true;
    })}
    <WindowPanel
      active={data.isOpen}
      onClickOutside={() => {
        data.isOpen = false;
      }}>
      <ProjectDeleteDialog>
        {open => <List borderRadius="5px">
          {
            [
              {
                key: 'name-header',
                body: "Project name",
                isHeader: true,
              },
              {
                key: 'name',
                body: (
                  <InlineTextEdit
                    placeholder="Write project name..."
                    value={projectName}
                    onChange={value => {
                      if (value.length > 0) {
                        projectService.data.project.name = value;
                        projectService.saveProject();
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
      </ProjectDeleteDialog>
    </WindowPanel>
  </>
}

export default memo(observer(ProjectEditDialog))
