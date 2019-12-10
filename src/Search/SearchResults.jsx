
import React, { useState, useEffect } from 'react';
import { List } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import opencage from 'opencage-api-client';
import SearchListItem from './SearchListItem';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import '../css/search.css';

const useStyles = makeStyles(theme => ({
  searchBox: {
    padding: '10npmpx 4px',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 600,
    width: 400,
    overflow: 'scroll',
    zIndex: 999,
    background: 'white', 
    color: 'black'
  },
}));

//OpenCage API Key
// const key = '65ebc933781846df84cd69161932603d';
const key = '7f6334b296b64dfba0e104744d4f14c9';
 

const SearchResults = ({
  searchString,
  setMapMarker,
  map,
  clearSearch
}) => {
  const classes = useStyles();
  const [results, setResults] = useState([]);

  useEffect(() => {
      // Update the document title using the browser API
      if(searchString.length < 2) {
        setResults([]);
        return;
      }
      opencage.geocode({ 
        q: searchString,
        proximity: '42.3903232, -72.511488',
        no_annotations: 1, 
        key, 
      }).then(response => {
        const results = response.results.map((x, index) => {
          return <SearchListItem 
                    key={index}
                    id={index}
                    map={map}
                    clearSearch={clearSearch}
                    address={x.formatted} 
                    latlng={x.geometry} 
                    setMapMarker={setMapMarker} />
        });
        return results;
      }).then((results) => {
        setResults(results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchString, setMapMarker, map, clearSearch]);

  const searchClass = classNames({
    'search-results': true,
    'show': (searchString.length>0),
  });

  return(
    <div className={searchClass}>
      <List className={classes.searchBox}>
        {results}
      </List>
    </div>
  );
}
SearchResults.propTypes = {
  map: PropTypes.any,
  clearSearch: PropTypes.func,
  searchString: PropTypes.string,
  setMapMarker: PropTypes.func,
}
export default SearchResults;