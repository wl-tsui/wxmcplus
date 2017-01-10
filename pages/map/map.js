//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    lng: 113.324520,
    lat: 23.099994,
    markers: [{
      iconPath: "./images/0.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 40,
      height: 51
    }],
    controls: [{
      id: 1,
      iconPath: './images/1.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 40,
        height: 51
      },
      clickable: true
    }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  bindViewTap(e) {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
        // this.mapCtx.moveToLocation()
      }
    })    
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('mcMap')
  },
  onLoad: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res)
        that.setData({
　　　　　　 hasLocation: true,
　　　　　　 lng: res.longitude, 
            lat: res.latitude
　　　　})
        // success
        // wx.openLocation({
        //   latitude: res.latitude, // 纬度，范围为-90~90，负数表示南纬
        //   longitude: res.longitude, // 经度，范围为-180~180，负数表示西经
        //   scale: 16, // 缩放比例

        // })
      }
    })
  }
})
