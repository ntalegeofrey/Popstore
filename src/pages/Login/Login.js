import React, { useEffect } from "react";
import { signInWithGoogle } from "../../service/firebase";
const Login = () => {
  useEffect(() => {
    signInWithGoogle();
  }, []);
  return <div>Login</div>;
};

export default Login;
