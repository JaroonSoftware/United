import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = {
  OPTION_ITEMS: `/common/options-items.php`, 
  OPTION_SUPPLIER: `/common/options-supplier.php`,
  OPTION_CUSTOMER: `/common/options-customer.php`,
  OPTION_CUSTOMERSO: `/common/options-customerSO.php`,
  OPTION_IC: `/common/options-InsuranceCustomers.php`,
  OPTION_QUOTATION: `/common/options-quotation.php`,
  OPTION_ITEMSTYPE: `/common/options-itemstype.php`,
  OPTION_UNIT: `/common/options-unit.php`,
  OPTION_KIND: `/common/options-kind.php`,
  OPTION_LOCATION: `/common/options-location.php`,
  OPTION_COUNTY: `/common/options-county.php`,
  OPTION_BRAND: `/common/options-brand.php`,
  OPTION_TYPE: `/common/options-type.php`,
  OPTION_MODEL: `/common/options-model.php`,
  OPTION_CARMODEL: `/common/options-carmodel.php`,
  OPTION_SO: `/common/options-so.php`,
  OPTION_RECEIPT: `/common/options-receipt.php`,  
  OPTION_INVOICE: `/common/options-invoice.php`,
  OPTION_DN: `/common/options-delivery-note.php`,
  OPTION_BANKS: `/common/options-banks.php`
};
 

const OptionService = () => {
  const optionsItems = (parm = {}) => api.get(`${API_URL.OPTION_ITEMS}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsSupplier = () => api.get(`${API_URL.OPTION_SUPPLIER}`, { ignoreLoading : true });
  const optionsCustomer = () => api.get(`${API_URL.OPTION_CUSTOMER}`, { ignoreLoading : true });
  const optionsCustomeSO = () => api.get(`${API_URL.OPTION_CUSTOMERSO}`, { ignoreLoading : true });
  const optionsIC = () => api.get(`${API_URL.OPTION_IC}`, { ignoreLoading : true });
  const optionsQuotation = () => api.get(`${API_URL.OPTION_QUOTATION}`, { ignoreLoading : true });
  const optionsItemstype = () => api.get(`${API_URL.OPTION_ITEMSTYPE}`, { ignoreLoading : true });
  const optionsUnit = () => api.get(`${API_URL.OPTION_UNIT}`, { ignoreLoading : true });
  const optionsKind = () => api.get(`${API_URL.OPTION_KIND}`, { ignoreLoading : true });
  const optionsLocation = () => api.get(`${API_URL.OPTION_LOCATION}`, { ignoreLoading : true });
  const optionsCounty = () => api.get(`${API_URL.OPTION_COUNTY}`, { ignoreLoading : true });
  const optionsBrand = () => api.get(`${API_URL.OPTION_BRAND}`, { ignoreLoading : true });
  const optionsModel = () => api.get(`${API_URL.OPTION_MODEL}`, { ignoreLoading : true });
  const optionsType = () => api.get(`${API_URL.OPTION_TYPE}`, { ignoreLoading : true });
  const optionsCarmodel = (parm = {}) => api.get(`${API_URL.OPTION_CARMODEL}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsSO = (parm = {}) => api.get(`${API_URL.OPTION_SO}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsReceipt = (parm = {}) => api.get(`${API_URL.OPTION_RECEIPT}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsInvoice = (parm = {}) => api.get(`${API_URL.OPTION_INVOICE}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsDN = (parm = {}) => api.get(`${API_URL.OPTION_DN}?${getParmeter(parm)}`, { ignoreLoading : true });
  const optionsBanks = (parm = {}) => api.get(`${API_URL.OPTION_BANKS}?${getParmeter(parm)}`, { ignoreLoading : true });

  return {
    optionsItems,
    optionsSupplier,
    optionsCustomer,
    optionsCustomeSO,
    optionsIC,
    optionsQuotation,
    optionsItemstype,
    optionsUnit,
    optionsKind,
    optionsLocation,
    optionsCounty,
    optionsBrand,
    optionsModel,
    optionsType,
    optionsCarmodel,
    optionsSO,
    optionsReceipt,
    optionsInvoice,
    optionsDN,
    optionsBanks
  };
};

export default OptionService;