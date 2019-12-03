import React from 'react';
import { ListItem } from '@material-ui/core';
import PropTypes from 'prop-types';

const SearchListItem = ({
  id,
  address,
  latlng,
  setMapMarker,
  map,
  clearSearch
}) => {
  const placeMarker = () => {
    setMapMarker(latlng);
    clearSearch();
    // Prevents race condition where map is not instantiated
    new Promise((res, rej) => {
      if(map) {
        res('Setting Current Location')
      } else {;
        rej();
      }
    }).then(() => {
      map.leafletElement.setView([latlng.lat, latlng.lng], 12);
    }).catch((err) => {
      console.log('Map not initialized. Try again.');
    })
  }
  return(
    <ListItem
      tabIndex={id}
      className="search-item"
      id={id}
      latlng={latlng}
      onClick={placeMarker}
      >
        {address}
    </ListItem>
  )
}
SearchListItem.propTypes = {
  map: PropTypes.any,
  clearSearch: PropTypes.func,
  setMapMarker: PropTypes.func,
}
export default SearchListItem;