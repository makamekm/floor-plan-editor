import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { LogoutIcon } from "../icons/icon";
import { FloorRouterService } from "../services/floor-router.service";
import { ProjectListService } from "../services/project-list.service";
import { UserService } from "../services/user.service";
import ListItem from "./list-item";
import WithIcon from "./with-icon";

const ProjectList = () => {
  const userService = useInstance(UserService);
  const projectListService = useInstance(ProjectListService);
  const floorRouterService = useInstance(FloorRouterService);
  const onLogout = useCallback(() => {
    userService.logout();
  }, []);
  const onOpenProject = useCallback((id: string | number) => {
    floorRouterService.openProject(id);
  }, []);

  return (
    <>
      <ListItem borderRadius="5px" onClick={onLogout} hasDivider>
        <WithIcon icon={LogoutIcon}>
          Logout
        </WithIcon>
      </ListItem>
      {projectListService.list.map(({id, name}) => {
        return <ListItem
          borderRadius="5px"
          key={id}
          metadata={id}
          onClick={onOpenProject}>
          {name}
        </ListItem>;
      })}
    </>
  );
};

export default memo(observer(ProjectList));
