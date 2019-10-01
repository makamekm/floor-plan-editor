import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import List from "./list";
import WindowPanel from "./window-panel";

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
      <List borderRadius="5px">
        {
          [
            {
              key: "header",
              body: "Delete Project",
              isHeader: true,
            },
            {
              key: "description",
              body: "The project will be removed completely and the changes can't be reverted",
            },
            {
              key: "action",
              body: "Yes, Remove",
              onClick: onDeleteProject,
              isClickable: true,
            },
          ]
        }
      </List>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectDeleteDialog));
