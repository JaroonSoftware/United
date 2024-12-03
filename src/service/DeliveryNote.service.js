import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/dn/manage.php`, 
  API_SEARCH: `/dn/search.php`, 

  API_GETCODE: `/dn/get-dncode.php`, 
};
  
const DNService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const code = () => api.get(`${API_URL.API_GETCODE}`);

  const search = (parm = {}, config = {}) => api.post(`${API_URL.API_SEARCH}`, parm, {...config, cancle: true});
  

  return {
    create,
    update,
    deleted,
    get, 

    code,

    search,
  };
};

export default DNService;