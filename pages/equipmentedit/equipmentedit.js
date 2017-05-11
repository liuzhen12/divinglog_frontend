Page({
    data: {
    array1:["面镜","BUD","脚蹼","配重"],
    array2:["gull","tusa","holls","hog"],
    array3:["pro1","pro2","pro3","pro4"],
    index:0
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
    onLoad: function(){
        
    }
});