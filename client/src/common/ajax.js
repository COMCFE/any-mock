import Vue from 'vue';
let buildOptions = (options) => {
  let opt = _.extend({}, options);
  opt.headers = opt.headers || {};
  opt.headers['x-token'] = localStorage.getItem('token');
  return opt;
};

let request = (type, url, data, options) => {
  let opt = buildOptions(options);
  let p;
  switch (type) {
    case 'get':
    case 'delete':
      p = Vue.http[type](url, opt);
      break;
    case 'post':
    case 'put':
      p = Vue.http[type](url, data, opt);
      break;
    default:
      throw new Error(`Not supported method: ${type}`);
  }
  return new Promise((resolve, reject) => {
    p.then(res => {
      resolve(res);
    }).catch(res => {
      if (res.status === 401) {
        layer.closeAll();
        let layerId = layer.msg('授权已过期，请重新登录', { icon: 3, title: '警告' }, () => {
          layer.close(layerId);
          Vue.$router.go('/login');
        });
      }
      if (!opt.disabledGlobalException) {
        let error = res.json() || { message: '' };
        layer.msg(`【${res.status}】${res.statusText}(${error.message})`);
      }
      reject(res);
    });
  });
};

let get = (url, options) => {
  return request('get', url, null, options);
}

let post = (url, data, options) => {
  return request('post', url, data, options);
};

let put = (url, data, options) => {
  return request('put', url, data, options);
};

let _delete = (url, options) => {
  return request('delete', url, null, options);
};

export const ajax = {
  get: get,
  post: post,
  put: put,
  delete: _delete
};