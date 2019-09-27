import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { FloorService } from "../services/floor.service";
import FloorDeleteDialog from "./floor-delete-dialog";
import InlineTextEdit from "./inline-text-edit";
import List from "./list";

const FloorEdit = () => {
  const floorService = useInstance(FloorService);

  return (
    <FloorDeleteDialog>
      {(open) => <List borderRadius="5px">
        {
          [
            {
              key: "name-header",
              body: "Floor name",
              isHeader: true,
            },
            {
              key: "name",
              body: (
                <InlineTextEdit
                  placeholder="Write name..."
                  value={floorService.floor.data && floorService.floor.data.name || ""}
                  onChange={(value) => {
                    if (value.length > 0) {
                      floorService.floor.data.name = value;
                      floorService.saveState();
                    }
                  }}
                />
              ),
              isField: true,
            },
            {
              key: "operations",
              body: "Operations",
              isHeader: true,
            },
            {
              key: "delete",
              body: "Delete",
              onClick: () => open(),
              isClickable: true,
            },
          ]
        }
      </List>}
    </FloorDeleteDialog>
  );
};

export default memo(observer(FloorEdit));
