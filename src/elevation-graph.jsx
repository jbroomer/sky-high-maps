import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as V from 'victory';

const prepareGraphData = (data) => {
  const temp = [];
  for(let i=0; i<data.length; i++) {
    let graphObject;
    if(i>50&& i<data.length-5) {
      let avgAlt = 0;
      for(let j = 0; j<5; j++) {
        avgAlt += data[i+j].altitude;
      }
      graphObject = { y: Math.round(avgAlt/5), x: i }
    } else {
      graphObject = { y: Math.round(data[i].altitude), x: i }
    }
    temp.push(graphObject);
  }
  return temp;
}

class ElevationGraph extends React.Component {
  constructor(props) {
    super(props);
    this.closeGraph = this.closeGraph.bind(this);
    this.state = {
      open: this.props.open,
    }
  }
  closeGraph() {
    this.setState({ open: false })
  }
  render() {
    return (
      <Dialog open={this.props.open} fullWidth>
        <DialogTitle>
          Elevation Graph
        </DialogTitle>
        <DialogContent>
          <V.VictoryChart
            theme={V.VictoryTheme.material}
          >
            <V.VictoryLine
              style={{
                data: { stroke: "#c43a31" },
                parent: { border: "1px solid #ccc"}
              }}
              interpolation="bundle"
              data={prepareGraphData(this.props.data)}
            />
          </V.VictoryChart>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleElevationGraphOpen}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

ElevationGraph.propTypes = {
  open: PropTypes.bool.isRequired,
}

export default ElevationGraph;