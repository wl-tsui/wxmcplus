//map.js
//add by wl-tsui, 2017.1.10
//地图显示和操作

var util = require('../../utils/util.js')
var geo = require('../../utils/geoConverter.js')

var isLoading = false;
var pois = [];
var tileMap = new Map();
var scrW = 0;
var scrH = 0;
var app = getApp()
Page({
  data: {
    markers: [],
    poi: {},
    lat: '39.97076538357345',
    lng: '116.40680687535645'
  },
  regionchange(e) {
    //地图视野发生变化的时候，获取中心的坐标
    //begin => end 
    const that = this;
    if (e.type === "begin") {
    } else if (e.type == "end") {
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
      poi: {
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
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
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
    const that = this;
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
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        that.scrW = res.windowWidth
        that.scrH = res.windowHeight
      }
    })
    that.setData({
      controls: [{
        id: 2,
        iconPath: './images/gis.png',
        position: {
          left: 5,
          top: that.scrH - 65,
        },
        clickable: true
      },
      {
        id: 1,
        iconPath: './images/center.png',
        position: {
          left: that.scrW / 2 - 20,
          top: that.scrH / 2 - 45,
        },
        clickable: false
      },
      {
        id: 3,
        iconPath: './images/search.png',
        position: {
          left: that.scrW - 60,
          top: that.scrH - 65,
        },
        clickable: true
      }]
    })
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
    if (isLoading) return;
    const that = this;
    var _t = geo.LatLonToTile(lat, lon);
    var _k = _t.x + "_" + _t.y;
    if (tileMap.has(_k)) {
      return;
    }
    tileMap.clear();
    isLoading = true;
    var displayType = "all"; //other
    wx.request({
      // url: "http://hbtest.dworld.cn/hujianrui/Map/getMapInfo",
      url: "http://hbtest.dworld.cn/Map/getMapInfo",
      data: '{ "lat": ' + lat + ', "lon": ' + lon + ', "type": "osm", "gType": "' + displayType + '" }',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      success: res => {
        console.log(res.data)
        var ar = new Array();
        var _tt = new Array();
        for (var kk in res.data.main) {
          for (var k in res.data.main[kk]) {
            // console.log(res.data.main[kk][k])
            var _data = new Object();
            if (kk == "pois") {
              var name = parseInt(res.data.main[kk][k].name)
              if (Number.isNaN(name)) {
                _data.iconPath = "./images/" + res.data.main[kk][k].race + ".png"
              } else {
                _data.iconPath = "./images/number.png"
              }
              _data.title = res.data.main[kk][k].name
            } else {
              if (res.data.main[kk][k].type == 1) {
                _data.iconPath = "./images/money.png"
              }
              else {
                _data.iconPath = "./images/hero.png"
              }
            }
            _data.latitude = res.data.main[kk][k].latitude
            _data.longitude = res.data.main[kk][k].longitude

            var _tile = geo.LatLonToTile(_data.latitude, _data.longitude);
            var _key = _tile.x + "_" + _tile.y;
            tileMap.set(_key, "ture");

            _data.id = res.data.main[kk][k].id

            // _data.width = 40
            // _data.height = 51
            ar.push(_data)
          }
          // that.pois = that.pois.concat(res.data.main[kk]);
        }
        // console.log(tileMap)
        that.setData({
          markers: ar
        })
      },
      fail: () => console.error('################something is wrong'),
      complete: () => {
        isLoading = false;
      }
    })
  }
})
