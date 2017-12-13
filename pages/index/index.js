const { DroiUser } = require('../../utils/droi-baas-weapp-min');

const app = getApp()

Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  onLoad: function () {
    // let user = DroiUser.getCurrentUser();
    // if (user != null && user.isLoggedIn()) {
    console.log('index');
    wx.redirectTo({
      url: '/pages/albumList/albumList',
    });
    // } else {
    //   console.log('需要登录');
    //   wx.redirectTo({
    //     url: '/pages/login/login',
    //   });
    // }
  }
})
