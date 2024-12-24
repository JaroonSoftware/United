import { requestService as api } from "./Request.service"  
const API_URL = { 
  API_MANAGE: `/adjust/manage.php`, 
  API_SEARCH: `/adjust/search.php`, 

  API_GETCODE: `/adjust/get-doc-code.php`, 
};
  
const ADService = () => { 
  
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`);

  const code = () => api.get(`${API_URL.API_GETCODE}`);

  const search = (parm = {}, config = {}) => api.post(`${API_URL.API_SEARCH}`, parm, {...config, cancle: true});
  

  return {
    create,
    get, 

    code,

    search,
  };
};

export default ADService;