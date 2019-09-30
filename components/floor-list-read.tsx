import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { BackIcon, CopyIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorService } from "../services/floor.service";
import { copyTextToClipboard } from "../utils/clipboard";
import WithIcon from "./with-icon";
import { FloorRouterService } from "../services/floor-router.service";
import List from "./list";

const FloorListRead = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);
  const floorRouterService = useInstance(FloorRouterService);

  return <>
    <List borderRadius="5px">
      {[
        {
          key: 'link',
          body: (
            <WithIcon icon={CopyIcon}>
              Copy Public Link
            </WithIcon>
          ),
          onClick: () => () => {
            copyTextToClipboard(window.location.href);
          },
          isClickable: true,
          isHidden: floorService.floor.id == null,
          hasDivider: true,
        },
        {
          key: 'projects',
          body: (
            <WithIcon icon={BackIcon}>
              Get Home
            </WithIcon>
          ),
          onClick: () => floorRouterService.openProjectList(),
          isClickable: true,
        },
        ...floorListService.list.map(({id, data: {name}}) => {
          return {
            key: id,
            body: name,
            isClickable: true,
            onClick: () => floorRouterService.openPublicFloor(id),
            isActive: id === floorService.floor.id,
          };
        }),
      ]}
    </List>
  </>;
};

export default memo(observer(FloorListRead));
