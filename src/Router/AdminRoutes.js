import React, { Component } from "react";
import { Route } from "react-router-dom";


import Dashboard from "../app/Admin/Dashboard/Dashboard";
import VendorContactDetails from "../app/Admin/Requests/Vendor/View_Contact/VendorContactDetails";
import Client_Request_contact from "../app/Admin/Requests/Client/Request_Contacts/Client_Request_contact";
import Vendor_Request_contact from "../app/Admin/Requests/Vendor/Request_contact/Vendor_Request_contact";
import ClientContactDetails from "../app/Admin/Requests/Client/View_Contact_Details/ClientContactDetails";
import VendorDocVerification from "../app/Admin/Requests/Vendor/VendorVerifiedDoc/VendorDocVerification";
import ViewListPage from "../app/Admin/ViewListing/ViewListPage";
import Vendor_Detail from "../app/Admin/Requests/Vendor/VendorDetail/Vendor_Detail";
import Clients from "../app/Admin/Clients&Contacts/Clients/Clients";
import AddNewClient from "../app/Admin/Clients&Contacts/Clients/AddNewClient";
import AddNewClientTwo from "../app/Admin/Clients&Contacts/Clients/AddNewClientTwo";
import EditProfile from "../app/Admin/EditProfile/EditProfile";
import ClientDepartment from "../app/Admin/Departments/Client_Department/ClientDepartment";
import MasterDepartmentList from "../app/Admin/Departments/Master_Department/MasterDepartmentList";
import AddNewMasterDetails from "../app/Admin/Departments/Master_Department/AddNewDepartment/AddNewMasterDetails";
import EditDetailsPage from "../app/Admin/Departments/Master_Department/View_Details/EditDetailsPage";
import AddClientDepartment from '../app/Admin/Departments/Client_Department/AddNewDepartment/AddClientDepartment';
import EditClientDetails from '../app/Admin/Departments/Client_Department/View_Details/EditClientDetails';
import AdminStaff from "../app/Admin/ManageAdminStaff/AdminStaff";
import AddAdminstaff from "../app/Admin/ManageAdminStaff/AddAdminStaff/AddAdminstaff";
import EditAdminStaff from "../app/Admin/ManageAdminStaff/Edit_AdminStaff/EditAdminStaff";
import VendorList from "../app/Admin/Manage Vendors/Vendor List";
import RequestList from "../app/Admin/Manage Vendors/Vendor_Registration/Request_List";
// import ViewRequest from "../app/Admin/Manage Vendors/Vendor_Registration/View_Request";
import VendorDocs from "../app/Admin/Manage Vendors/Vendor_docs";
import ServiceCategoryList from "../app/Admin/ServiceCategory/ServiceCategoryList/ServiceCategoryList";
import AddSeviceCategory from "../app/Admin/ServiceCategory/AddServiceCategory/AddServiceCategory";
import EditSeviceCategory from "../app/Admin/ServiceCategory/EditServiceCategory/EditServiceCategory";
import DocumentList from "../app/Admin/Documents/DocumentList/DocumentList";
import AddDocument from "../app/Admin/Documents/AddDocument/AddDocument";
import EditDocument from "../app/Admin/Documents/EditDocument/EditDocument";
import CourseList from "../app/Admin/ManageTrainingCourses/TrainingCourseList/CourseList";
import AddCourse from "../app/Admin/ManageTrainingCourses/AddTrainingCourse/AddCourse";
import EditCourse from "../app/Admin/ManageTrainingCourses/EditTrainingCourse/EditCourse";
import AddVendor from "../app/Admin/Manage Vendors/AddVendor";
import EditVendorProfile from "../app/Admin/Manage Vendors/EditVendorProfile";
import VendorRateList from "../app/Admin/Manage Vendors/VendorRateCard/VendorRateList";
import Header from "../app/Admin/Header/Header";
import Sidebar from "../app/Admin/Sidebar/Sidebar";
import ClientList from "../app/Admin/ManageClients/ClientList/ClientList";
import AddClient from "../app/Admin/ManageClients/AddClient/AddClient";
import EditClient from "../app/Admin/ManageClients/EditClient/EditClient";
import ContactsRequestList from "../app/Admin/ManageClients_contacts/contactsRegistration/ContactsRequestList";
import ViewContactRequest from "../app/Admin/ManageClients_contacts/contactsRegistration/ViewContactRequest";
import AddPermission from "../app/Admin/ManageRoles/Add";
import RoleList from "../app/Admin/ManageRoles/Roles_PermissionList";
import EditPermission from "../app/Admin/ManageRoles/Edit";
import ClientContactList from "../app/Admin/ManageClients_contacts/ClientContactList/ClientContactList";
import AddClientContact from "../app/Admin/ManageClients_contacts/AddClientContacts/AddClientContact";
import EditClientContact from "../app/Admin/ManageClients_contacts/EditClientContacts/EditClientContact";
import ViewRequest from "../app/Admin/Manage Vendors/Vendor_Registration/View_Request/viewRequest";
import CreateNewJob from "../app/Admin/ManageJobs/CreateNewJob/CreateNewJob";
import OnDemandInterpretation from "../app/Admin/ManageJobs/CreateOnDemandJob/OnDemandInterpretation";
import CreateNewTraining from "../app/Admin/ManageProjects/CreateNewTraining/CreateNewTraining";
import CreateNewTranslation from "../app/Admin/ManageProjects/CreateNewTranslation/CreateNewTranslation";
import ClientRfqDetails from "../app/Admin/ManageClientRFQ/ClientRFQDetails/ClientRfqDetails";
import ClientRfqList from "../app/Admin/ManageClientRFQ/ClientRFQList/ClientRfqList";
import SendQuote from "../app/Admin/ManageClientRFQ/ClientRFQSendQuotePage/SendQuote";
import TranslationDetails from "../app/Admin/ManageClientRFQ/TranslationDetails/TranslationDetails";
import TranslationSendQuote from "../app/Admin/ManageClientRFQ/TranslationSendQuotePage/TranslationSendQuote";
import ViewAllJobs from "../app/Admin/Manage_Interpretation_jobs/ViewAllJobs";
import VendorOffer from "../app/Admin/Manage_Interpretation_jobs/VendorOffer";
import JobDetails from "../app/Admin/Manage_Interpretation_jobs/JobDetails";
import TrainingDetails from "../app/Admin/ManageClientRFQ/TrainingDetails/TrainingDetails";
import TranslationList from "../app/Admin/ManageProjects/Translation/TranslationList/TranslationList";
import ProjectList from "../app/Admin/ManageProjects/ProjectList/ProjectList";
import ClientRateCard from "../app/Admin/ManageClients/ClientRateCard/ClientRateCard_1";
import ViewTranslationDetails from "../app/Admin/ManageProjects/ProjectPages/ViewTranslationDetails";
import TrainingProjectList from "../app/Admin/ManageProjects/ProjectList/TrainingProjectList";
import ViewTrainingDetails from "../app/Admin/ManageProjects/ProjectPages/ViewTrainingDetails";

