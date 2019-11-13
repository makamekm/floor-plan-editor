import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { useInstance } from "react-ioc";
import Sidebar from "react-sidebar";
import { Blueprint } from "../models/blueprint";
import { ItemArray, ItemNameDict } from "../models/floorplan-entities/item.dict";
import { ItemEnum } from "../models/floorplan-entities/item.enum";
import { BlueprintService } from "../services/blueprint.service";
import FloorPanel from "./floor-panel";
import ItemProperty from "./item-property";
import ListItem from "./list-item";
import Panel from "./panel";
import ToggleButtonType from "./toggle-type";
const itemTypeList = [
  {
    key: "move",
    name: "Move",
  },
  {
    key: "draw",
    name: "Draw",
  },
  {
    key: "delete",
    name: "Delete",
  },
  {
    key: "zoomIn",
    name: "Zoom in",
    onClick: function() {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const context = canvas.getContext("2d");
    }
  },
  {
    key: "zoomOut",
    name: "Zoom out",
    onClick: function() {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const contex = canvas.getContext("2d");
    }
  },
];

const BlueprintView = () => {
  const isToolbarOpen = useObservable({value: false});
  const canvasRef = useRef(null);
  const blueprintService = useInstance(BlueprintService);

  useEffect(() => {
    const blueprint = new Blueprint(canvasRef.current);
    blueprintService.setBlueprint(blueprint);
    return () => {
      blueprintService.destructor();
    };
  }, []);

  const onToggleSidebar = useCallback((open: boolean) => {
    isToolbarOpen.value = open;
  }, []);

  const onAddItem = useCallback((key: ItemEnum) => {
    blueprintService.addItem(key);
    isToolbarOpen.value = false;
  }, []);

  const onToggleMode = useCallback((mode: string | number) => {
    blueprintService.changeMode(mode as string);
  }, []);

  return (
    <Sidebar
      pullRight
      styles={{
        sidebar: {
          background: "white",
          overflowY: "auto",
          maxHeight: "calc(var(--vh, 1vh) * 100)",
        },
        content: {
          overflowY: "hidden",
          maxHeight: "calc(var(--vh, 1vh) * 100)",
        },
      }}
      open={isToolbarOpen.value}
      onSetOpen={onToggleSidebar}
      sidebar={
        <>
          {ItemArray.map((key) => <ListItem
            key={key}
            metadata={key}
            onClick={onAddItem}>
            + &nbsp;{ItemNameDict[key]}
          </ListItem>)}
        </>
      }
    >
      <div className="view">
        <canvas
          ref={canvasRef} id="canvas"
        />

        <div className="mode-panel">
          <ToggleButtonType
            activeState={blueprintService.mode}
            items={itemTypeList}
            onToggle={onToggleMode}
          />
        </div>

        <div className="items-panel">
          <Panel>
            <div className="list-overflow">
              {ItemArray.map((key) => <ListItem
                key={key}
                borderRadius="5px"
                metadata={key}
                onClick={onAddItem}>
                + &nbsp;{ItemNameDict[key]}
              </ListItem>)}
            </div>
          </Panel>
        </div>

        <div className="property-panel">
          {blueprintService.selected ? <Panel>
            <ItemProperty/>
          </Panel> : null}
        </div>

        <div className="floor-panel">
          <FloorPanel/>
        </div>

        <style jsx>{`
          .view {
            position: relative;
            width: 100vw;
            height: calc(var(--vh, 1vh) * 100);
          }

          .list-overflow {
            overflow: auto;
            max-height: calc(var(--vh, 1vh) * 100 - 20px);
          }

          .mode-panel {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          }

          .items-panel {
            position: absolute;
            top: 20px;
            right: 20px;
            border-radius: 5px;
            width: 300px;
          }

          .property-panel {
            position: absolute;
            top: 20px;
            left: 20px;
            border-radius: 5px;
            width: 300px;
          }

          .floor-panel {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            max-width: calc(100vw - 40px);
            width: 270px;
          }

          @media (max-width: 900px) {
            .items-panel {
              display: none;
            }

            .property-panel {
              top: 80px;
              right: 20px;
              width: unset;
            }
          }
        `}</style>
      </div>
    </Sidebar>
  );
};

export default memo(observer(BlueprintView));
