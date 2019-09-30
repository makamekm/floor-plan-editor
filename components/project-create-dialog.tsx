import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import InlineTextEdit from "./inline-text-edit";
import List from "./list";
import WindowPanel from "./window-panel";

const ProjectCreateDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false, projectName: ""});
  const projectService = useInstance(ProjectService);

  const onClickOutside = useCallback(() => {
    data.isOpen = false;
  }, []);

  const onChangeProjectName = useCallback((value: string) => {
    data.projectName = value;
  }, []);

  const onCreateProject = useCallback(async () => {
    await projectService.createProject(data.projectName);
    data.isOpen = false;
  }, []);

  return <>
    {children(() => {
      data.isOpen = true;
      data.projectName = "";
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
              key: "name",
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
              key: "action",
              body: "Create",
              onClick: onCreateProject,
              isDisabled: data.projectName.length < 1,
              isClickable: true,
            },
          ]
        }
      </List>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectCreateDialog));