import NotificationList from "../app/Admin/Settings/Notification/NotificationList/NotificationList";
import AddNotification from "../app/Admin/Settings/Notification/AddNotification/AddNotification";
import EditNotification from "../app/Admin/Settings/Notification/EditNotification/EditNotification";
import ConfigurationPanel from "../app/Admin/Settings/ConfigurationPanel/ConfigurationPanel";
import NotificationSetting from "../app/Admin/Settings/ConfigurationPanel/NotificationSetting/NotificationSetting";


import StoresList from "../app/Admin/Manage_Stores_&_Maintenance/ManageStores/StoresList/StoresList";
import AddStore from "../app/Admin/Manage_Stores_&_Maintenance/ManageStores/AddStore/AddStore";
import EditStore from "../app/Admin/Manage_Stores_&_Maintenance/ManageStores/EditStore/EditStore";
import MaintenanceList from "../app/Admin/Manage_Stores_&_Maintenance/Maintenance/MaintenanceRequestList/MaintenanceList";
import AddMaintenance from "../app/Admin/Manage_Stores_&_Maintenance/Maintenance/AddMaintenanceRequest/AddMaintenance";
import EditMaintenance from "../app/Admin/Manage_Stores_&_Maintenance/Maintenance/EditMaintenanceDetails/EditMaintenance";
import JobDetailsOfClient from "../app/Admin/ManageClients_contacts/Client_Job_Details/ClientJobDetails";
import ProjectDetailsClient from "../app/Admin/ManageClients_contacts/Client_Project_Details/ProjectDetailsClient";
import InvoicesReceivable from "../app/Admin/ManageInvoice/InvoicesAccountReceivable";
import InvoicesPayable from "../app/Admin/ManageInvoice/InvoiceAccountPayable";
import InvoicesBillsUnderV from "../app/Admin/ManageInvoice/InvoicesBillsUnderV";
import IndustryTypeList from "../app/Admin/ManageIndustryType/IndustryTypeList/IndustryTypeList";
import AddIndustryType from "../app/Admin/ManageIndustryType/AddIndustryType/AddIndustryType";
import EditIndustryType from "../app/Admin/ManageIndustryType/EditIndustryType/EditIndustryType";
import ClientRequestList from "../app/Admin/ManageClients/ManageClientRequest/ClientRequest";
import EditClientRequest from "../app/Admin/ManageClients/ManageClientRequest/EditClientRequest";
import InternalProjectList from "../app/Admin/ManageInternalProjectsV2/InternalProjectList/InternalProjectList";
import CreateInternalProject from "../app/Admin/ManageInternalProjectsV2/CreateInternalProject/CreateInternalProject";



