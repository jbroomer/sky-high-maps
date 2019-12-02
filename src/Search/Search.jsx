import React, { useState} from 'react';
import { Paper, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchResults from './SearchResults';
import PropTypes from 'prop-types';
import '../css/search.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: 400,
    zIndex: 9999,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
}));

const Search = ({
  setMapMarker,
  map
}) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState('');

  const clearSearch = () => {
    setSearchString('');
  }

  const onSearch = (e) => {
    if(e) {
      setSearchString(e.target.value);
    }
  }

  return(
      <div >
        <Paper
          className={classes.root}
          >
          <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{ "aria-label": "Search" }}
            onChange={(e)=>{onSearch(e)}}
            value={searchString}
          />
        </Paper>
        <SearchResults
          map={map}
          clearSearch={clearSearch}
          setMapMarker={setMapMarker}
          searchString={searchString}
        />
    </div>
  )
}
Search.propTypes = {
  map: PropTypes.any,
  setMapMarker: PropTypes.func
}
export default Search;