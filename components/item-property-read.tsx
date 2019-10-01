import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { ItemNameDict } from "../models/floorplan-entities/item.dict";
import { BlueprintService } from "../services/blueprint.service";
import ListItem from "./list-item";

const ItemProperty = () => {
  const blueprintService = useInstance(BlueprintService);

  return (
    <>
      <ListItem borderRadius="5px" isHeader>
        {ItemNameDict[blueprintService.selected.type]}
      </ListItem>
      <ListItem borderRadius="5px">
        {blueprintService.selected.name}
      </ListItem>
      <ListItem borderRadius="5px" isHeader>
        Description
      </ListItem>
      <ListItem borderRadius="5px">
        {blueprintService.selected.description}
      </ListItem>
    </>
  );
};

export default memo(observer(ItemProperty));
