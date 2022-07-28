import React from "react";
import ReactDOM from "react-dom";
import $ from 'jquery';
import './sidebar.css';

import history from "../../../history";
import { Link } from "react-router-dom";
import { ImageName } from "../../../enums";
import { Decoder } from "../../../services/auth";
import { UsersEnums } from "../../../services/constant";
import AdminSidebar from "./AdminSidebar";
import ClientSidebar from "./ClientSidebar";
import VendorSidebar from "./VendorSidebar";

export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: 0,
        };
    }
    componentDidMount() {
        let data = localStorage.getItem("AuthToken");
        let authUser = Decoder.decode(data);
        if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN) {
            this.setState({
                userType: UsersEnums.APPLICATION_ROLE.SUPER_ADMIN
            })
        } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.CLIENT) {
            this.setState({
                userType: UsersEnums.APPLICATION_ROLE.CLIENT
            })
        } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF) {
            this.setState({
                userType: UsersEnums.APPLICATION_ROLE.ADMIN_STAFF
            })
        } else if (authUser.data.usertypeid === UsersEnums.APPLICATION_ROLE.VENDOR) {
            this.setState({
                userType: UsersEnums.APPLICATION_ROLE.VENDOR
            })
        }

        // window.$("._menubtn").click(function () {
        //     $('.side-navigaiton,.component-wrapper').toggleClass('hp');
        // });


        // window.$('.responsive-menu').click(function () {
        //     $('.side-navigaiton').toggleClass('hp');
        // });

        // window.$('.close-nav').click(function () {
        //     $('.side-navigaiton').removeClass('hp');
        // });

        // //........ For toggle down menu to sub menu's............

        // window.$('.arrow_btn').click(function () {
        //     $(this).toggleClass('op');

        //     if ($(this).hasClass('op')) {
        //         $(this).toggleClass('op');
        //         $(this).parent().find('.dropdown-app').slideUp();
        //     } else {
        //         $(this).toggleClass('op');
        //         $(this).parent().find('.dropdown-app').slideDown();
        //     }
        // });
    }

    // toggledown = () => {
    //     // window.$('.dropdown-app .op').slideToggle();
    //     document.getElementsByClassName(".dropdown-app .op").slideToggle();
    // }
    render() {
        return (
            <React.Fragment>
                {this.state.userType === UsersEnums.APPLICATION_ROLE.SUPER_ADMIN || this.state.userType === UsersEnums.APPLICATION_ROLE.ADMIN_STAFF ? <React.Fragment>
                    <AdminSidebar />
                </React.Fragment> : <React.Fragment>
                    {this.state.userType === UsersEnums.APPLICATION_ROLE.CLIENT ?
                        <ClientSidebar /> :
                        <React.Fragment>
                            <VendorSidebar />
                        </React.Fragment>
                    }
                </React.Fragment>
                }
            </React.Fragment>
        );
    }
}
