import React from "react";
import BidsTable from "./BidsTable";
import ConfirmedTable from "./ConfirmedTable";
import HistoryTable from "./HistoryTable";
import "./index.css";
import InprogressTable from "./InprogressTable";
import $ from "jquery";
import { ApiCall, ApiCallVendor } from "../../../../../services/middleware";
import { CommonData, ErrorCode } from "../../../../../services/constant";
import { Decoder } from "../../../../../services/auth";
import {
  consoleLog,
  SetDatabaseDateFormat,
  SetUSAdateFormat,
} from "../../../../../services/common-function";
import {
  InputText,
  SelectBox,
  MultiSelectBox,
  PaginationDropdown,
} from "../../../../Admin/SharedComponents/inputText";
import axios from "axios";
import { APP_URL } from "../../../../../services/config";
import { ImageName } from "../../../../../enums";
import Select, { components } from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src={ImageName.IMAGE_NAME.DOWN_ARROW_BLUE}
        style={{ width: "17px" }}
      />
    </components.DropdownIndicator>
  );
};

const allStatusArr = [
  {
    value: "0",
    label: "Offer Received",
  },
  {
    value: "1",
    label: "Bid Sent",
  },
  {
    value: "2",
    label: "Bid Accepted",
  },
  {
    value: "3",
    label: "In Progress",
  },
  {
    value: "4",
    label: "Completed",
  },
  {
    value: "5",
    label: "Declined",
  },
  {
    value: "6",
    label: "Under Review",
  },
];

