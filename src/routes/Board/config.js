export const halfInputStyle = {
  width: '40%'
}

export const fontFamilyList = [
  {
    value: 'Alibaba-PuHuiTi',
    label: 'Alibaba-PuHuiTi',
  },
  {
    value: 'DINSchrift',
    label: 'DINSchrift',
  },
]

export const lockedRadioOptions = [
  {
    label: '是',
    value: true,
  },
  {
    label: '否',
    value: false,
  }
]

export const defaultTag = 'https://img.gegejia.com/item-adminab3c039c3c4f4a34aa3f69ba6833c946.png'
export const background = 'https://img.gegejia.com/item-admin/7dbda4dbe65f4f28b406e5c7badfdf11.png'

export const defaultTextOptions = {
  lockUniScaling: true,
  centeredRotation: true,
  skipTargetFind: true,
  lockScalingX: true,
  lockScalingY: true,
  locked: false,
  fontFamily: 'Alibaba-PuHuiTi', // DINSchrift
  fontSize: 20,
  fontWeight: 400,
  fill: '#000000',
  length: 20,
}
export const defaultImageOptions = {
  lockRotation: true,
  angle: 0,
  lockUniScaling: true,
}

export const defaultImageControls = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  fill: '#000000',
}

export const defaultTextControls = {
  left: 0,
  top: 0,
  angle: 0,
  fontFamily: '',
  fontWeight: '',
  lineHeight: 0,
  charSpacing: 0,
  fontSize: 20,
  fill: '#000',
  text: '',
  length: 20,
  locked: false,
}

export const totalLimit = 15

const dinOptions = {
  locked: true,
  fontFamily: 'DINSchrift',
  fontWeight: 400,
  fontSize: 22,
  fill: '#ffffff'
}
const hanOptions = {
  locked: true,
  fontFamily: 'Alibaba-PuHuiTi',
  fontWeight: 700,
  fontSize: 22,
  fill: '#ffffff'
}
export const defaultInitTextsOptions = [
  {...hanOptions, text: '会员到手价', left: 600, top: 552, length: 5},
  {...dinOptions, text: '¥', left: 584, top: 616, fontSize: 50, length: 1},
  {...dinOptions, text: '666', name: 'memberPrice', left: 608, top: 576, fontSize: 102, length: 20},
  {...hanOptions, text: '日常价', left: 584, top: 672, length: 3},
  {...dinOptions, text: '¥', left: 650, top: 672, length: 1},
  {...dinOptions, text: '999', name: 'price', left: 661, top: 672, length: 20},
]
