import React from 'react'
import Root from '../../../components/root'
import BlueprintView from '../../../components/blueprint-read';
import Loading from '../../../components/loading';
import { useInstance } from 'react-ioc';
import { FloorService } from '../../../services/floor.service';
import { useObserver } from 'mobx-react';
import { ProjectService } from '../../../services/project.service';
import { FloorListService } from '../../../services/floor-list.service';

const Page = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);
  const projectService = useInstance(ProjectService);

  return useObserver(() =>
    <>
      <BlueprintView/>

      <Loading active={
        floorService.loading
        || floorListService.loading
        || projectService.loading
      }></Loading>
    </>
  );
};

export default Root(Page);
