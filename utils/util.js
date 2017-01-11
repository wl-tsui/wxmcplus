function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getPois(lat, lng) {
  var pois = new Array();
  wx.request({
    url: "http://hbtest.dworld.cn/Map/getMapInfo",
    data: '{ "lat": ' + lat + ', "lon": ' + lng + ', "type": "osm" }',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    success: res => {
      // console.log(res.data.main.pois)
      var ar = new Array();
      for (var k in res.data.main.pois) {
        var _data = new Object();
        _data.iconPath = "./images/"+res.data.main.pois[k].race+".png"
        _data.latitude = res.data.main.pois[k].latitude
        _data.longitude = res.data.main.pois[k].longitude
        _data.id = k
        _data.width = 40
        _data.height = 40
        // console.log(JSON.stringify(_data))
        ar.push(_data)
      }
      console.log(ar)
      onSuccess(ar)
    },
    fail: () => console.error('something is wrong'),
    complete: () => console.log('json data is loaded')
  })
  console.log(pois)
  // console.log(JSON.parse(JSON.stringify(pois)))
}

module.exports = {
  formatTime: formatTime,
  getPois: getPois
}
