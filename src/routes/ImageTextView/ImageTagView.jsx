import React, { Component } from 'react'
import { Modal } from 'antd'
import PropTypes from 'prop-types'
import { formatPriceText } from '../utils'

export default class ImageTagView extends Component {
  constructor() {
    super()
    this.state = {
      visible: false,
    }
  }
  render () {
    const { visible } = this.state
    const {
      scale,
      tagUrl,
      item = null,
      texts,
      originHeight = 640,
      originWidth = 640,
      previewAble = true,
    } = this.props
    const containerStyle = {
      position: 'relative',
      overflow: 'hidden',
      width: originWidth * scale,
      height: originHeight * scale,
      margin: 'auto',
    }
    const contentStyle = {
      transform: `scale(${scale})`,
      transformOrigin: '0 0',
      width: originWidth,
      height: originHeight,
    }
    const view = (
      <div style={containerStyle}>
        <div style={contentStyle}>
          {
            item && item.itemImage &&
            <img style={{width: '100%', height: '100%', position: 'absolute'}} src={item.itemImage}/>
          }
          <img style={{width: '100%', height: '100%', position: 'absolute'}} src={tagUrl}/>
          {
            texts instanceof Array &&
            texts.map((text, index) => {
              const {
                color,
                fontSize,
                fontWeight,
                letterSpacing,
                lineHeight,
                x,
                y,
                title,
                fontFamily,
              } = text
              let priceText = text.writing
              if (item) {
                if (title === 'price') {
                  priceText = item.activityPrice
                }
                if (title === 'memberPrice') {
                  priceText = item.activityMemberPrice
                }
              }
              const textStyle = {
                position: 'absolute',
                left: x,
                top: y,
                color,
                fontSize,
                fontWeight,
                letterSpacing,
                lineHeight,
                whiteSpace: 'pre',
                fontFamily,
              }
              return (
                <span style={textStyle} key={index}>{priceText}</span>
              )
            })
          }
        </div>
      </div>
    )
    if (previewAble) {
      return (
        <div>
          <div style={{cursor: 'pointer'}} onClick={e => this.setState({visible: true})}>
            { view }
          </div>
          <Modal
            width={700}
            bodyStyle={{padding: '40px 24px'}}
            maskClosable={true}
            onCancel={e => this.setState({visible: false})}
            onOk={e => this.setState({visible: false})}
            footer={null}
            visible={visible}
          >
            <ImageTagView {...this.props} previewAble={false} scale={1}></ImageTagView>
          </Modal>
        </div>
      )
    }
    return view
  }
}

ImageTagView.propTypes = {
  scale: PropTypes.number,
  originHeight: PropTypes.number,
  originWidth: PropTypes.number,
  tagUrl: PropTypes.string,
  item: PropTypes.object,
  texts: PropTypes.array,
  previewAble: PropTypes.bool,
}