export default class MaintranslationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_page: 1,
      total_page: 10,
      limit: 20,
      selectedDisplayData: {
        label: "20",
        value: "20",
      },
      listData: [],

      isBid: true,
      isConfirmed: false,
      isInprogress: false,
      isHistory: false,
      // ...bid tab..........
      confirmed_current_page: 1,
      confirmed_total_page: 10,
      confirmed_limit: 20,
      confirmed_selectedDisplayData: {
        label: "20",
        value: "20",
      },
      // .......inprogress...tab.......
      inprogress_current_page: 1,
      inprogress_total_page: 10,
      inprogress_limit: 20,
      inprogress_selectedDisplayData: {
        label: "20",
        value: "20",
      },
      // .......history...tab.......
      history_current_page: 1,
      history_total_page: 10,
      history_limit: 20,
      history_selectedDisplayData: {
        label: "20",
        value: "20",
      },
      statusArr: [],
      statusData: {},
      allServiceTypeArr: [],
      selectedServiceType: [],
      selectedServiceTypeId: [],
      sourceLangId: [],
      targetLangId: [],
      sourceLangData:[],
      targetLangData:[],
      formDate:"",
      toDate:"",
      id: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    document.getElementById("backdrop").style.display = "none";
    var classInstance = this;

    // When the user clicks anywhere outside of the modal, close it

    var filterModal = document.getElementById("filter-model");
    window.onclick = function (event) {
      if (event.target == filterModal) {
        classInstance.closeModal();
      }
    };

    window.$(".verificaiton-doc-tab ul li").on("click", function () {
      $(".verificaiton-doc-tab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
    });

    window.$(".filterTab ul li").on("click", function () {
      $(".filterTab ul li").removeClass("active");
      $(this).addClass("active");
      $("div").removeClass("activeLnk1");
      $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk1");
    });

    this.load();
  }

  load = async () => {
    let languageArrData = [],
      languageObjData = {},
      languageResArrData = [],
      allTranslationService = [];

    // ....................For List Data..........................................

    let data = {
      deadlinefrom: "",
      deadlineto: "",
      limit: JSON.stringify(this.state.limit),
      offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
      search: "",
      serviceCatType: [],
      sourcelang: [],
      status: "",
      tabtype: ["0", "1"],
      targetlang: [],
    };

    this.listApi(data);

    //For language dropdown in filter
    let languageResData = await ApiCall("getlanguagelist");
    let languagePayload = Decoder.decode(languageResData.data.payload);
    languageResArrData = languagePayload.data.languagelist;
    for (let n = 0; n < languageResArrData.length; n++) {
      languageArrData.push({
        label: languageResArrData[n].language,
        value: languageResArrData[n].id,
      });
      //   if (languageResArrData[n].language === "English") {
      //     languageObjData = {
      //       label: languageResArrData[n].language,
      //       value: languageResArrData[n].id,
      //     };
      //   }
    }

    // .....service type,,,,,,,,,,,,,,,,,,,,

    axios.post(APP_URL.VENDOR_SERVICE_OFFERED).then((res) => {
      // console.log("RES>>>>", res);
      let respObject = res.data;
      if (
        respObject.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
        respObject.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
      ) {
        let payload = Decoder.decode(respObject.data.payload);
        // console.log("service response payload>>>", payload);
        if (payload.data) {
          if (payload.data.services) {
            if (payload.data.services.length > 0) {
              payload.data.services.map((ser) => {
                if (
                  ser.id === 46 &&
                  ser.name === "Translation" &&
                  ser.subItem.length > 0
                ) {
                  ser.subItem.map((item) => {
                    allTranslationService.push({
                      label: item.subItemName,
                      value: item.id,
                    });
                  });
                  // console.log("ARRAY>>>",allTranslationService )

                  this.setState({
                    allServiceTypeArr: allTranslationService,
                  });
                }
              });
            }
          }
        }
      }
    });

    this.setState({
      languageArr: languageArrData,
    });
  };

  listApi = async (data) => {
    consoleLog("reqData:::", data);
    const res = await ApiCallVendor("getTranslationProjetList", data);
    if (
      res.error === ErrorCode.ERROR.ERROR.WITHOUT_ERROR &&
      res.respondcode === ErrorCode.ERROR.ERROR_CODE.SUCCESS
    ) {
      const decodeData = Decoder.decode(res.data.payload);
      consoleLog("listData:", decodeData);
      let listData = [];
      if (decodeData.data.translationList.length > 0) {
        listData = decodeData.data.translationList;
        let totalPage = Math.ceil(
          decodeData.data.translationList / this.state.limit
        );
        this.setState({
          listData: listData,
          total_page: totalPage,
        });
      } else {
        this.setState({
          listData: listData,
        });
      }
    }
  };

  resetData = () => {
    this.setState({
      statusData:{},
      formDate:"",
      toDate:"",
      targetLangId:[],
      sourceLangId:[],
      selectedServiceTypeId:[],
      id:"",
      sourceLangData:[],
      targetLangData:[],
      selectedServiceType: [],
    })
  }

  onTabClick = (value) => {
    if (value === "bids") {
      this.resetData();
      let data = {
        deadlinefrom: "",
        deadlineto: "",
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        search: "",
        sourcelang: [],
        status: "",
        tabtype: ["0", "1"],
        targetlang: [],
      };

      this.listApi(data);
      this.setState({
        isBid: true,
        isConfirmed: false,
        isInprogress: false,
        isHistory: false,
      });
    } else if (value === "confirmed") {
      this.resetData();
      let data = {
        deadlinefrom: "",
        deadlineto: "",
        limit: JSON.stringify(this.state.confirmed_limit),
        offset: JSON.stringify(
          (this.state.confirmed_current_page - 1) * this.state.confirmed_limit
        ),
        search: "",
        sourcelang: [],
        status: "",
        tabtype: ["2"],
        targetlang: [],
      };

      this.listApi(data);
      this.setState({
        isBid: false,
        isConfirmed: true,
        isInprogress: false,
        isHistory: false,
      });
    } else if (value === "inprogress") {
      this.resetData();
      let data = {
        deadlinefrom: "",
        deadlineto: "",
        limit: JSON.stringify(this.state.inprogress_limit),
        offset: JSON.stringify(
          (this.state.inprogress_current_page - 1) * this.state.inprogress_limit
        ),
        search: "",
        sourcelang: [],
        status: "",
        tabtype: ["3", "6"],
        targetlang: [],
      };

      this.listApi(data);
      this.setState({
        isBid: false,
        isConfirmed: false,
        isInprogress: true,
        isHistory: false,
      });
    } else if (value === "history") {
      this.resetData();
      let data = {
        deadlinefrom: "",
        deadlineto: "",
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify(
          (this.state.history_current_page - 1) * this.state.history_limit
        ),
        search: "",
        sourcelang: [],
        status: "",
        tabtype: ["4", "5", "7"],
        targetlang: [],
      };

      this.listApi(data);
      this.setState({
        isBid: false,
        isConfirmed: false,
        isInprogress: false,
        isHistory: true,
      });
    }
  };

  onview = (id) => {
    consoleLog("translationid:::", id);
    this.props.history.push({
      pathname: "/vendorTranslationDetails",
      state: this.state.listData[id],
    });
  };

  filterModal = () => {
    this.openModal();
    // this.handleMenuClose();
  };

  //........Page show Limit.........

  onChangeLimit = (dat) => {
    if (this.state.isBid) {
      this.setState({
        limit: parseInt(dat.value),
        selectedDisplayData: dat,
        current_page: 1,
      });

      let data = {
        limit: dat.value,
        offset: "0",
        tabtype: ["0", "1"],
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };

      this.listApi(data);
    } else if (this.state.isConfirmed) {
      this.setState({
        confirmed_limit: parseInt(dat.value),
        confirmed_selectedDisplayData: dat,
        confirmed_current_page: 1,
      });

      let data = {
        limit: dat.value,
        offset: "0",
        tabtype: ["2"],
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };

      this.listApi(data);
    } else if (this.state.isInprogress) {
      this.setState({
        inprogress_limit: parseInt(dat.value),
        inprogress_selectedDisplayData: dat,
        inprogress_current_page: 1,
      });

      let data = {
        limit: dat.value,
        offset: "0",
        tabtype: ["3", "6"],
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };

      this.listApi(data);
    } else if (this.state.isHistory) {
      this.setState({
        history_limit: parseInt(dat.value),
        history_selectedDisplayData: dat,
        history_current_page: 1,
      });

      let data = {
        limit: dat.value,
        offset: "0",
        tabtype: ["4", "5", "7"],
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
      };

      this.listApi(data);
    }
  };

  openModal = () => {
    document.getElementById("backdrop").style.display = "block";
    document.getElementById("filter-model").style.display = "block";
    document.getElementById("filter-model").classList.add("show");
  };

  closeModal = () => {
    document.getElementById("backdrop").style.display = "none";
    document.getElementById("filter-model").style.display = "none";
    document.getElementById("filter-model").classList.remove("show");
  };

  // .............pagination function..........

  clickChange = (e) => {
    this.setState({
      current_page: e.target.value,
    });
  };

  // This is goes to the previous page
  exLeft = () => {
    if (this.state.isBid) {
      this.setState({
        current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["0", "1"],
      };

      this.listApi(fetchData);
    } else if (this.state.isConfirmed) {
      this.setState({
        confirmed_current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.confirmed_limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["2"],
      };

      this.listApi(fetchData);
    } else if (this.state.isInprogress) {
      this.setState({
        inprogress_current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.inprogress_limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["3", "6"],
      };

      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      this.setState({
        history_current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["4", "5", "7"],
      };

      this.listApi(fetchData);
    }
  };

  // This is goes to the last page
  exRigth = () => {
    if (this.state.isBid) {
      let totalPage = this.state.total_page;
      this.setState({
        current_page: totalPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify((totalPage - 1) * this.state.limit),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["0", "1"],
      };

      this.listApi(fetchData);
    } else if (this.state.isConfirmed) {
      let totalPage = this.state.confirmed_total_page;
      this.setState({
        confirmed_current_page: totalPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.confirmed_limit),
        offset: JSON.stringify((totalPage - 1) * this.state.confirmed_limit),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["2"],
      };

      this.listApi(fetchData);
    } else if (this.state.isInprogress) {
      let totalPage = this.state.inprogress_total_page;
      this.setState({
        inprogress_current_page: totalPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.inprogress_limit),
        offset: JSON.stringify((totalPage - 1) * this.state.inprogress_limit),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["3", "6"],
      };

      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      let totalPage = this.state.history_total_page;
      this.setState({
        history_current_page: totalPage,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify((totalPage - 1) * this.state.history_limit),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["4", "5", "7"],
      };

      this.listApi(fetchData);
    }
  };

  // This is goes to the first page
  prev = () => {
    if (this.state.isBid) {
      let currentPage = this.state.current_page;
      if (currentPage > 1) {
        currentPage--;
        this.setState({
          current_page: currentPage,
        });
        let fetchData = {
          limit: JSON.stringify(this.state.limit),
          offset: JSON.stringify((currentPage - 1) * this.state.limit),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["0", "1"],
        };

        this.listApi(fetchData);
      }
    } else if (this.state.isConfirmed) {
      let currentPage = this.state.confirmed_current_page;
      if (currentPage > 1) {
        currentPage--;
        this.setState({
          confirmed_current_page: currentPage,
        });

        let fetchData = {
          limit: JSON.stringify(this.state.confirmed_limit),
          offset: JSON.stringify(
            (currentPage - 1) * this.state.confirmed_limit
          ),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourceLanguage: this.state.sourceLangId,
          sourcelang: this.state.selectedServiceTypeId,
          tabtype: ["2"],
        };

        this.listApi(fetchData);
      }
    } else if (this.state.isInprogress) {
      let currentPage = this.state.inprogress_current_page;
      if (currentPage > 1) {
        currentPage--;
        this.setState({
          inprogress_current_page: currentPage,
        });

        let fetchData = {
          limit: JSON.stringify(this.state.inprogress_limit),
          offset: JSON.stringify(
            (currentPage - 1) * this.state.inprogress_limit
          ),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["3", "6"],
        };

        this.listApi(fetchData);
      }
    } else if (this.state.isHistory) {
      let currentPage = this.state.history_current_page;
      if (currentPage > 1) {
        currentPage--;
        this.setState({
          history_current_page: currentPage,
        });

        let fetchData = {
          limit: JSON.stringify(this.state.history_limit),
          offset: JSON.stringify((currentPage - 1) * this.state.history_limit),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["4", "5", "7"],
        };

        this.listApi(fetchData);
      }
    }
  };

  // This is goes to the next page
  next = () => {
    if (this.state.isBid) {
      let currentPage = this.state.current_page;
      let totalPage = this.state.total_page;
      if (currentPage < totalPage) {
        currentPage++;
        this.setState({
          current_page: currentPage,
        });
        let fetchData = {
          limit: JSON.stringify(this.state.limit),
          offset: JSON.stringify((currentPage - 1) * this.state.limit),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["0", "1"],
        };
        // let returnData = Object.assign(reqData, fetchData);
        this.listApi(fetchData);
      }
    } else if (this.state.isConfirmed) {
      let currentPage = this.state.confirmed_current_page;
      let totalPage = this.state.confirmed_total_page;
      if (currentPage < totalPage) {
        currentPage++;
        this.setState({
          confirmed_current_page: currentPage,
        });

        let fetchData = {
          limit: JSON.stringify(this.state.confirmed_limit),
          offset: JSON.stringify(
            (currentPage - 1) * this.state.confirmed_limit
          ),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["2"],
        };

        this.listApi(fetchData);
      }
    } else if (this.state.isInprogress) {
      let currentPage = this.state.inprogress_current_page;
      let totalPage = this.state.inprogress_total_page;
      if (currentPage < totalPage) {
        currentPage++;
        this.setState({
          inprogress_current_page: currentPage,
        });

        let fetchData = {
          limit: JSON.stringify(this.state.inprogress_limit),
          offset: JSON.stringify(
            (currentPage - 1) * this.state.inprogress_limit
          ),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["3", "6"],
        };

        this.listApi(fetchData);
      }
    } else if (this.state.isHistory) {
      let currentPage = this.state.history_current_page;
      let totalPage = this.state.history_total_page;
      if (currentPage < totalPage) {
        currentPage++;
        this.setState({
          history_current_page: currentPage,
        });

        let fetchData = {
          limit: JSON.stringify(this.state.history_limit),
          offset: JSON.stringify((currentPage - 1) * this.state.history_limit),
          status:
            this.state.statusData.value == null ||
            this.state.statusData.value == undefined
              ? ""
              : this.state.statusData.value,
          orderby: "",
          direc: "",
          deadlinefrom:
            this.state.formDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.formDate),
          deadlineto:
            this.state.toDate == ""
              ? ""
              : SetDatabaseDateFormat(this.state.toDate),
          rfqId: this.state.id,
          targetlang: this.state.targetLangId,
          sourcelang: this.state.sourceLangId,
          serviceCatType: this.state.selectedServiceTypeId,
          tabtype: ["4", "5", "7"],
        };

        this.listApi(fetchData);
      }
    }
  };

  onFilterApply = () => {
    if (this.state.isBid) {
      this.setState({
        current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["0", "1"],
      };

      this.listApi(fetchData);
    } else if (this.state.isConfirmed) {
      this.setState({
        confirmed_current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.confirmed_limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["2"],
      };

      this.listApi(fetchData);
    } else if (this.state.isInprogress) {
      this.setState({
        inprogress_current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.inprogress_limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["3", "6"],
      };

      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      this.setState({
        history_current_page: 1,
      });

      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: this.state.id,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["4", "5", "7"],
      };

      this.listApi(fetchData);
    }
    this.closeModal();
  };

  onResetFilter = () => {
    if (this.state.isBid) {
      this.resetData();
      this.setState({
        selectedDisplayData: {
          label: "20",
          value: "20",
        },
        current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: "0",
        status: "",
        orderby: "",
        direc: "",
        deadlinefrom: "",
        deadlineto: "",
        rfqId: "",
        targetlang: [],
        sourcelang: [],
        serviceCatType: [],
        tabtype: ["0", "1"],
      };

      this.listApi(fetchData);
    } else if (this.state.isConfirmed) {
      this.resetData();
      this.setState({
        confirmed_selectedDisplayData: {
          label: "20",
          value: "20",
        },
        confirmed_current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.confirmed_limit),
        offset: "0",
        status: "",
        orderby: "",
        direc: "",
        deadlinefrom: "",
        deadlineto: "",
        rfqId: "",
        targetlang: [],
        sourcelang: [],
        serviceCatType: [],
        tabtype: ["2"],
      };

      this.listApi(fetchData);
    } else if (this.state.isInprogress) {
      this.resetData();
      this.setState({
        inprogress_selectedDisplayData: {
          label: "20",
          value: "20",
        },
        inprogress_current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.inprogress_limit),
        offset: "0",
        status: "",
        orderby: "",
        direc: "",
        deadlinefrom: "",
        deadlineto: "",
        rfqId: "",
        targetlang: [],
        sourcelang: [],
        serviceCatType: [],
        tabtype: ["3", "6"],
      };

      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      this.resetData();
      this.setState({
        history_selectedDisplayData: {
          label: "20",
          value: "20",
        },
        history_current_page: 1,
      });
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: "0",
        status: "",
        orderby: "",
        direc: "",
        deadlinefrom: "",
        deadlineto: "",
        rfqId: "",
        targetlang: [],
        sourcelang: [],
        serviceCatType: [],
        tabtype: ["4", "5", "7"],
      };

      this.listApi(fetchData);
    }
    this.closeModal();
  };
  resetData = () => {
    this.setState({
      id: "",
      clientData: {},
      selectedServiceType: [],
      selectedServiceTypeId: [],
      targetLangData: [],
      targetLangId: [],
      sourceLangData: [],
      sourceLangId: [],
      toDate: "",
      formDate: "",
      statusData: {},
    });
  };

  onTargetLangChange = (value) => {
    let arr = [];

    value.map((obj) => {
      arr.push(obj.value);
    });
    this.setState({
      targetLangData: value,
      targetLangId: arr,
    });
  };
  onsourceLangChange = (value) => {
    let arr = [];

    value.map((obj) => {
      arr.push(obj.value);
    });
    this.setState({
      sourceLangData: value,
      sourceLangId: arr,
    });
  };
  onStatusChange = (data) => {
    this.setState({
      statusData: data,
    });
  };
  serviceChange = (value) => {
    let arr = [];

    value.map((obj) => {
      arr.push(obj.value);
    });
    this.setState({
      selectedServiceType: value,
      selectedServiceTypeId: arr,
    });
  };
  formDateChange = (date) => {
    this.setState({
      formDate: SetUSAdateFormat(date),
    });
  };

  toDateChange = (date) => {
    this.setState({
      toDate: SetUSAdateFormat(date),
    });
  };
  onIdChange = (val) => {
    if (this.state.isBid) {
      let fetchData = {
        limit: JSON.stringify(this.state.limit),
        offset: JSON.stringify(
          (this.state.current_page - 1) * this.state.limit
        ),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: val,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["0", "1"],
      };

      this.listApi(fetchData);
    } else if (this.state.isConfirmed) {
      let fetchData = {
        limit: JSON.stringify(this.state.confirmed_limit),
        offset: JSON.stringify(
          (this.state.confirmed_current_page - 1) * this.state.confirmed_limit
        ),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: val,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["2"],
      };

      this.listApi(fetchData);
    } else if (this.state.isInprogress) {
      let fetchData = {
        limit: JSON.stringify(this.state.inprogress_limit),
        offset: JSON.stringify(
          (this.state.inprogress_current_page - 1) * this.state.inprogress_limit
        ),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: val,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["3", "6"],
      };

      this.listApi(fetchData);
    } else if (this.state.isHistory) {
      let fetchData = {
        limit: JSON.stringify(this.state.history_limit),
        offset: JSON.stringify(
          (this.state.history_current_page - 1) * this.state.history_limit
        ),
        status:
          this.state.statusData.value == null ||
          this.state.statusData.value == undefined
            ? ""
            : this.state.statusData.value,
        orderby: "",
        direc: "",
        deadlinefrom:
          this.state.formDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.formDate),
        deadlineto:
          this.state.toDate == ""
            ? ""
            : SetDatabaseDateFormat(this.state.toDate),
        rfqId: val,
        targetlang: this.state.targetLangId,
        sourcelang: this.state.sourceLangId,
        serviceCatType: this.state.selectedServiceTypeId,
        tabtype: ["4", "5", "7"],
      };

      this.listApi(fetchData);
    }

    this.setState({
      id: val,
    });
  };

  render() {

    const customStylesDropdown = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        boxShadow: "0px 0px 4px 0px rgb(0 0 0 / 28%)",
        borderRadius: "10px",
        height: 45,
        minHeight: 45,
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = "yellow";
        return {
          ...styles,
          color: isFocused ? "grey" : "white",
          //   backgroundColor: isDisabled ? "red" : "white",
          color: "#000",
          cursor: isDisabled ? "not-allowed" : "default",
        };
      },
    };
    return (
      <React.Fragment>
        <div className="component-wrapper vewaljobs">
          <div
            className="vn_frm"
            style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
          >
            Translation
          </div>
          <div className="vendor-info p-10 _fl sdw">
            <div className="vn-form _fl">
              <div className="row">
                <div className="col-md-3">
                  <div className="vn_frm">
                    <span
                      style={{
                        width: "30%",

                        paddingLeft: "5px",
                        fontSize: "14px",
                      }}
                    >
                      Project ID
                    </span>
                    <InputText
                      placeholder="Search"
                      className="inputfield"
                      value={this.state.id}
                      onTextChange={(value) => {
                        this.onIdChange(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-8">
                  <div className="_fl verificaiton-doc-tab venProject">
                    <ul>
                      <li
                        className="active"
                        data-related="bids_table"
                        onClick={() => {
                          this.onTabClick("bids");
                        }}
                      >
                        Bid's
                      </li>
                      <li
                        className=""
                        data-related="confirmed_table"
                        onClick={() => {
                          this.onTabClick("confirmed");
                        }}
                      >
                        Confirmed
                      </li>
                      <li
                        className=""
                        data-related="inprogress_table"
                        onClick={() => {
                          this.onTabClick("inprogress");
                        }}
                      >
                        In Progress
                      </li>
                      <li
                        data-related="history_table"
                        onClick={() => {
                          this.onTabClick("history");
                        }}
                      >
                        History
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-filter-app">
            <div className="row">
              <div className="col-md-6">
                <div className="cus-filter-btn">
                  {/* <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN} />
                                    </button>
                                    <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN_ONE} />
                                    </button>
                                    <button className="button">
                                        <img src={ImageName.IMAGE_NAME.MENU_BTN_TWO} />
                                    </button> */}

                  <div
                    className="filter-btn"
                    style={{ float: "none", paddingLeft: "10px" }}
                  >
                    <a href="javascript:void(0)" onClick={this.filterModal}>
                      Filter
                    </a>
                  </div>

                  <div className="filter-pagination">
                    <button className="prev_btn" onClick={this.exLeft}></button>
                    <button className="prv_btn" onClick={this.prev}>
                      {" "}
                      {"<"}
                    </button>
                    <span className="num" onChange={(e) => this.clickChange(e)}>
                      {this.state.isBid
                        ? this.state.current_page
                        : this.state.isConfirmed
                        ? this.state.confirmed_current_page
                        : this.state.isInprogress
                        ? this.state.inprogress_current_page
                        : this.state.isHistory
                        ? this.state.history_current_page
                        : ""}
                    </span>
                    <button className="nxt_btn" onClick={this.next}>
                      {">"}
                    </button>
                    <button
                      className="next_btn"
                      onClick={this.exRigth}
                    ></button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="table-filter-box">
                  {/* <div className="export-btn" onClick={this.onExport}>
                    <a href="">Export</a>
                  </div>
                  <div className="addnew">
                    <a href="#">Add New</a>
                  </div> */}
                  <div className="tble-short">
                    {" "}
                    <span className="lbl">Display</span>
                    <div
                      className="dropdwn"
                      style={{
                        width: "70px",
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      {this.state.isBid ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : this.state.isConfirmed ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.confirmed_selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : this.state.isInprogress ? (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.inprogress_selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <PaginationDropdown
                            optionData={CommonData.COMMON.DISPLAY_ARR}
                            value={this.state.history_selectedDisplayData}
                            placeholder="Select"
                            onSelectChange={(value) => {
                              this.onChangeLimit(value);
                            }}
                          />
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-app-information activeLnk" id="bids_table">
            <BidsTable
              value={this.state.listData}
              onViewClick={(id) => this.onview(id)}
            />
          </div>
          <div className="tab-app-information " id="confirmed_table">
            <ConfirmedTable value={this.state.listData} onViewClick={(id) => this.onview(id)}/>
          </div>
          <div className="tab-app-information " id="inprogress_table">
            <InprogressTable value={this.state.listData} onViewClick={(id) => this.onview(id)}/>
          </div>
          <div className="tab-app-information " id="history_table">
            <HistoryTable value={this.state.listData} onViewClick={(id) => this.onview(id)}/>
          </div>
        </div>

        {/* ..................... */}

        <div
          id="filter-model"
          className="modal fade modelwindow filter-pop"
          role="dialog"
        >
          <div className="modal-dialog modal-lg jobhrtypage">
            <div className="modal-content">
              <div className="filter-head _fl mdf">
                <h3>Filter by</h3>
                <div className="reset-btn-dp">
                  <button className="reset" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.RESET_BTN}
                      onClick={this.onResetFilter}
                    />
                    Reset
                  </button>
                  <button className="apply" data-dismiss="modal">
                    <img
                      src={ImageName.IMAGE_NAME.BLUE_TICK}
                      onClick={this.onFilterApply}
                    />
                    Apply
                  </button>
                </div>
              </div>
              {/* <div className="filter-head _fl">
                <h3>Filter by</h3>
                <div className="reset-btn">
                  <button className="reset">Reset</button>
                  <button className="apply">Apply</button>
                  <button className="close-page">
                    <img src={ImageName.IMAGE_NAME.CLOSE_BTN_2} />
                    &nbsp;
                  </button>
                </div>
              </div> */}
              <div className="modal-body">
                <div className="job_filt_lfe">
                  <div className="_fl filterTab">
                    <ul style={{ cursor: "pointer" }}>
                      <li
                        className="active"
                        data-related="tble-data-d"
                        style={{ padding: "20px 20px" }}
                      >
                        Service Type
                      </li>
                      <li
                        data-related="tble-data-e"
                        style={{ padding: "20px 20px" }}
                      >
                        Language
                      </li>
                      {/* <li
                        data-related="tble-data-f"
                        style={{ padding: "20px 20px" }}
                      >
                        Requester
                      </li> */}
                      {/* <li
                        data-related="tble-data-g"
                        style={{ padding: "20px 20px" }}
                      >
                        Location
                      </li> */}
                      <li
                        data-related="tble-data-h"
                        style={{ padding: "20px 20px" }}
                      >
                        Deadline
                      </li>
                      {/*                     
                        <li
                          data-related="tble-data-i"
                          style={{ padding: "20px 20px" }}
                        >
                          Contract Type
                        </li> */}

                      <li
                        data-related="tble-data-j"
                        style={{ padding: "20px 20px" }}
                      >
                        Status
                      </li>
                      {/* {this.state.isReceivable ? (
                        <li data-related="tble-data-k">Contract Type</li>
                      ) : (
                        <React.Fragment />
                      )} */}
                    </ul>
                  </div>
                </div>
                <div
                  className="tab-app-information activeLnk1 "
                  id="tble-data-d"
                >
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-10">
                              <div className="row">
                                <div
                                  className="lable-text"
                                  style={{ fontSize: "20px" }}
                                >
                                  SERVICE TYPE
                                </div>
                              </div>
                              <div className="row">
                                <div
                                  className="dropdwn"
                                  style={{ cursor: "pointer" }}
                                >
                                  <MultiSelectBox
                                    optionData={this.state.allServiceTypeArr}
                                    value={this.state.selectedServiceType}
                                    onSelectChange={(value) =>
                                      this.serviceChange(value)
                                    }
                                  ></MultiSelectBox>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-e">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row" style={{ padding: "30px" }}>
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div className="frm-label">
                                    SOURCE LANGUAGE
                                  </div>
                                  <div className="bts-drop">
                                    <MultiSelectBox
                                      optionData={this.state.languageArr}
                                      value={this.state.sou}
                                      onSelectChange={(value) =>
                                        this.onsourceLangChange(value)
                                      }
                                    ></MultiSelectBox>
                                  </div>
                                </div>

                                <div className="web-form-bx">
                                  <div className="frm-label">
                                    TARGET LANGUAGE
                                  </div>
                                  <div className="bts-drop">
                                    <MultiSelectBox
                                      optionData={this.state.languageArr}
                                      value={this.state.targetLangData}
                                      onSelectChange={(value) =>
                                        this.onTargetLangChange(value)
                                      }
                                    ></MultiSelectBox>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="tab-app-information" id="tble-data-f">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
                                    c
                                    className="lable-text"
                                    style={{ fontSize: "20px" }}
                                  >
                                    {" "}
                                    REQUESTER
                                  </div>
                                  <div className="bts-drop">
                                    <SelectBox
                                      optionData={this.state.requesterArr}
                                      value={this.state.selectedRequester}
                                      onSelectChange={(value) =>
                                        this.requesterChange(value)
                                      }
                                    ></SelectBox>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="tab-app-information" id="tble-data-g">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="row">
                                <div className="web-form-bx">
                                  <div
                                    className="lable-text"
                                    style={{
                                      // paddingLeft: "10px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    LOCATION
                                  </div>
                                  <div
                                    className="dropdwn"
                                    // style={{ marginLeft: "25%" }}
                                  >
                                    <div className="tr-3">
                                      <Select
                                        options={this.state.locationArr}
                                        components={{
                                          DropdownIndicator,
                                          IndicatorSeparator: () => null,
                                        }}
                                        value={this.state.locationData}
                                        placeholder="Select"
                                        onChange={(value) =>
                                          this.onLocationChange(value)
                                        }
                                        onInputChange={(value) => {
                                          this.onLocationInputChange(value);
                                        }}
                                        styles={customStylesDropdown}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tab-app-information" id="tble-data-h">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="form-search-app">
                            <div
                              className="lable-text"
                              style={{ fontSize: "20px" }}
                            >
                              Expected Deadline
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div
                                  className="input-group"
                                  style={{
                                    width: "100%",
                                    borderRadius: "9px",
                                    height: "43px",
                                    border: "1px solid #ced4da",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                >
                                  <div style={{ width: "80%", padding: "8px" }}>
                                    <span>
                                      FROM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      {this.state.formDate}
                                    </span>
                                  </div>
                                  <div style={{ width: "20%" }}>
                                    <a style={{ float: "right" }}>
                                      <DatePicker
                                        dropdownMode="select"
                                        showMonthDropdown
                                        showYearDropdown
                                        adjustDateOnChange
                                        // minDate={new Date()}
                                        onChange={(date) =>
                                          this.formDateChange(date)
                                        }
                                        customInput={<Schedule />}
                                      />
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div
                                  className="input-group"
                                  style={{
                                    width: "100%",
                                    borderRadius: "9px",
                                    height: "43px",
                                    border: "1px solid #ced4da",
                                    boxShadow:
                                      "0px 0px 4px 0px rgb(0 0 0 / 28%)",
                                  }}
                                >
                                  <div style={{ width: "80%", padding: "8px" }}>
                                    <span>
                                      TO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                      {this.state.toDate}
                                    </span>
                                  </div>
                                  <div style={{ width: "20%" }}>
                                    <a style={{ float: "right" }}>
                                      <DatePicker
                                        dropdownMode="select"
                                        showMonthDropdown
                                        showYearDropdown
                                        adjustDateOnChange
                                        // minDate={new Date()}
                                        onChange={(date) =>
                                          this.toDateChange(date)
                                        }
                                        customInput={<Schedule />}
                                      />
                                    </a>
                                  </div>
                                </div>
                                {/* <div className="t-time">
                                <span className="t1">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.hour_fiter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.hourChange_filter}
                                    />
                                  </small>
                                </span>
                                <span className="t2">
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChangeUp_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.min_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.minChange_filter}
                                    />
                                  </small>
                                </span>
                                <span
                                  className="t3"
                                  style={{ marginLeft: "2%" }}
                                >
                                  <small>
                                    <img
                                      src={ImageName.IMAGE_NAME.U_IMG}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                    <br />
                                    <input
                                      type="text"
                                      placeholder=""
                                      value={this.state.ampm_filter}
                                      className="tsd2"
                                      readonly
                                    />
                                    <br />
                                    <img
                                      src={ImageName.IMAGE_NAME.B_ARROW}
                                      alt=""
                                      style={{ cursor: "pointer" }}
                                      onClick={this.ampmChange_filter}
                                    />
                                  </small>
                                </span>
                              </div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tab-app-information" id="tble-data-j">
                  <div className="jobfilterpop table-listing-app">
                    <div className="table-responsive_cus table-style-a">
                      <div className="filter-jeneral-wrap">
                        <div className="create-row-app">
                          <div className="row">
                            <div className="col-md-12">
                              <div
                                className="lable-text"
                                style={{ fontSize: "20px" }}
                              >
                                Status{" "}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-8">
                              <div
                                className="dropdwn"
                                style={{ cursor: "pointer" }}
                              >
                                <SelectBox
                                  optionData={allStatusArr}
                                  value={this.state.statusData}
                                  placeholder="Select"
                                  onSelectChange={(value) => {
                                    this.onStatusChange(value);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal-backdrop fade show"
          id="backdrop"
          style={{ display: "none" }}
        ></div>
      </React.Fragment>
    );
  }
}

class Schedule extends React.Component {
  render() {
    const { onClick } = this.props;
    return (
      <img
        style={{
          width: "35px",
          height: "37px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        src={ImageName.IMAGE_NAME.CALENDER4}
        onClick={onClick}
      />
    );
  }
}
