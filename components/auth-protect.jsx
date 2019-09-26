import React from 'react'
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react';
import { UserService } from '../services/user.service';
import LoginDialog from './login-dialog';

const AuthProtect = ({children}) => {
  const userService = useInstance(UserService);
  React.useEffect(() => {
    userService.askToLogIn = true;
    return () => {
      userService.askToLogIn = false;
    };
  }, [])

  return <>
    {!userService.user || userService.loading ? null : children}

    <LoginDialog active={userService.isOpenLoginDialog}/>
  </>;
}

export default observer(AuthProtect);