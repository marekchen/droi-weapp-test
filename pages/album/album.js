const { listToMatrix, always } = require('../../utils/util.js');
const { DroiUser, DroiError, DroiFile, DroiObject, DroiQuery } = require('../../utils/droi-baas-weapp-min')

Page({
  data: {
    // 相册列表数据
    albumList: [],

    // 图片布局列表（二维数组，由`albumList`计算而得）
    layoutList: [],

    // 布局列数
    layoutColumnSize: 3,

    // 是否显示动作命令
    showActionsSheet: false,

    // 当前操作的图片
    imageInAction: '',

    // 图片预览模式
    previewMode: false,

    // 当前预览索引
    previewIndex: 0,
  },

  // 隐藏动作列表
  hideActionSheet() {
    this.setData({ showActionsSheet: false, imageInAction: '' });
  },

  onLoad() {
    this.renderAlbumList();
    this.getAlbumList().then((list) => {
      let photoList = [];
      list.forEach((value, index, array) => {
        photoList.push(value.getValue('photo').getValue('_MongoDmd')['CDN']);
      });
      wx.hideLoading();
      this.setData({ 'albumList': this.data.albumList.concat(photoList) });
      this.renderAlbumList();
    }).catch(error => {
      let errorMessage = "发生错误：" + error;
      wx.hideLoading();
      wx.showToast({
        title: "查询失败",
        image: '../../images/camera.png'
      });
    });
  },

  // 获取相册列表
  getAlbumList() {
    wx.showLoading({
      title: '加载列表中…',
      mask:true
    });
    //setTimeout(() => wx.hideLoading(), 1000);
    let query = DroiQuery.create("Album");
    return query.runQuery();
  },

  // 渲染相册列表
  renderAlbumList() {
    let layoutColumnSize = this.data.layoutColumnSize;
    let layoutList = [];

    if (this.data.albumList.length) {
      layoutList = listToMatrix([0].concat(this.data.albumList), layoutColumnSize);
      
      let lastRow = layoutList[layoutList.length - 1];
      if (lastRow.length < layoutColumnSize) {
        let supplement = Array(layoutColumnSize - lastRow.length).fill(0);
        lastRow.push(...supplement);
      }
    }
    console.log(layoutList);
    this.setData({ layoutList });
  },

  // 从相册选择照片或拍摄照片
  chooseImage() {
    let that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        wx.showLoading({
          title: '正在上传图片…',
          mask: true
        });
        var tempFilePaths = res.tempFilePaths;
        let droifile = DroiFile.createFile(tempFilePaths[0]);
        droifile.then(file => {
          let obj1 = DroiObject.createObject("Album");
          obj1.setValue('photo', file);
          obj1.save().then(() => {
            console.log('success');
            file.getUris(false).then((urls) => {
              that.hideLoading();
              let albumList = this.data.albumList;
              albumList.unshift(urls);
              that.setData({ albumList });
              that.renderAlbumList();
              wx.showToast({
                title: "图片上传成功",
                icon: 'success',
              });
            })
          }).catch(error => {
            let errorMessage = "发生错误：" + error;
            that.hideLoading();
            wx.showToast({
              title: "图片上传失败",
              image: '../../images/camera.png'
            });
          })
        })
      },
    });
  },

  // 进入预览模式
  enterPreviewMode(event) {
    if (this.data.showActionsSheet) {
      return;
    }

    let imageUrl = event.target.dataset.src;
    let previewIndex = this.data.albumList.indexOf(imageUrl);

    this.setData({ previewMode: true, previewIndex: previewIndex });
  },

  // 退出预览模式
  leavePreviewMode() {
    this.setData({ previewMode: false, previewIndex: 0 });
  },

  // 显示可操作命令
  showActions(event) {
    this.setData({ showActionsSheet: true, imageInAction: event.target.dataset.src });
  },

  // 下载图片
  downloadImage() {
    wx.showLoading({
      title: '正在保存图片…',
      mask: true
    });
    console.log('download_image_url', this.data.imageInAction);
    let imageUrl = this.data.imageInAction;
    if (imageUrl.startsWith('http:')){
      imageUrl = imageUrl.replace(/http/,'https');
    }
    wx.downloadFile({
      url: imageUrl,
      type: 'image',
      success: (resp) => {
        wx.saveFile({
          tempFilePath: resp.tempFilePath,
          success: (resp) => {
            wx.showToast({
              title: '图片保存成功',
              icon:'success'
            });
          },

          fail: (resp) => {
            console.log('fail', resp);
          },

          complete: (resp) => {
            console.log('complete', resp);
            this.hideLoading();
          },
        });
      },

      fail: (resp) => {
        console.log('fail', resp);
      },
    });

    this.setData({ showActionsSheet: false, imageInAction: '' });
  },

  // 删除图片
  deleteImage() {
    let imageUrl = this.data.imageInAction;
    let filepath = '/' + imageUrl.split('/').slice(3).join('/');
  
    wx.showLoading({
      title: '正在删除图片…',
      mask: true
    });
    this.setData({ showActionsSheet: false, imageInAction: '' });

    request({
      method: 'POST',
      url: api.getUrl('/delete'),
      data: { filepath },
    })
      .then((resp) => {
        if (resp.code !== 0) {
          // 图片删除失败
          return;
        }

        // 从图片列表中移除
        let index = this.data.albumList.indexOf(imageUrl);
        if (~index) {
          let albumList = this.data.albumList;
          albumList.splice(index, 1);

          this.setData({ albumList });
          this.renderAlbumList();
        }
        wx.showToast({
          title: '图片删除成功',
          icon: 'success'
        });
      })
      .catch(error => {
        console.log('failed', error);
      })
      .then(() => {
        this.hideLoading();
      });
  },
});