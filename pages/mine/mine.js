const { DroiUser, DroiError } = require('../../utils/droi-baas-weapp-min');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    whichButton: 1,
    userId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的'
    });
    this.checkLogin();
  },

  checkLogin:function(){
    let user = DroiUser.getCurrentUser();
    if (user != null && user.isLoggedIn()) {
      // wx.redirectTo({
      //   url: '/pages/albumList/albumList',
      // });
      this.setData({ userId: user.UserId });
      this.setData({ whichButton: 1 });
    } else {
      this.setData({ whichButton: 2 });
      // console.log('需要登录');
      // wx.redirectTo({
      //   url: '/pages/login/login',
      // });
    }
  },

  logout: function () {
    let user = DroiUser.getCurrentUser();
    user.logout();
    this.setData({ whichButton: 2 ,userId:''});
  },

  toLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.checkLogin();
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

  }
})