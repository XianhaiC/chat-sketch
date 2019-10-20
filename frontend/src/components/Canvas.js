import React from 'react';
import CanvasDraw from 'react-canvas-draw';

import Toolbar from './Toolbar';

class Canvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "#444",
      radius: 6,
      lazyRadius: 5,
      width: 318,
      height: 300,
      disabled: false
    }

    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleRadiusChange = this.handleRadiusChange.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleColorChange(color) {
    window.Twitch.ext.rig.log(color);
    this.setState({ color: color.color });
  }

  handleRadiusChange(radius) {
    this.setState({ radius });
  }

  handleUndo() {
    this.canvas.undo();
  }

  handleClear() {
    window.Twitch.ext.rig.log("CLEARING");
    this.canvas.clear();
  }

  render = () => {
    return (
      <div className="canvas">
        <Toolbar
          onColorChange={this.handleColorChange}
          onRadiusChange={this.handleRadiusChange}
          onUndo={this.handleUndo}
          onClear={this.handleClear}
        />
        <div className="canvas-wrapper">
          <CanvasDraw
            ref={el => this.canvas = el}
            brushColor={this.state.color}
            brushRadius={this.state.radius}
            lazyRadius={this.state.lazyRadius}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
            hideGrid={true}
            disabled={this.state.disabled}
          />
        </div>
        <button className="submit">Send</button>
      </div>
    );
  }
}

export default Canvas;
