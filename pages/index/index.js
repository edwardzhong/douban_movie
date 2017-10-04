//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    rankList:[],
    inTheaters:[]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that= this;
    wx.showLoading({
      title: 'laoding',
    });
    app.getUsBox({count:10},function (data){
      that.setData({ rankList: data.subjects.slice(0, 4) });
    })
    app.getCityName(function(ret){
      var city=ret.result.addressComponent.city;
      app.getInTheaters({ city: city.replace('市', ''), count: 40 }, function (data) {
        wx.hideLoading();
        that.setData({ inTheaters: data.subjects });
      }, function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '获取后台数据失败',
          content: err.msg,
        });
        console.log(err);
      });
    });
  },
  onShareAppMessage: function () {
    return {
      title: 'Douban Movie',
      path: '/pages/index/index'
    }
  }
})