// import NewDesign from "../app/Admin/ManageProjects/ProjectPages/abdulDesign";





// ============Client===========
import ClientProfile from "../app/Client/ClientProfile/ClientProfile";
import DepartmentList from "../app/Client/Department/DepartmentList";
import AddDepartmentClient from "../app/Client/Department/AddDepartmentClient/AddDepartmentClient";

import ManageContactList from "../app/Client/ManageContact/ManageContactList";
import EditDepartmentClient from "../app/Client/Department/EditClientDept/EditDepartmentClient";
import ViewManageContactDetails from "../app/Client/ManageContact/ViewManageContactDetails/ViewManageContactDetails";
import ApprovedContact from "../app/Client/ManageContact/ApprovedContact/ApprovedContact";
import AddNewContact from "../app/Client/ManageContact/ApprovedContact/AddNewContact/AddNewContact";
import EditContact from "../app/Client/ManageContact/ApprovedContact/EditContact/EditContact";
// import ClientReq from "../app/Client/ClientReq/ClientReq";
import AddNewJob from "../app/Client/ClientRFQ/AddNewJob/AddNewJob";
import ClientDashboard from "../app/Client/Dashboard/ClientDashboard";
import ContactList from "../app/Client/ManageClientContact/ContactList/ContactList";
import AddClientContactPage from "../app/Client/ManageClientContact/AddClientContact/AddClientContact";
import EditClientContactPage from "../app/Client/ManageClientContact/EditClientContact/EditClientContactPage";
import ClientContactsRequestList from "../app/Client/ManageClientContact/ContactRequest/ContactRequestList";
import ClientViewContactRequest from "../app/Client/ManageClientContact/ContactRequestView/ContactRequestView";
import ClientAllJobs from "../app/Client/Manage_Interpretation_jobs/ViewAllJobs/ClientAllJobs";
import AssignedJobs from "../app/Client/Manage_Interpretation_jobs/ViewAllJobs/AssignedJobs";
import UnassignedJobs from "../app/Client/Manage_Interpretation_jobs/ViewAllJobs/UnassignedJobs";
import HistoryJobs from "../app/Client/Manage_Interpretation_jobs/ViewAllJobs/HistoryJobs";
import NeedAttention from "../app/Client/Manage_Interpretation_jobs/ViewAllJobs/NeedAttention";
import ClientJobDetails from "../app/Client/Manage_Interpretation_jobs/JobDetails/ClientJobDetails";





