import React, { Component } from "react";
import { Route } from "react-router-dom";
import ClientDashboard from "../app/Client/Dashboard/ClientDashboard";

class ClientRoutes extends React.Component {
    render() {
        return (
            <>
                <Route path="/clientDashboard" component={ClientDashboard} />
            </>
        )
    }
}

export default ClientRoutes;