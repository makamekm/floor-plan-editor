import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
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
                  onChange={onChangeName}
                />
              ),
              isField: true,
            },
            {
              key: "action",
              body: "Create",
              onClick: onCreateFloor,
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
