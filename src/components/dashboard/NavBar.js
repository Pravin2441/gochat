import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { AccountCircle } from "@material-ui/icons";
import ProfileArea from "./profilearea";
const NavBar = (props) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.menubackground}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            GoChat
          </Typography>

          <div>
            <IconButton aria-label="account od current user" color="inherit">
              <ProfileArea />
            </IconButton>

            <IconButton aria-label="account od current user" color="inherit">
              <ExitToAppIcon></ExitToAppIcon>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menubackground: {
    background: "linear-gradient(45deg,#0575E6 30%, #FF8E53 90%)",
  },
  title: {
    flexGrow: 1,
  },
}));
export default NavBar;
