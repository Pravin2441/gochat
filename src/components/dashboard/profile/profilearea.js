import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  SwipeableDrawer,
  Button,
  List,
  Divider,
  IconButton,
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import CloseIcon from "@material-ui/icons/Close";
import ProfileSection from "./profile/profile";
const Profilearea = (props) => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
    >
      <List>
        <IconButton aria-label="account od current user" color="inherit">
          <CloseIcon
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
          ></CloseIcon>
        </IconButton>
      </List>
      <Divider />
      <List>
        <ProfileSection />
      </List>
    </div>
  );

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <IconButton aria-label="account od current user" color="inherit">
            <AccountCircle onClick={toggleDrawer(anchor, true)}></AccountCircle>
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
};
const useStyles = makeStyles({
  list: {
    width: 480,
  },
  fullList: {
    width: "auto",
  },
});
export default Profilearea;
