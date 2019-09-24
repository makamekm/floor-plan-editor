import React from 'react'
import Root from '../../components/root'
import BlueprintView from '../../components/blueprint';
import Loading from '../../components/loading';
import { useInstance } from 'react-ioc';
import { FloorService } from '../../services/floor.service';
import { useObserver } from 'mobx-react';
import { ProjectService } from '../../services/project.service';
import { FloorListService } from '../../services/floor-list.service';
import AuthProtect from '../../components/auth-protect';

const Page = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);
  const projectService = useInstance(ProjectService);

  return useObserver(() =>
    <AuthProtect>
      <BlueprintView/>

      <Loading active={
        floorService.loading
        || floorListService.loading
        || projectService.loading
      }></Loading>
    </AuthProtect>
  );
};

export default Root(Page);
