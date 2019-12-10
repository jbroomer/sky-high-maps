import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DirectionsIcon from '@material-ui/icons/Directions';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'relative',
    width: 32,
    height: 32,
    borderRadius: 5,
    float: 'right',
    margin: 10,
    background: 'white',
    marginRight: 20,
  },
}));

const leafletDirectionsClass = 'leaflet-routing-container leaflet-bar leaflet-control';
const leafletDirectionsClassHidden = 'leaflet-routing-container leaflet-bar leaflet-control hidden';

const MapDirectionsToggle = ({
  directionsContainer
}) => {
  const classes = useStyles();
  const [firstMount, setFirstMount] = useState(true);
  
  // Hide the directions when they first load
  if(firstMount) {
    directionsContainer.setAttribute('class', leafletDirectionsClassHidden)
    setFirstMount(false)
  }
  // This is bad practice so don't do this but it is a short fix for the annoying directions
  // that pop up automatically and take up so much screen space
  const onDirectionsToggleClick = () => {
    if(directionsContainer.getAttribute('class').includes('hidden')) {
      directionsContainer.setAttribute('class', leafletDirectionsClass);
    } else {
      directionsContainer.setAttribute('class', leafletDirectionsClassHidden);
    }
  }
  return (
    <DirectionsIcon className={classes.root} onClick={onDirectionsToggleClick} />
  )
}

MapDirectionsToggle.propTypes = {
  directionsContainer: PropTypes.any,
};

export default MapDirectionsToggle;