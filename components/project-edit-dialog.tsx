import { observer } from "mobx-react";
import { useObservable } from "mobx-react-lite";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { ProjectService } from "../services/project.service";
import InlineTextEdit from "./inline-text-edit";
import List from "./list";
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

  const onDeleteProject = useCallback((value: string) => {
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
        {(open) => <List borderRadius="5px">
          {
            [
              {
                key: "name-header",
                body: "Project name",
                isHeader: true,
              },
              {
                key: "name",
                body: (
                  <InlineTextEdit
                    placeholder="Write project name..."
                    value={projectName}
                    onChange={onDeleteProject}
                  />
                ),
                isField: true,
              },
              {
                key: "operations",
                body: "Operations",
                isHeader: true,
              },
              {
                key: "delete",
                body: "Delete",
                onClick: open,
                isClickable: true,
              },
            ]
          }
        </List>}
      </ProjectDeleteDialog>
    </WindowPanel>
  </>;
};

export default memo(observer(ProjectEditDialog));
