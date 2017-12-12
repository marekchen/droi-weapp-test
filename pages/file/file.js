// pages/file/file.js
const { DroiUser, DroiError, DroiFile } = require('../../utils/droi-baas-weapp-min')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filepath: null,
    error: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  choose: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        that.setData({
          filepath: tempFilePaths
        });
      }
    })
  },

  saveFile: function () {
    this.setData({
      error: null,
    });
    const { filepath } = this.data;
    let droifile = DroiFile.createFile(filepath[0]);
    console.log(droifile);
    console.log(droifile.MD5);
    droifile.then(file => {
      file.save((e) => {

      }).then(() => {
        console.log('success');
        file.getUris(false).then((urls)=>{
          console.log(urls);
          wx.showToast({
            title: urls[0],
            icon: 'success',
          });
        })
      }).catch(error => {
        let errorMessage = "发生错误：" + error;;
        this.setData({
          error: errorMessage,
        });
      })
    })
    //   const { username, password } = this.data;
    //   let user = DroiUser.createUser();
    //   if (username) {
    //     user.UserId = username
    //   }
    //   if (password) {
    //     user.Password = password;
    //   }
    //   user.signup().then(() => {
    //     console.log('success');
    //     wx.showToast({
    //       title: '注册成功',
    //       icon: 'success',
    //     });
    //   }).catch(error => {
    //     let errorMessage;
    //     if (error.code == DroiError.USER_ALREADY_EXISTS) {
    //       errorMessage = "用户已被注册";
    //     } else {
    //       errorMessage = "发生错误：" + error;
    //     }
    //     this.setData({
    //       error: errorMessage,
    //     });
    //   });
  }
})