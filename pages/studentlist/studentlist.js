Page({
    data: {
      student: []
    },
    onLoad: function(option){
      var that = this;
      var token = wx.getStorageSync('access_token');
      var params = { 'access-token': token };
      getData(option.url, params, function(data){
        while (data.items.length < 6) {
          data.items.push(data.items[0]);
        }
        that.setData({
          student: data.items
        })
      })
    }
});


function getData(url, params, callback) {
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json'
    },
    data: params,
    complete: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
      else {
        console.log(res.data.message);
        callback();

      }
    }
  })
}