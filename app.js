//app.js
const { DroiUser, DroiCore, DroiPermission } = require('./utils/droi-baas-weapp-min');

DroiCore.initializeCore("kgotmbzhvdZZbRem9j0h9waEeAyhc0L7lQAAwKII", "W9RMgZxSXLr5pJsj6tthS72XmLo_pJQl0ydXHjAF1oSXkOd4N2sXuLSTQaCwbBYw");

App({
  onLaunch: function(){
    let permission = new DroiPermission();
    permission.setPublicReadPermission(true);
    permission.setPublicWritePermission(false);
    DroiPermission.setDefaultPermission(permission);
  },
  globalData: {
    userInfo: null
  }
})