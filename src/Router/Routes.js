import React, { Component } from "react";
import AdminRoutes from "./AdminRoutes";
// import ClientRoutes from "./ClientRoutes";
import { Router, Switch, Route } from "react-router-dom";
import history from "../history";
import Login from "../app/Login/AdminLogin";
import ForgetPassword from '../app/ForgetPassword/Forgetpassword';
import ResetPassword from "../app/ResetPassword/ResetPassword";
import ClientDashboard from "../app/Client/Dashboard/ClientDashboard";
import ClientRoutes from "./ClientRoutes";
import ClientReq from "../app/Client/ClientReq/ClientReq";
import ErrorPage from "../app/ErrorPage/ErrorPage";
import VideoPage from "../app/VideoPages/VideoPage";




export default class Routes extends Component {
  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={ClientReq} />
            <Route path="/forgetpassword" component={ForgetPassword} />
            <Route path="/resetpassword" component={ResetPassword} />
            {/* <ClientRoutes /> */}
            <Route path='/clientReq' component={ClientReq} />
            <Route exact path="/servicePage/:appointmentType/:jobId" component={VideoPage} />





            <AdminRoutes />

            {/* Routes for Admin Page */}

            {/* {AdminRoutes()} */}

            {/* Routes for Client page */}

            {/* {ClientRoutes()} */}


          </Switch>
        </Router>
      </div>
    );
  }
}
