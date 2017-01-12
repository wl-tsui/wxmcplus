//map.js
//add by wl-tsui, 2017.1.10
//地图显示和操作


var util = require('../../utils/util.js')
var pois = [];
var app = getApp()
Page({
  data: {
    markers: [],
    poi: {},
    lat: '',
    lng: '',
    controls: [{
      id: 2,
      iconPath: './images/gis.png',
      position: {
        left: 5,
        top: 600 - 30,
      },
      clickable: true
    },
    {
      id: 1,
      iconPath: './images/center.png',
      position: {
        left: 200,
        top: 300 - 30,
      },
      clickable: false
    },
    {
      id: 3,
      iconPath: './images/search.png',
      position: {
        left: 330,
        top: 600 - 30,
      },
      clickable: true
    }]
  },
  regionchange(e) {
    //地图视野发生变化的时候，获取中心的坐标
    //begin => end 
    if (e.type == "end") {
      const that = this;
      this.mapCtx.getCenterLocation({
        success: function (res) {
          console.log("****now center,  lat: ", res.latitude, ", lon: ", res.longitude)
          that.setData({
            lat: res.latitude,
            lng: res.longitude
          });
          that.getPois(res.latitude, res.longitude)
          // this.mapCtx.moveToLocation()
        }
      })
    }
  },
  markertap(e) {
    var that = this;
    that.setData({
      poi:{
        name: that.pois[e.markerId].name,
        level: that.pois[e.markerId].level
      }
    })
  },
  controltap(e) {
    const that = this;
    if (e.controlId == 3) {
      wx.chooseLocation({
        success: function (res) {
          console.log("chooseLocation,  lat: ", res.latitude, ", lon: ", res.longitude)
          that.setData({
            lat: res.latitude,
            lng: res.longitude
          });
          that.getPois(res.latitude, res.longitude)
        }
      })
    } else if (e.controlId == 2) {
      wx.getLocation({
        type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          console.log("location,  lat: ", res.latitude, ", lon: ", res.longitude)
          that.setData({
            lat: res.latitude,
            lng: res.longitude
          });
          that.getPois(res.latitude, res.longitude)
        }
      })
    }
  },
  bindViewTap(e) {
  },
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文 
    this.mapCtx = wx.createMapContext('mcMap')
  },
  onShow: function () {
    // console.log(this.data.markers)
  },
  onLoad: function () {
    const that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log("location,  lat: ", res.latitude, ", lon: ", res.longitude)
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        });
        that.getPois(res.latitude, res.longitude)
      }
    })
  },

  getPois(lat, lon) {
    const that = this;
    var displayType = "pois"; //other
    wx.request({
      url: "http://hbtest.dworld.cn/Map/getMapInfo",
      data: '{ "lat": ' + lat + ', "lon": ' + lon + ', "type": "osm", "gType": "'+displayType+'" }',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: res => {
        if( displayType == "other" ){
          that.pois = res.data.main.allthings;
        }else{
          that.pois = res.data.main.pois;
        }
        // console.log(that.pois)
        var ar = new Array();
        for (var k in that.pois) {
          var _data = new Object();
           if( displayType == "other" ){
            if( that.pois[k].type == 1 )
              _data.iconPath = "./images/money.png"
            else
              _data.iconPath = "./images/hero.png"
          }else{
            _data.iconPath = "./images/" + that.pois[k].race + ".png"
            _data.title = that.pois[k].name
          }
          _data.latitude = that.pois[k].latitude
          _data.longitude = that.pois[k].longitude
          _data.id = k
          // _data.width = 40
          // _data.height = 51
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
