import React from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const LogoutButton = ({user}) => {
  return (
    <div>
      <div>
        <Avatar
          alt="Remy Sharp"
          src={user}
          sx={{ width: 56, height: 56 }}
        />
        <Typography variant="p">
          Logout
        </Typography>
      </div>
    </div>
  );
};

export default LogoutButton;
