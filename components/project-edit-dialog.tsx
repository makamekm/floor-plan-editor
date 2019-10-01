import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import InlineTextEdit from "./inline-text-edit";
import ListItem from "./list-item";
import ProjectDeleteDialog from "./project-delete-dialog";
import WindowPanel from "./window-panel";

const ProjectEditDialog = ({
  children,
}: {
  children: (open: () => void) => JSX.Element;
}) => {
  const data = useObservable({isOpen: false});
  const projectService = useInstance(ProjectService);
  const projectName = projectService.project && projectService.project.name;

  const onClickOutside = useCallback(async () => {
    data.isOpen = false;
  }, []);

  const onChangeProjectName = useCallback((value: string) => {
    if (value.length > 0) {
      projectService.data.project.name = value;
      projectService.saveProject();
    }
  }, []);

  return <>
    {children(() => {
      data.isOpen = true;
    })}
    <WindowPanel
      active={data.isOpen}
      onClickOutside={onClickOutside}>
      <ProjectDeleteDialog>
        {(open) => <>
          <ListItem isHeader borderRadius="5px">
            Project name
          </ListItem>
          <ListItem isField borderRadius="5px">
            <InlineTextEdit
              placeholder="Write project name..."
              value={projectName}
              onChange={onChangeProjectName}
            />
          </ListItem>
          <ListItem isHeader borderRadius="5px">
            Operations
          </ListItem>
          <ListItem borderRadius="5px" onClick={open}>
            Delete
          </ListItem>
        </>}
      </ProjectDeleteDialog>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectEditDialog));
