import React from "react";
import BidsTable from "./BidsTable";
import ConfirmedTable from "./ConfirmedTable";
import HistoryTable from "./HistoryTable";
import "./index.css";
import InprogressTable from "./InprogressTable";
import $ from "jquery";
import { ApiCallVendor } from "../../../../../services/middleware";
import { ErrorCode } from "../../../../../services/constant";
import { Decoder } from "../../../../../services/auth";
import { consoleLog } from "../../../../../services/common-function";
import { Link } from "react-router-dom";


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

        }
    }

    componentDidMount() {
        window.$(".verificaiton-doc-tab ul li").on("click", function () {
            $(".verificaiton-doc-tab ul li").removeClass("active");
            $(this).addClass("active");
            $("div").removeClass("activeLnk");
            $("div[id=" + $(this).attr("data-related") + "]").addClass("activeLnk");
        });

        let data = {
            deadlinefrom: "",
            deadlineto: "",
            limit: JSON.stringify(this.state.limit),
            offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
            search: "",
            sourcelang: [],
            status: "",
            tabtype: [
                "0",
                "1"
            ],
            targetlang: []
        }

        this.listApi(data);
    }

    listApi = async (data) => {
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
                    listData: listData
                })
            }
        }
    };

    onTabClick = (value) => {
        if (value === "bids") {

            let data = {
                deadlinefrom: "",
                deadlineto: "",
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
                search: "",
                sourcelang: [],
                status: "",
                tabtype: [
                    "0",
                    "1"
                ],
                targetlang: []
            }

            this.listApi(data);

        } else if (value === "confirmed") {

            let data = {
                deadlinefrom: "",
                deadlineto: "",
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
                search: "",
                sourcelang: [],
                status: "",
                tabtype: ["2"],
                targetlang: []
            }

            this.listApi(data);

        } else if (value === "inprogress") {

            let data = {
                deadlinefrom: "",
                deadlineto: "",
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
                search: "",
                sourcelang: [],
                status: "",
                tabtype: ["3", "6"],
                targetlang: []
            }

            this.listApi(data);

        } else if (value === "history") {

            let data = {
                deadlinefrom: "",
                deadlineto: "",
                limit: JSON.stringify(this.state.limit),
                offset: JSON.stringify((this.state.current_page - 1) * this.state.limit),
                search: "",
                sourcelang: [],
                status: "",
                tabtype: ["4", "5"],
                targetlang: []
            }

            this.listApi(data);

        }
    };

    onview = (id) => {
        consoleLog("translationid:::", id);
        this.props.history.push({
            pathname: "/vendorTranslationDetails",
            state: this.state.listData[id],
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="component-wrapper vewaljobs">
                    <div
                        className="vn_frm"
                        style={{ color: "grey", paddingBottom: "2%", paddingTop: "5%" }}
                    >
                        {" "}
                        <Link to="/vendorDashboard">Dashboard</Link> /{" "}
                        Translation
                    </div>
                    <div className="vendor-info p-10 _fl sdw">
                        <div className="vn-form _fl">
                            <div className="row">
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
                    <div
                        className="tab-app-information activeLnk"
                        id="bids_table"
                    >
                        <BidsTable value={this.state.listData} onViewClick={(id) => this.onview(id)} />
                    </div>
                    <div
                        className="tab-app-information "
                        id="confirmed_table"
                    >
                        <ConfirmedTable value={this.state.listData} onViewClick={(id) => this.onview(id)} />
                    </div>
                    <div
                        className="tab-app-information "
                        id="inprogress_table"
                    >
                        <InprogressTable value={this.state.listData} onViewClick={(id) => this.onview(id)} />
                    </div>
                    <div
                        className="tab-app-information "
                        id="history_table"
                    >
                        <HistoryTable value={this.state.listData} onViewClick={(id) => this.onview(id)} />
                    </div>
                </div>

            </React.Fragment>
        )
    }
}