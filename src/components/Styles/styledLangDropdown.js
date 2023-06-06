import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material/styles";

const DropdownButton = styled(Button)(({ theme }) => ({
  color: theme.palette.white.main,
}));

const StyledArrowDropDown = styled(KeyboardArrowDownIcon)`
  && {
    margin-left: 2px;
  }
`;

const StyledLangButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("EN");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    handleClose();
  };

  return (
    <>
      <DropdownButton
        aria-controls="dropdown-menu"
        aria-haspopup="true"
        variant="contained"
        size="small"
        onClick={handleClick}
      >
        {selectedLanguage}
        <StyledArrowDropDown />
      </DropdownButton>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "lightblue",
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
        <MenuItem onClick={() => handleLanguageSelect("EN")}>EN</MenuItem>
        <MenuItem onClick={() => handleLanguageSelect("SE")}>SE</MenuItem>
      </Menu>
    </>
  );
};

export default StyledLangButton;
