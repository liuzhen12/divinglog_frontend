var Util = require('../../utils/util.js')
Page({
  data: {
    access_token: '',
    id: '',
    links: '',
    editStatus: '',
    organization: '',
    level: '',
    diveNo: '',
    instructor: '',
    stamplink:''
  },
  orgInput: function (e) {
    this.setData({
      organization: e.detail.value
    })
  },
  levelInput: function (e) {
    this.setData({
      level: e.detail.value
    })
  },
  divenoInput: function (e) {
    this.setData({
      diveNo: e.detail.value
    })
  },
  onLoad: function (option) {
    var that = this;
    if(option.status=='Stamp'){
      console.log(option)
      var token = wx.getStorageSync('access_token')
      var id = wx.getStorageSync('id')
      var stamplink = option.stamplink
      that.setData({
        access_token: token,
        id: id,
        editStatus: option.status,
        stamplink: stamplink
      });
      wx.request({
        url: stamplink + "?access-token=" + token,
        data: {

        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (resList) {
          console.log(resList)
          if (resList.data != null) {
            that.setData({
              organization: resList.data.organization,
              level: resList.data.level,
              diveNo: resList.data.no,
              instructor: resList.data.coach
            });
          }
          else {
            console.log('errer')
          }
        }
      })
    }
    else{
      var token = wx.getStorageSync('access_token')
      var id = wx.getStorageSync('id')
      var editStatus = wx.getStorageSync('melevelStatus')
      that.setData({
        access_token: token,
        id: id,
        editStatus: editStatus
      });
      if (editStatus == 'Edit') {
        var links = wx.getStorageSync('melevelLinks')
        that.setData({
          links: links,
          stamplink: links.self.href
        });
        if (links != null || typeof (links) != 'undefined') {
          wx.request({
            url: links.self.href + "?access-token=" + token,
            data: {

            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (resList) {
              console.log(resList)
              if (resList.data != null) {
                that.setData({
                  organization: resList.data.organization,
                  level: resList.data.level,
                  diveNo: resList.data.no,
                  instructor: resList.data.coach
                });
              }
              else {
                console.log('errer')
              }
            }
          })
        }
      } 
    }
    
  },
  btnSave: function () {
    wx.showLoading({
      title: 'Saving',
    })
    if (this.data.editStatus == 'Edit') {
      wx.request({
        url: this.data.links.edit.href + "?access-token=" + this.data.access_token,
        data: Util.json2Form({
          organization: this.data.organization,
          level: this.data.level,
          no: this.data.diveNo,
          user_id: this.data.id
        })
        ,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "PUT",
        complete: function (res1) {
          if (res1 == null || res1.statusCode != 200) {
            console.error(res1.statusCode);
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
            wx.showToast({
              title: 'save fail',
              icon: 'fail',
              duration: 2000
            })
            setTimeout(function () {
              wx.hideToast()
            }, 2000)
            return;
          }
          console.log(res1)
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: 'save success',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.onLoad()
          }
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
    else {
      console.log('Add')
      console.log(this.data.access_token)
      var that = this;
      wx.getStorage({
        key: 'meLinks',
        success: function (meLinks) {
          console.log(meLinks.data)
          console.log(meLinks.data.level.href)
          wx.request({
            url: meLinks.data.level.href + "?access-token=" + that.data.access_token,
            data: Util.json2Form({
              organization: that.data.organization,
              level: that.data.level,
              no: that.data.diveNo,
              user_id: that.data.id
            })
            ,
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            complete: function (res2) {
              console.log(res2)
              if (res2 == null || res2.statusCode != 201) {
                console.error(res2.statusCode);
                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
                wx.showToast({
                  title: 'save fail',
                  icon: 'fail',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.hideToast()
                }, 2000)
                return;
              }
              console.log(res2)
              setTimeout(function () {
                wx.hideLoading()
              }, 2000)
              wx.showToast({
                title: 'save success',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                wx.hideToast()
              }, 2000)
              var pages = getCurrentPages();
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //关键在这里
                prePage.onLoad()
              }
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })

    }
  },
  btnDelete: function () {
    wx.showLoading({
      title: 'Deleting',
    })
    wx.request({
      url: this.data.links.delete.href + "?access-token=" + this.data.access_token,
      data: Util.json2Form({
        organization: this.data.organization,
        level: this.data.level,
        no: this.data.diveNo,
        user_id: this.data.id
      })
      ,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "DELETE",
      complete: function (res1) {
        if (res1 == null || res1.statusCode != 204) {
          console.error(res1.statusCode);
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: 'save fail',
            icon: 'fail',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          return;
        }
        console.log(res1)
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: 'Delete Success',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  btnStamp:function(){
    wx.showLoading({
      title: 'Saving',
    })
    wx.request({
      url: this.data.stamplink + "?access-token=" + this.data.access_token,
      data: Util.json2Form({
        coach_id: this.data.id
      })
      ,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "PUT",
      complete: function (res1) {
        if (res1 == null || res1.statusCode != 200) {
          console.error(res1);
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          wx.showToast({
            title: res1.data[0].message,
            icon: 'fail',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          return;
        }
        console.log(res1)
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        wx.showToast({
          title: 'save success',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideToast()
        }, 2000)
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  onShareAppMessage: function () {
    return {
      title: 'Stamp',
      path: '/pages/meleveledit?status=Stamp&stamplink=' + this.data.stamplink,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
});