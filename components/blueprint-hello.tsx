import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useEffect, useRef } from "react";
import { useInstance } from "react-ioc";
import Sidebar from "react-sidebar";
import { Blueprint } from "../models/blueprint";
import { ItemArray, ItemNameDict } from "../models/floorplan-entities/item.dict";
import { ItemEnum } from "../models/floorplan-entities/item.enum";
import { BlueprintService } from "../services/blueprint.service";
import { UserService } from "../services/user.service";
import InlineTextEdit from "./inline-text-edit";
import InlineTextareaEdit from "./inline-textarea-edit";
import List from "./list";
import LoginPanel from "./login-panel";
import Panel from "./panel";
import ProjectCreateDialog from "./project-create-dialog";
import ProjectPanel from "./project-panel";
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
];

const BlueprintView = () => {
  const isToolbarOpen = useObservable({value: false});
  const canvasRef = useRef(null);
  const blueprintService = useInstance(BlueprintService);
  const userService = useInstance(UserService);

  useEffect(() => {
    const blueprint = new Blueprint(canvasRef.current);
    blueprintService.setBlueprint(blueprint);
    return () => {
      blueprintService.destructor();
    };
  }, []);

  return (<ProjectCreateDialog>{(open) =>
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
      onSetOpen={(open: boolean) => isToolbarOpen.value = open}
      sidebar={
        <List onClick={(item) => {
          blueprintService.addItem(item.key as ItemEnum);
          isToolbarOpen.value = false;
        }}>
          {ItemArray.map((key) => ({
            key,
            body: (<>+ &nbsp;{ItemNameDict[key]}</>),
            isClickable: true,
          }))}
        </List>
      }
    >
      <div className="view">
        <canvas
          ref={canvasRef}
        />

        <div className="mode-panel">
          <ToggleButtonType
            activeState={blueprintService.mode}
            items={itemTypeList}
            onToggle={(mode) => blueprintService.changeMode(mode as string)}
          />
        </div>

        <div className="items-panel">
          <Panel>
            <div className="list-overflow">
              <List borderRadius="5px" onClick={(item) => {
                blueprintService.addItem(item.key as ItemEnum);
              }}>
                {ItemArray.map((item) => ({
                  key: item,
                  body: (<>+ &nbsp;{ItemNameDict[item]}</>),
                  isClickable: true,
                }))}
              </List>
            </div>
          </Panel>
        </div>

        <div className="property-panel">
          {blueprintService.selected ? <Panel>
            <List borderRadius="5px">
              {[
                {
                  key: "header",
                  body: ItemNameDict[blueprintService.selected.type as ItemEnum],
                  isHeader: true,
                },
                {
                  key: "name",
                  body: (
                    <InlineTextEdit
                      placeholder="Write Name..."
                      value={blueprintService.selected.name}
                      onChange={(value) => {
                        blueprintService.selected.name = value;
                        blueprintService.applyChanges();
                      }}
                    />
                  ),
                  isField: true,
                },
                {
                  key: "header-description",
                  body: "Description",
                  isHeader: true,
                },
                {
                  key: "description",
                  body: (
                    <InlineTextareaEdit
                      borderRadius="0 0 5px 5px"
                      placeholder="Write Description..."
                      value={blueprintService.selected.description}
                      onChange={(value) => {
                        blueprintService.selected.description = value;
                        blueprintService.applyChanges();
                      }}
                    />
                  ),
                  isField: true,
                },
              ]}
            </List>
          </Panel> : null}
        </div>

        {userService.loading ? null : (
          <div className="floor-panel">
            {!userService.user ? <LoginPanel/> : <ProjectPanel/>}
          </div>
        )}

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
            width: 230px;
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
  }</ProjectCreateDialog>);
};

export default memo(observer(BlueprintView));
