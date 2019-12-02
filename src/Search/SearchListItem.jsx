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
    map.leafletElement.setView([latlng.lat, latlng.lng], 12)
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