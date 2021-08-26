import React from 'react';
import Button from '@material-ui/core/Button';
import { ReactComponent as MatchaIcon } from "../assets/images/logo.svg";
import '../assets/stylesheets/Components.css';

function NavBar() {

  return (
    <div id="NavBar">
      <Button edge="start" color="inherit" aria-label="menu">
        <MatchaIcon/>
      </Button>
      <Button variant="contained" color="primary">Log in</Button>
    </div>
  );
}

export default NavBar;

