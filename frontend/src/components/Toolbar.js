import React from 'react';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      penSelected: true
    }

    this.handlePenSelect = this.handlePenSelect.bind(this);
    this.handleEraserSelect = this.handleEraserSelect.bind(this);
  }

  handlePenSelect() {
    this.setState({ penSelected: true });
    this.props.onPenSelect();
  }

  handleEraserSelect() {
    this.setState({ penSelected: false });
    this.props.onEraserSelect();
  }

  render = () => {
    return (
      <div className="toolbar">
        <label className="item-container">
          <input type="radio" checked={this.state.penSelected} name="pen"
            onChange={this.handlePenSelect} />
          <div className="radio-button"><i className="fas fa-pen"></i></div>
        </label>
        <label className="item-container">
          <input type="radio" checked={!this.state.penSelected} name="pen"
            onChange={this.handleEraserSelect} />
          <div className="radio-button"><i className="fas fa-eraser"></i></div>
        </label>
        <button className="toolbar-item">slider</button>
        <ColorPicker
          defaultColor={'#000'}
          enableAlpha={false}
          onChange={this.props.onColorChange}>
          <button className="toolbar-item picker"></button>
        </ColorPicker>
        <div className="filler"></div>
        <button className="toolbar-item" onClick={this.props.onUndo}><i className="fas fa-undo-alt"></i></button>
        <button className="toolbar-item"><i className="fas fa-redo-alt"></i></button>
        <div className="filler"></div>
        <button className="toolbar-item" onClick={this.props.onClear}>Clear</button>
        <button className="toolbar-item"><i className="fas fa-cog"></i></button>
      </div>
    );
  }
}

export default Toolbar;
