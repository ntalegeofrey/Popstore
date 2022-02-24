import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import firebase from "../../service/firebase";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("poolfarm_user_id");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div onClick={handleLogout}>
      <div>
        <Avatar alt="Remy Sharp" src={user} sx={{ width: 56, height: 56 }} />
        <Typography variant="p">Logout</Typography>
      </div>
    </div>
  );
};

export default LogoutButton;
