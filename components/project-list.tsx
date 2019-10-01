import { observer } from "mobx-react";
import React, { memo, useCallback } from "react";
import { useInstance } from "react-ioc";
import { LogoutIcon } from "../icons/icon";
import { FloorRouterService } from "../services/floor-router.service";
import { ProjectListService } from "../services/project-list.service";
import { UserService } from "../services/user.service";
import List, { Item } from "./list";
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
      <List borderRadius="5px">
        {[
          {
            key: "logout",
            body: (
              <WithIcon icon={LogoutIcon}>
                Logout
              </WithIcon>
            ),
            onClick: onLogout,
            isClickable: true,
            hasDivider: true,
          },
          ...projectListService.list.map<Item<string | number>>(({id, name}) => {
            return {
              key: id,
              body: name,
              isClickable: true,
              metadata: id,
              onClick: onOpenProject,
            };
          }),
        ]}
      </List>
    </>
  );
};

export default memo(observer(ProjectList));
