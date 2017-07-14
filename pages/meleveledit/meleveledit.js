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
    instructor: ''
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
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'access_token',
      success: function (resToken) {
        that.setData({
          access_token: resToken.data,
        });
        console.log(resToken.data)

        wx.getStorage({
          key: 'id',
          success: function (resId) {
            that.setData({
              id: resId.data
            });
          }
        })
        wx.getStorage({
          key: 'melevelStatus',
          success: function (resLevelStatus) {
            that.setData({
              editStatus: resLevelStatus.data
            });
            if (resLevelStatus.data == 'Edit') {
              
              wx.getStorage({
                key: 'melevelLinks',
                success: function (resLinks) {
                  that.setData({
                    links: resLinks.data
                  });
                  if (resLinks.data != null || typeof (resLinks.data) != 'undefined') {
                    console.log(resLinks.data)
                    wx.request({
                      url: resLinks.data.self.href + "?access-token=" + resToken.data,
                      data: {

                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      method: "GET",
                      success: function (resList) {
                        console.log(resList.data)
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
              })
            }
          }
        })

      }
    });   
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
  }
});