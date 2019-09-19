import React, { Component } from 'react';
import { Blueprint } from '../models/blueprint';

class BlueprintView extends Component {

  componentDidMount() {
    this.blueprint = new Blueprint("blueprint");
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
      >
        <canvas
          id="blueprint"
          ref={(ref) => {
            this.ref = ref;
          }}></canvas>
      </div>
    )
  }
}

export default BlueprintView
