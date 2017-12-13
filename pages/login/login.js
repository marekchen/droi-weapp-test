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
    wx.setNavigationBarTitle({
      title: '登录 | 注册'
    });
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
  login: function () {
    this.setData({
      error: null,
    });
    const { username, password } = this.data;
    wx.showLoading({
      title: '登录中...',
    })
    DroiUser.login(username, password).then(() => {
      console.log('success');
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success',
      });
      wx.navigateBack({
        delta: 1
      });
    }).catch(error => {
      wx.hideLoading();
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
  },
  signup: function () {
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
    wx.showLoading({
      title: '注册中...',
    })
    user.signup().then(() => {
      wx.hideLoading();
      console.log('success');
      wx.showToast({
        title: '注册成功',
        icon: 'success',
      });
      wx.navigateBack({
        delta: 1
      });
    }).catch(error => {
      wx.hideLoading();
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