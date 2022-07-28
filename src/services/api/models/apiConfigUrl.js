export const APP_LAST_URI = Object.freeze({
  signin: {
    path: "v1/signin",
    isAuth: false,
    method: "POST",
  },
  forgotpass: {
    path: "v1/forgotpass",
    isAuth: false,
    method: "POST",
  },
  signout: {
    path: "v1/signout",
    isAuth: true,
    method: "POST",
  },
  resetPassword: {
    path: "v1/changepass",
    isAuth: true,
    method: "POST",
  },
  getAdminProfile: {
    path: "v1/getadminprofiledetails",
    isAuth: true,
    method: "POST",
  },
  modifyAdminProfile: {
    path: "v1/modifyadminprofile",
    isAuth: true,
    method: "POST",
  },
  getMasterDepartmentList: {
    path: "v1/fetchMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  addMasterDepartmentList: {
    path: "v1/insertMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  deleteMasterDepartmentData: {
    path: "v1/deleteMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  activeMasterDepartmentData: {
    path: "v1/fetchActiveMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  fetchDetailsByDepartment: {
    path: "v1/fetchDetailsByDepartment",
    isAuth: true,
    method: "POST",
  },
  updateMasterDepartment: {
    path: "v1/updateMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  getLookUpData: {
    path: "v1/getlookuplist",
    isAuth: true,
    method: "POST",
  },
  getadminstafflist: {
    path: "v1/fetchadminstafflist",
    isAuth: true,
    method: "POST",
  },
  getroles: {
    path: "v1/getroles",
    isAuth: true,
    method: "POST",
  },
  fetchClientDepartment: {
    path: "v1/fetchClientDepartment",
    isAuth: true,
    method: "POST",
  },
  adminstaffstatuschange: {
    path: "v1/adminstaffstatuschange",
    isAuth: false,
    method: "POST",
  },
  createuser: {
    path: "v1/createuser",
    isAuth: true,
    method: "POST",
  },
  getstaffdetails: {
    path: "v1/getstaffdetails",
    isAuth: true,
    method: "POST",
  },
  modifystaffdetails: {
    path: "v1/modifystaffdetails",
    isAuth: true,
    method: "POST",
  },
  exportadminstaff: {
    path: "v1/exportadminstaff",
    isAuth: true,
    method: "POST",
  },
  userpasswordreset: {
    path: "v1/userpasswordreset",
    isAuth: true,
    method: "POST",
  },
  resetpass: {
    path: "v1/resetpass",
    isAuth: false,
    method: "POST",
  },
  fetchAllActiveUsers: {
    path: "v1/fetchAllActiveUsers",
    isAuth: true,
    method: "POST",
  },
  fetchActiveParent: {
    path: "v1/fetchActiveParent",
    isAuth: true,
    method: "POST",
  },
  fetchDetailsByClientDepartment: {
    path: "v1/fetchDetailsByClientDepartment",
    isAuth: true,
    method: "POST",
  },
  updateClientDepartment: {
    path: "v1/updateClientDepartment",
    isAuth: true,
    method: "POST",
  },
  fetchActiveMasterDepartment: {
    path: "v1/fetchActiveMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  getlocaiondescription: {
    path: "v1/getlocaiondescription",
    isAuth: true,
    method: "POST",
  },
  getcoordinatefromplaceid: {
    path: "v1/getcoordinatefromplaceid",
    isAuth: true,
    method: "POST",
  },
  fetchClientDepartmentDetailsByParentid: {
    path: "v1/fetchClientDepartmentDetailsByParentid",
    isAuth: true,
    method: "POST",
  },
  insertClientMasterDepartment: {
    path: "v1/insertClientMasterDepartment",
    isAuth: true,
    method: "POST",
  },
  clientdepartmentstatusupdate: {
    path: "v1/clientdepartmentstatusupdate",
    isAuth: true,
    method: "POST",
  },
  insertService: {
    path: "v1/insertService",
    isAuth: true,
    method: "POST",
  },
  fetchServiceList: {
    path: "v1/fetchServiceList",
    isAuth: true,
    method: "POST",
  },
  fetchServiceDetails: {
    path: "v1/fetchServiceDetails",
    isAuth: true,
    method: "POST",
  },
  updateService: {
    path: "v1/updateService",
    isAuth: true,
    method: "POST",
  },
  changeStatusService: {
    path: "v1/changeStatusService",
    isAuth: true,
    method: "POST",
  },
  fetchdocumentlist: {
    path: "v1/fetchdocumentlist",
    isAuth: true,
    method: "POST",
  },
  deletedocument: {
    path: "v1/deletedocument",
    isAuth: true,
    method: "POST",
  },
  fetchintentuserlist: {
    path: "v1/fetchintentuserlist",
    isAuth: true,
    method: "POST",
  },
  adddocument: {
    path: "v1/adddocument",
    isAuth: true,
    method: "POST",
  },
  fetchdocumentdetails: {
    path: "v1/fetchdocumentdetails",
    isAuth: true,
    method: "POST",
  },
  updatedocumentdetails: {
    path: "v1/updatedocumentdetails",
    isAuth: true,
    method: "POST",
  },

  insertTrainingCourse: {
    path: "v1/insertTrainingCourse",
    isAuth: true,
    method: "POST",
  },
  fetchTrainingCourseList: {
    path: "v1/fetchTrainingCourseList",
    isAuth: true,
    method: "POST",
  },
  changeStatusTrainingCourse: {
    path: "v1/changeStatusTrainingCourse",
    isAuth: true,
    method: "POST",
  },
  publishTrainingCourse: {
    path: "v1/publishTrainingCourse",
    isAuth: true,
    method: "POST",
  },
  fetchTrainingCourseDetails: {
    path: "v1/fetchTrainingCourseDetails",
    isAuth: true,
    method: "POST",
  },
  updateTrainingCourse: {
    path: "v1/updateTrainingCourse",
    isAuth: true,
    method: "POST",
  },
  getcountrylist: {
    path: "v1/getcountrylist",
    isAuth: true,
    method: "POST",
  },
  getstatelistofselectedcountry: {
    path: "v1/getstatelistofselectedcountry",
    isAuth: true,
    method: "POST",
  },
  fetchvendorsignuprequestlist: {
    path: "v1/fetchvendorsignuprequestlist",
    isAuth: true,
    method: "POST",
  },
  fetchapprovedvendorlist: {
    path: "v1/fetchapprovedvendorlist",
    isAuth: true,
    method: "POST",
  },
  fetchvendorreqdetails: {
    path: "v1/fetchvendorreqdetails",
    isAuth: true,
    method: "POST",
  },
  createvendoraccount: {
    path: "v1/createvendoraccount",
    isAuth: true,
    method: "POST",
  },
  modifyvendorstatus: {
    path: "v1/modifyvendorstatus",
    isAuth: true,
    method: "POST",
  },
  deletevendorAcccount: {
    path: "v1/deletevendorAcccount",
    isAuth: true,
    method: "POST",
  },
  modifyvendoraccount: {
    path: "v1/modifyvendoraccount",
    isAuth: true,
    method: "POST",
  },
  vendoraccountinfo: {
    path: "v1/vendoraccountinfo",
    isAuth: true,
    method: "POST",
  },
  exportvendorlist: {
    path: "v1/exportvendorlist",
    isAuth: true,
    method: "POST",
  },
  createclientaccount: {
    path: "v1/createclientaccount",
    isAuth: true,
    method: "POST",
  },
  fetchclientlist: {
    path: "v1/fetchclientlist",
    isAuth: true,
    method: "POST",
  },
  modifyclientstatus: {
    path: "v1/modifyclientstatus",
    isAuth: true,
    method: "POST",
  },
  fetchclientcontactreqlist: {
    path: "v1/fetchclientcontactreqlist",
    isAuth: true,
    method: "POST",
  },
  getallclinetinfo: {
    path: "v1/getallclinetinfo",
    isAuth: true,
    method: "POST",
  },
  modifyclientcontactstatus: {
    path: "v1/modifyclientcontactstatus",
    isAuth: true,
    method: "POST",
  },
  getclientcontactrequestdetails: {
    path: "v1/getclientcontactrequestdetails",
    isAuth: true,
    method: "POST",
  },
  addRole: {
    path: "v1/addRole",
    isAuth: true,
    method: "POST",
  },
  updateRole: {
    path: "v1/updateRole",
    isAuth: true,
    method: "POST",
  },
  deleteRole: {
    path: "v1/deleteRole",
    isAuth: true,
    method: "POST",
  },
  getModuleList: {
    path: "v1/getModuleList",
    isAuth: true,
    method: "POST",
  },
  getRoleDetails: {
    path: "v1/getRoleDetails",
    isAuth: true,
    method: "POST",
  },
  getRoleList: {
    path: "v1/getRoleList",
    isAuth: true,
    method: "POST",
  },
  modifyvendordocumentstatus: {
    path: "v1/modifyvendordocumentstatus",
    isAuth: true,
    method: "POST",
  },
  fetchtimezonelist: {
    path: "v1/fetchtimezonelist",
    isAuth: true,
    method: "POST",
  },
  getlanguagelist: {
    path: "v1/getlanguagelist",
    isAuth: true,
    method: "POST",
  },
  fetchclientinfo: {
    path: "v1/fetchclientinfo",
    isAuth: true,
    method: "POST",
  },
  modifyclientinfo: {
    path: "v1/modifyclientinfo",
    isAuth: true,
    method: "POST",
  },
  updateVendorPayment: {
    path: "v1/updateVendorPayment",
    isAuth: true,
    method: "POST",
  },
  getVendorAddress: {
    path: "v1/getVendorAddress",
    isAuth: true,
    method: "POST",
  },
  getVendorPayment: {
    path: "v1/getVendorPayment",
    isAuth: true,
    method: "POST",
  },
  updateVendorAddress: {
    path: "v1/updateVendorAddress",
    isAuth: true,
    method: "POST",
  },
  fetchapprovedclientcontactlist: {
    path: "v1/fetchapprovedclientcontactlist",
    isAuth: true,
    method: "POST",
  },
  modifyapprovedclientcontactstatus: {
    path: "v1/modifyapprovedclientcontactstatus",
    isAuth: true,
    method: "POST",
  },
  fetchselectedclientdeptinfo: {
    path: "v1/fetchselectedclientdeptinfo",
    isAuth: true,
    method: "POST",
  },
  fetchVendorService: {
    path: "v1/fetchVendorService",
    isAuth: true,
    method: "POST",
  },
  getVendorContractList: {
    path: "v1/getVendorContractList",
    isAuth: true,
    method: "POST",
  },
  getVendorTrainingList: {
    path: "v1/getVendorTrainingList",
    isAuth: true,
    method: "POST",
  },
  getapprovedclientcontactdetails: {
    path: "v1/getapprovedclientcontactdetails",
    isAuth: true,
    method: "POST",
  },
  addclientcontacttyperequester: {
    path: "v1/addclientcontacttyperequester",
    isAuth: true,
    method: "POST",
  },
  addclientcontacttypesupervisor: {
    path: "v1/addclientcontacttypesupervisor",
    isAuth: true,
    method: "POST",
  },
  addclientcontacttypelei: {
    path: "v1/addclientcontacttypelei",
    isAuth: true,
    method: "POST",
  },
  modifyVendorService: {
    path: "v1/modifyVendorService",
    isAuth: true,
    method: "POST",
  },
  updateUserProfilePic: {
    path: "v1/updateUserProfilePic",
    isAuth: true,
    method: "POST",
  },
  updateClientContactDetails: {
    path: "v1/updateClientContactDetails",
    isAuth: true,
    method: "POST",
  },
  fetchLeiByClient: {
    path: "v1/fetchLeiByClient",
    isAuth: true,
    method: "POST",
  },
  createInterPretationJobFromAdmin: {
    path: "v1/createInterPretationJobFromAdmin",
    isAuth: true,
    method: "POST",
  },
  getCourseWithCategory: {
    path: "v1/getCourseWithCategory",
    isAuth: true,
    method: "POST",
  },
  createTraining: {
    path: "v1/createTraining",
    isAuth: true,
    method: "POST",
  },
  createTranslation: {
    path: "v1/createTranslation",
    isAuth: true,
    method: "POST",
  },
  getPendingInterpretationRFQList: {
    path: "v1/getPendingInterpretationRFQList",
    isAuth: true,
    method: "POST",
  },
  getPendingTranslationRFQList: {
    path: "v1/getPendingTranslationRFQList",
    isAuth: true,
    method: "POST",
  },
  createQuote: {
    path: "v1/createQuote",
    isAuth: true,
    method: "POST",
  },
  getApprovedInterpretationRFQList: {
    path: "v1/getApprovedInterpretationRFQList",
    isAuth: true,
    method: "POST",
  },
  cancelJobDetails: {
    path: "v1/cancelJobDetails",
    isAuth: true,
    method: "POST",
  },
  getCompleteInterpretationRFQList: {
    path: "v1/getCompleteInterpretationRFQList",
    isAuth: true,
    method: "POST",
  },
  getAllLeiList: {
    path: "v1/getAllLeiList",
    isAuth: true,
    method: "POST",
  },
  getInterpretionJobStatuslist: {
    path: "v1/getInterpretionJobStatuslist",
    isAuth: true,
    method: "POST",
  },
  getJobDetails: {
    path: "v1/getJobDetails",
    isAuth: true,
    method: "POST",
  },
  getPendingTrainingRFQList: {
    path: "v1/getPendingTrainingRFQList",
    isAuth: true,
    method: "POST",
  },
  getAllProjects: {
    path: "v1/getAllProjects",
    isAuth: true,
    method: "POST",
  },
  getAllProjectsHistory: {
    path: "v1/getAllProjectsHistory",
    isAuth: true,
    method: "POST",
  },
  getAllVendorList: {
    path: "v1/getAllVendorList",
    isAuth: true,
    method: "POST",
  },
  getUserLanguagesByServiceId: {
    path: "v1/getUserLanguagesByServiceId",
    isAuth: true,
    method: "POST",
  },
  addVendorRatecard: {
    path: "v1/addVendorRatecard",
    isAuth: true,
    method: "POST",
  },
  getVendorRatecardList: {
    path: "v1/getVendorRatecardList",
    isAuth: true,
    method: "POST",
  },
  deleteVendorRatecard: {
    path: "v1/deleteVendorRatecard",
    isAuth: true,
    method: "POST",
  },
  getRatecardByLanguage: {
    path: "v1/getRatecardByLanguage",
    isAuth: true,
    method: "POST",
  },
  createQuoteTranslation: {
    path: "v1/createQuoteTranslation",
    isAuth: true,
    method: "POST",
  },
  sentOfferToVendor: {
    path: "v1/sentOfferToVendor",
    isAuth: true,
    method: "POST",
  },
  getVendorsWorkingStatus: {
    path: "v1/getVendorsWorkingStatus",
    isAuth: true,
    method: "POST",
  },
  getNotificationList: {
    path: "v1/getNotificationList",
    isAuth: true,
    method: "POST",
  },
  deleteNotification: {
    path: "v1/deleteNotification",
    isAuth: true,
    method: "POST",
  },
  createNotification: {
    path: "v1/createNotification",
    isAuth: true,
    method: "POST",
  },
  getUserListByUserType: {
    path: "v1/getUserListByUserType",
    isAuth: true,
    method: "POST",
  },
  getNotificationDetails: {
    path: "v1/getNotificationDetails",
    isAuth: true,
    method: "POST",
  },
  updateNotificationDetails: {
    path: "v1/updateNotificationDetails",
    isAuth: true,
    method: "POST",
  },
  getlookuplistbylookuptype: {
    path: "v1/getlookuplistbylookuptype",
    isAuth: true,
    method: "POST",
  },
  getConfigurationDetails: {
    path: "v1/getConfigurationDetails",
    isAuth: true,
    method: "POST",
  },
  updateConfigurationDetails: {
    path: "v1/updateConfigurationDetails",
    isAuth: true,
    method: "POST",
  },

  getNotificationConfig: {
    path: "v1/getNotificationConfig",
    isAuth: true,
    method: "POST",
  },
  updateNotificationConfig: {
    path: "v1/updateNotificationConfig",
    isAuth: true,
    method: "POST",
  },
  getVendorsWorkingStatusTraining: {
    path: "v1/getVendorsWorkingStatusTraining",
    isAuth: true,
    method: "POST",
  },
  assignTraningInterpretion: {
    path: "v1/assignTraningInterpretion",
    isAuth: true,
    method: "POST",
  },
  getSupervisorFromClient: {
    path: "v1/getSupervisorFromClient",
    isAuth: true,
    method: "POST",
  },
  fetchActiveMasterDepartmentByIndustry: {
    path: "v1/fetchActiveMasterDepartmentByIndustry",
    isAuth: true,
    method: "POST",
  },
  fetchActiveClientDepartment: {
    path: "v1/fetchActiveClientDepartment",
    isAuth: true,
    method: "POST",
  },
  getJobCompleteSummary: {
    path: "v1/getJobCompleteSummary",
    isAuth: true,
    method: "POST",
  },
  addVendorRatecardNew: {
    path: "v1/addVendorRatecardNew",
    isAuth: true,
    method: "POST",
  },
  acceptClientQuote: {
    path: "v1/acceptClientQuote",
    isAuth: true,
    method: "POST",
  },
  getVendorsWorkingStatusTranslation: {
    path: "v1/getVendorsWorkingStatusTranslation",
    isAuth: true,
    method: "POST",
  },
  getBidStatus: {
    path: "v1/getBidStatus",
    isAuth: true,
    method: "POST",
  },
  getBidReqStat: {
    path: "v1/getBidReqStat",
    isAuth: true,
    method: "POST",
  },
  assignVendorForTranslation: {
    path: "v1/assignVendorForTranslation",
    isAuth: true,
    method: "POST",
  },

  assignVendorForTranslationV2: {
    path: "v2/assignVendorForTranslation",
    isAuth: true,
    method: "POST",
  },
  fetchVendorAvailablityList: {
    path: "v1/fetchVendorAvailablityList",
    isAuth: true,
    method: "POST",
  },
  insertStores: {
    path: "v1/insertStores",
    isAuth: true,
    method: "POST",
  },
  changeStatusStore: {
    path: "v1/changeStatusStore",
    isAuth: true,
    method: "POST",
  },
  fetchStoreList: {
    path: "v1/fetchStoreList",
    isAuth: true,
    method: "POST",
  },
  getStoreDetailsById: {
    path: "v1/getStoreDetailsById",
    isAuth: true,
    method: "POST",
  },
  updateStoreDetails: {
    path: "v1/updateStoreDetails",
    isAuth: true,
    method: "POST",
  },
  insertMaintainanceReq: {
    path: "v1/insertMaintainanceReq",
    isAuth: true,
    method: "POST",
  },
  insertMaintainanceReq: {
    path: "v1/insertMaintainanceReq",
    isAuth: true,
    method: "POST",
  },
  fetchMaintainanceReqList: {
    path: "v1/fetchMaintainanceReqList",
    isAuth: true,
    method: "POST",
  },
  changeStatusMaintainance: {
    path: "v1/changeStatusMaintainance",
    isAuth: true,
    method: "POST",
  },
  getAdminStaffForMaintainance: {
    path: "v1/getAdminStaffForMaintainance",
    isAuth: true,
    method: "POST",
  },
  fetchMaintainanceReqById: {
    path: "v1/fetchMaintainanceReqById",
    isAuth: true,
    method: "POST",
  },
  updateMaintainanceReq: {
    path: "v1/updateMaintainanceReq",
    isAuth: true,
    method: "POST",
  },
  fetchAccountPayableInterpretation: {
    path: "v1/fetchAccountPayableInterpretation",
    isAuth: true,
    method: "POST",
  },
  fetchAccountReceivabaleInterpretation: {
    path: "v1/fetchAccountReceivabaleInterpretation",
    isAuth: true,
    method: "POST",
  },
  fetchPayableTraining: {
    path: "v1/fetchPayableTraining",
    isAuth: true,
    method: "POST",
  },
  fetchReceivabaleTraining: {
    path: "v1/fetchReceivabaleTraining",
    isAuth: true,
    method: "POST",
  },
  getSourceDocuments: {
    path: "v1/getSourceDocuments",
    isAuth: true,
    method: "POST",
  },
  getTranslationDocuments: {
    path: "v1/getTranslationDocuments",
    isAuth: true,
    method: "POST",
  },
  setVendorReviewDocument: {
    path: "v1/setVendorReviewDocument",
    isAuth: true,
    method: "POST",
  },
  sentDocToClient: {
    path: "v1/sentDocToClient",
    isAuth: true,
    method: "POST",
  },
  fetchAccountPayable: {
    path: "v1/fetchAccountPayable",
    isAuth: true,
    method: "POST",
  },

  fetchAllVendorList: {
    path: "v1/fetchAllVendorList",
    isAuth: true,
    method: "POST",
  },
  changeStatusAccountPayable: {
    path: "v1/changeStatusAccountPayable",
    isAuth: true,
    method: "POST",
  },
  getApprovedInterpretationRFQListByClient: {
    path: "v1/getApprovedInterpretationRFQListByClient",
    isAuth: true,
    method: "POST",
  },
  getAllProjectsByClient: {
    path: "v1/getAllProjectsByClient",
    isAuth: true,
    method: "POST",
  },
  insertInvoiceTemplate: {
    path: "v1/insertInvoiceTemplate",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceTemplateList: {
    path: "v1/fetchInvoiceTemplateList",
    isAuth: true,
    method: "POST",
  },
  getInvoiceTemplateById: {
    path: "v1/getInvoiceTemplateById",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceAllJobs: {
    path: "v1/fetchInvoiceAllJobsRecievable",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceAllJobsPayable: {
    path: "v1/fetchInvoiceAllJobsPayable",
    isAuth: true,
    method: "POST",
  },
  fetchBillsUnderVerification: {
    path: "v1/fetchBillsUnderVerification",
    isAuth: true,
    method: "POST",
  },

  createInvoice: {
    path: "v1/createInvoice",
    isAuth: true,
    method: "POST",
  },
  fetchclientinfoByID: {
    path: "v1/fetchclientinfoByID",
    isAuth: true,
    method: "POST",
  },
  insertAdminAddress: {
    path: "v1/insertAdminAddress",
    isAuth: true,
    method: "POST",
  },
  getAdminAddress: {
    path: "v1/getAdminAddress",
    isAuth: true,
    method: "POST",
  },
  fetchTemplateListByUserId: {
    path: "v1/fetchTemplateListByUserId",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceByJobId: {
    path: "v1/fetchInvoiceByJobId",
    isAuth: true,
    method: "POST",
  },
  fetchPayableItemOnCreateInvoice: {
    path: "v1/fetchPayableItemOnCreateInvoice",
    isAuth: true,
    method: "POST",
  },





  insertInvoiceTemplate: {
    path: "v1/insertInvoiceTemplate",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceTemplateList: {
    path: "v1/fetchInvoiceTemplateList",
    isAuth: true,
    method: "POST",
  },
  getInvoiceTemplateById: {
    path: "v1/getInvoiceTemplateById",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceAllJobs: {
    path: "v1/fetchInvoiceAllJobsRecievable",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceAllJobsPayable: {
    path: "v1/fetchInvoiceAllJobsPayable",
    isAuth: true,
    method: "POST",
  },
  fetchBillsUnderVerification: {
    path: "v1/fetchBillsUnderVerification",
    isAuth: true,
    method: "POST",
  },

  createInvoice: {
    path: "v1/createInvoice",
    isAuth: true,
    method: "POST",
  },
  fetchclientinfoByID: {
    path: "v1/fetchclientinfoByID",
    isAuth: true,
    method: "POST",
  },
  insertAdminAddress: {
    path: "v1/insertAdminAddress",
    isAuth: true,
    method: "POST",
  },
  getAdminAddress: {
    path: "v1/getAdminAddress",
    isAuth: true,
    method: "POST",
  },
  fetchTemplateListByUserId: {
    path: "v1/fetchTemplateListByUserId",
    isAuth: true,
    method: "POST",
  },
  fetchAllInvoiceReceivable: {
    path: "v1/fetchAllInvoiceReceivable",
    isAuth: true,
    method: "POST",
  },
  fetchAllInvoicePayable: {
    path: "v1/fetchAllInvoicePayable",
    isAuth: true,
    method: "POST",
  },
  fetchPayableItemsById: {
    path: "v1/fetchPayableItemsById",
    isAuth: true,
    method: "POST",
  },
  fetchBillsUnderVerificationReceivable: {
    path: "v1/fetchBillsUnderVerificationReceivable",
    isAuth: true,
    method: "POST",
  },
  fetchBillsUnderVerificationPayable: {
    path: "v1/fetchBillsUnderVerificationReceivable",
    isAuth: true,
    method: "POST",
  },
  createIndustryType: {
    path: "v1/createIndustryType",
    isAuth: true,
    method: "POST",
  },
  fetchIndustryTypeList: {
    path: "v1/fetchIndustryTypeList",
    isAuth: true,
    method: "POST",
  },
  changeStatusIndustryType: {
    path: "v1/changeStatusIndustryType",
    isAuth: true,
    method: "POST",
  },
  fetchIndustryTypeById: {
    path: "v1/fetchIndustryTypeById",
    isAuth: true,
    method: "POST",
  },
  updateIndustryType: {
    path: "v1/updateIndustryType",
    isAuth: true,
    method: "POST",
  },
  fetchBillsUnderVerificationPayable: {
    path: "v1/fetchBillsUnderVerificationPayable",
    isAuth: true,
    method: "POST",
  },
  updateQuote: {
    path: "v1/updateQuote",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceByJobId: {
    path: "v1/fetchInvoiceByJobId",
    isAuth: true,
    method: "POST",
  },
  updateClientContactProfilePic: {
    path: "v1/updateClientContactProfilePic",
    isAuth: true,
    method: "POST",
  },
  exportInvoicePayables: {
    path: "v1/exportInvoicePayables",
    isAuth: true,
    method: "POST",
  },
  exportInvoiceReceivables: {
    path: "v1/exportInvoiceReceivables",
    isAuth: true,
    method: "POST",
  },
  fetchJobDetails: {
    path: "v1/fetchJobDetails",
    isAuth: true,
    method: "POST",
  },

  fetchTrainingDetails: {
    path: "v1/fetchTrainingDetails",
    isAuth: true,
    method: "POST",
  },
  modifyInterPretationJobFromAdmin: {
    path: "v1/modifyInterPretationJobFromAdmin",
    isAuth: true,
    method: "POST",
  },
  modifyTraining: {
    path: "v1/modifyTraining",
    isAuth: true,
    method: "POST",
  },
  getDashboardJobList: {
    path: "v1/getDashboardJobList",
    isAuth: true,
    method: "POST",
  },
  fetchDashboardBillsUnderVerificationClient: {
    path: "v1/fetchDashboardBillsUnderVerificationClient",
    isAuth: true,
    method: "POST",
  },
  fetchDasboardInvoiceClient: {
    path: "v1/fetchDasboardInvoiceClient",
    isAuth: true,
    method: "POST",
  },
  fetchClientInvoice: {
    path: "v1/fetchClientInvoice",
    isAuth: true,
    method: "POST",
  },
  getDashboardJobListVendor: {
    path: "v1/getDashboardJobListVendor",
    isAuth: true,
    method: "POST",
  },
  fetchDashboardBillsUnderVerificationVendor: {
    path: "v1/fetchDashboardBillsUnderVerificationVendor",
    isAuth: true,
    method: "POST",
  },
  fetchDasboardInvoiceVendor: {
    path: "v1/fetchDasboardInvoiceVendor",
    isAuth: true,
    method: "POST",
  },
  getDashboardJobListByClient: {
    path: "v1/getDashboardJobListByClient",
    isAuth: true,
    method: "POST",
  },
  getDashboardQuoteByClient: {
    path: "v1/getDashboardQuoteByClient",
    isAuth: true,
    method: "POST",
  },
  insertClientContactUs: {
    path: "v1/insertClientContactUs",
    isAuth: true,
    method: "POST",
  },
  getInvoicePathById: {
    path: "v1/getInvoicePathById",
    isAuth: true,
    method: "POST",
  },
  updateIdentificationDoc: {
    path: "v1/updateIdentificationDoc",
    isAuth: true,
    method: "POST",
  },
  insertMasterDepartmentNew: {
    path: "v1/insertMasterDepartmentNew",
    isAuth: true,
    method: "POST",
  },
  updateMasterDepartmentNew: {
    path: "v1/updateMasterDepartmentNew",
    isAuth: true,
    method: "POST",
  },

  insertClientMasterDepartmentNew: {
    path: "v1/insertClientMasterDepartmentNew",
    isAuth: true,
    method: "POST",
  },
  fetchClientDepartmentNew: {
    path: "v1/fetchClientDepartmentNew",
    isAuth: true,
    method: "POST",
  },
  fetchActiveClientDepartmentNew: {
    path: "v1/fetchActiveClientDepartmentNew",
    isAuth: true,
    method: "POST",
  },
  fetchActiveClientDepartmentAll: {
    path: "v1/fetchActiveClientDepartmentAll",
    isAuth: true,
    method: "POST",
  },
  updateClientDepartmentNew: {
    path: "v1/updateClientDepartmentNew",
    isAuth: true,
    method: "POST",
  },
  addVendorEducationTrainingDoc: {
    path: "v1/addVendorEducationTrainingDoc",
    isAuth: false,
    method: "POST",
  },
  fetchVendorEducationTrainingDocById: {
    path: "v1/fetchVendorEducationTrainingDocById",
    isAuth: false,
    method: "POST",
  },
  updateVendorEducationTrainingDoc: {
    path: "v1/updateVendorEducationTrainingDoc",
    isAuth: false,
    method: "POST",
  },
  getVendorContractListV2: {
    path: "v2/getVendorContractList",
    isAuth: true,
    method: "POST",
  },
  addclientcontacttypeleiV2: {
    path: "v2/addclientcontacttypelei",
    isAuth: true,
    method: "POST",
  },
  updateClientContactDetailsLEIV2: {
    path: "v2/updateClientContactDetailsLEI",
    isAuth: true,
    method: "POST",
  },
  uploadVendorContract: {
    path: "v2/uploadVendorContractList",
    isAuth: true,
    method: "POST",
  },

  bulkActionToVoid: {
    path: "v1/bulkActionToVoid",
    isAuth: true,
    method: "POST",
  },
  bulkActionToPaid: {
    path: "v1/bulkActionToPaid",
    isAuth: true,
    method: "POST",
  },
  acceptClientQuoteV2: {
    path: "v2/acceptClientQuote",
    isAuth: true,
    method: "POST",
  },
  declineClientQuote: {
    path: "v1/declineClientQuote",
    isAuth: true,
    method: "POST",
  },
  getRequestorByClient: {
    path: "v1/getRequestorByClient",
    isAuth: true,
    method: "POST",
  },
  getJobCompleteSummaryV2: {
    path: "v2/getJobCompleteSummary",
    isAuth: true,
    method: "POST",
  },
  fetchAllRequester: {
    path: "v1/fetchAllRequester",
    isAuth: true,
    method: "POST",
  },
  getAllCourseList: {
    path: "v1/getAllCourseList",
    isAuth: true,
    method: "POST",
  },
  getAllProjectsHistoryV2: {
    path: "v2/getAllProjectsHistory",
    isAuth: true,
    method: "POST",
  },
  getAllProjectsV2: {
    path: "v2/getAllProjects",
    isAuth: true,
    method: "POST",
  },
  getTranslationDetails: {
    path: "v1/getTranslationDetails",
    isAuth: true,
    method: "POST",
  },
  getApprovedTranslation: {
    path: "v1/getApprovedTranslation",
    isAuth: true,
    method: "POST",
  },
  updateTranslationTask: {
    path: "v1/updateTranslationTask",
    isAuth: true,
    method: "POST",
  },
  createTranslationV2: {
    path: "v2/createTranslation",
    isAuth: true,
    method: "POST",
  },
  fetchInvoiceAllJobsPayableV2: {
    path: "v2/fetchInvoiceAllJobsPayable",
    isAuth: true,
    method: "POST",
  },

  fetchAllInvoicePayableV2: {
    path: "v2/fetchAllInvoicePayable",
    isAuth: true,
    method: "POST",
  },

  addVendorServiceNLanguage: {
    path: "v1/addVendorServiceNLanguage",
    isAuth: true,
    method: "POST",
  },

  sentTranslationOfferToVendor: {
    path: "v1/sentTranslationOfferToVendor",
    isAuth: true,
    method: "POST",
  },
  updateInvoice: {
    path: "v1/updateInvoice",
    isAuth: true,
    method: "POST",
  },
  clientRequestList: {
    path: "v1/clientRequestList",
    isAuth: true,
    method: "POST",
  },
  fetchclientReqlist: {
    path: "v1/fetchclientReqlist",
    isAuth: true,
    method: "POST",
  },
  clientMerge: {
    path: "v1/clientMerge",
    isAuth: true,
    method: "POST",
  },
  fetchAllRequesterByClientId: {
    path: "v1/fetchAllRequesterByClientId",
    isAuth: true,
    method: "POST",
  },
  requesterMerge: {
    path: "v1/requesterMerge",
    isAuth: true,
    method: "POST",
  },
  removeTask: {
    path: "v1/removeTask",
    isAuth: true,
    method: "POST",
  },
  fetchApproveClientList: {
    path: "v1/fetchApproveClientList",
    isAuth: true,
    method: "POST",
  },
  getcoordinatefromplaceidforclientRFQ: {
    path: "v1/getcoordinatefromplaceidforclientRFQ",
    isAuth: false,
    method: "POST",
  },
  createTranslationFromClientRFQ: {
    path: "v1/createTranslationFromClientRFQ",
    isAuth: false,
    method: "POST",
  },
  bulkActionToDownloadEmail: {
    path: "v1/bulkActionToDownloadEmail",
    isAuth: true,
    method: "POST",
  },
  bulkActionToDownload: {
    path: "v1/bulkActionToDownload",
    isAuth: true,
    method: "POST",
  },
  getDashboardProjectList: {
    path: "v1/getDashboardProjectList",
    isAuth: true,
    method: "POST",
  },
  getDashboardProjectListVendor: {
    path: "v1/getDashboardProjectListVendor",
    isAuth: true,
    method: "POST",
  },
  vendorGetDashboardProjectList: {
    path: "v1/vendorGetDashboardProjectList",
    isAuth: true,
    method: "POST",
  },
  getAdminTranslationDocs: {
    path: "v1/getAdminTranslationDocs",
    isAuth: true,
    method: "POST",
  },
  sendTranslationDocRequest: {
    path: "v1/sendTranslationDocRequest",
    isAuth: true,
    method: "POST",
  },
  clientContactMerge: {
    path: "v1/clientContactMerge",
    isAuth: true,
    method: "POST",
  },
  getApprovedTranslationHistory: {
    path: "v1/getApprovedTranslationHistory",
    isAuth: true,
    method: "POST",
  },
  fetchClientInvoiceByClientId: {
    path: "v1/fetchClientInvoiceByClientId",
    isAuth: true,
    method: "POST",
  },
  translationDocUpload: {
    path: "v1/translationDocUpload",
    isAuth: true,
    method: "POST",
  },
  updateWordCount: {
    path: "v1/updateWordCount",
    isAuth: true,
    method: "POST",
  },
  getAudioVideoIdentity: {
    path: "v1/getAudioVideoIdentity",
    isAuth: true,
    method: "POST",
  },
  completeReq: {
    path: "v1/completeReq",
    isAuth: true,
    method: "POST",
  },
  followUpJobs: {
    path: "v1/followUpJobs",
    isAuth: true,
    method: "POST",
  },














  // ................CLIENT...........

  findBusinessName: {
    path: "v1/findBusinessName",
    isAuth: false,
    method: "POST",
  },
  getlocaiondescriptionForClientRFQ: {
    path: "v2/getlocaiondescriptionForClientRFQ",
    isAuth: true,
    method: "POST",
  },
  fetchClientDepartmentClient: {
    path: "v2/fetchClientDepartment",
    isAuth: true,
    method: "POST",
  },

  insertClientMasterDepartmentClient: {
    path: "v2/insertClientMasterDepartment",
    isAuth: true,
    method: "POST",
  },

  updateClientDepartmentClient: {
    path: "v2/updateClientDepartment",
    isAuth: true,
    method: "POST",
  },

  clientdepartmentstatusupdateClient: {
    path: "v2/clientdepartmentstatusupdate",
    isAuth: true,
    method: "POST",
  },

  getclientcontactrequestdetailsClient: {
    path: "v2/getclientcontactrequestdetails",
    isAuth: true,
    method: "POST",
  },

  modifyclientcontactstatusClient: {
    path: "v2/modifyclientcontactstatus",
    isAuth: true,
    method: "POST",
  },

  fetchDetailsByClientDepartmentClient: {
    path: "v2/fetchDetailsByClientDepartment",
    isAuth: true,
    method: "POST",
  },

  modifyclientinfoClient: {
    path: "v2/modifyclientinfo",
    isAuth: true,
    method: "POST",
  },

  fetchclientinfoClient: {
    path: "v2/fetchclientinfo",
    isAuth: true,
    method: "POST"
  },

  fetchUserDetailByDeptClient: {
    path: "v2/fetchUserDetailByDept",
    isAuth: true,
    method: "POST"
  }, 
  fetchapprovedclientcontactlistClient: {
    path: "v2/fetchapprovedclientcontactlist",
    isAuth: true,
    method: "POST"
  },
  addclientcontacttyperequesterClient: {
    path: "v2/addclientcontacttyperequester",
    isAuth: true,
    method: "POST"
  },
  addclientcontacttypesupervisorClient: {
    path: "v2/addclientcontacttypesupervisor",
    isAuth: true,
    method: "POST"
  },
  addclientcontacttypeleiClient: {
    path: "v2/addclientcontacttypelei",
    isAuth: true,
    method: "POST"
  },
  getallclinetinfoClient: {
    path: "v2/getallclinetinfo",
    isAuth: true,
    method: "POST"
  },
  updateClientContactDetailsClient: {
    path: "v2/updateClientContactDetails",
    isAuth: true,
    method: "POST"
  },
  fetchclientcontactreqlistClient: {
    path: "v2/fetchclientcontactreqlist",
    isAuth: true,
    method: "POST"
  },
  fetchselectedclientdeptinfoClient: {
    path: "v2/fetchselectedclientdeptinfo",
    isAuth: true,
    method: "POST"
  },
  addrequesterFromClientREQ: {
    path: "v1/addrequesterFromClientREQ",
    isAuth: true,
    method: "POST"
  },
  addNewJobFromClientREQ: {
    path: "v1/addNewJobFromClientREQ",
    isAuth: true,
    method: "POST"
  },
  getCourseWithCategoryForClientReq: {
    path: "v1/getCourseWithCategoryForClientReq",
    isAuth: true,
    method: "POST"
  },
  getJobList: {
    path: "v1/getJobList",
    isAuth: true,
    method: "POST",
  },
  rejectClientQuote: {
    path: "v1/rejectClientQuote",
    isAuth: true,
    method: "POST"
  },

  fetchClientInvoice: {
    path: "v1/fetchClientInvoice",
    isAuth: true,
    method: "POST",
  },
  fetchClientDepartmentNewClient: {
    path: "v2/fetchClientDepartmentNew",
    isAuth: true,
    method: "POST",
  },
  getTrainingListClient: {
    path: "v1/getTrainingListClient",
    isAuth: true,
    method: "POST",
  },
  fetchClientInvoiceDetails: {
    path: "v1/fetchClientInvoiceDetails",
    isAuth: true,
    method: "POST",
  },

  fetchclientinfoForMerge: {
    path: "v1/fetchclientinfoForMerge",
    isAuth: true,
    method: "POST",
  },
  getTranslationListClient: {
    path: "v2/getTranslationListClient",
    isAuth: true,
    method: "POST",
  },
  getTranslationHistoryListClient: {
    path: "v2/getTranslationHistoryListClient",
    isAuth: true,
    method: "POST",
  },








  // .................vendor....................
  getVendorIdentificationDoc: {
    path: "v1/getVendorIdentificationDoc",
    isAuth: false,
    method: "POST",
  },
  addVendorIdentificationDoc: {
    path: "v1/addVendorIdentificationDoc",
    isAuth: false,
    method: "POST",
  },
  getVendorContracts: {
    path: "v1/getVendorContracts",
    isAuth: false,
    method: "POST",
  },
  getvendorCertificateList: {
    path: "v1/getvendorCertificateList",
    isAuth: false,
    method: "POST",
  },
  deleteVendorCertificate: {
    path: "v1/deleteVendorCertificate",
    isAuth: false,
    method: "POST",
  },
  getvendorbasicinfo: {
    path: "v1/getvendorbasicinfo",
    isAuth: false,
    method: "POST",
  },
  getVendorContracts: {
    path: "v1/getVendorContracts",
    isAuth: false,
    method: "POST",
  },
  addVendorCertificate: {
    path: "v1/addVendorCertificate",
    isAuth: false,
    method: "POST",
  },
  getVendorCertificateDetails: {
    path: "v1/getVendorCertificateDetails",
    isAuth: false,
    method: "POST",
  },
  updateVendorCertificate: {
    path: "v1/updateVendorCertificate",
    isAuth: false,
    method: "POST",
  },
  addVendorContracts: {
    path: "v1/addVendorContracts",
    isAuth: false,
    method: "POST",
  },
  getVendorRatecardListForVendorWeb: {
    path: "v1/getVendorRatecardListForVendorWeb",
    isAuth: true,
    method: "POST",
  },
  userAlertList: {
    path: "v1/userAlertList",
    isAuth: true,
    method: "POST",
  },
  addUserAlert: {
    path: "v1/addUserAlert",
    isAuth: true,
    method: "POST",
  },
  deleteUserAlert: {
    path: "v1/deleteUserAlert",
    isAuth: true,
    method: "POST",
  },
  updateUserAlert: {
    path: "v1/updateUserAlert",
    isAuth: true,
    method: "POST",
  },
  getUserNotifications: {
    path: "v1/getUserNotifications",
    isAuth: true,
    method: "POST",
  },
  UserNotificationsStatusChange: {
    path: "v1/UserNotificationsStatusChange",
    isAuth: true,
    method: "POST",
  },
  submitContactUs: {
    path: "v1/submitContactUs",
    isAuth: true,
    method: "POST",
  },
  changeOngoingJobStat: {
    path: "v1/changeOngoingJobStat",
    isAuth: true,
    method: "POST",
  },
  createCompleteSummary: {
    path: "v1/createCompleteSummary",
    isAuth: true,
    method: "POST",
  },
  getTrainingDetails: {
    path: "v1/getTrainingDetails",
    isAuth: true,
    method: "POST",
  },
  getTrainingListForWeb: {
    path: "v1/getTrainingListForWeb",
    isAuth: true,
    method: "POST",

  },
  sendJobBid: {
    path: "v1/sendJobBid",
    isAuth: true,
    method: "POST",
  },
  getCompleteSummary: {
    path: "v1/getCompleteSummary",
    isAuth: true,
    method: "POST",
  },
  updateInterpretationJobStat: {
    path: "v1/updateInterpretationJobStat",
    isAuth: true,
    method: "POST",
  },

  fetchVendorInvoice: {
    path: "v1/fetchVendorInvoice",
    isAuth: true,
    method: "POST",
  },
  vendorGetDashboardJobList: {
    path: "v1/vendorGetDashboardJobList",
    isAuth: true,
    method: "POST",
  },
  vendorFetchDashboardBillsUnderVerification: {
    path: "v1/vendorFetchDashboardBillsUnderVerification",
    isAuth: true,
    method: "POST",
  },
  vendorFetchDasboardInvoice: {
    path: "v1/vendorFetchDasboardInvoice",
    isAuth: true,
    method: "POST",
  },
  getTrainingPayableDetails: {
    path: "v1/getTrainingPayableDetails",
    isAuth: true,
    method: "POST",
  },
  sendTrainingPayable: {
    path: "v1/sendTrainingPayable",
    isAuth: true,
    method: "POST",
  },


  getTranslationProjetList: {
    path: "v2/getTranslationProjetList",
    isAuth: true,
    method: "POST",
  },
  getTranslationProjetDeails: {
    path: "v1/getTranslationProjetDeails",
    isAuth: true,
    method: "POST",
  },
  translationTaskSendBid: {
    path: "v1/translationTaskSendBid",
    isAuth: true,
    method: "POST",
  },
  cancelProjectDetailsForApp: {
    path: "v1/cancelProjectDetailsForApp",
    isAuth: true,
    method: "POST",
  },
  fetchVendorVaccationListByUserId: {
    path: "v1/fetchVendorVaccationListByUserId",
    isAuth: true,
    method: "POST",
  },
  getVendorTranslationDocs: {
    path: "v1/getVendorTranslationDocs",
    isAuth: true,
    method: "POST",
  },
  translationStart: {
    path: "v1/translationStart",
    isAuth: true,
    method: "POST",
  }



});
