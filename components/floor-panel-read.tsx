import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { SearchIcon } from "../icons/icon";
import { FloorListService } from "../services/floor-list.service";
import { FloorService } from "../services/floor.service";
import FloorListRead from "./floor-list-read";
import Panel from "./panel";
import ToggleButtonType from "./toggle-type";
import WindowPanel from "./window-panel";

const FloorPanelRead = () => {
  const floorService = useInstance(FloorService);
  const floorListService = useInstance(FloorListService);

  const name = floorService.floor.data && floorService.floor.data.name;

  return <>
    <Panel>
      <ToggleButtonType
        activeState={"name"}
        items={[{
          key: "name",
          name,
        }, {
          key: "menu",
          name: <div style={{lineHeight: 0}}><img src={SearchIcon} alt=""/></div>,
        }]}
        onToggle={(key) => {
          if (key === "menu") {
            floorListService.opened = true;
          }
        }}
      />
      <WindowPanel
        active={floorListService.opened}
        onClickOutside={() => {
          floorListService.opened = false;
        }}>
        <div className="list">
          <FloorListRead/>
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
  </>;
};

export default memo(observer(FloorPanelRead));
