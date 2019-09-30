import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import InlineTextEdit from "./inline-text-edit";
import List from "./list";
import WindowPanel from "./window-panel";

const ProjectPlanCreateDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false, projectName: "", planName: ""});
  const projectService = useInstance(ProjectService);

  return <>
    {children(() => {
      data.isOpen = true;
      data.projectName = "";
      data.planName = "";
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
              body: "Create Project",
              isHeader: true,
            },
            {
              key: "projectName",
              body: (
                <InlineTextEdit
                  placeholder="Write project name..."
                  value={data.projectName}
                  onChange={(value) => {
                    data.projectName = value;
                  }}
                />
              ),
              isField: true,
            },
            {
              key: "planName",
              body: (
                <InlineTextEdit
                  placeholder="Write plan name..."
                  value={data.planName}
                  onChange={(value) => {
                    data.planName = value;
                  }}
                />
              ),
              isField: true,
            },
            {
              key: "action",
              body: "Create",
              onClick: async () => {
                await projectService.createProjectPlan(data.projectName, data.planName);
                data.isOpen = false;
              },
              isDisabled: data.projectName.length < 1 || data.planName.length < 1,
              isClickable: true,
            },
          ]
        }
      </List>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectPlanCreateDialog));
