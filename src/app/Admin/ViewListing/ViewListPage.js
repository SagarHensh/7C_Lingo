import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

//.................css for textField.................

export default class ViewListPage extends Component {
  render() {
    return (
      <>
        <Header />
        <Sidebar />
        <div className="content-wrapper">
          <section className="content-header">
            <h5 style={{ marginTop: "8%" }}>View Request Details</h5>
            <div
              className="container"
              style={{
                border: "0.5px solid grey",
                borderRadius: "10px",
              }}
            >
              <div className="row " style={{ marginTop: "10px" }}>
                <div
                  className="col-sm-12"
                  style={{ fontSize: "20px", color: "blue" }}
                >
                  ACCOUNT INFORMATION
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <TextField
                    label="Size"
                    id="standard-size-normal"
                    defaultValue="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />
                </div>
                <div className="col-sm-4">
                  <TextField
                    label="Last Name"
                    id="standard"
                    defaultValue="Mondal"
                    size="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />
                </div>
                <div className="col-sm-4">
                  <TextField
                    label="Are You a/an"
                    id="standard"
                    defaultValue="7c"
                    size="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <TextField
                    label="Email Id"
                    id="standard-size-small"
                    defaultValue="sam@gmail.com"
                    size="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />
                </div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <TextField
                    label="type"
                    id="standard-size-small"
                    defaultValue="Health Care"
                    size="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <TextField
                    label="Phone No"
                    id="standard-size-small"
                    defaultValue="1-2334444-2234"
                    size="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />{" "}
                </div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <TextField
                    label="Requested On"
                    id="standard-size-small"
                    defaultValue="sept 20,2020"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="Normal"
                    variant="standard"
                  />{" "}
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-1">status</div>
                <div className="col-sm-1 status">pending</div>
                <div className="col-sm-6"></div>
                <div className="col-sm-4">
                  <TextField
                    label="Role"
                    id="standard-size-small"
                    defaultValue="Agency Contact"
                    size="Normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="standard"
                  />{" "}
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <TextField
                    label="Country of Origin"
                    id="standard-size-small"
                    defaultValue="US"
                    size="Normal"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <TextField
                    label="Services Offered"
                    id="Translation,Editing"
                    defaultValue="US"
                    size="Normal"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: "10px" }}>
                <div className="col-sm-4">
                  <TextField
                    label="How did you hear about us?"
                    id="standard-size-small"
                    defaultValue="Friends"
                    size="Normal"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                  <TextField
                    label="Training mode"
                    id="standard-size-small"
                    defaultValue="Online"
                    size="Normal"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <TextField
                    label="Friends Name"
                    id="standard-size-small"
                    defaultValue="Subha"
                    size="Normal"
                    variant="standard"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>

              <div className="row" style={{ margin: "50px" }}>
                <div className="col-sm-4"></div>
                <div className="col-sm-4 contctDetailsBtn">
                  <button className="acceptBtn">Next</button>
                </div>
                <div className="col-sm-4"></div>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
}
