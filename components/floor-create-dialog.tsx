import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { FloorService } from "../services/floor.service";
import InlineTextEdit from "./inline-text-edit";
import ListItem from "./list-item";
import WindowPanel from "./window-panel";

const FloorCreateDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false, name: ""});
  const floorService = useInstance(FloorService);
  const onClickOutside = useCallback(() => {
    data.isOpen = false;
  }, []);
  const onChangeName = useCallback((value: string) => {
    data.name = value;
  }, []);
  const onCreateFloor = useCallback(async () => {
    await floorService.createFloor(data.name);
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
        Create Floor
      </ListItem>
      <ListItem isField borderRadius="5px">
        <InlineTextEdit
          placeholder="Write floor name..."
          value={data.name}
          onChange={onChangeName}
        />
      </ListItem>
      <ListItem borderRadius="5px" onClick={onCreateFloor} isDisabled={data.name.length < 1}>
        Create
      </ListItem>
    </WindowPanel>
  </>;
};

export default memo(observer(FloorCreateDialog));
