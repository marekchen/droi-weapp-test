// pages/albumList/albumList.js
const { DroiUser, DroiError, DroiFile, DroiObject, DroiQuery, DroiPermission } = require('../../utils/droi-baas-weapp-min')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList: [],
    showModal: false,
    newAlbumName: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '相册列表'
    });
    this.fetchAlbumList();
  },

  fetchAlbumList: function () {
    wx.showLoading({
      title: '加载中...',
    })
    let query = DroiQuery.create("Album");
    query.runQuery().then((list) => {
      let albumList = [];
      list.forEach((value, index, array) => {
        //console.log(value);
        //console.log(JSON.parse(value.toJSON()));
        //console.log(value.properties['name']);
        albumList.push(JSON.parse(value.toJSON()));
        //albumList.push(DroiObject.exportProperties(value,3,true));
      });
      //albumList = list;
      this.setData({ 'albumList': albumList });
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }).catch(error => {
      let errorMessage = "发生错误：" + error;
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: "查询失败",
        image: '../../images/camera.png'
      });
    });
  },

  addAlbum: function () {
    wx.showLoading({
      title: '新建相册中...',
    })
    let that = this;
    let permission = new DroiPermission();
    permission.setPublicReadPermission(false);
    permission.setPublicWritePermission(false);
    let albumObject = DroiObject.createObject('Album');
    albumObject.setValue("name", this.data.newAlbumName);
    albumObject.setValue("amount", 0);
    albumObject.permission = permission;
    albumObject.save().then(() => {
      wx.hideLoading();
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      });
      that.fetchAlbumList();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        title: '创建失败',
        icon: 'success'
      });
    });
  },

  chooseAlbum: function (event) {
    console.log(event);
    let albumId = event.currentTarget.id;
    let albumName = event.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/album/album?id=${albumId}&name=${albumName}`,
    })
  },

  inputChange: function (e) {
    this.setData({ 'newAlbumName': e.detail.value });
  },

  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },

  preventTouchMove: function () {
  },

  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  onCancel: function () {
    this.setData({ 'newAlbumName': "" });
    this.hideModal();
  },

  onConfirm: function () {
    this.hideModal();
    this.addAlbum();
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
    this.fetchAlbumList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})