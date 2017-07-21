Page({
  data: {
    url: '',
    comment: [],
    isFromSearch: true,
    searchLoading: false,
    searchLoadingComplete: false,
  },
  onLoad: function (option) {
    this.setData({
      url: option.url
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
    getData(that.data.url, params, function (data) {
      if (data.items.lenght != 0) {
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
          url: url,
          searchLoading: url ? true : false,
          searchLoadingComplete: url ? false: true,
        })
      }
    })

  },

  searchScrollLower: function () {
    let that = this;
    console.log(that.data.searchLoading);
    console.log(that.data.searchLoadingComplete);
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        // searchPageNum: that.data.searchPageNum + 1, //每次触发上拉事件，把searchPageNum+1 
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