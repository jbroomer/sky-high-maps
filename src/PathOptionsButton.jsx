import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import PropTypes from 'prop-types';
import pathOptions from './path-options';
const options = [pathOptions.shortestPath, pathOptions.minElevation, pathOptions.maxElevation];

const useStyles = makeStyles(theme => ({
  mobileButton: {
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    boxShadow: 'none',
  },
  gridMenu: {
    display: 'contents'
  },
  paper: {
    position: 'fixed',
    zIndex: 1
  }
}));

const PathOptionsButton = ({
  renderPath,
  mobile,
  handleMobileMenuClose
})=>  {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClick = () => {
    renderPath(options[selectedIndex]);
    if(mobile) {
      handleMobileMenuClose();
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color={mobile ? '' : 'primary'} ref={anchorRef} aria-label="split button">
          <Button className={mobile ? classes.mobileButton : ''} onClick={handleClick}>{options[selectedIndex]}</Button>
          <Button
            className={mobile ? classes.mobileButton : ''}
            color={mobile ? '' : 'primary'}
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper className={classes.gridMenu} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}

PathOptionsButton.propTypes = {
  renderPath: PropTypes.func,
}

export default PathOptionsButton;