export const copyProperties = (target, source) => {
  const result = {...target}
  Object.keys(target).forEach(key => {
    if (key in source) {
      result[key] = source[key]
    }
  })
  return result
}

export const blobToFile = (theBlob, fileName, type) => {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  let files = new window.File([theBlob], fileName, {type})
  return files
}

export const loadImg = (url) => {
  let image = new Image()
  return new Promise((resolve, reject) => {
    image.onload =  function() {
      resolve({
        img: this,
        width: image.width,
        height: image.height
      })
    }
    image.onerror =  function() {
      reject()
    }
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url // 指定Image的路径
  })
}
