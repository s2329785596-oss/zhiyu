// 聊天记录存储管理
const chatStorage = {
  STORAGE_KEY: 'chatHistory',
  MAX_DAYS: 30,
  
  saveMessage: function(role, content, extra) {
    const history = this._getRawHistory();
    const message = {
      role: role,
      content: content,
      timestamp: Date.now()
    };
    if (extra && typeof extra === 'object') {
      Object.assign(message, extra);
    }
    history.push(message);
    wx.setStorageSync(this.STORAGE_KEY, history);
    this._cleanExpired(history);
    return message;
  },
  
  getHistory: function(days) {
    days = days || this.MAX_DAYS;
    const history = this._getRawHistory();
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return history.filter(h => h.timestamp >= cutoff);
  },
  
  clearHistory: function() {
    wx.removeStorageSync(this.STORAGE_KEY);
  },
  
  getStats: function() {
    const history = this._getRawHistory();
    if (history.length === 0) {
      return { totalMessages: 0, days: 0, userMessages: 0, assistantMessages: 0 };
    }
    
    let userCount = 0, assistantCount = 0;
    let minTime = Infinity, maxTime = 0;
    
    history.forEach(h => {
      if (h.role === 'user') userCount++;
      else if (h.role === 'assistant') assistantCount++;
      if (h.timestamp < minTime) minTime = h.timestamp;
      if (h.timestamp > maxTime) maxTime = h.timestamp;
    });
    
    return {
      totalMessages: history.length,
      days: Math.ceil((maxTime - minTime) / (24 * 60 * 60 * 1000)) || 1,
      userMessages: userCount,
      assistantMessages: assistantCount
    };
  },
  
  _getRawHistory: function() {
    try {
      const data = wx.getStorageSync(this.STORAGE_KEY);
      return Array.isArray(data) ? data : [];
    } catch(e) {
      return [];
    }
  },
  
  _cleanExpired: function(history) {
    const cutoff = Date.now() - this.MAX_DAYS * 24 * 60 * 60 * 1000;
    const cleaned = history.filter(h => h.timestamp >= cutoff);
    if (cleaned.length !== history.length) {
      wx.setStorageSync(this.STORAGE_KEY, cleaned);
    }
  }
};
