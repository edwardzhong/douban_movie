const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies:[]
  },
  handleSearch: function (e) {
    var that=this,
        val = e.detail.value;
    wx.showLoading({
      title: 'loading',
    })
    app.searchMovie(val, function (data) {
      wx.hideLoading();
      that.setData({movies:data.subjects});
    });
  }
})