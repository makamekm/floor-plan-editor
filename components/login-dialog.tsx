import React, { memo } from 'react'
import Window from './window';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { UserService } from '../services/user.service';

const LoginDialog = ({active, onClickOutside}: {
  active: boolean;
  onClickOutside?: (e: React.MouseEvent) => void;
}) => {
  const userService = useInstance(UserService);

  return <>
    <Window
      active={active}
      onClickOutside={onClickOutside}>
      <StyledFirebaseAuth
        uiConfig={userService.uiConfig}
        firebaseAuth={userService.auth}/>
    </Window>
  </>
}

export default memo(observer(LoginDialog));