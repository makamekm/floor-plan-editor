import React, { Component } from 'react';
import { Blueprint } from '../models/blueprint';
import ToggleButtonType from './toggle-type';

const itemTypeList = [
  {
    key: 'move',
    name: 'Move',
  },
  {
    key: 'draw',
    name: 'Draw',
  },
  {
    key: 'delete',
    name: 'Delete',
  },
]

class BlueprintView extends Component {

  state = {
    activeState: 'move',
  }

  componentDidMount() {
    this.blueprint = new Blueprint(this.ref);

    this.blueprint.onModeChange.add(mode => {
      this.setState({
        activeState: mode,
      });
    });
  }

  componentWillUnmount() {
  }

  changeMode(mode) {
    this.blueprint.changeMode(mode);
  }

  render() {
    return (
      <div className="view">
        <canvas
          id="blueprint"
          ref={(ref) => {
            this.ref = ref;
          }}
        />

        <div className="mode-panel">
          <ToggleButtonType
            activeState={this.state.activeState}
            items={itemTypeList}
            onToggle={key => this.changeMode(key)}
          />
        </div>
  
        <style jsx>{`
          .view {
            position: relative;
            width: 100%;
            height: 100%;
          }

          .mode-panel {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
          }
        `}</style>
      </div>
    )
  }
}

export default BlueprintView
