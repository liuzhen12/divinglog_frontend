var Util = require('../../utils/util.js')
Page({
    data: {
        access_token: '',
        id: '',
        links: '',
        editStatus: '',
        equiptype: '',
        brand: '',
        model: ''
    },
    typeInput: function(e){
        this.setData({
          equiptype : e.detail.value
        })
    },
    brandInput: function(e){
        this.setData({
          brand: e.detail.value
        })
    },
    modelInput: function(e){
        this.setData({
          model: e.detail.value
        })
    },
    onLoad: function(options){
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
              key: 'equipStatus',
              success: function (resEquipStatus) {
                that.setData({
                  editStatus: resEquipStatus.data
                });
                if (resEquipStatus.data =='Edit'){
                  wx.getStorage({
                    key: 'equipLinks',
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
                                equiptype: resList.data.type,
                                brand: resList.data.brand,
                                model: resList.data.model
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
    btnSave: function(){
      wx.showLoading({
        title: 'Saving',
      })
      if (this.data.editStatus == 'Edit'){
        wx.request({
          url: this.data.links.edit.href + "?access-token=" + this.data.access_token,
          data: Util.json2Form({
            brand: this.data.brand,
            type: this.data.equiptype,
            model: this.data.model,
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
      else{
        console.log('Add')
        console.log(this.data.access_token)
        var that = this;
        wx.getStorage({
          key: 'meLinks',
          success: function (meLinks) {
            console.log(meLinks.data)
            console.log(meLinks.data.equip.href)
            wx.request({
              url: meLinks.data.equip.href + "?access-token=" + that.data.access_token,
              data: Util.json2Form({
                brand: that.data.brand,
                type: that.data.equiptype,
                model: that.data.model,
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
    btnDelete: function(){
      wx.showLoading({
        title: 'Deleting',
      })
      wx.request({
        url: this.data.links.delete.href + "?access-token=" + this.data.access_token,
        data: Util.json2Form({
          brand: this.data.brand,
          type: this.data.equiptype,
          model: this.data.model,
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