//...........For Vendor....................

import VendorDashboard from "../app/Vendor/Dashboard/VendorDashboard";
import VendorDocumentList from "../app/Vendor/ManageDocuments/DocumentList/VendorDocumentList";
import VendorDocList from "../app/Vendor/ManageDocuments/DocumentList/VendorDocList";
import VendorAddDocument from "../app/Vendor/ManageDocuments/AddDocument/VendorAddDocument";
import VendorEditDocument from "../app/Vendor/ManageDocuments/EditDocument/VendorEditDocument";
import VendorEditProfile from "../app/Vendor/EditProfile/EditVendorProfile";
import VendorRateCardList from "../app/Vendor/ManageRateCard/RateCardList";
import VendorTranslationList from "../app/Vendor/ManageProjects/VendorTranslation/TranslationList/VendorTranslationList";
import VendorNotificationList from "../app/Vendor/ManageNotification/NotificationList/NotificationList";

import ReminderList from "../app/Vendor/Settings/ManageReminder/ReminderList/ReminderList";
import AddReminder from "../app/Vendor/Settings/ManageReminder/AddReminder/AddReminder";
import EditReminder from "../app/Vendor/Settings/ManageReminder/EditReminder/EditReminder";
import ContactPage from "../app/Vendor/Contact7c/ContactPage";
import VendorTrainingList from "../app/Vendor/ManageProjects/VendorTraining/TrainingList/VendorTrainingList";
import VendorTrainingDetails from "../app/Vendor/ManageProjects/VendorTraining/TrainingDetails/TrainingDetails";
import EditJob from "../app/Admin/Manage_Interpretation_jobs/JobDetails/EditJobDetails";
import EditTrainingDetails from "../app/Admin/ManageProjects/ProjectPages/EditTrainingDetails";
import InvoiceList from "../app/Client/ManageInvoice/InvoiceListPage/InvoiceList";
import VendorRegistrationDocs from "../app/Admin/Manage Vendors/Vendor_Registration/Registration_Docs/RegistrationDocs";
import AdminAddVendorCertificate from "../app/Admin/Manage Vendors/Vendor_docs/AddCertificateDoc/AdminAddVendorCertificate";
import AdminEditCertificateDoc from "../app/Admin/Manage Vendors/Vendor_docs/EditCertificateDoc/AdminEditCertificateDoc";
import IdentificationDocAdd from "../app/Admin/Manage Vendors/Vendor_docs/AddIdentificationDoc/IdentificationDocAdd";
import InvoiceListVendor from "../app/Vendor/ManageInvoice/InvoiceListPage/InvoiceList";
import ClientTrainingList from "../app/Client/ManageProjects/ClientTraining/TrainingList/ClientTrainingList";
import ClientTrainingDetails from "../app/Client/ManageProjects/ClientTraining/TrainingDetailsPage/TrainingDetails";

import MainBillUnderVerificationPage from "../app/Admin/ManageInvoiceV2/BillsUmderVerification/MainBillUnderVerificationPage/MainBillUnderVerificationPage";
import InterpretationInvoicePage from "../app/Admin/ManageInvoiceV2/BillsUmderVerification/InterpretationPage/InterpretationInvoicePage";
import TrainingInvoicePage from "../app/Admin/ManageInvoiceV2/BillsUmderVerification/TrainingPage/TrainingInvoicePage";
import TranslationInvoicePage from "../app/Admin/ManageInvoiceV2/BillsUmderVerification/TranslationPage/TranslationInvoicePage";

