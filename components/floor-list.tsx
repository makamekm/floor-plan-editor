import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { AddIcon, BackIcon, CopyIcon, EditIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorRouterService } from "../services/floor-router.service";
import { FloorService } from "../services/floor.service";
import { ProjectService } from "../services/project.service";
import { copyTextToClipboard } from "../utils/clipboard";
import List from "./list";
import ProjectEditDialog from "./project-edit-dialog";
import WithIcon from "./with-icon";

const FloorList = () => {
  const floorService = useInstance(FloorService);
  const projectService = useInstance(ProjectService);
  const floorListService = useInstance(FloorListService);
  const floorRouterService = useInstance(FloorRouterService);

  return (
    <ProjectEditDialog>
      {(open) => <>
        <List borderRadius="5px">
          {[
            {
              key: "edit",
              body: (
                <WithIcon icon={EditIcon}>
                  Edit Project
                </WithIcon>
              ),
              onClick: () => open(),
              isClickable: true,
            },
            {
              key: "link",
              body: (
                <WithIcon icon={CopyIcon}>
                  Copy Public Link
                </WithIcon>
              ),
              onClick: () => () => {
                copyTextToClipboard(
                  window.location.origin
                  + "/"
                  + projectService.project.id
                  + "/view/"
                  + floorService.floor.id,
                );
              },
              isClickable: true,
              isHidden: floorService.floor.id == null,
            },
            {
              key: "projects",
              body: (
                <WithIcon icon={BackIcon}>
                  Get Home
                </WithIcon>
              ),
              onClick: () => floorRouterService.openProjectList(),
              isClickable: true,
            },
            {
              key: "create",
              body: (
                <WithIcon icon={AddIcon}>
                  Create Plan
                </WithIcon>
              ),
              onClick: () => floorRouterService.openProjectCreatePlan(),
              isClickable: true,
              hasDivider: true,
              isActive: floorService.floor.id == null,
            },
            ...floorListService.list.map(({id, data: {name}}) => {
              return {
                key: id,
                body: name,
                isClickable: true,
                onClick: () => floorRouterService.openFloor(id),
                isActive: id === floorService.floor.id,
              };
            }),
          ]}
        </List>
      </>}
    </ProjectEditDialog>
  );
};

export default memo(observer(FloorList));
