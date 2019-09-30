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

      <style jsx>{`
        .list {
          width: calc(100vw - 20px);
          max-width: 400px;
          overflow: auto;
          max-height: calc(var(--vh, 1vh) * 100 - 20px);
        }
      `}</style>
    </>
  );
};

export default memo(observer(LoginPanel));