import MainReceivablePage from "../app/Admin/ManageInvoiceV2/Receivables/MainReceivablePage/MainReceivablePage";
import ReceivableInterpretationPage from "../app/Admin/ManageInvoiceV2/Receivables/InterpretationPage/ReceivableInterpretationPage";
import ReceivableTrainingPage from "../app/Admin/ManageInvoiceV2/Receivables/TrainingPage/ReceivableTrainingPage";

import MainPayablePage from "../app/Admin/ManageInvoiceV2/Payables/MainPayablesPage/MainPayablePage";
import PayableInterpretationPage from "../app/Admin/ManageInvoiceV2/Payables/InterpretationPage/PayableInterpretationPage";
import PayableTrainingPage from "../app/Admin/ManageInvoiceV2/Payables/TrainingPage/PayableTrainingPage";
import MaintranslationList from "../app/Vendor/ManageProjects/VendorTranslation/TranslationList/MainTranslationList";
import TranslationDetailsVendor from "../app/Vendor/ManageProjects/VendorTranslation/TranslationDetails/TranslationDetails";
import VendorTranslationDetails from "../app/Vendor/ManageProjects/VendorTranslation/TranslationDetails/vendorTranslationDetails";

import ViewCancelContactRequest from "../app/Admin/ManageClients_contacts/contactsRegistration/ViewCancelContactsRequest/ViewCancelContactRequest";
import ReceivableTranslationPage from "../app/Admin/ManageInvoiceV2/Receivables/TranslationPage/ReceivableTranslationPage";
import PayableTranslationPage from "../app/Admin/ManageInvoiceV2/Payables/TranslationPage/PayableTranslationPage";
import ClientInvoiceList from "../app/Admin/ManageClients/ClientInvoice/ClientInvoiceList";
import ClientTranslationList from "../app/Client/ManageProjects/ClientTranslation/TranslationList/ClientTranslationList";
import ClientTranslationDetails from "../app/Client/ManageProjects/ClientTranslation/TranslationDetails/ClientTranslationDetails";
import FollowUpJobs from "../app/Client/Manage_Interpretation_jobs/FollowUpJobs/followUpJobs";
// import ErrorPage from "../app/ErrorPage/ErrorPage";







