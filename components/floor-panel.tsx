import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { EditIcon, SearchIcon } from "../icons/icon";
import { FloorEditService } from "../services/floor-edit.service";
import { FloorListService } from "../services/floor-list.service";
import { FloorService } from "../services/floor.service";
import FloorCreateDialog from "./floor-create-dialog";
import FloorEdit from "./floor-edit";
import FloorList from "./floor-list";
import Panel from "./panel";
import ToggleButtonType from "./toggle-type";
import WindowPanel from "./window-panel";

const FloorPanel = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);
  const floorEditService = useInstance(FloorEditService);

  const id = floorService.floor && floorService.floor.id;
  const isCreate = id == null;
  const name = floorService.floor.data && floorService.floor.data.name;

  return (
    <FloorCreateDialog>
      {(open) => (
        <>
          <Panel>
            <ToggleButtonType
              activeState={isCreate ? "not-save" : "save"}
              items={[{
                key: "save",
                name: isCreate ? "Save Plan" : name,
              }, !isCreate && {
                key: "edit",
                name: <div style={{lineHeight: 0}}><img src={EditIcon} alt=""/></div>,
              }, {
                key: "menu",
                name: <div style={{lineHeight: 0}}><img src={SearchIcon} alt=""/></div>,
              }].filter((s) => !!s)}
              onToggle={(key) => {
                if (key === "menu") {
                  floorListService.opened = true;
                } else if (key === "save") {
                  open();
                } else if (key === "edit") {
                  floorEditService.opened = true;
                }
              }}
            />
            <WindowPanel
              active={floorListService.opened}
              onClickOutside={() => {
                floorListService.opened = false;
              }}>
              <div className="list">
                <FloorList/>
              </div>
            </WindowPanel>
            <WindowPanel
              active={floorEditService.opened}
              onClickOutside={() => {
                floorEditService.opened = false;
              }}>
              <div className="list">
                <FloorEdit/>
              </div>
            </WindowPanel>
          </Panel>

          <style jsx>{`
            .list {
              width: calc(100vw - 20px);
              max-width: 400px;
              overflow: auto;
              max-height: calc(var(--vh, 1vh) * 100 - 20px);
            }
          `}</style>
        </>
      )}
    </FloorCreateDialog>
  );
};

export default memo(observer(FloorPanel));
