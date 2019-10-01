import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { AddIcon, BackIcon, CopyIcon, EditIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorRouterService } from "../services/floor-router.service";
import { FloorService } from "../services/floor.service";
import { ProjectService } from "../services/project.service";
import { copyTextToClipboard } from "../utils/clipboard";
import ProjectEditDialog from "./project-edit-dialog";
import WithIcon from "./with-icon";
import ListItem from "./list-item";

const FloorList = () => {
  const floorService = useInstance(FloorService);
  const projectService = useInstance(ProjectService);
  const floorListService = useInstance(FloorListService);
  const floorRouterService = useInstance(FloorRouterService);
  const onCopy = useCallback(() => {
    copyTextToClipboard(
      window.location.origin
      + "/"
      + projectService.project.id
      + "/view/"
      + floorService.floor.id,
    );
  }, []);
  const onGetHome = useCallback(() => {
    floorRouterService.openProjectList();
  }, []);
  const onCreatePlan = useCallback(() => {
    floorRouterService.openProjectCreatePlan();
  }, []);
  const onOpenFloor = useCallback((id: string | number) => {
    floorRouterService.openFloor(id);
  }, []);

  return (
    <ProjectEditDialog>
      {(open) => <>
        <ListItem borderRadius="5px" onClick={open}>
          <WithIcon icon={EditIcon}>
            Edit Project
          </WithIcon>
        </ListItem>
        <ListItem borderRadius="5px" onClick={onCopy} isHidden={floorService.floor.id == null}>
          <WithIcon icon={CopyIcon}>
            Copy Public Link
          </WithIcon>
        </ListItem>
        <ListItem borderRadius="5px" onClick={onGetHome}>
          <WithIcon icon={BackIcon}>
            Get Home
          </WithIcon>
        </ListItem>
        <ListItem borderRadius="5px" onClick={onCreatePlan} isActive={floorService.floor.id == null} hasDivider>
          <WithIcon icon={AddIcon}>
            Create Plan
          </WithIcon>
        </ListItem>
        {...floorListService.list.map(({id, data: {name}}) => {
          return <ListItem
            key={id}
            metadata={id}
            onClick={onOpenFloor}
            isActive={id === floorService.floor.id}>
            {name}
          </ListItem>;
        })}
      </>}
    </ProjectEditDialog>
  );
};

export default memo(observer(FloorList));
