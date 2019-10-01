import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import WindowPanel from "./window-panel";
import ListItem from "./list-item";

const ProjectDeleteDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false, name: ""});
  const projectService = useInstance(ProjectService);

  const onClickOutside = useCallback(async () => {
    data.isOpen = false;
  }, []);

  const onDeleteProject = useCallback(async () => {
    await projectService.deleteProject();
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
      <ListItem isHeader borderRadius="5px">
        Delete Project
      </ListItem>
      <ListItem borderRadius="5px">
        The project will be removed completely and the changes can't be reverted
      </ListItem>
      <ListItem borderRadius="5px" onClick={onDeleteProject}>
        Yes, Remove
      </ListItem>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectDeleteDialog));
