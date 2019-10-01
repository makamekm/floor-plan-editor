import React from 'react'
import BlueprintView from '../../components/blueprint';
import AuthProtect from '../../components/auth-protect';

export default () => {
  return <AuthProtect><BlueprintView/></AuthProtect>;
};
