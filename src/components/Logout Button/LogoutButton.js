import React from "react";
import { useSelector } from "react-redux";
const LogoutButton = () => {
  const user = useSelector((state) => state.user.userInfo);
  console.log(user);
  return <div></div>;
};

export default LogoutButton;
