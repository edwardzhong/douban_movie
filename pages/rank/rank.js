const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankDate: '',
    movies: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
  },
  onShareAppMessage: function () {
    return {
      title: 'Douban Movie - 北美排行榜',
      path: '/pages/rank/rank'
    }
  },
  getPageData: function () {
    var that = this;
    wx.showLoading({
      title: 'loading',
    })
    app.getUsBox({}, function (data) {
      wx.hideLoading();
      that.setData({ rankDate:data.date, movies: data.subjects });
    });
  }
})