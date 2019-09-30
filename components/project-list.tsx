import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { LogoutIcon } from "../icons/icon";
import { FloorRouterService } from "../services/floor-router.service";
import { ProjectListService } from "../services/project-list.service";
import { UserService } from "../services/user.service";
import WithIcon from "./with-icon";
import List from "./list";

const ProjectList = () => {
  const userService = useInstance(UserService);
  const projectListService = useInstance(ProjectListService);
  const floorRouterService = useInstance(FloorRouterService);

  return (
    <>
      <List borderRadius="5px">
        {[
          {
            key: 'logout',
            body: (
              <WithIcon icon={LogoutIcon}>
                Logout
              </WithIcon>
            ),
            onClick: () => userService.logout(),
            isClickable: true,
            hasDivider: true,
          },
          ...projectListService.list.map(({id, name}) => {
            return {
              key: id,
              body: name,
              isClickable: true,
              onClick: () => floorRouterService.openProject(id),
            };
          }),
        ]}
      </List>
    </>
  );
};

export default memo(observer(ProjectList));
