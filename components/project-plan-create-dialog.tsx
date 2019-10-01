import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
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

  const onClickOutside = useCallback(() => {
    data.isOpen = false;
  }, []);

  const onChangeProjectName = useCallback((value: string) => {
    data.projectName = value;
  }, []);

  const onChangePlanName = useCallback((value: string) => {
    data.planName = value;
  }, []);

  const onCreateProjectPlan = useCallback(async () => {
    await projectService.createProjectPlan(data.projectName, data.planName);
    data.isOpen = false;
  }, []);

  return <>
    {children(() => {
      data.isOpen = true;
      data.projectName = "";
      data.planName = "";
    })}
    <WindowPanel
      active={data.isOpen}
      onClickOutside={onClickOutside}>
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
                  onChange={onChangeProjectName}
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
                  onChange={onChangePlanName}
                />
              ),
              isField: true,
            },
            {
              key: "action",
              body: "Create",
              onClick: onCreateProjectPlan,
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
