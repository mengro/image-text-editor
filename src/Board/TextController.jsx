import React, { memo, Fragment } from 'react'
import { InputNumber, Slider, Input, Radio } from 'antd'
import { SelectShell } from '@lib/item-admin-lib'
import ColorPicker from './ColorPicker'
import PropTypes from 'prop-types'
import { halfInputStyle, fontFamilyList, lockedRadioOptions } from './config'

const RadioGroup = Radio.Group

function TextController({
  onChange,
  currentTextControls,
  currentActiveLayer,
}) {
  const halfInputOptions = {
    precision: 0,
    style: halfInputStyle,
  }
  const boolIsPrice = currentActiveLayer.name === 'price' || currentActiveLayer.name === 'memberPrice'
  const currentPriceType = currentActiveLayer.name === 'memberPrice' ? '会员价' : '售价'
  return (
    <Fragment>
      <ul className="board-controller-container">
        <li className="board-controller-row">
          <span className="board-controller-label">
            位置
          </span>
          <span className="board-controller-inputs">
            <InputNumber value={currentTextControls.left} {...halfInputOptions} onChange={value => onChange('left', value)}></InputNumber>
            <InputNumber value={currentTextControls.top} {...halfInputOptions} onChange={value => onChange('top', value)}></InputNumber>
          </span>
        </li>
        <li style={{display: 'none'}} className="board-controller-row withBorder">
          <span className="board-controller-label">
            旋转
          </span>
          <span className="board-controller-inputs">
            <Slider
              style={{flex: 1}}
              min={0}
              max={360}
              onChange={value => onChange('angle', value)}
              value={currentTextControls.angle || 0}
            />
          </span>
        </li>
        <li className="board-controller-row">
          <span className="board-controller-label">
            字体
          </span>
          <span className="board-controller-inputs">
            <SelectShell
              data={fontFamilyList}
              onChange={value => onChange('fontFamily', value)}
              value={currentTextControls.fontFamily}
            >
            </SelectShell>
          </span>
        </li>
        <li className="board-controller-row">
          <span className="board-controller-label">
            行距
          </span>
          <span className="board-controller-inputs">
            <InputNumber value={currentTextControls.lineHeight} {...halfInputOptions} precision={1} step={0.1} onChange={value => onChange('lineHeight', value)}></InputNumber>
            <span className="board-controller-lock">
              字距
            </span>
            <InputNumber value={currentTextControls.charSpacing} {...halfInputOptions} onChange={value => onChange('charSpacing', value)}></InputNumber>
          </span>
        </li>
        <li className="board-controller-row withBorder">
          <span className="board-controller-label">
            字号
          </span>
          <span className="board-controller-inputs">
            <InputNumber value={currentTextControls.fontSize} {...halfInputOptions} onChange={value => onChange('fontSize', value)}></InputNumber>
            <span className="board-controller-lock">
              粗细
            </span>
            <InputNumber min={300} max={900} step={100} value={currentTextControls.fontWeight} {...halfInputOptions} onChange={value => onChange('fontWeight', value)}></InputNumber>
          </span>
        </li>
        <li className="board-controller-row">
          <span className="board-controller-label">
            颜色
          </span>
          <span className="board-controller-inputs">
            <ColorPicker
              onChange={value => onChange('fill', value)}
              value={currentTextControls.fill}
            />
          </span>
        </li>
        <li className="board-controller-row">
          <span className="board-controller-label">
            内容
          </span>
          <span className="board-controller-inputs">
            <Input.TextArea
              readOnly={boolIsPrice}
              maxLength={20}
              rows={4}
              onChange={e => onChange('text', e.target.value)}
              value={currentTextControls.text}
            />
          </span>
        </li>
        <li className="board-controller-row">
          <span className="board-controller-label">
            锁定
          </span>
          <span className="board-controller-inputs">
            <RadioGroup
              onChange={e => onChange('locked', e.target.value)}
              value={currentTextControls.locked}
              options={lockedRadioOptions}
            >
            </RadioGroup>
          </span>
        </li>
        <li className={`board-controller-row ${boolIsPrice ? 'withBorder' : ''}`}>
          <span className="board-controller-label">
            字数
          </span>
          <span className="board-controller-inputs">
            <InputNumber
              min={1}
              max={50}
              step={1}
              value={currentTextControls.length}
              {...halfInputOptions}
              onChange={value => onChange('length', value)}
            >
            </InputNumber>
          </span>
        </li>
        {
          boolIsPrice &&
          <li style={{color: 'red', lineHeight: 1.2}} className="board-controller-row">
            智能价标-【{currentPriceType}】，投放时会根据商品实际的【{currentPriceType}】显示，仅支持修改定位、字体、字号等，无需修改文案
          </li>
        }
      </ul>
    </Fragment>
  )
}

TextController.propTypes = {
  onChange: PropTypes.func,
  currentTextControls: PropTypes.object,
  currentActiveLayer: PropTypes.object,
}

export default memo(TextController)

