import React, { PureComponent } from 'react'
import { Icon, Empty, Modal } from 'antd'
import PropTypes from 'prop-types'
import { fabric } from 'fabric'
import { SingleImgUpload, objectTools } from '@lib/item-admin-lib'
import Sider from './Sider'
import Drawer from './Drawer'
import ImageController from './ImageController'
import TextController from './TextController'
import LayerList from './LayerList'
import { uploadImageAction, uploadImage } from '@/services/common'
import { defaultTag, background, totalLimit, defaultInitTextsOptions, defaultTextOptions, defaultImageOptions, defaultTextControls, defaultImageControls } from './config'
import { copyProperties, blobToFile, loadImg } from './utils'

export default class Board extends PureComponent {
  constructor() {
    super()
    this.state = {
      currentTab: '',
      currentSelectType: '',
      currentImageControls: defaultImageControls,
      currentTextControls: defaultTextControls,
      allLayers: [],
      currentActiveLayer: null,
    }
    this.currentTarget = null
    this.distance = 8
    this.imageCount = 0
    this.textCount = 0
  }
  static propTypes = {
    children: PropTypes.any,
    boolIsEcho: PropTypes.bool,
    echoLayers: PropTypes.array,
  }
  componentDidMount() {
    this.initBoard()
  }
  initBoard = () => {
    const { boolIsEcho, echoLayers } = this.props
    this.canvasWidth = this.containerRef.clientWidth
    this.canvasHeight = this.containerRef.clientHeight
    this.canvas =new fabric.Canvas('fabric-root', {
      width: this.canvasWidth,
      height: this.canvasHeight,
      preserveObjectStacking: true, // 使画布分层，无论选中哪个图层，不会影响层级
    })
    this.addImageHandle(background, { lockScalingX: true, lockScalingY: true, name: '背景图片'})
      .then(backgroundImage => {
        this.backgroundImage = backgroundImage
        this.backgroundImageObject = backgroundImage.toObject()
        if (!boolIsEcho) {
          this.addImageHandle(defaultTag, { name: '默认模板' })
            .then(imgInstance => {
              this.selectLayerHandle(imgInstance)
              this.addDefaultTexts()
            })
        } else {
          echoLayers instanceof Array && this.echoLayersHandle(echoLayers)
        }
      })
  }
  addDefaultTexts = () => {
    defaultInitTextsOptions.forEach(option => {
      this.addTextHandle(option)
    })
  }
  echoLayersHandle = echoLayers => {
    const { left, top } = this.backgroundImageObject
    if (echoLayers instanceof Array) {
      echoLayers.forEach((item, index) => {
        if (item.type === 'image' && item.src) {
          this.addImageHandle(item.src, {
            left: left + item.left,
            top: top + item.top,
          }, item.width, item.height, item.zindex)
        }
        if (item.type === 'text' && item.text) {
          const options = objectTools.filterUndefined({
            ...item,
            text: item.writing,
            left: left + item.left,
            top: top + item.top,
            name: item.name,
            fill: item.color,
          })
          this.addTextHandle(options, item.zindex)
        }
      })
    }
  }
  /** common */
  getValue = ({
    onlyImages = false,
    onlyTexts = false,
    toObject = false,
    relative = true,
    sorted = true,
  } = {}) => {
    let layers = this.canvas.getObjects()
    if (layers instanceof Array) {
      layers = layers.filter(item => item.name !== '背景图片')
      if (toObject) {
        layers = layers.map(item => ({
          ...item.toObject(),
          name: item.name
        }))
      }
      if (onlyImages) {
        layers = layers.filter(item => item.type === 'image')
      }
      if (onlyTexts) {
        layers = layers.filter(item => item.type === 'text')
      }
      if (relative) {
        const { left, top } = this.backgroundImageObject
        layers = layers.map(item => {
          const properties = item.toObject()
          const { lineHeight } = properties
          const result = {
            ...item,
            left: item.left - left,
            top: item.top - top,
            src: item.getSrc && item.getSrc(),
            lineHeight,
          }
          if (item.scaleX) {
            result.width = Math.round(item.width * item.scaleX)
          }
          if (item.scaleY) {
            result.height = Math.round(item.height * item.scaleY)
          }
          return result
        })
      }
      if (sorted) {
        const sortedLayers = layers.sort((a, b) => a.zindex - b.zindex)
        return sortedLayers
      }
      return layers
    }
    return []
  }
  getMergedImage = ({withTexts = false} = {}) => {
    return new Promise((resolve, reject) => {
      const tagImages = this.getValue({
        onlyImages: true,
        toObject: false,
      })
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      loadImg(this.backgroundImageObject.src)
        .then(defaultLayerRes => {
          canvas.width = this.backgroundImageObject.width
          canvas.style.width = this.backgroundImageObject.width
          canvas.height = this.backgroundImageObject.height
          canvas.style.height = this.backgroundImageObject.height
          const process = tagImages.map(item => {
            return loadImg(item.src)
          })
          return Promise.all(process)
            .then(resArr => {
              if (resArr instanceof Array) {
                resArr.forEach((res, index) => {
                  const item = tagImages[index]
                  const left = item.left
                  const top = item.top
                  ctx.drawImage(res.img, left, top, item.width, item.height)
                })
              }
              canvas.toBlob(blob => {
                this.uploadImage(blob)
                  .then(resData => {
                    if (resData && resData.url) {
                      return resolve(resData.url)
                    }
                    return reject()
                  })
                  .catch(e => {
                    return reject(e)
                  })
              }, 'image/png')
            })
        })
        .catch(reject)
    })
  }
  uploadImage = blob => {
    const data = new FormData()
    const image = blobToFile(blob, 'imageTag.png', 'image/png')
    data.append('file', image)
    return uploadImage(data)
  }
  switchHandle = tab => {
    this.setState({
      currentTab: this.state.currentTab ? '' : tab
    })
  }
  getCenter = ({width, height}) => {
    const left = Math.round(((this.canvasWidth - width) / 2) / this.distance) * this.distance
    const top = Math.round(((this.canvasHeight - height) / 2) / this.distance) * this.distance
    return { left, top }
  }
  addImageHandle = (url, options = {}, scaleWidth, scaleHeight, zindex) => {
    console.log(zindex)
    return new Promise((resolve) => {
      fabric.Image.fromURL(url, imgInstance => {
        imgInstance.type = 'image'
        const { width, height } = imgInstance
        const { left, top } = this.getCenter({width, height})
        imgInstance.originWidth = width
        imgInstance.originHeight = height
        imgInstance.set({ ...defaultImageOptions, left, top, ...options })
        if (scaleWidth) {
          imgInstance.scaleToWidth(scaleWidth)
        }
        if (scaleHeight) {
          imgInstance.scaleToHeight(scaleHeight)
        }
        this.imageCount ++
        if (!options.name) {
          imgInstance.name = `静态图片-${this.imageCount}`
        }
        imgInstance.id = `imgInstance-${this.imageCount}`
        this.addLayer(imgInstance, zindex)
        imgInstance.on('moving', e => this.commonMoveHandle(e, 'selected_image', imgInstance))
          .on('selected', e => this.commonSelectHandle(e, 'selected_image', imgInstance))
          .on('scaling', this.commonScaleHandle)
          .on('deselected', this.commonUnselectHandle)
        resolve(imgInstance)
      })
    })
  }
  addTextHandle = (options = {}, zindex) => {
    const {
      text, name, left, top,
      fill = defaultTextOptions.fill,
      fontSize = defaultTextOptions.fontSize,
      fontWeight = defaultTextOptions.fontWeight,
      length = defaultTextOptions.length,
      fontFamily = defaultTextOptions.fontFamily,
      locked = defaultTextOptions.locked,
    } = options
    const [ width, height ] = [300, 20]
    const center = this.getCenter({width, height })
    const textInstance = new fabric.IText(text || '输入文本', {
      ...defaultTextOptions,
      left: left || center.left,
      top: top || center.top,
      width,
      height,
      name,
      fill,
      fontSize,
      fontWeight,
      fontFamily,
      length,
      locked,
    })
    textInstance.type = 'text'
    textInstance.on('moving', e => this.commonMoveHandle(e, 'selected_text', textInstance))
      .on('selected', e => this.commonSelectHandle(e, 'selected_text', textInstance))
      .on('rotating', e => this.commonRotatingHandle(e, 'selected_text', textInstance))
      .on('deselected', this.commonUnselectHandle)
    textInstance.id = `textInstance-${++this.textCount}`
    this.addLayer(textInstance, zindex)
    return textInstance
  }
  commonMoveHandle = (e, type, target) => {
    // 设定移动间隔為格线间隔
    target.left = Math.round(target.left / this.distance) * this.distance
    target.top = Math.round(target.top / this.distance) * this.distance
    type === 'selected_image' && this.updateImageControls({
      ...target,
      width: target.scaleX * target.width,
      height: target.scaleY * target.height,
    })
    type === 'selected_text' && this.updateTextControls(target)
  }
  commonScaleHandle = e => {
    const target = e.target
    const { scaleX, scaleY, left, top } = target
    const width = Math.round(scaleX * target.originWidth)
    const height = Math.round(scaleY * target.originHeight)
    this.updateImageControls({
      width,
      height,
      left,
      top,
    })
  }
  commonRotatingHandle = (e, type, target) => {
    type === 'selected_text' && this.updateTextControls(target)
  }
  commonSelectHandle = (e, type, target) => {
    type === 'selected_image' && this.updateImageControls({
      ...target,
      width: target.scaleX ? target.scaleX * target.width : target.width,
      height: target.scaleY ? target.scaleY * target.height : target.height,
    })
    type === 'selected_text' && this.updateTextControls(target)
    this.setState({
      currentSelectType: type,
      currentActiveLayer: target,
    })
    this.currentTarget = target
  }
  commonUnselectHandle = () => {
    this.setState({
      currentSelectType: '',
    })
    this.currentTarget = null
  }
  selectLayerHandle = target => {
    this.canvas.setActiveObject(target)
      .renderAll()
    this.setState({
      currentActiveLayer: target
    })
  }
  sortSideBarLayerHandle = e => {
    const { newIndex, oldIndex } = e
    const { allLayers } = this.state
    const newZIndex = allLayers.length - 1 - newIndex
    const oldZIndex = allLayers.length - 1 - oldIndex
    allLayers.forEach(layer => {
      if (layer.zindex === oldZIndex) {
        return layer.zindex = newZIndex
      }
      if (newZIndex > oldZIndex) {
        if (layer.zindex > oldZIndex && layer.zindex <= newZIndex) {
          layer.zindex = layer.zindex - 1
        }
      } else {
        if (layer.zindex < oldZIndex && layer.zindex >= newZIndex) {
          layer.zindex = layer.zindex + 1
        }
      }
    })
    const sortedLayers = this.sortBoardLayersHandle(allLayers)
    this.setState({
      allLayers: [...sortedLayers]
    })
  }
  sortBoardLayersHandle = layers => {
    const sortedLayers = layers.sort((a, b) => b.zindex - a.zindex)
    this.canvas.clear()
    sortedLayers.slice().reverse().forEach(layer => this.canvas.add(layer))
    return sortedLayers
  }
  /** image */
  uploadHandle = url => {
    this.setState({
      currentTab: ''
    })
    if (url) {
      this.addImageHandle(url)
    }
  }
  replaceHandle = url => {
    if (url) {
      this.currentTarget.setSrc(url, imgInstance => {
        this.canvas.renderAll()
        return imgInstance
      })
    }
  }
  updateImageRender = (type, value) => {
    if (type === 'width' || type === 'height') {
      type === 'width' && this.currentTarget.scaleToWidth(value)
      type === 'height' && this.currentTarget.scaleToHeight(value)
      const { scaleX, scaleY, originWidth, originHeight } = this.currentTarget
      this.updateImageControls({
        width: originWidth * scaleX,
        height: originHeight * scaleY,
      })
    } else {
      this.updateImageControls({[type]: value})
      this.currentTarget.set(type, value)
    }
    this.canvas.renderAll()
  }
  updateImageControls = imgInstance => {
    const options = {
      ...imgInstance,
    }
    if (imgInstance.width) {
      options.width = Math.round(imgInstance.width)
    }
    if (imgInstance.height) {
      options.height = Math.round(imgInstance.height)
    }
    this.setState({
      currentImageControls: copyProperties(this.state.currentImageControls, options)
    })
  }
  /** text */
  updateTextRender = (type, value) => {
    if (type === 'angle') {
      this.currentTarget.rotate(value)
    } else {
      if (type === 'fill') {
        this.currentTarget.setColor(value)
      }
      this.currentTarget[type] = value
    }
    this.canvas.renderAll()
    this.updateTextControls(this.currentTarget)
  }
  updateTextControls = textInstance => {
    this.setState({
      currentTextControls: copyProperties(this.state.currentTextControls, textInstance)
    })
  }
  addLayer = (layer, zindex) => {
    const { allLayers } = this.state
    layer.zindex = (zindex !== undefined && zindex !== null) ? zindex : allLayers.length
    this.canvas.add(layer)
    const layers = this.canvas.getObjects()
    const sortedLayers = this.sortBoardLayersHandle(layers)
    this.setState({
      allLayers: sortedLayers
    })
  }
  /** operates */
  deleteLayerHandle = e => {
    const { currentActiveLayer, allLayers } = this.state
    const handle = () => {
      const filteredLayers = allLayers.filter(item => item !== currentActiveLayer)
      const sortedLayers = this.sortBoardLayersHandle(filteredLayers)
      const result = sortedLayers.map(layer => {
        if (layer.zindex > currentActiveLayer.zindex && layer.zindex > 1) {
          layer.zindex = layer.zindex - 1
        }
        return layer
      })
      this.setState({
        allLayers: result
      })
      this.canvas.remove(currentActiveLayer)
    }
    if (currentActiveLayer.locked) {
      return Modal.confirm({
        title: '确定删除吗？',
        content: '删除价格图层将导致主图不能正常展示价格，确定要删除吗？',
        onOk: () => {
          return handle()
        }
      })
    }
    handle()
  }
  changeIndexHandle = type => {
    const { currentActiveLayer } = this.state
    if (type === 'up') {
      currentActiveLayer.bringToFront()
    } else {
      currentActiveLayer.sendToBack()
    }
  }
  render() {
    const { currentTab, currentSelectType, currentImageControls, currentTextControls, allLayers, currentActiveLayer } = this.state
    const { children } = this.props
    const boolLimitOn = allLayers.length >= totalLimit
    return (
      <div className="board-container">
        <aside className="board-components">
          <Sider
            addText={e => this.addTextHandle()}
            onSwitch={this.switchHandle}
            boolLimitOn={boolLimitOn}
          >
          </Sider>
          <Drawer
            visible={currentTab === 'tab_image' || currentTab === 'tab_layer'}
          >
            {
              currentTab === 'tab_image' &&
              <div style={{marginTop: 32}}>
                <SingleImgUpload
                  sortable={false}
                  limit={1}
                  action={uploadImageAction}
                  buttonText="本地上传"
                  onChange={this.uploadHandle}
                  buttonOptions={{
                    disabled: boolLimitOn
                  }}
                >
                </SingleImgUpload>
              </div>
            }
            {
              currentTab === 'tab_layer' &&
              <LayerList
                currentActiveLayer={currentActiveLayer}
                allLayers={allLayers}
                onSelect={this.selectLayerHandle}
                onSort={this.sortSideBarLayerHandle}
              >
              </LayerList>
            }
          </Drawer>
        </aside>
        <section className="board-body">
          <div ref={ref => this.containerRef = ref} className="boardBody-container">
            <div className="board-layer-counter">
              {
                `已添加图层 ${allLayers.length} / ${totalLimit}`
              }
            </div>
            <canvas className="fabric-root" id="fabric-root"></canvas>
            {
              currentSelectType &&
              <div className="boardBody-operator">
                {
                  currentActiveLayer.name !== '背景图片' &&
                  <div className="boardBody-operator-delete icon">
                    <Icon onClick={this.deleteLayerHandle} type="delete" />
                  </div>
                }
              </div>
            }
          </div>
        </section>
        <aside className="board-controller">
          {
            currentSelectType === 'selected_image' &&
            <ImageController
              onChange={this.updateImageRender}
              currentImageControls={currentImageControls}
            >
              <SingleImgUpload
                sortable={false}
                limit={1}
                action={uploadImageAction}
                buttonOptions={{
                  style: {
                    width: '240px'
                  }
                }}
                buttonText="替换图片"
                onChange={this.replaceHandle}
              >
              </SingleImgUpload>
            </ImageController>
          }
          {
            currentSelectType === 'selected_text' &&
            <TextController
              currentTextControls={currentTextControls}
              onChange={this.updateTextRender}
              currentActiveLayer={currentActiveLayer}
            >
            </TextController>
          }
          {
            currentSelectType === '' &&
            <Empty style={{marginTop: 100, color: '#aaa'}} description="未选择图层"></Empty>
          }
          <div className="board-baseInfo">
            { children }
          </div>
        </aside>
      </div>
    )
  }
}
