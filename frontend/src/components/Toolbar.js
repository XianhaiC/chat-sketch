import React from 'react';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="toolbar">
        <button className="toolbar-item"><i className="fas fa-pen"></i></button>
        <button className="toolbar-item"><i className="fas fa-eraser"></i></button>
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
