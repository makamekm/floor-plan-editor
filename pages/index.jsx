import React from 'react'
import Root from '../components/root'
import List from '../components/list'
import { useInstance } from 'react-ioc';
import { ProjectListService } from '../services/project-list.service';
import { ProjectService } from '../services/project.service';
import { useObserver } from 'mobx-react';
import Loading from '../components/loading';
import ProjectCreateDialog from '../components/project-create-dialog';
import WithIcon from '../components/with-icon';
import AddIcon from "../icons/add.svg"

const Page = () => {
  const projectListService = useInstance(ProjectListService);
  const projectService = useInstance(ProjectService);

  return useObserver(() => <ProjectCreateDialog>
    {open => 
      <>
        <div>
          <List>
            {[
              {
                key: 'create',
                body: <WithIcon icon={AddIcon}>
                  Create Project
                </WithIcon>,
                isClickable: true,
                onClick: () => open(),
              },
              ...projectListService.list.map(project => ({
                key: project.id,
                body: project.name,
                isClickable: true,
                onClick: () => {
                  projectService.openProject(project.id);
                }
              })),
            ]}
          </List>
        </div>

        <Loading active={
          projectListService.loading
          || projectService.loading
        }></Loading>
      </>}
    </ProjectCreateDialog>
  );
};

export default Root(Page);
