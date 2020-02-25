// eslint-disabled

Image.prototype.load = function(url, { onProgress = function() {} }) {
  return new Promise((resolve, reject) => {
    var thisImg = this
    var xmlHTTP = new XMLHttpRequest()
    xmlHTTP.open('GET', url, true)
    xmlHTTP.responseType = 'arraybuffer'

    xmlHTTP.onload = function(e) {
      var blob = new Blob([this.response])
      thisImg.src = window.URL.createObjectURL(blob)
      resolve()
    }
    xmlHTTP.onprogress = function(e) {
      onProgress(parseInt((e.loaded / e.total) * 100))
    }

    xmlHTTP.onerror = onabort = function() {
      reject()
    }
    xmlHTTP.send()
  })
}

import { useEffect, useState } from 'react'

const [percent, setPercent] = useState(0)
const [isLoaded, setIsLoaded] = useState(false)
export default function({ src, Container, children }) {
  useEffect(
    function() {
      const Img = new Image()

      Img.load(src, {
        onProgress(percent) {
          setPercent(percent)
        },
      })
        .then(() => {
          setIsLoaded(true)
        })
        .catch(() => {
          setIsLoaded(false)
        })
    },
    [src],
  )
  if (isLoaded) {
    ;<Container>{children}</Container>
  }

  return <Container>download {percent}</Container>
}
