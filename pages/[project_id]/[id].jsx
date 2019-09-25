import React from 'react'
import Root from '../../components/root'
import BlueprintView from '../../components/blueprint';
import AuthProtect from '../../components/auth-protect';

const Page = () => {
  return <AuthProtect><BlueprintView/></AuthProtect>;
};

export default Root(Page);
