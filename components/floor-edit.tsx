import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { FloorService } from "../services/floor.service";
import FloorDeleteDialog from "./floor-delete-dialog";
import InlineTextEdit from "./inline-text-edit";
import ListItem from "./list-item";

const FloorEdit = () => {
  const floorService = useInstance(FloorService);
  const onChangeName = useCallback((value: string) => {
    if (value.length > 0) {
      floorService.floor.data.name = value;
      floorService.saveState();
    }
  }, []);

  return (
    <FloorDeleteDialog>
      {(open) => <>
        <ListItem isHeader borderRadius="5px">
          Floor name
        </ListItem>
        <ListItem isField borderRadius="5px">
          <InlineTextEdit
            placeholder="Write name..."
            value={floorService.floor.data && floorService.floor.data.name || ""}
            onChange={onChangeName}
          />
        </ListItem>
        <ListItem isHeader borderRadius="5px">
          Operations
        </ListItem>
        <ListItem borderRadius="5px" onClick={open}>
          Delete
        </ListItem>
      </>}
    </FloorDeleteDialog>
  );
};

export default memo(observer(FloorEdit));
