Page({
    data: {
      userInfo: [],
      languageNames: [],
      divestore: [],
      student: [],
      comment: [],
      course: []
    },
    //事件处理函数
    bindViewTap: function() {

    },
    onLoad: function (option) {
        var that = this;
        var token = wx.getStorageSync('access_token');
        var params = { 'access-token': token};
        var languageNames = wx.getStorageSync('languageNames');
        getData(option.url, params, function(userInfo){
          if (userInfo){
            console.log(userInfo)
            that.setData({
              userInfo: userInfo,
              languageNames: languageNames
            })
            getData(userInfo._links.divestore.href, params, function (storeInfo) {
              if (storeInfo) {
                that.setData({
                  divestore: storeInfo
                })
              }
            })
            getData(userInfo._links.student.href, params, function (studentsInfo) {
              if (studentsInfo) {
                while (studentsInfo.items.length < 6){
                  studentsInfo.items.push(studentsInfo.items[0]);
                }
                that.setData({
                  student: studentsInfo
                })
              }
            })
            getData(userInfo._links.comment.href, params, function (comment) {
              //todo limit comment amount
              if (comment) {
                var newDate = new Date();
                for (var i=0;i<comment.items.length;i++){
                  newDate.setTime(parseInt(comment.items[i]['remark_time']) * 1000);
                  comment.items[i]['remark_time'] = newDate.toLocaleString();
                }
                that.setData({
                  comment: comment
                })
              }
            })
            getData(userInfo._links.coachCourse.href, params, function (course) {
              if (course) {
                console.log(course);
                that.setData({
                  course: course.items
                })
              }
            })

          }
        })
    },
    onLaunch: function () {

    },
})

function getData(url, params, callback){
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