import { requestService as api } from "./Request.service"  

const API_URL = {
  API_MANAGE: `/carmodel/manage.php`,
  API_SEARCH: `/carmodel/search.php`,
};



const CarModelsService = () => { 
 
  const create = (parm = {}) => api.post(`${API_URL.API_MANAGE}`, parm);
  const update = (parm = {}) => api.put(`${API_URL.API_MANAGE}`, parm);
  const deleted = (code) => api.delete(`${API_URL.API_MANAGE}?code=${code}`);
  const get = (code) => api.get(`${API_URL.API_MANAGE}?code=${code}`, { ignoreLoading : true, cancle: true });
  const search = (parm = {}, config = {}) => api.post(`${API_URL.API_SEARCH}`, parm, {...config, cancle: true});

  return {
    create,
    update,
    deleted,
    get,
    search,

  };
};

export default CarModelsService;
