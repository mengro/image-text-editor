import React, { memo, Fragment } from 'react'
import { InputNumber, Icon } from 'antd'
import PropTypes from 'prop-types'
import { halfInputStyle } from './config'

function ImageController({
  children,
  onChange,
  currentImageControls,
}) {
  const options = {
    precision: 0,
    style: halfInputStyle,
  }
  return (
    <Fragment>
      <ul className="board-controller-container">
        <li className="board-controller-row">
          <span className="board-controller-label">
            位置
          </span>
          <span className="board-controller-inputs">
            <InputNumber value={currentImageControls.left} {...options} onChange={value => onChange('left', value)}></InputNumber>
            <InputNumber value={currentImageControls.top} {...options} onChange={value => onChange('top', value)}></InputNumber>
          </span>
        </li>
        <li className="board-controller-row">
          <span className="board-controller-label">
            尺寸
          </span>
          <span className="board-controller-inputs">
            <InputNumber value={currentImageControls.width} {...options} onChange={value => onChange('width', value)}></InputNumber>
            <span className="board-controller-lock">
              <Icon type="lock" />
            </span>
            <InputNumber value={currentImageControls.height} {...options} onChange={value => onChange('height', value)}></InputNumber>
          </span>
        </li>
      </ul>
      <div className="board-controller-replace">
        { children }
      </div>
      <ul className="board-controller-tip">
        <li className="board-controller-tip-row">
          <Icon type="info-circle" />
          “替换图片”进行自定义素材上传
        </li>
        <li className="board-controller-tip-row">
          <Icon type="info-circle" />
          图片大小请不要超过1MB
        </li>
        <li className="board-controller-tip-row">
          <Icon type="info-circle" />
          图片名称不含“-、%”等特殊符号
        </li>
        <li className="board-controller-tip-row">
          <Icon type="info-circle" />
          主图图标请使用png格式图片
        </li>
      </ul>
    </Fragment>
  )
}

ImageController.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func,
  currentImageControls: PropTypes.object,
}

export default memo(ImageController)

