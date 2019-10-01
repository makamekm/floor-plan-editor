import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { FloorService } from "../services/floor.service";
import WindowPanel from "./window-panel";
import ListItem from "./list-item";

const FloorDeleteDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false, name: ""});
  const floorService = useInstance(FloorService);
  const onClickOutside = useCallback(() => {
    data.isOpen = false;
  }, []);
  const onDeleteFloor = useCallback(async () => {
    await floorService.deleteFloor();
    data.isOpen = false;
  }, []);

  return <>
    {children(() => {
      data.isOpen = true;
      data.name = "";
    })}
    <WindowPanel
      active={data.isOpen}
      onClickOutside={onClickOutside}>
      <ListItem isHeader borderRadius="5px">
        Delete Floor
      </ListItem>
      <ListItem borderRadius="5px">
        The floor will be removed completely and the changes can't be reverted
      </ListItem>
      <ListItem borderRadius="5px" onClick={onDeleteFloor}>
        Yes, Remove
      </ListItem>
    </WindowPanel>
  </>;
};

export default memo(observer(FloorDeleteDialog));