class AdminRoutes extends React.Component {
    render() {
        return (
            <>
                <div className="wrapper">
                    <Header />
                    <Sidebar />
                    {/* <Route exact path="/dess" component={NewDesign} /> */}
                    <Route exact path="/adminEditProfile" component={EditProfile} />
                    <Route exact path="/adminDashboard" component={Dashboard} />
                    {/* <Route exact path="/admin"
                        render={({ match: { url } })=>(
                            <>
                            <Route path={`${url}/home`} component={AdminStaff} />
                            </>
                        )}
                     /> */}
                    <Route exact path="/masterDepartment" component={MasterDepartmentList} />
                    <Route exact path="/addMasterDepartment" component={AddNewMasterDetails} />
                    <Route exact path="/editDepartment" component={EditDetailsPage} />
                    <Route exact path="/clientDepartment" component={ClientDepartment} />
                    <Route exact path="/addClientDepartment" component={AddClientDepartment} />
                    <Route exact path="/editClientDetails" component={EditClientDetails} />
                    <Route exact path="/adminStaff" component={AdminStaff} />
                    <Route exact path="/adminAddStaff" component={AddAdminstaff} />
                    <Route exact path="/adminEditStaff" component={EditAdminStaff} />
                    <Route exact path="/adminVendorList" component={VendorList} />
                    <Route exact path="/adminVendorRegistration" component={RequestList} />

                    <Route exact path="/adminVendorRegistrationDocs" component={VendorRegistrationDocs} />
                    <Route exact path="/adminVendorRequestDetails" component={ViewRequest} />
                    <Route exact path="/adminVendorDocs" component={VendorDocs} />

                    <Route exact path="/adminServiceCategory" component={ServiceCategoryList} />
                    <Route exact path="/adminAddServiceCategory" component={AddSeviceCategory} />
                    <Route exact path="/adminEditServiceCategory" component={EditSeviceCategory} />
                    <Route exact path="/adminDocuments" component={DocumentList} />
                    <Route exact path="/adminAddDocument" component={AddDocument} />
                    <Route exact path="/adminEditDocument" component={EditDocument} />
                    <Route exact path="/adminTrainingCourse" component={CourseList} />
                    <Route exact path="/adminAddTrainingCourse" component={AddCourse} />
                    <Route exact path="/adminEditTrainingCourse" component={EditCourse} />
                    <Route exact path="/adminVendorAdd" component={AddVendor} />
                    <Route exact path="/adminVendorEdit" component={EditVendorProfile} />
                    <Route exact path="/adminVendorRateCard" component={VendorRateList} />

                    <Route exact path="/adminClientList" component={ClientList} />
                    <Route exact path="/adminClientAdd" component={AddClient} />
                    <Route exact path="/adminClientEdit" component={EditClient} />
                    <Route exact path="/adminClientRateCard" component={ClientRateCard} />

                    <Route exact path="/adminContactsRequest" component={ContactsRequestList} />
                    <Route exact path="/adminContactRequestView" component={ViewContactRequest} />
                    <Route exact path="/adminRoles" component={RoleList} />
                    <Route exact path="/adminPermissionAdd" component={AddPermission} />
                    <Route exact path="/adminPermissionEdit" component={EditPermission} />
                    <Route exact path="/adminClientContactList" component={ClientContactList} />
                    <Route exact path="/adminAddClientContact" component={AddClientContact} />
                    <Route exact path="/adminAddLEI" component={AddClientContact} />
                    <Route exact path="/adminEditClientContact" component={EditClientContact} />

                    <Route exact path="/adminCreateNewJob" component={CreateNewJob} />
                    <Route exact path="/adminCreateOnDemandJob" component={OnDemandInterpretation} />
                    <Route exact path="/adminCreateNewTraining" component={CreateNewTraining} />
                    <Route exact path="/adminCreateNewTranslation" component={CreateNewTranslation} />

                    <Route exact path="/adminClientRfqDetails" component={ClientRfqDetails} />
                    <Route exact path="/adminClientRfqList" component={ClientRfqList} />
                    <Route exact path="/adminClientRfqSendQuotePage" component={SendQuote} />
                    <Route exact path="/adminViewAllJobs" component={ViewAllJobs} />
                    <Route exact path="/adminVendorOffer" component={VendorOffer} />
                    <Route exact path="/adminJobDetails" component={JobDetails} />
                    <Route exact path="/adminJobDetailsFromBillVerification" component={JobDetails} />
                    <Route exact path="/adminClientRfqTranslationDetails" component={TranslationDetails} />
                    <Route exact path="/adminTranslationSendQuote" component={TranslationSendQuote} />
                    <Route exact path="/adminClientRfqTrainingDetails" component={TrainingDetails} />
                    <Route exact path="/adminTranslationList" component={TranslationList} />
                    <Route exact path="/adminProjectList" component={ProjectList} />
                    <Route exact path="/adminTranslationDetails" component={ViewTranslationDetails} />

                    <Route exact path="/adminTranslationDetailsFromBillVerification" component={ViewTranslationDetails} />
                    <Route exact path="/adminTrainingList" component={TrainingProjectList} />
                    <Route exact path="/adminTrainingDetails" component={ViewTrainingDetails} />

                    <Route exact path="/adminTrainingDetailsFromBillVerification" component={ViewTrainingDetails} />


                    <Route exact path="/adminNotificationList" component={NotificationList} />
                    <Route exact path="/adminAddNotification" component={AddNotification} />
                    <Route exact path="/adminEditNotification" component={EditNotification} />
                    <Route
                        exact path="/adminConfigurationPanel"
                        component={ConfigurationPanel}
                    />
                    <Route
                        exact path="/adminConfigurationPanelNotification"
                        component={NotificationSetting}
                    />
                    <Route path="/adminStoreList" component={StoresList} />
                    <Route path="/adminAddStore" component={AddStore} />
                    <Route path="/adminEditStore" component={EditStore} />

                    <Route path="/adminMaintenanceList" component={MaintenanceList} />
                    <Route path="/adminAddMaintenance" component={AddMaintenance} />
                    <Route path="/adminEditMaintenance" component={EditMaintenance} />
                    {/* <Route exact path="/adminInvoicesAccountPayable" component={InvoicesAccountPayable} /> */}
                    <Route exact path="/adminJobDetailsOfClient" component={JobDetailsOfClient} />

                    <Route exact path="/adminProjectDetailsOfClient" component={ProjectDetailsClient} />
                    <Route exact path="/adminInvoicesBillsUnderV" component={InvoicesBillsUnderV} />
                    <Route exact path="/adminInvoicesAccountReceivable" component={InvoicesReceivable} />
                    <Route exact path="/adminInvoicesAccountPayable" component={InvoicesPayable} />
                    <Route exact path="/adminIndustryTypeList" component={IndustryTypeList} />
                    <Route exact path="/adminAddIndustryType" component={AddIndustryType} />
                    <Route exact path="/adminEditIndustryType" component={EditIndustryType} />

                    <Route exact path="/adminEditJob" component={EditJob} />
                    <Route exact path="/adminEditTraining" component={EditTrainingDetails} />


                    <Route exact path="/adminAddVendorCertificate" component={AdminAddVendorCertificate} />
                    <Route exact path="/adminEditVendorCertificate" component={AdminEditCertificateDoc} />

                    <Route exact path="/adminAddVendorIdentificationDocs" component={IdentificationDocAdd} />


                    <Route exact path="/adminMainBillUnderVerification" component={MainBillUnderVerificationPage} />
                    <Route exact path="/adminInterpretationInvoices" component={InterpretationInvoicePage} />
                    <Route exact path="/adminTrainingInvoices" component={TrainingInvoicePage} />
                    <Route exact path="/adminTranslationInvoices" component={TranslationInvoicePage} />


                    <Route exact path="/adminMainReceivable" component={MainReceivablePage} />
                    <Route exact path="/adminReceivableInterpretation" component={ReceivableInterpretationPage} />

                    <Route exact path="/adminReceivableTraining" component={ReceivableTrainingPage} />

                    <Route exact path="/adminMainPayables" component={MainPayablePage} />
                    <Route exact path="/adminPayableInterpretation" component={PayableInterpretationPage} />
                    <Route exact path="/adminPayableTraining" component={PayableTrainingPage} />
                    <Route exact path="/adminClientRequstList" component={ClientRequestList} />
                    <Route path='/adminClientRequestEdit' component={EditClientRequest} />


                    <Route path='/adminViewContactRequest' component={ViewCancelContactRequest} />

                    <Route path='/adminReceivableTranslation' component={ReceivableTranslationPage} />
                    <Route path='/adminPayableTranslation' component={PayableTranslationPage} />
                    <Route path='/adminInternalProjectList' component={InternalProjectList} />
                    <Route path='/adminCreateInternalProject' component={CreateInternalProject} />














                    {/* Client */}
                    <Route path="/clientDashboard" component={ClientDashboard} />
                    <Route path="/clientProfile" component={ClientProfile} />
                    {/* <Route path='/clientReq' component={ClientReq} /> */}


                    <Route path="/departmentClient" component={DepartmentList} />
                    <Route path="/addDeptClient" component={AddDepartmentClient} />
                    <Route path="/editDepartmentClient" component={EditDepartmentClient} />
                    <Route path="/manageContactList" component={ManageContactList} />
                    <Route path="/viewcontactdetails" component={ViewManageContactDetails} />
                    <Route path='/clientContactListPage' component={ContactList} />
                    <Route path='/clientAddContactPage' component={AddClientContactPage} />
                    <Route path='/clientEditContactPage' component={EditClientContactPage} />
                    <Route path='/clientContactRequestPage' component={ClientContactsRequestList} />
                    <Route path='/clientViewContactRequestPage' component={ClientViewContactRequest} />
                    <Route path='/clientAllJobs' component={ClientAllJobs} />
                    <Route path='/clientAssignedJobs' component={ClientAllJobs} />
                    <Route path='/clientUnAssignedJobs' component={ClientAllJobs} />
                    <Route path='/clientJobsHistory' component={ClientAllJobs} />
                    <Route path='/clientNeedAttentionJobs' component={ClientAllJobs} />
                    <Route path='/clientAllJobsMain' component={ClientAllJobs} />

                    <Route path='/clientJobDetails' component={ClientJobDetails} />
                    <Route path='/clientInvoiceList' component={InvoiceList} />

                    <Route path='/clientTrainingList' component={ClientTrainingList} />
                    <Route path='/clientTrainingDetails' component={ClientTrainingDetails} />
                    <Route path='/adminClientInvoiceList' component={ClientInvoiceList} />
                    <Route path='/clientTranslationList' component={ClientTranslationList} />
                    <Route path='/clientTranslationDetails' component={ClientTranslationDetails} />
                    <Route path="/clietFollowUpAppointment" component={FollowUpJobs} />









                    {/* .............For Vendor Routes............. */}
                    <Route path="/vendorDashboard" component={VendorDashboard} />
                    <Route path="/vendorDocumentList" component={VendorDocumentList} />
                    <Route path="/vendorDocList" component={VendorDocList} />
                    <Route path="/vendorAddDocument" component={VendorAddDocument} />
                    <Route path="/vendorEditDocument" component={VendorEditDocument} />
                    <Route exact path="/vendorRateCard" component={VendorRateCardList} />
                    <Route exact path="/VendorEdit" component={VendorEditProfile} />
                    {/* <Route exact path="/vendorTranslationList" component={VendorTranslationList} /> */}
                    <Route exact path="/vendorTranslationList" component={MaintranslationList} />
                    <Route exact path="/vendorTranslationDetails" component={VendorTranslationDetails} />
                    <Route exact path="/vendorNotificationList" component={VendorNotificationList} />

                    <Route exact path="/vendorReminderList" component={ReminderList} />
                    <Route exact path="/vendorAddReminder" component={AddReminder} />
                    <Route exact path="/vendorEditReminder" component={EditReminder} />
                    <Route exact path="/contact7C" component={ContactPage} />
                    <Route exact path="/vendorTrainingList" component={VendorTrainingList} />
                    <Route exact path="/vendorTrainingDetails" component={VendorTrainingDetails} />
                    <Route exact path="/vendorInvoicePage" component={InvoiceListVendor} />










                    <Route path='/addNewJob' component={AddNewJob} />
                    {/* <Route path='*' component={ErrorPage} /> */}


                    {/* <Route exact path="/vendorrequest" component={Vendor_Request_contact} />
                    <Route exact path="/clientrequest" component={Client_Request_contact} />
                    <Route
                        path="/clientcontactdetails"
                        component={ClientContactDetails}
                    />
                    <Route
                        path="/vendorcontactdetails"
                        component={VendorContactDetails}
                    />
                    <Route
                        path="/vendorverifieddoc"
                        component={VendorDocVerification}
                    />
                    <Route path="/viewlist" component={ViewListPage} />
                    <Route path="/vendordetail" component={Vendor_Detail} />
                    <Route path="/Clients" component={Clients} />
                    <Route path="/addnewclient" component={AddNewClient} />
                    <Route path="/addnewclienttwo" component={AddNewClientTwo} /> */}
                </div>
            </>
        )
    }
}

export default AdminRoutes;