import { observer } from "mobx-react";
import React, { memo } from "react";
import { useInstance } from "react-ioc";
import { UserService } from "../services/user.service";
import LoginDialog from "./login-dialog";
import Panel from "./panel";
import ToggleButtonType from "./toggle-type";

const LoginPanel = () => {
  const userService = useInstance(UserService);
  React.useEffect(() => {
    return () => {
      userService.askToLogIn = false;
    };
  }, []);

  return (
    <>
      <Panel>
        <ToggleButtonType
          items={[{
            key: "login",
            name: "Login",
          }]}
          onToggle={(key) => {
            if (key === "login") {
              userService.askToLogIn = true;
            }
          }}
        />
      </Panel>

      <LoginDialog
        active={userService.isOpenLoginDialog}
        onClickOutside={() => userService.askToLogIn = false}
        />
    </>
  );
};

export default memo(observer(LoginPanel));
