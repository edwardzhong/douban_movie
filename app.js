//app.js
const util = require('./utils/util')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /**
   * 获取城市名称
   */
  getCityName:function(succ){
    wx.getLocation({success:function(loc){
      util.sendRequest('https://api.map.baidu.com/geocoder/v2/', {
        location: loc.latitude + ',' + loc.longitude,
        output: 'json',
        ak: 'B61195334f65b9e4d02ae75d24fa2c53'
      }, function (res) {
        succ(res.data);
      })
    }});
  },
  /**
   * 搜索影片
   */
  searchMovie:function(txt,succ,fail){
    util.sendRequest('https://api.douban.com/v2/movie/search',{q:txt},function(res){
      processData(res.data, succ, fail);
    });
  },
  /**
   * 北美排行榜
   */
  getUsBox:function(data,succ,fail){
    util.sendRequest('https://api.douban.com/v2/movie/us_box?_r='+Math.random(),data,function (res) {
      res.data.subjects.forEach(s=>{
        Object.assign(s,s.subject);
        var sum=s.box,Yi=0,Wa=0;
        s.boxs='';
        Yi = Math.floor(sum/100000000);
        if (Yi){
          s.boxs += Yi+'亿';
          sum=sum-Yi*100000000;
        }
        Wa = Math.floor(sum/10000);
        if(Wa){
          s.boxs += Wa+'万';
        }
        s.boxs=s.boxs?s.boxs:s.box;
      });
      processData(res.data, succ, fail);
    },fail);
  },
  /**
   * 正在热映
   */
  getInTheaters:function(data,succ,fail){
    util.sendRequest('https://api.douban.com/v2/movie/in_theaters?_r='+Math.random(),data,function (res) {
      processData(res.data,succ,fail);
    },fail);
  },
  /**
   * 即将上映
   */
  getComming:function(data,succ,fail){
    util.sendRequest('https://api.douban.com/v2/movie/coming_soon?_r=' + Math.random(), data, function (res) {
      processData(res.data, succ, fail);
    }, fail);
  }
})
/**
 * 格式化数据
 */
function processData(data,succ,fail){
  console.log(data);
  if (data.subjects) {
    data.subjects.forEach(item => {
      item.titles = item.title == item.original_title ? item.title : (item.title + '/' + item.original_title);
      item.directorsStr = item.directors.map(d => d.name).join('/');
      item.castsStr = item.casts.map(d => d.name).join('/');
      item.types = item.genres.join('/');
    });
    succ(data);
  } else {
    fail(data);
  }
}