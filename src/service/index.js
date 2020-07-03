import axios from 'src/utils/myAxios';
import api from 'src/api/api'

export const login = (adname, adpassword) => axios(api.login, {
  noLoading: true,
  method: 'post',
  data: {
    adname,
    adpassword,
  },
});

export const supplizerLogin = (mobile, password) => axios(api.supplizer_login, {
  noLoading: true,
  method: 'post',
  data: {
    mobile,
    password,
  },
});

export const personalLogin = (code) => axios(api.personal_login, {
  noLoading: true,
  method: 'post',
  data:{
    code
  }
});

export const authRefresh = (mobile, password) => axios(api.auth_fresh, {
  noLoading: true,
  method: 'get',
});
