import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ClearIcon from '@material-ui/icons/Clear';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import MoreIcon from '@material-ui/icons/MoreVert';
import Search from './Search/Search';
import BounceLoader from 'react-spinners/BounceLoader';
import PathOptionsButton from './PathOptionsButton';
import PropTypes from 'prop-types';
import './MapView.css'

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const spinnerOverride = 'display: block; margin-left: 5px;'

export default function NavBar({
  map,
  setMapMarker,
  setCurrentLocation,
  elevationDisabled,
  handleElevationGraphOpen,
  pathDisabled,
  renderPath,
  clearMap,
  isLoading
}) {
  const classes = useStyles();
  const [mobileAnchor, setMobileAnchor] = React.useState(false);
  const isMobileMenuOpen = mobileAnchor;

  const handleMobileMenuClose = () => {
    setMobileAnchor(false);
  };

  const handleMobileMenuOpen = event => {
    setMobileAnchor(event.currentTarget);
  };

  const onCurrentLocationClick = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setCurrentLocation);
    }
    setMobileAnchor(false)
  }

  const onMobileElevationOpen = () => {
    handleElevationGraphOpen();
    setMobileAnchor(false)
  }

  const onMobileClearMap = () => {
    clearMap();
    setMobileAnchor(false);
  }
 

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={onCurrentLocationClick}>
        <IconButton aria-label="Find current location" color="inherit">
          <MyLocationIcon />
        </IconButton>
        <p>Current Location</p>
      </MenuItem>
      <MenuItem disabled={pathDisabled}>
        <IconButton  aria-label="Calculate Path" color="inherit">
          <DirectionsWalkIcon />
        </IconButton>
        <PathOptionsButton 
          mobile={true} 
          renderPath={renderPath}
          handleMobileMenuClose={handleMobileMenuClose}
          />
      </MenuItem>
      <MenuItem disabled={elevationDisabled && !isLoading} onClick={onMobileElevationOpen}>
        <IconButton  aria-label="Calculate Elevation" color="inherit">
          <TrendingUpIcon />
        </IconButton>
        { isLoading ? <BounceLoader
                            css={spinnerOverride}
                            sizeUnit={"px"}
                            color={'black'}
                            size={30}
                            loading={isLoading}
                            /> : 'Show Path Elevation'}
                            
      </MenuItem>
      <MenuItem onClick={onMobileClearMap}>
        <IconButton  aria-label="Reset Map State" color="inherit">
          <ClearIcon />
        </IconButton>
        <p>Clear</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Sky High Maps
          </Typography>
          <div className={classes.search}>
            <Search 
              map={map}
              setMapMarker={setMapMarker}
            /> 
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton onClick={onCurrentLocationClick} aria-label="Calculate current location" color="inherit">
              <MyLocationIcon />
              <Typography>Current Location</Typography>
            </IconButton>
            <IconButton 
              disabled={pathDisabled}
              aria-label="Calculate path"
              color="inherit"
            >
              <DirectionsWalkIcon />
              <PathOptionsButton renderPath={renderPath}/>
            </IconButton>
            <IconButton 
              disabled={elevationDisabled && !isLoading}
              aria-label="Calculate path elevation"
              color="inherit"
              onClick={handleElevationGraphOpen}
            >
              <TrendingUpIcon />
              <Typography>
                <p>{ isLoading ? <BounceLoader
                                    css={spinnerOverride}
                                    color={'#FFFFFF'}
                                    sizeUnit={"px"}
                                    size={30}
                                    loading={isLoading}/> : 'Show Path Elevation'}</p>
              </Typography>
            </IconButton>
            <IconButton 
              aria-label="Reset Map State"
              color="inherit"
              onClick={clearMap}
            >
              <ClearIcon />
              <Typography>Clear</Typography>
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </div>
  );
}
NavBar.propTypes = {
  map: PropTypes.any,
  setMapMarker: PropTypes.func.isRequired,
  handleElevationGraphOpen: PropTypes.func.isRequired,
  elevationDisabled: PropTypes.bool,
  pathDisabled: PropTypes.bool,
  renderPath: PropTypes.func,
  clearMap: PropTypes.func,
  isLoading: PropTypes.bool,
};