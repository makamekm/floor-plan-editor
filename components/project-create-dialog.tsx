import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import InlineTextEdit from "./inline-text-edit";
import ListItem from "./list-item";
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
      <ListItem isHeader borderRadius="5px">
        Create Project
      </ListItem>
      <ListItem isField borderRadius="5px">
        <InlineTextEdit
          placeholder="Write project name..."
          value={data.projectName}
          onChange={onChangeProjectName}
        />
      </ListItem>
      <ListItem borderRadius="5px" onClick={onCreateProject} isDisabled={data.projectName.length < 1}>
        Create
      </ListItem>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectCreateDialog));
