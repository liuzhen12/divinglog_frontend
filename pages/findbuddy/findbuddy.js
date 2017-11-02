var dateUtils = require("../../utils/dateUtils.js");

Page({
    data: {
        inputShowed: false,
        inputVal: "",
        start_date: "",
        end_date: "",
        array: [],
        access_token: '',
        initiallistLink: '',
        activitysLink: '',
        searchLoading: false,
        searchLoadingComplte: false,
        batchLoadingComplete: true,
        content_height:"",
        northeast: {
          latitude:null,
          longitude:null
        },
        southwest: {
          latitude:null,
          longitude:null
        },
        extraLinks:[]
    },
    onShow: function(){
        console.log(this.data.northeast);
        console.log(this.data.southwest);
    },
    onLoad: function (options) {
      var that = this;
      //处理内容区域高度
      wx.getSystemInfo({
            success: function (res) {
              console.log(res);
              // 计算主体部分高度,单位为px
              that.setData({
                content_height: (res.windowHeight - 38 - 40)+"px"
              });
            }
      });
      //获取当前日期
      let nowDate = new Date();

      this.setData({
          start_date: dateUtils.formatDate(nowDate),
          end_date: dateUtils.formatDate(dateUtils.addDays(nowDate,7))
      });

      this.setData({
        start_date_short: this.data.start_date.substring(5),
        end_date_short: this.data.end_date.substring(5)
      });

      var token = wx.getStorageSync('access_token')
      var links = wx.getStorageSync('indexLinks')
      var params = { 'access-token': token };
      that.setData({
        access_token: token,
      });
      that.setData({
        initiallistLink: links.activity.href,
        activitysLink: links.activity.href
      })

      this.getActivityList();
    },

    selectLocation: function(e) {
        wx.navigateTo({
          url: '../map/map?showMarkers=true&getNortheast=true&getSouthwest=true&triggerOnLoad=true',
          success: function(res){
            console.log(res);
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        });
    },

    startDatePickerBindchange: function(e) {
        this.setData({
          start_date: e.detail.value,
          start_date_short: e.detail.value.substring(5)
        });
        this.getActivityList();
    }, 

    endDatePickerBindchange: function(e) {
        this.setData({
          end_date: e.detail.value,
          end_date_short: e.detail.value.substring(5)
        });
        this.getActivityList();
    },

    findbuddyEdit: function(e){
      console.log(e);
      wx.setStorage({
        key: "findbuddysearchLinks",
        data: e.currentTarget.dataset.links
      })
      wx.navigateTo({
        url: '../findbuddysearch/findbuddysearch'
      })
    },

    getActivityList: function (refresh = true){
      var that = this
      var token = wx.getStorageSync('access_token');
      let reqData = {
        start_date: that.data.start_date,
        end_date: that.data.end_date,
        'access-token': token
      };
      if (null != that.data.northeast.longitude) {
        reqData.northeast_longitude = that.data.northeast.longitude;
      }
      if (null != that.data.northeast.latitude) {
        reqData.northeast_latitude = that.data.northeast.latitude;
      }
      if (null != that.data.southwest.longitude) {
        reqData.southwest_longitude = that.data.southwest.longitude;
      }
      if (null != that.data.southwest.latitude) {
        reqData.southwest_latitude = that.data.southwest.latitude;
      }

      getData(that.data.activitysLink, reqData, function (activity_data) {
        var activityItems = activity_data.items;
        
        for (let i = 0; i < activityItems.length; i++) {
          let d = new Date(activityItems[i].start_date);
          activityItems[i].timeline_month = dateUtils.getMonthsInEn(d.getMonth());
          activityItems[i].timeline_day = d.getDate();
        }

        var activityArray = refresh ? activityItems : that.data.array.concat(activityItems);
        var nextUrl = activity_data._links.next ? activity_data._links.next.href : that.data.initiallistLink;
        var extralinks = activity_data._extra
        that.setData({
          array: activityArray,
          activitysLink: nextUrl,
          extraLinks: extralinks,
          searchLoading: activity_data._links.next ? true : false,
          searchLoadingComplete: activity_data._links.next ? false : true,
          batchLoadingComplete: true
        })
      })
    },

    searchScrollLower: function () {
      if (this.data.batchLoadingComplete && this.data.searchLoading && !this.data.searchLoadingComplete) {
        this.setData({
          batchLoadingComplete: false
        });
        this.fetchSearchList(false);
      }
    },

    scroll: function (e, res) {
      // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
      if (e.detail.scrollTop > 500) {
        this.setData({
          floorstatus: true
        });
      } else {
        this.setData({
          floorstatus: false
        });
      }
    },

    create: function(){
      wx.setStorage({
        key: "findbuddyCreateLinks",
        data: this.data.extraLinks.create
      }),
      wx.navigateTo({
        url: '../findbuddycreate/findbuddycreate'
      })
    },

    mine: function(){
      wx.setStorage({
        key: "findbuddyMineLinks",
        data: this.data.extraLinks.mine
      }),
      wx.navigateTo({
        url: '../findbuddylist/findbuddylist'
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