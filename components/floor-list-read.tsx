import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { BackIcon, CopyIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorRouterService } from "../services/floor-router.service";
import { FloorService } from "../services/floor.service";
import { copyTextToClipboard } from "../utils/clipboard";
import WithIcon from "./with-icon";
import ListItem from "./list-item";

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
    <ListItem borderRadius="5px" onClick={onCopy} isHidden={floorService.floor.id == null}>
      <WithIcon icon={CopyIcon}>
        Copy Public Link
      </WithIcon>
    </ListItem>
    <ListItem borderRadius="5px" onClick={onGetHome} hasDivider>
      <WithIcon icon={BackIcon}>
        Get Home
      </WithIcon>
    </ListItem>
    {floorListService.list.map(({id, data: {name}}) => {
      return <ListItem
        key={id}
        metadata={id}
        onClick={onOpenPublicFloor}
        isActive={id === floorService.floor.id}>
        {name}
      </ListItem>;
    })}
  </>;
};

export default memo(observer(FloorListRead));
