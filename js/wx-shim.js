// wx API shim - 将微信小程序API映射到Web API
const wx = {
  getStorageSync: function(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch(e) {
      return null;
    }
  },
  
  setStorageSync: function(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
      console.error('Storage error:', e);
    }
  },
  
  removeStorageSync: function(key) {
    localStorage.removeItem(key);
  },
  
  showToast: function(options) {
    const toast = document.getElementById('toast');
    toast.textContent = options.title || '';
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, options.duration || 2000);
  },
  
  showModal: function(options) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const cancelBtn = document.getElementById('modal-cancel');
    const confirmBtn = document.getElementById('modal-confirm');
    
    title.textContent = options.title || '';
    body.textContent = options.content || '';
    
    if (options.showCancel === false) {
      cancelBtn.classList.add('hidden');
    } else {
      cancelBtn.classList.remove('hidden');
    }
    
    modal.classList.remove('hidden');
    
    window._modalCallback = function(confirm) {
      modal.classList.add('hidden');
      if (options.success) {
        options.success({ confirm: confirm, cancel: !confirm });
      }
    };
  },
  
  vibrateShort: function(options) {
    if (navigator.vibrate) {
      navigator.vibrate(options.type === 'medium' ? 50 : 20);
    }
  },
  
  navigateTo: function(options) {
    const url = options.url;
    const pageName = url.replace(/^\//, '').split('/')[0];
    showPage(pageName);
  },
  
  redirectTo: function(options) {
    this.navigateTo(options);
  },
  
  reLaunch: function(options) {
    this.navigateTo(options);
  },
  
  navigateBack: function(options) {
    goBack();
  },
  
  getSystemInfoSync: function() {
    return {
      statusBarHeight: 20,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  }
};

// 全局modal回调
function confirmModal() {
  if (window._modalCallback) {
    window._modalCallback(true);
    window._modalCallback = null;
  }
}

function closeModal() {
  if (window._modalCallback) {
    window._modalCallback(false);
    window._modalCallback = null;
  }
}
