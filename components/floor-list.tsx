import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { AddIcon, BackIcon, CopyIcon, EditIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorRouterService } from "../services/floor-router.service";
import { FloorService } from "../services/floor.service";
import { ProjectService } from "../services/project.service";
import { copyTextToClipboard } from "../utils/clipboard";
import List, { Item } from "./list";
import ProjectEditDialog from "./project-edit-dialog";
import WithIcon from "./with-icon";

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
        <List borderRadius="5px">
          {[
            {
              key: "edit",
              body: (
                <WithIcon icon={EditIcon}>
                  Edit Project
                </WithIcon>
              ),
              onClick: open,
              isClickable: true,
            },
            {
              key: "link",
              body: (
                <WithIcon icon={CopyIcon}>
                  Copy Public Link
                </WithIcon>
              ),
              onClick: onCopy,
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
              onClick: onGetHome,
              isClickable: true,
            },
            {
              key: "create",
              body: (
                <WithIcon icon={AddIcon}>
                  Create Plan
                </WithIcon>
              ),
              onClick: onCreatePlan,
              isClickable: true,
              hasDivider: true,
              isActive: floorService.floor.id == null,
            },
            ...floorListService.list.map<Item<string | number>>(({id, data: {name}}) => {
              return {
                key: id,
                body: name,
                isClickable: true,
                onClick: onOpenFloor,
                isActive: id === floorService.floor.id,
                metadata: id,
              };
            }),
          ]}
        </List>
      </>}
    </ProjectEditDialog>
  );
};

export default memo(observer(FloorList));
