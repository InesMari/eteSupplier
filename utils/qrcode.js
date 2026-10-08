import jsQR from 'jsqr'

/**
 * 从图片文件路径识别二维码
 * @param {string} imagePath - 图片路径（本地路径）
 * @returns {Promise<string|null>} - 返回识别到的二维码内容，失败返回null
 */
function scanQRCode(imagePath) {
  return new Promise((resolve, reject) => {
    // 1. 获取图片信息
    wx.getImageInfo({
      src: imagePath,
      success: (imageInfo) => {
        const { width, height } = imageInfo;
        
        // 2. 创建 canvas 上下文
        const canvasId = 'qrCanvas';
        const canvasNode = wx.createOffscreenCanvas({
          type: '2d',
          width: width,
          height: height
        });

        const ctx = canvasNode.getContext('2d');
        const img = canvasNode.createImage();

        // 3. 绘制图片到 canvas
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);

          // 4. 获取图片数据
          const imageData = ctx.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            console.log('识别到的二维码:', code.data);
            resolve(code.data);
          } else {
            console.log('未识别到二维码');
            resolve(null);
          }
        };

        img.onerror = (err) => {
          console.error('图片加载失败:', err);
          reject(err);
        };

        img.src = imagePath;
      },
      fail: (err) => {
        console.error('获取图片信息失败:', err);
        reject(err);
      }
    });
  });
}

module.exports = {
  scanQRCode
};
