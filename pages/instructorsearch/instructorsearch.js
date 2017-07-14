Page({
    data: {
        inputShowed: false,
        usersArray: [],
        filteredLocationArray: [],
        languageArray: [],
        languageNames: [],
        searchKeyword: "",
        isFromSearch: true,
        searchPageNum: 1,
        callbackCount: 12,
        searchLoading: false,
        searchLoadingComplte: false,
        showModalStatus: false,
        sortBy: 0,
        genderArray: [
          { 'id':'1','name': 'Male' }, 
          { 'id':'2','name': 'Female'}],
        sortArray: ["Popular: High->Low", "Rate: High->Low", "Students amount: High->Low"]
    },
    showInput: function () {
        var that = this;
        var token = wx.getStorageSync('access_token');
        getLocationList(token,function(data){
          wx.setStorageSync('locationArray', data);
          that.setData({
            inputShowed: true,
          })
        })
    },
    hideInput: function () {
        this.setData({
          searchKeyword: "",
          inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
          searchKeyword: ""
        });
    },
    inputTyping: function (e) {
        var keyWord = e.detail.value;
        var locationArray = wx.getStorageSync('locationArray');
        var len = locationArray.length;
        var ret = [];
        var reg = new RegExp(keyWord,"i");
        for (var i=0;i<len;i++){
          if (locationArray[i]['name'].match(reg)){
            ret.push(locationArray[i]);
          }
        }
        this.setData({
            searchKeyword: keyWord,
            filteredLocationArray: ret
        });
    },
    onLoad: function(option){
        var that = this;
        var languageArray = wx.getStorageSync('language_array');
        var languageNames = [];
        for (var i=0; i < languageArray.length; i++){
          languageNames[i + 1] = languageArray[i]['name'];
        }
        that.setData({
          languageArray: languageArray,
          languageNames: languageNames
        })
        this.fetchSearchList();
    },

    listClick:function(event){
        var user_url = event.currentTarget.dataset.url;
        console.log(user_url);
        wx.navigateTo({
          url: "../instructorinfo/instructorinfo?url=" + user_url
        })
    },
    fetchSearchList: function(){
      let that = this,
        searchPageNum = that.data.searchPageNum,
        callbackCount = that.data.callbackCount,
        keyword = that.data.searchKeyword,
        token = wx.getStorageSync('access_token'),
        genderArray = this.data.genderArray,
        languageArray = this.data.languageArray,
        selectedGender = [],
        selectedLanguage = [];
      for (var i = 0; i < genderArray.length; i++) {
        if (genderArray[i]['isSelected']) {
          selectedGender.push(genderArray[i]['id']);
        }
      }
      for (var i = 0; i < languageArray.length; i++) {
        if (languageArray[i]['isSelected']) {
          selectedLanguage.push(languageArray[i]['id']);
        }
      }
      var selectedGenderStr = selectedGender.join(',');
      var selectedLanguageStr = selectedLanguage.join(',');
      var keywordArray = keyword.split(',').reverse();
      var params = {
        'location': keywordArray,
        'gender': selectedGenderStr,
        'language': selectedLanguageStr,
        'evaluation_score': that.data.sortBy == 1 ? 2 : '',
        'student_count': that.data.sortBy == 2 ? 2 : ''
      };
      
      getUserList(token, params, searchPageNum, callbackCount, function (data) {
        var usersArray = that.data.isFromSearch ? data : that.data.usersArray.concat(data);
        that.setData({
          usersArray: usersArray
        })
        if (data.length != 0) {
          that.setData({
            seachLoading: true
          })
        }
        else {
          that.setData({
            searchLoadingComplete: true,
            searchLoading: false
          })
        }
      })
    },
    searchClick: function (event) {
      var keyword = event.currentTarget.dataset.keyword;
      this.setData({
        searchPageNum: 1,
        usersArray: [],
        isFromSearch: true,
        searchLoading: true,
        SearchLoadingComplete: false,
        searchKeyword: keyword
      })
      this.fetchSearchList();
    },

    showModal: function () {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: true,
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    },
    hideModal: function () {
      // 隐藏遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export(),
          showModalStatus: false,
        })
      }.bind(this), 200)
    },

    showFilter: function(){
      this.setData({
        showModalStatus: true
      })
    },

    changeColor: function (e) {
      var languageArray = this.data.languageArray;
      for (var i=0; i<languageArray.length; i++){
        if (e.target.id == languageArray[i]['id']) {
          languageArray[i]['isSelected'] = !languageArray[i]['isSelected'];
        }
      }
      this.setData({
        languageArray: languageArray
      })
    },

    changeColorGender: function (e) {
      var genderArray = this.data.genderArray;
      for (var i = 0; i < genderArray.length; i++) {
        if (e.target.id == genderArray[i]['id']) {
          genderArray[i]['isSelected'] = !genderArray[i]['isSelected'];
        }
      }
      this.setData({
        genderArray: genderArray
      })
    },

    filterConfirm: function (e) {
      this.fetchSearchList();
      this.hideModal();
    },

    showSort: function () {
      var that = this;
      wx.showActionSheet({
        itemList: that.data.sortArray,
        success: function (res) {
          if (!res.cancel) {
            that.setData({
              sortBy: res.tapIndex
            })
            that.fetchSearchList();
            console.log(res.tapIndex)
          }
        }
      });
    }
});

function getUserList(accessToken, params, pageNum, callbackCount, callback) {
  console.log(params);
  wx.request({
    url: 'https://log.fundiving.com/coaches',
    data: {
      'access-token': accessToken,
      country: params['location'][0],
      province: params['location'].length > 1 ? params['location'][1] : '',
      city: params['location'].length > 2 ? params['location'][2] : '',
      gender: params['gender'],
      language: params['language'],
      currentPage: pageNum,
      perPage: callbackCount,
      evaluation_score: params['evaluation_score'],
      student_count: params['student_count']
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      if (res.statusCode == 200) {
        console.log(res.data.items);
        callback(res.data.items);
      }
    }
  });
}

function getLocationList(accessToken, callback) {
  wx.request({
    url: 'https://log.fundiving.com/locations?source=2',
    header: {
      'content-type': 'application/json'
    },
    data: {
      'access-token': accessToken
    },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data.items);
      }
    }
  })
}