import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { AddIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorRouterService } from "../services/floor-router.service";
import { FloorService } from "../services/floor.service";
import ListItem from "./list-item";
import WithIcon from "./with-icon";

const FloorList = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);
  const floorRouterService = useInstance(FloorRouterService);
  const onCreatePlan = useCallback(() => {
    floorRouterService.openHome();
  }, []);
  const onOpenFloor = useCallback((id: string | number) => {
    floorRouterService.openFloor(id);
  }, []);

  return (
    <>
      <ListItem borderRadius="5px" onClick={onCreatePlan} isActive={floorService.floor.id == null} hasDivider>
        <WithIcon icon={AddIcon}>
          Create Plan
        </WithIcon>
      </ListItem>
      {floorListService.list.map(({id, data: {name}}) => (
        <ListItem
          key={id}
          metadata={id}
          onClick={onOpenFloor}
          isActive={id === floorService.floor.id}>
          {name}
        </ListItem>
      ))}
    </>
  );
};

export default memo(observer(FloorList));
