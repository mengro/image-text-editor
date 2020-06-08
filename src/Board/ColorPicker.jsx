import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'

class ColorPicker extends PureComponent {
  state = {
    displayColorPicker: false,
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  render() {
    const {
      value,
      onChange,
    } = this.props

    const styles = {
      container: {
        width: '100%'
      },
      color: {
        width: '100%',
        height: '14px',
        borderRadius: '2px',
        background: value,
      },
      swatch: {
        width: '100%',
        padding: '5px',
        marginRight: '10px',
        background: '#ffffff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        verticalAlign: 'middle',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    }
    return (
      <div style={styles.container}>
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {
          this.state.displayColorPicker ?
            <div style={styles.popover}>
              <div style={styles.cover} onClick={this.handleClose} />
              <SketchPicker
                color={value}
                onChangeComplete={(color,a,b) => {
                  console.log(color,a,b)
                  onChange(color.hex)
                }}
              />
            </div> : null
        }
      </div>
    )
  }
}

ColorPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ColorPicker

