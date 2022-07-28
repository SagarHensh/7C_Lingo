// Define all the alert and error messages

export const MESSAGE = Object.freeze({
  MOBILE: {
    MOBILE_EMPTY: "Please enter your mobile no !",
    MOBILE_LESS: "Mobile no is less than 10 Digits !",
    MOBILE_GREATER:
      "Mobile no cannot exceed less than 10 and gretter than 14 digits !",
    MOBILE_ZERO_CHECK: "Mobile no cannot start with 0 !",
    MOBILE_NOT_MATCH: "Given mobile can not match !",
    MOBILE_EXIST: "Mobile no already exist !",
    BUSINESS_MOBILE_EMPTY: "Please enter Business Phone Number !",

  },
  PASSWORD: {
    PASSWORD_EMPTY: "Please enter your password !",
    CURRENT_PASSWORD_EMPTY: "Please enter your current password !",
    PASSWORD_NOT_VALID:
      "Password must contain Minimum seven characters, at least one uppercase letter, one lowercase letter , one special character and one number",
    PASSWORD_WRONG: "You have entered a wrong password",
    PASSWORD_NOT_MATCH: "Given password does not match !",
    PASSWORD_LENGTH: "Password length should be within 7 to 16 !",
    PASSWORD_RESET_SUCCESS: "Password updated successfully.",
    PASSWORD_RESET_FAILURE: "Password not updated. !!",
    CNF_PASS_EMPTY: "Confirm password cannot be empty !",
    PASS_CNFPASS_NOT_MATCH: "Password and Confirm password does not match !",
    RESET_SUCCESS: "Password has been reset successfully",
    DUPLICATE_PASS: "New password cannot be same as current password",
    NEW_PASS_EMPTY: "Please enter your new password !",
    CONFIRM_PASS_EMPTY: "Please enter your confirm password !",
  },
  EMAIL: {
    EMAIL_EMPTY: "Please enter your email !",
    BUSSINESS_EMAIL_EMPTY: "Please enter your Business email !",
    EMAIL_INVALID: "Please enter valid email !",
    EMAIL_NOT_MATCH: "Given email can not match !",
    EMAIL_NOT_EXIST: "Your email does not exist !",
    EMAIL_SEND_TO_YOU: "Reset link is send to your mail",
    RESET_LINK: "We sent a reset link to your email",
    EMAIL_EXIST: "Email already exist !",
    BUSINESS_EMAIL_EXIST: "Business Email already exists !",
    MAX_EMAIL_LENGTH: "Email ID must be less than 50 Characters",
  },
  EXIT_APP: {
    PRESS_AGAIN: "press again to exit the application !",
  },
  USER: {
    UNAUTHORIZE_USER: "Unauthorized user !",
    NAME_VALID: "Please enter valid Name",
    EMPTY_USER: "Please enter username",
    MAX_NAME_LENGTH: "Name must be less than 100 Characters",
    ADD_USER_SUCCESS: "Successfully added User",
  },
  UPDATE: {
    PROFILE_SUCCESS: "Profile updated successfully",
    PROFILE_PAYMENT_SUCCESS: "Vendor Payment updated successfully",
    PROFILE_ADDRESS_SUCCESS: "Address updated successfully",
    PROFILE_FAILURE: "Updation failed !!",
  },
  DEPARTMENT: {
    DROPDOWN_INDUSTRY_EMPTY: "Please select Industry type",
    DROPDOWN_PARENTDEPARTMENT_EMPTY: "please select parent department",
    DROPDOWN_CLIENT_EMPTY: "please select Client Name",
    DROPDOWN_SUPERVISOR_EMPTY: "please select Supervisor [s]",
    DROPDOWN_SUBDEPARTMENT_EMPTY: "please select Sub-Department",
    DEPARTMENT_EMPTY: "Please enter the Department Name",
    SUB_DEPARTMENT_EMPTY: "Please enter the Sub-Department Name",
    CLIENT_ID_EMPTY: "Please enter the Client Id",
    CLIENT_EMPTY: "Please enter the Client Name",
    NO_OF_USER_EMPTY: "Please enter No. of Users",
    SUPERVISOR_EMPTY: "Please enter the Supervisor name",
    DUPLICATE_DEPARTMENT: "This department is already created",
    DEPARTMENT_MAX_LENGTH: "Department should be maximum 100 character",
    ADD_DEPARTMENT: "Department add successfully",
    DELETE_DEPARTMENT_SUCCESS: "Department deleted successfully",
    UPDATE_DEPARTMENT: "Department updated successfully",
    CLIENT_ALREADY_MAP: "Client already mapped with department !",
    DROPDOWN_ROLE_EMPTY: "Please select role",
  },
  LOCATION: {
    LOCATION_EMPTY: "Please enter the Location",
  },
  LINK: {
    EXPIRE: "The reset link is expired",
    ALREADY_USE: "The link already Used",
  },
  CREATE: {
    SUCCESS: "Added Successfully",
  },
  EMAIL_MOBILE: {
    DUBLICATE: "Email and Phone both already exist",
  },
  UPDATE_STATUS: {
    SUCCESS: "Status updated successfully.",
  },
  CLIENT: {
    EMPTY_CLIENT_NAME: "Please enter client name !",

    CLIENT_CREATE_SUCCESS: "Client Department create successfull",
    OUT_OF_TOWN_EMPTY: "Please select out of Town field",
    FIRST_NAME_EMPTY: "Please enter First Name",
    LAST_NAME_EMPTY: "Please enter Last Name",
    EMPTY_DEPARTMENT: "Please select Department",
    EMPTY_LANGUAGE: "Please select Language",
    EMPTY_CONTACT_JOB_TITLE: "Please enter job title",
    EMPTY_CONTACT_JOB_TYPE: "Please select job type",
    EMPTY_CONTACT_ROLE_TYPE: "Please select job type",
    EMPTY_ADDRESSINFO_LOCATION: "Please enter Address",
    EMPTY_ADDRESSINFO_COUNTRY: "Please select country",
    EMPTY_ADDRESSINFO_STATE: "Please select state",
    EMPTY_ADDRESSINFO_CITY: "Please enter city name",
    EMPTY_ADDRESSINFO_ZIP: "Please enter zipcode",
    CLIENT_ADD_SUCCESS: "Client added successfully",
    CLIENT_UPDATED_SUCCESS: "Client updated successfully",
    CLIENT_NOT_SELECTED: "Please select client",
    EMPTY_DOB: "Please select Date of Birth",
    EMPTY_BILLING_ADDRESSINFO_LOCATION: "Please enter Billing Address",
    EMPTY_CLIENT_DROPDOWN: "Please select the client !",

  },
  SERVICE_CATEGORY: {
    SERVICE_NAME_EMPTY: "Please enter the Service name",
    SERVICE_CATEGORY_ADD_SUCCESS: "Service Category added successfully",
    SERVICE_NAME_DUPLICATE: "Service Name already exists !",
    SERVICE_DESCRIPTION_EMPTY: "Please enter description",
    SERVICE_CATEGORY_UPDATE_SUCCES: "Service Category Updated successfully",
  },
  DELETE: {
    DELETED: "Deleted Successfully",
  },
  DOCUMENT: {
    DOCUMENT_NAME_EMPTY: "Please enter the Document name",
    DROPDOWN_DOCTYPE_EMPTY: "Please select Document type",
    DROPDOWN_SELECT_ROLE_EMPTY: "Please select Role",
    DROPDOWN_INTENDED_USER_EMPTY: "Please select Intended User",
    DROPDOWN_PURPOSE_EMPTY: "Please select Purpose",
    DROPDOWN_STATUS_EMPTY: "Please select the Status",
    FILE_EMPTY: "Please submit one Document",
    DOCUMENT_ADD_SUCCESS: "Document added succesfully",
    DOCUMENT_UPLOAD_SUCCESS: "Document uploaded successfully",
    DOCUMENT_STATUS_APPROVED: "Document Approved",
    DOCUMENT_STATUS_DECLINED: "Document is rejected !!!",
    DOCUMENT_NAME_EXIST: "Document Name already exists !!!"
  },
  TRAINING_COURSE: {
    EMPTY_DESCRIPTION: "Please enter description",
    COURSE_NAME_EMPTY: "Please enter the Course name",
    DROPDOWN_TRAINING_CATEGORY_EMPTY: "Please select Training Category",
    FORMAT_EMPTY: "Please enter the format type",
    DURATION_UNIT_EMPTY: "Please select Duration Unit type",
    COURSE_FEE_EMPTY: "Please enter the Course Fee",
    TOTAL_DURATION_EMPTY: "Please enter the total duration",
    DURATION_TIME_EMPTY: "Please select the duration time",
    COURSE_DOCUMENT_EMPTY: "Please upload one Document",
    COURSE_PUBLISH_SUCCESS: "Published Successfully",
    COURSE_UPDATE_SUCCESS: "Course updated succesfully",
  },
  VENDOR: {
    EMPTY_FNAME: "Please enter first name",
    EMPTY_LNAME: "Please enter last name",
    EMPTY_AGENCY_NAME: "Please enter agency name",
    EMPTY_SUB_TYPE: "Please select role",
    EMPTY_SERVICE: "Please select an service category",
    EMPTY_HEAR: "Please select source type ",
    EMPTY_FRIEND_NAME: "Please input friends name",
    EMPTY_GENDER: "Please select Gender",
    EMPTY_DOB: "Please select Date of Birth",
    EMPTY_LOCATION: "Please input vendor location",

    EMPTY_EXPERIENCE: "Please select WorkExperience",
    EMPTY_TIME_ZONE: "Please select Time Zone",
    EMPTY_ADDRESSINFO_LOCATION: "Please enter Address",
    EMPTY_ADDRESSINFO_COUNTRY: "Please select country",
    EMPTY_ADDRESSINFO_STATE: "Please select state",
    EMPTY_ADDRESSINFO_BILLING_STATE: "Please select billing state",
    EMPTY_ADDRESSINFO_BILLING_: "Please select billing state",
    EMPTY_ADDRESSINFO_CITY: "Please enter city name",
    EMPTY_ADDRESSINFO_ZIP: "Please enter zipcode",
    EMPTY_SERVICEINFO_PRIMARY_LANGUAGE: "Please select primary language !",
    EMPTY_SERVICEINFO_PRIMARY_LANGUAGE_SKILL:
      "Please select primary language Skills !",
    EMPTY_SERVICEINFO_PROFICIENT: "Please select proficient other languages !",
    EMPTY_SERVICEINFO_OTHER_LANGUAGE: "Please select other languages !",
    EMPTY_SERVICEINFO_OTHER_LANGUAGE_SKILL:
      "Please select other language Skills !",
    EMPTY_SERVICEINFO_SERVICE_OFFERED: "Please select services !",
    EMPTY_SERVICEINFO_TRAINING_SERVICE: "Please select Training services !",
    EMPTY_SERVICEINFO_TRAINING_MODE: "Please select Training Mode !",
    EMPTY_BANK_ACCOUNT_NUMBER: "Please enter Bank Account Number !",
    EMPTY_ROUTING_NUMBER: "Please enter Routing number !",
    EMPTY_WESTERN_ACCOUNT_NUMBER: "Please enter Bank Account Number !",
    EMPTY_PAYPAL_EMAIL: "Please enter Paypal Email Id !",
    EMPTY_PAYONEER_EMAIL: "Please enter Payoneer Email Id !",
    EMPTY_WESTERN_EMAIL: "Please enter western Email Id !",
  },
  COUNTRY: {
    EMPTY_COUNTRY: "Please select a country",
  },
  VENDOR_REQUEST: {
    REQUEST_ACCEPTED: "Request accepted successfully",
    REQUEST_DECLINED: "Request declined",
  },
  CLIENT_REQUEST: {
    REQUEST_ACCEPTED: "Request accepted successfully",
    REQUEST_DECLINED: "Request declined",
  },
  DECLINE_MODAL: {
    EMPTY_MESSAGE: "Please input reason",
  },
  ROLE: {
    EMPTY_NAME: "Please input role name",
    EMPTY_USERTYPE: "Please select a user type",
    ADD_SUCCESS: "Role added successfully",
    ROLE_UPDATE: "Role updated successfully",
    DUPLICATE_ROLENAME: "Role already exist!!!",
    DELETE_ROLE_SUCCESS: "Role deleted successfully",
  },
  CONTACT: {
    EMPTY_DIRECTLINE: "Please enter Direct Line Number !",
    EMPTY_AMOUNT: "Please enter amount !",
    EMPTY_OUT_OF_TOWN: "Please select out of town Interpreters !",
  },
  JOB: {
    EMPTY_FEE: "Please enter interpretation Fee",
    EMPTY_TRAINING_FEE: "Please enter Training Fee",
    QUOTE_SEND: "Quote send successfully",
    EMPTY_MAIN_REASON: "Please select a Reason",
    EMPTY_OTHER_REASON: "Please enter the Reason",
    EMPTY_JOB_RESCHEDULE_CHECK: "Please select the job is rescheduled or not!",
    EMPTY_DATE: "Please select date!",
    CANCEL: "Cancelled Successfully",
    OFFER_SENT_SUCCESS: "Offer sent Successfully",
    VENDOR_ASSIGNED_SUCCESS: "Vendor Assigned Successfully",
    QUOTE_ACCEPTED_BY_CLIENT: "Quote accepted by client successfully",
    QUOTE_ACCEPTED: "Quote accepted successfully",
    QUOTE_REJECTED: "Quote rejected",
    QUOTE_UPDATE: "Quote update successfully",
    RESCHEDULED: "Job Rescheduled",
    PROJECT_RESCHEDULED: "Project Rescheduled",

  },
  RATE_CARD: {
    BLANK_TARGET_LANGUAGE: "Vendor has no target language",
    ALL_FIELDS_REQUIRED: "All fields required in rate card",
    ADD_RATE_SUCCESS: "Rate Card Added Successfully",
    DUPLICATE_ENTRY: "Duplicate entry is not allowed",
    DELETE_RATE_SUCCESS: "Rate deleted successfully",
    SAME_LANG_ERROR: "Source and target language cannot be same",
    BOOKING_FEE_BLANK: "Booking Fee cannot be blank",
    TARGET_LANG_BLANK: "Target language cannot be blank",
  },
  NOTIFICATION: {
    EMPTY_TITLE: "Please enter Notification Title",
    EMPTY_NOTIFICATION_TYPE: "Please select Notification Type",
    EMPTY_RECIPIENT_TYPE: "Please select Recipient Type",
    EMPTY_RECIPIENT: "Please select Recipient",
    EMPTY_BODY: "Please enter body",
    EMPTY_STATUS: "Please select status",
    EMPTY_DATE: "Please select Date",
    NOTIFICATION_CREATE_SUCCESS: "Notification created successfully",
    NOTIFICATION_UPDATE_SUCCESS: "Notification updated successfully",
  },
  SERVER: {
    INTERNAL_SERVER_ERROR: "Internal Server Error !",
  },
  CONFIGURATION: {
    UPDATE_VENDOR_SUCCESS: "Vendor setting updated successfully",
  },
  CERTIFICATE: {
    ADD_SUCCESS: "Successfully added your certificate",
    UPDATE_SUCCESS: "Successfully updated your certificate",
    EMPTY_NAME: "Please enter Certificate Name",
    EMPTY_ORGANIZATION: "Please enter organization name",
    EMPTY_ISSUE_DATE: "Please select issuing date",
    EMPTY_EXPIRY_DATE: "Please select expire date",
    EMPTY_DOC: "Please enter one document",
  },
  CONTRACTS: {
    UPLOAD_DOCUMENT: "Uploaded Successfully",
  },
  STORE: {
    EMPTY_NAME: "Please enter Store Name",
    EMPTY_STORE_TYPE: "Please select Store Type",
    EMPTY_DESCRIPTION: "Please enter Description",
    EMPTY_LOCATION: "Please select Location",
    EMPTY_ADDRESS: "Please enter Adddress",
    EMPTY_EMAIL: "Please enter Business Email",
    EMPTY_PHONE: "Please enter Business Phone No",
    EMPTY_MANAGER_NAME: "Please enter Manager name",
    EMPTY_STATUS: "Please select Status",
    EMPTY_STORE_LOGO: "Please Add Store Logo",
    ADD_STORE_SUCCESS: "Store Added Successfully",
    ADD_STORE_PHOTO: "Store Photo Uploaded Successfully",
    DUPLICATE_STORE: "Store Already Exists !",
    EDIT_STORE_SUCCESS: "Store Details Updated Successfully",
    MANAGER_EXIST: "Manager Name already exists"
  },
  MAINTENANCE: {
    EMPTY_REQUESTEDBY: "Please select Requested By",
    EMPTY_REQUIREMENT: "Please enter Requirement",
    EMPTY_MAINTENANCE_TYPE: "Please select Maintenance Type",
    EMPTY_STORE: "Please select Store",
    EMPTY_PRIORITY: "Please select Priority",
    EMPTY_STATUS: "Please select Status",
    REQUIREMENT_LENTH_VALIDATION: "Requirement Field exceed 100 Characters",
    ADD_MAINTENANCE_SUCCESS: "Maintenance Request Added Successfully",

    EMPTY_TASK: "Please enter Task Detail",
    EMPTY_WORK_DESCRIPTION: "Please enter Work Description",
    EMPTY_PERSON: "Please enter Service Person Name",
    EMPTY_MATERIAL: "Please enter Material Required",
    EMPTY_COST: "Please enter Cost Amount"
  },

  PAYABALES: {
    SUCCESS: "Approved",
    REJECT: "Rejected"
  },


  BID: {
    SUCCESS_BID_SUBMIT: "Bid Submitted Succesfully",
    EMPTY_TRAINING_FEE: "Please enter Training Fee",
    PAUSE: "Training Paused",
    RESUME: "Training Resumed",
    STARTED: "Training Started",
    END: "Training Ended",
    ADD_SUMMARY_SUCCESS: "Completion Summary Added Successfully"
  },
  REQ: {
    FIRST_NAME_EMPTY: "Please input first name",
    LAST_NAME_EMPTY: "Please input last name",
    EMAIL_EMPTY: "Please input Email",
    BUSINESS_NAME_EMPTY: "Please input business name",
    EMPTY_PHONE: "Please input phone number",
  }, TEMPLATE: {
    ADD_SUCCESS: "Template created successfully"
  },
  INVOICE: {
    CREATE_SUCCESSFULL: "Invoice Created successfully",
    EMPTY_STATUS: "Please select status",
    EMPTY_FROM_DATE_PERIOD: "Please select from date",
    EMPTY_TO_DATE_PERIOD: "Please select to date",
    EMPTY_ADDRESS: "Please enter address",
    EMPTY_PHONE: "Please enter phone number",
    EMPTY_EMAIL: "Please enter Email",
    UPDATE_SUCCESSFULL: "Invoice Updated successfully",
    PAYABLE_ITEM: {
      EMPTY_ID: "Please enter Payable Id",
      EMPTY_TYPE: "Please enter Payable type",
      EMPTY_DESCRIPTION: "Please enter Payable description",
      EMPTY_QUANTITY: "Please enter Payable quantity",
      EMPTY_UNIT_COST: "Please enter Payable unit cost",
      EMPTY_PRICE: "Please enter Payable price"
    }
  },
  COMPANYINFO: {
    EMPTY_LOGO: "Please Add One Logo",
    EMPTY_STREET: "Please enter street name",
    EMPTY_CITY: "Please enter city",
    EMPTY_STATE: "Please select state",
    EMPTY_ZIP: "Please select zip",
    EMPTY_PHONE: "Please enter Phone Number"
  },
  INDUSTRY_TYPE: {
    INDUSTRY_TYPE_EXIST: "Industry type already exist !!",
    ADDED_SUCCESSFULLY: "Industry Type Added successfully",
    UPDATE_SUCCESSFULLY: "Industry Type Updated successfully",
    EMPTY_INDUSTRY_NAME: "Please enter Industry Type Name",
    EMPTY_LOGO: "Please select one logo"
  },
  WEBSITE: {
    INVALID_WEBSITE: "Please enter valid website"
  },
  DATE: {
    EMPTY_DATE: "Please select date !",
    FROM_EMPTY: 'Please enter "From" date !',
    TO_EMPTY: 'Please enter "To" date !',
    FROM_GRETTER_TO: '"From" date must be in the past of "To" date',
    TO_LESS_FROM: '"To" date must be in the future of "From" date',
  },


  LEI: {
    DUBLICATE_LEI: "Lei already added by another Client"
  },
  OTHER_LANGUAGE: {
    ALL_FIELDS_REQUIRED: "All fields required in other language"
  },
  INTERNAL_PROJECT: {
    MILESTONE: {
      EMPTY_MILESTONE_NAME: "Please enter Milestone Name",
      EMPTY_START_DATE: "Please enter start date",
      EMPTY_END_DATE: "Please enter end date",
      START_GRETTER_TO: '"Start" date must be in the past of "End" date',
      END_LESS_FROM: '"End" date must be in the future of "Start" date',
    },
    TASK: {
      EMPTY_TASK_NAME: "Please enter Task name",
      EMPTY_TASK_DESCRIPTION: "Please enter Task description",
      EMPTY_OWNER: "Please select Owner",
      EMPTY_START_DATE: "Please enter start date",
      EMPTY_END_DATE: "Please enter end date",
      START_GRETTER_TO: '"Start" date must be in the past of "End" date',
      END_LESS_FROM: '"End" date must be in the future of "Start" date',
      EMPTY_STATUS: "Please select status"
    }
  }


});
