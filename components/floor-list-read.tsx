import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { BackIcon, CopyIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorRouterService } from "../services/floor-router.service";
import { FloorService } from "../services/floor.service";
import { copyTextToClipboard } from "../utils/clipboard";
import List, { Item } from "./list";
import WithIcon from "./with-icon";

const FloorListRead = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);
  const floorRouterService = useInstance(FloorRouterService);
  const onCopy = useCallback(() => {
    copyTextToClipboard(window.location.href);
  }, []);
  const onGetHome = useCallback(() => {
    floorRouterService.openProjectList();
  }, []);
  const onOpenPublicFloor = useCallback((id: string | number) => {
    floorRouterService.openPublicFloor(id);
  }, []);

  return <>
    <List borderRadius="5px">
      {[
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
          hasDivider: true,
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
        ...floorListService.list.map<Item<string | number>>(({id, data: {name}}) => {
          return {
            key: id,
            body: name,
            isClickable: true,
            onClick: onOpenPublicFloor,
            isActive: id === floorService.floor.id,
            metadata: id,
          };
        }),
      ]}
    </List>
  </>;
};

export default memo(observer(FloorListRead));
