function getPois(lat, lon) {
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
    },
    fail: () => console.error('################something is wrong'),
    complete: () => {
      isLoading = false;
    }
  })
}
module.exports = {
  getPois: getPois,
}
