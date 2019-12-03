import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as V from 'victory';

const prepareGraphData = (data) => {
  const temp = [];
  for(let i=0; i<data.length; i++) {
    const graphObject = { y: data[i].altitude, x: i }
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
      <Dialog open={this.props.open} maxWidth={'70vw'} maxHeight={'70vh'}>
        <DialogTitle>
          Elevation Graph
        </DialogTitle>
        <DialogContent>
          <V.VictoryChart
            animate={{ duration: 2000 }}
            width={1200}
            theme={V.VictoryTheme.material}
          >
            <V.VictoryArea
              style={{
                data: { fill: "#add8e6" },
                parent: { border: "1px solid #ccc"}
              }}
              labels={["Elevation (ft.)"]}
              data={prepareGraphData(this.props.data)}
              interpolation={"basis"}
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