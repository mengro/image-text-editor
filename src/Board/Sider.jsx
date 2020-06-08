import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'antd'

export default class Sider extends Component {
  static propTypes = {
    onSwitch: PropTypes.func,
    addText: PropTypes.func,
    boolLimitOn: PropTypes.bool,
  }
  render() {
    const { boolLimitOn, onSwitch, addText } = this.props
    return (
      <ul className="board-sider-container">
        <li onClick={e => onSwitch('tab_image')}>
          <Icon type="picture" /><br/>
          <span>图像</span>
        </li>
        <li className={`${boolLimitOn ? 'disabled' : ''}`} onClick={e => !boolLimitOn && addText()}>
          <Icon type="font-size" /><br/>
          <span>文字</span>
        </li>
        <li onClick={e => onSwitch('tab_layer')}>
          <Icon type="tags" /><br/>
          <span>图层</span>
        </li>
      </ul>
    )
  }
}
