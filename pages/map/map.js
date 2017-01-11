//index.js
//获取应用实例


var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    markers: [{
      iconPath: "./images/0.png",
      id: 0,
      latitude: 39.92403,
      longitude: 116.460411,
      width: 40,
      height: 51
    },
    {
      iconPath: "./images/1.png",
      id: 10,
      latitude: 39.915820,
      longitude: 116.457538,
      width: 40,
      height: 51
    }],
    controls: [{
      id: 1,
      iconPath: './images/gis.png',
      position: {
        left: 0,
        top: 600 - 30,
        width: 30,
        height: 30
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
    const that = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log("****now centerlat: ", res.latitude, ", lon: ", res.longitude)
        that.getPois(res.latitude, res.longitude) 
        // this.mapCtx.moveToLocation()
      }
    })
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('mcMap')
  },
  onShow: function () {
    console.log(this.data.markers)
  },
  onLoad: function () {
    const that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("location lat: ", res.latitude, ", lon: ", res.longitude)
        that.getPois(res.latitude, res.longitude)
      }
    })
  },
  getPois(lat, lon) {
    const that = this;
    wx.request({
      url: "http://hbtest.dworld.cn/Map/getMapInfo",
      data: '{ "lat": ' +lat + ', "lon": ' + lon + ', "type": "osm" }',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: res => {
        // console.log(res.data.main.pois)
        var ar = new Array();
        for (var k in res.data.main.pois) {
          var _data = new Object();
          _data.iconPath = "./images/" + res.data.main.pois[k].race + ".png"
          _data.latitude = res.data.main.pois[k].latitude
          _data.longitude = res.data.main.pois[k].longitude
          _data.id = res.data.main.pois[k].name
          _data.width = 40
          _data.height = 51
          ar.push(_data)
        }
        that.setData({
          markers: ar
        })
      },
      fail: () => console.error('something is wrong'),
      complete: () => console.log('json data is loaded')
    })
  }
})
