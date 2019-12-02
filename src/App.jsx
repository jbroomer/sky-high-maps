import React from 'react';
import MapView from './MapView';
import './css/App.css';

class App extends React.Component {
  render() {
    return (
      <div>
        <MapView setMap={this.setMap}/>
      </div>
    );
  }
}

  


export default App;
