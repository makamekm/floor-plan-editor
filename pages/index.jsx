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
import LogoutIcon from "../icons/logout.svg"
import { UserService } from '../services/user.service';
import AuthProtect from '../components/auth-protect';

const Page = () => {
  const projectListService = useInstance(ProjectListService);
  const projectService = useInstance(ProjectService);
  const userService = useInstance(UserService);

  return useObserver(() => <AuthProtect>
    <ProjectCreateDialog>
      {open =>
        <>
          <div>
            <List>
              {[
                {
                  key: 'login',
                  body: <WithIcon icon={LogoutIcon}>
                    Logout ({userService.user.displayName})
                  </WithIcon>,
                  isClickable: true,
                  onClick: () => userService.logout(),
                },
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
    </AuthProtect>
  );
};

export default Root(Page);
