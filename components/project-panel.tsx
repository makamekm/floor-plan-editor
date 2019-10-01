import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { SearchIcon } from "../icons/icon";
import { BlueprintService } from "../services/blueprint.service";
import { ProjectListService } from "../services/project-list.service";
import Panel from "./panel";
import ProjectCreateDialog from "./project-create-dialog";
import ProjectList from "./project-list";
import ProjectPlanCreateDialog from "./project-plan-create-dialog";
import ToggleButtonType from "./toggle-type";
import WindowPanel from "./window-panel";

const ProjectPanel = () => {
  const floorListService = useInstance(ProjectListService);
  const blueprintService = useInstance(BlueprintService);

  const onClickOutside = useCallback(() => {
    floorListService.opened = false;
  }, []);

  // const onToggle = useCallback((key: string) => {
  //   if (key === "menu") {
  //     floorListService.opened = true;
  //   } else if (key === "save") {
  //     if (blueprintService.hasPlan) {
  //       openProjectPlanCreate();
  //     } else {
  //       openProjectCreate();
  //     }
  //   }
  // }, []);

  return (
    <ProjectPlanCreateDialog>{(openProjectPlanCreate) => (
      <ProjectCreateDialog>{(openProjectCreate) => (
        <>
          <Panel>
            <ToggleButtonType
              items={[{
                key: "save",
                name: "Create Project",
              }, {
                key: "menu",
                name: <div style={{lineHeight: 0}}><img src={SearchIcon} alt=""/></div>,
              }]}
              onToggle={(key) => {
                if (key === "menu") {
                  floorListService.opened = true;
                } else if (key === "save") {
                  if (blueprintService.hasPlan) {
                    openProjectPlanCreate();
                  } else {
                    openProjectCreate();
                  }
                }
              }}
            />
            <WindowPanel
              active={floorListService.opened}
              onClickOutside={onClickOutside}>
              <div className="list">
                <ProjectList/>
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
      )}</ProjectCreateDialog>
    )}</ProjectPlanCreateDialog>
  );
};

export default memo(observer(ProjectPanel));
