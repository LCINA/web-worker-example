self.addEventListener('message', function (e) {
  var data = e.data;
  var url = data.url;
  request({
    url: url
  }).then(data => {
    self.postMessage('原始数据:\n ' + data);
  });
}, false);

function request(opt) {
  opt.method = (opt.method || 'GET').toUpperCase();
  opt.url = opt.url || '';
  opt.async = !!opt.async || true;
  opt.data = opt.data || {};
  const xhr = new XMLHttpRequest();
  const params = [];
  for (const key in opt.data) {
    if (opt.data.hasOwnProperty) {
      params.push(`${key}=${opt.data[key]}`);
    }
  }
  const postData = params.join('&');
  if (opt.method === 'POST') {
    xhr.open(opt.method, opt.url, opt.async);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = opt.responseType;
    xhr.send(opt.data);
  } else if (opt.method === 'GET') {
    xhr.open(opt.method, postData ? `${opt.url}?'${postData}` : opt.url, opt.async);
    xhr.responseType = opt.responseType;
    xhr.send(null);
  }
  return new Promise((resolve, reject) => {
    xhr.onload = function () {
      if (xhr.readyState === 4) {
        const response = xhr.responseType === 'arraybuffer' ? xhr.response : xhr.responseText;
        if (xhr.status >= 200 && xhr.status <= 304) {
          resolve(response);
        } else if (xhr.status === 0) {
          resolve(response);
        } else {
          reject(response);
        }
      }
    };
  });
}
