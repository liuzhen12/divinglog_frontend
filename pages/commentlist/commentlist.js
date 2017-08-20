Page({
  data: {
    commentLink: '',
    comment: [],
    isFromSearch: true,
    searchLoading: false,
    searchLoadingComplete: false,
  },
  onLoad: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })
    that.setData({
      commentLink: option.url,
    })
    this.fetchSearchList();
  },

  fetchSearchList: function () {
    let that = this,
      searchPageNum = that.data.searchPageNum,
      token = wx.getStorageSync('access_token'),
      params = {
        'access-token': token,
        currentPage: searchPageNum,
      };
    getData(that.data.commentLink, params, function (data) {
      if (data.items.length != 0) {
        var comment_from_rs = data.items;
        var newDate = new Date();
        for (var i = 0; i < comment_from_rs.length; i++) {
          newDate.setTime(parseInt(comment_from_rs[i]['remark_time']) * 1000);
          comment_from_rs[i]['remark_time'] = newDate.toLocaleString();
        }
        var comment = that.data.isFromSearch ? comment_from_rs : that.data.comment.concat(comment_from_rs);
        var url = data._links.next ? data._links.next.href : '';
        that.setData({
          comment: comment,
          commentLink: url,
          searchLoading: url ? true : false,
          searchLoadingComplete: url ? false: true,
        })
      }
    })

  },

  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false 
      });
      that.fetchSearchList();
    }
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