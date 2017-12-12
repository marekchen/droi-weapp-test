// pages/user.js
const { DroiUser, DroiError } = require('../../utils/droi-baas-weapp-min')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    username: '',
    password: '',
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
  updateUsername: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      username: value
    });
  },
  updatePassword: function ({
    detail: {
      value
    }
  }) {
    this.setData({
      password: value
    });
  },
  save: function () {
    this.setData({
      error: null,
    });
    const { username, password } = this.data;
    let user = DroiUser.createUser();
    if (username) {
      user.UserId = username
    }
    if (password) {
      user.Password = password;
    }
    user.signup().then(() => {
      console.log('success');
      wx.showToast({
        title: '注册成功',
        icon: 'success',
      });
    }).catch(error => {
      let errorMessage;
      if (error.code == DroiError.USER_ALREADY_EXISTS) {
        errorMessage = "用户已被注册";
      } else {
        errorMessage = "发生错误：" + error;
      }
      this.setData({
        error: errorMessage,
      });
    });
  }
})