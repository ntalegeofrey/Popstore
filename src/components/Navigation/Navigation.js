import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { StyledAppBar, StyledToolBar } from "../Styles/styledAppBar";
import { StyledLogo } from "../Styles/styledLogo";
import { StyledNavButton } from "../Styles/styledNavButton";
import StyledLangButton from "../Styles/styledLangDropdown";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, Menu, MenuItem } from "@mui/material";
import firebase, { signInWithGoogle, logout } from "../../service/firebase";
import LoginPopup from "./../Styles/styledLoginPopUp";

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [_, setRerenderPage] = useState(null);
  const [isOpen, setOpenPopup] = useState(false);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = async () => {
    await logout();
    setRerenderPage({});
  };
  const handleClosePopup = () => setOpenPopup(false);

  const handleLoginLogout = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      handleLogout();
      return;
    }
    setOpenPopup(true);
    setRerenderPage({});
  };

  const handleLogin = async () => {
    await signInWithGoogle();
    handleClosePopup();
    setRerenderPage({});
  };

  const isUserLoggedIn = () => {
    const user = firebase.auth().currentUser;
    return user !== null;
  };

  const LoginLogoutBtn = () => {
    return (
      <StyledNavButton
        variant="text"
        size="medium"
        active={false}
        onClick={() => handleLoginLogout()}
      >
        {isUserLoggedIn() ? "Logout" : "Login"}
      </StyledNavButton>
    );
  };

  const renderMobileNav = () => {
    return (
      <>
        <StyledLogo variant="h3">POPSTORE</StyledLogo>
        <IconButton
          onClick={handleMenuClick}
          aria-controls="mobile-menu"
          aria-haspopup="true"
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="mobile-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#fff",
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem>
            <StyledNavButton variant="text" size="medium" active={false}>
              Home
            </StyledNavButton>
          </MenuItem>
          <MenuItem>
            <StyledNavButton variant="text" size="medium" active={true}>
              Dashboard
            </StyledNavButton>
          </MenuItem>
          <MenuItem>
            <StyledNavButton variant="text" size="medium" active={false}>
              Contact
            </StyledNavButton>
          </MenuItem>
          <MenuItem>
            <LoginLogoutBtn />
          </MenuItem>
          <MenuItem>
            <StyledLangButton />
          </MenuItem>
        </Menu>
      </>
    );
  };

  const renderDesktopNav = () => {
    return (
      <>
        <StyledLogo variant="h3">POPSTORE</StyledLogo>
        <StyledNavButton variant="text" size="medium" active={false}>
          Home
        </StyledNavButton>
        <StyledNavButton variant="text" size="medium" active={true}>
          Dashboard
        </StyledNavButton>
        <StyledNavButton variant="text" size="medium" active={false}>
          Contact
        </StyledNavButton>
        <LoginLogoutBtn />
        <StyledLangButton />
      </>
    );
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <StyledToolBar>
        {isMobile ? renderMobileNav() : renderDesktopNav()}
      </StyledToolBar>
      <LoginPopup
        open={isOpen}
        onClose={handleClosePopup}
        saveSheet={handleLogin}
      />
    </StyledAppBar>
  );
};

export default Navigation;
