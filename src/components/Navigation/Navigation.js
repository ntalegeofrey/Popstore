import React from "react";
import { StyledAppBar, StyledToolBar } from "../Styles/styledAppBar";
import { StyledLogo } from "../Styles/styledLogo";
import { StyledNavButton } from "../Styles/styledNavButton";
import StyledLangButton from "../Styles/styledLangDropdown";

const Navigation = () => {
  return (
    <StyledAppBar position="fixed" elevation={0}>
      <StyledToolBar>
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
        <StyledNavButton variant="text" size="medium" active={false}>
          Login
        </StyledNavButton>
        <StyledLangButton />
      </StyledToolBar>
    </StyledAppBar>
  );
};

export default Navigation;
