import React, { Component, Fragment } from 'react'
import { Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import Sortable from 'sortablejs'

export default class LayerList extends Component {
  constructor() {
    super()
  }
  static propTypes = {
    allLayers: PropTypes.array,
    currentActiveLayer: PropTypes.object,
    onSelect: PropTypes.func,
    onSort: PropTypes.func,
  }
  componentDidMount() {
    const { onSort } = this.props
    const container = document.querySelector('#board-layerList-container')
    if (container) {
      this.sortList = new Sortable(container, {
        animation: 300,
        onSort,
      })
    }
  }
  render () {
    const {
      allLayers,
      currentActiveLayer,
      onSelect,
    } = this.props
    const normalLayers = allLayers.filter(layer => layer.name !== '背景图片')
    const bgLayer = allLayers.find(layer => layer.name === '背景图片')
    return (
      <div className="layerList-root">
        <h3 className="layerList-title">
          图层列表
          <i className="layerList-tip">
            <Tooltip placement="right" title="可通过拖拽图层列表对层级进行设定，越靠前则对应图层层级越高">
              <Icon type="info-circle" />
            </Tooltip>
          </i>
        </h3>
        <ul id="board-layerList-container" className="layerList-container">
          {
            normalLayers instanceof Array &&
            normalLayers.map((layer, index) => {
              const { type, name, text } = layer
              let title = name
              if (type === 'text') {
                title = `${text}`
              }
              if (name === 'price') {
                title = '售价'
              }
              if (name === 'memberPrice') {
                title = '会员价'
              }
              return (
                <li
                  onClick={e => onSelect(layer)}
                  className={`layerList-row ${currentActiveLayer && currentActiveLayer.id === layer.id ? 'active' : ''}`}
                  title={title}
                  key={layer.id}
                >
                  <span className="layerList-icon">
                    {
                      type === 'text' && <Icon type="font-size" />
                    }
                    {
                      type === 'image' && <img style={{maxHeight: 20, maxWidth: 20}} src={layer.getSrc()} alt=""/>
                    }
                  </span>
                  <span className="layerList-name">
                    { title }
                  </span>
                </li>
              )
            })
          }
        </ul>
        <div
          onClick={e => onSelect(bgLayer)}
          className={`layerList-row ${currentActiveLayer && currentActiveLayer.id === bgLayer.id ? 'active' : ''}`}
          title={bgLayer.name}
          key={bgLayer.id}
        >
          <span className="layerList-icon">
            <img style={{maxHeight: 20, maxWidth: 20}} src={bgLayer.getSrc()} alt=""/>
          </span>
          <span className="layerList-name">
            { bgLayer.name }
          </span>
        </div>
      </div>
    )
  }
}

