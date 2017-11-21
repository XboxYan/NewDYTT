import axios from 'axios';
axios.defaults.timeout = 5000;
axios.defaults.headers.appVersion = '5.6.0';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://101.37.135.113/newmovie/api';
// axios.defaults.baseURL = 'http://192.168.1.129:8383';
//code状态码200判断
axios.interceptors.response.use((res) =>{
  if(res.status == '200'){
    return Promise.resolve(res);
  }
}, (error) => {
  return Promise.reject(error);
});
export default axios;