import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message, Button } from 'antd'

export default class ImageUpload extends Component {
  constructor() {
    super()
  }
  static propTypes = {
    limitSize: PropTypes.number,
    action: PropTypes.string,
    antdOptions: PropTypes.object,
    disabled: PropTypes.bool,
    buttonText: PropTypes.string,
    allowTypeList: PropTypes.array,
  }
  state = {
    loading: false,
  }

  handleChange = ({file}) => {
    const { sortable, disabled } = this.props
    if (disabled) {
      return
    }
    if (file.status === 'uploading') {
      return this.setState({
        loading: true,
      })
    }
    this.setState({
      loading: false,
    })
    const { onChange } = this.props
    if (file.status === 'error') {
      message.error('上传失败')
      return false
    } else if (file.response && file.response.code === 30600042) {
      message.warn(file.response.message)
      file.response.code = 1
    } else if (file.response && file.response.code !== 1) {
      message.error(file.response.message)
      return false
    }
    const url = file.response.data && file.response.data.url
    onChange(url)
  }
  beforeUpload = (file) => {
    const { limitSize = 10 * 1024 * 1024 } = this.props
    if (limitSize && (file.size > limitSize * 1024)) {
      message.warn(`图片大小须小于${limitSize}KB`)
      return Promise.reject()
    }
    const { allowTypeList = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/bmp'] } = this.props
    const fileType = file.type
    if (allowTypeList.indexOf(fileType) < 0) {
      message.error(`请上传${allowTypeList.map(item => item.replace('image/', '')).join('、')}格式的图片`)
      return Promise.reject()
    }
    const { imageRules } = this.props
    if (imageRules) {
      const { minWidth = 0, minHeight = 0, maxHeight = 3000, maxWidth = 3000 } = imageRules
      if (minWidth || minHeight || maxHeight || maxWidth) {
        let result = false
        const img = new Image()
        img.src = window.URL.createObjectURL(file)
        return new Promise((resolve, reject) => {
          img.onload = () => {
            const width = img.width
            const height=img.height
            if (
              width >= minWidth &&
              height >= minHeight &&
              width <= maxWidth &&
              height <= maxHeight
            ) {
              result = true
            }
            if (!result) {
              message.error('图片尺寸不合法，请重新上传')
              reject()
            }else {
              resolve()
            }
          }
        })
      }
    }
    return true
  }
  render() {
    const { antdOptions, action, disabled, buttonOptions = {}, buttonText = '上传' } = this.props
    const { loading } = this.state
    return (
      <div>
        <Upload
          name="file"
          multiple={false}
          action={action}
          disabled={disabled}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          withCredentials={true}
          beforeUpload={this.beforeUpload}
          showUploadList={false}
          {...antdOptions}
          headers={{
            'x-referer': location.href,
            'Accept': 'application/json',
          }}
        >
          <Button loading={loading} type="primary" {...buttonOptions}>{buttonText}</Button>
        </Upload>
      </div>
    )
  }
}