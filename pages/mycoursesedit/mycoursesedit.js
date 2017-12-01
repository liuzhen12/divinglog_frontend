// pages/mycoursesedit/mycoursesedit.js
var Util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: '',
    id: '',
    links: '',
    addLinks:'',
    editStatus: '',
    organization: '',
    category: '',
    duty: '',
    name:'',
    subName:'',
    duty: '',
    name:'',
    subName:'',
    orglist: '',
    orgIndex: 0,
    orgName:'',
    categoryList:'',
    categoryIndex: 0,
    categoryName:'',
    dutyList:'',
    dutyIndex:0,
    dutyName:'',
    nameList:'',
    nameIndex:0,
    nameEdit:'',
    subList:'',
    subIndex:0,
    subName:''
  },

  bindPickerOrgChange: function(e){
    this.setData({
      orgIndex: e.detail.value,
      orgName: this.data.orglist[e.detail.value].name,
      categoryList: '',
      categoryIndex: 0,
      categoryName: '',
      dutyList: '',
      dutyIndex: 0,
      dutyName: '',
      nameList: '',
      nameIndex: 0,
      nameEdit: '',
      subList: '',
      subIndex: 0,
      subName: ''
    })
    var that = this
    wx.request({
      url: this.data.addLinks.course.href + '?access-token==' + this.data.access_token,
      data:{
        p_id: this.data.orglist[e.detail.value].id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resCategory) {
        if (resCategory.data.items.length != 0) {
          that.setData({
            categoryList: resCategory.data.items,
            categoryIndex: resCategory.data.items[0].id
          })
        }
      }
    })
  },

  bindPickerCategoryChange: function (e) {
    this.setData({
      categoryIndex: e.detail.value,
      categoryName: this.data.categoryList[e.detail.value].name,
      dutyList: '',
      dutyIndex: 0,
      dutyName: '',
      nameList: '',
      nameIndex: 0,
      nameEdit: '',
      subList: '',
      subIndex: 0,
      subName: ''
    })
    var that = this
    wx.request({
      url: this.data.addLinks.course.href + '?access-token==' + this.data.access_token,
      data: {
        p_id: this.data.categoryList[e.detail.value].id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resDuty) {
        if (resDuty.data.items.length != 0) {
          that.setData({
            dutyList: resDuty.data.items,
            dutyIndex: resDuty.data.items[0].id
          })
        }
      }
    })
  },

  bindPickerDutyChange: function (e) {
    this.setData({
      dutyIndex: e.detail.value,
      dutyName: this.data.dutyList[e.detail.value].name,
      nameList: '',
      nameIndex: 0,
      nameEdit: '',
      subList: '',
      subIndex: 0,
      subName: ''
    })
    var that = this
    wx.request({
      url: this.data.addLinks.course.href + '?access-token==' + this.data.access_token,
      data: {
        p_id: this.data.dutyList[e.detail.value].id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resName) {
        if (resName.data.items.length != 0) {
          that.setData({
            nameList: resName.data.items,
            nameIndex: resName.data.items[0].id
          })
        }
      }
    })
  },

  bindPickerNameChange: function (e) {
    this.setData({
      nameIndex: e.detail.value,
      nameEdit: this.data.nameList[e.detail.value].name,
      subList: '',
      subIndex: 0,
      subName: ''
    })
    var that = this
    wx.request({
      url: this.data.addLinks.course.href + '?access-token==' + this.data.access_token,
      data: {
        p_id: this.data.nameList[e.detail.value].id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (resSub) {
        console.log(resSub)
        if (resSub.data.items.length != 0) {
          that.setData({
            subList: resSub.data.items,
            subIndex: resSub.data.items[0].id
          })
        }
      }
    })
  },

  bindPickerSubChange:function(e){
    if (this.data.subList.length != 0) {
      this.setData({
        subIndex: e.detail.value,
        subName: this.data.subList[e.detail.value].name
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('access_token')
    that.setData({
      access_token: token,
    });
    var userId = wx.getStorageSync('id')
    that.setData({
      id: userId
    });
    var myCourseStatus = wx.getStorageSync('mycourseStatus')
    that.setData({
      editStatus: myCourseStatus
    });
    if (myCourseStatus == 'Edit'){
      var editLinks = wx.getStorageSync('mycourseLinks')
      that.setData({
        links: editLinks
      });
      if (editLinks != null || typeof (editLinks) != 'undefined') {
        wx.request({
          url: editLinks.self.href + "?access-token=" + token,
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
                category: resList.data.category,
                duty: resList.data.duty,
                name: resList.data.name,
                subName: resList.data.sub_name
              });
            }
            else {
              console.log('errer')
            }
          }
        })
      }
    }
    else{
      var addLinks = wx.getStorageSync('mycourseAddLinks')
      that.setData({
        addLinks: addLinks
      });
      if (addLinks != null || typeof (addLinks) != 'undefined') {
        wx.request({
          url: addLinks.course.href + "?access-token=" + token,
          data: {

          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (resCourseList) {
            if (resCourseList.data != null) {
              that.setData({
                orglist: resCourseList.data.items,
                orgIndex: resCourseList.data.items[0].id
              });
            }
            else {
              console.log('errer')
            }
          }
        })
      }
    }
  },

  btnSave: function () {
    wx.showLoading({
      title: 'Saving',
    })
    var that = this;
    var addLinks = wx.getStorageSync('mycourseAddLinks')
    wx.request({
      url: addLinks.create.href + "?access-token=" + that.data.access_token,
      data: Util.json2Form({
        organization: that.data.orgName,
        category: that.data.categoryName,
        duty: that.data.dutyName,
        name: that.data.nameEdit,
        sub_name: that.data.subName,
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
  },
  btnDelete: function () {
    wx.showLoading({
      title: 'Deleting',
    })
    wx.request({
      url: this.data.links.delete.href + "?access-token=" + this.data.access_token,
      data: Util.json2Form({
        organization: this.data.organization,
        category: this.data.category,
        duty: this.data.duty,
        name: this.data.name,
        sub_name: this.data.subName
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  }
})