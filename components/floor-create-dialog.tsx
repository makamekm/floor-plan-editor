import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { FloorService } from "../services/floor.service";
import InlineTextEdit from "./inline-text-edit";
import List from "./list";
import WindowPanel from "./window-panel";

const FloorCreateDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false, name: ""});
  const floorService = useInstance(FloorService);

  return <>
    {children(() => {
      data.isOpen = true;
      data.name = "";
    })}
    <WindowPanel
      active={data.isOpen}
      onClickOutside={() => {
        data.isOpen = false;
      }}>
      <List borderRadius="5px">
        {
          [
            {
              key: "header",
              body: "Create Floor",
              isHeader: true,
            },
            {
              key: "name",
              body: (
                <InlineTextEdit
                  placeholder="Write floor name..."
                  value={data.name}
                  onChange={(value) => {
                    data.name = value;
                  }}
                />
              ),
              isField: true,
            },
            {
              key: "action",
              body: "Create",
              onClick: async () => {
                await floorService.createFloor(data.name);
                data.isOpen = false;
              },
              isDisabled: data.name.length < 1,
              isClickable: true,
            },
          ]
        }
      </List>
    </WindowPanel>
  </>;
};

export default memo(observer(FloorCreateDialog));
