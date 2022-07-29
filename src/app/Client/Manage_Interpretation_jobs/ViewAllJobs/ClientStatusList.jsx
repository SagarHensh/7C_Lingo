import React from 'react';

export default class ClientStatusList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const item = this.props.value;
        return (
            <React.Fragment>
                {item.status === 0 ? (
                    <React.Fragment>
                        <span className="progress-btn yellow">
                            Requested
                        </span>
                    </React.Fragment>
                ) : item.status === 1 ? (
                    <React.Fragment>
                        <span
                            href="#"
                            className="progress-btn sky"
                        >
                            Quote Received
                        </span>
                    </React.Fragment>
                ) : item.status === 2 ? (
                    <React.Fragment>
                        <span
                            href="#"
                            className="progress-btn green"
                        >
                            Quote Accepted
                        </span>
                    </React.Fragment>
                ) : item.status === 3 ? (
                    <React.Fragment>
                        <span
                            href="#"
                            className="progress-btn green"
                        >
                            Offer Sent to Interpreter
                        </span>
                    </React.Fragment>
                ) : item.status === 4 ? (
                    <React.Fragment>
                        <span
                            href="#"
                            className="progress-btn green"
                        >
                            Offer Accepted by Interpreter
                        </span>
                    </React.Fragment>
                ) : item.status === 5 ? (
                    <React.Fragment>
                        <span
                            href="#"
                            className="progress-btn green"
                        >
                            Offer Rejected by Interpreter
                        </span>
                    </React.Fragment>
                ) :
                    //  item.status === 6 ? (
                    //     <React.Fragment>
                    //         <span
                    //             href="#"
                    //             className="progress-btn yellow"
                    //         >
                    //             Find Interpreter
                    //         </span>
                    //     </React.Fragment>
                    // ) : 
                    item.status === 7 ? (
                        <React.Fragment>
                            <span
                                href="#"
                                className="progress-btn red"
                            >
                                Quote Rejected
                            </span>
                        </React.Fragment>
                    ) : item.status === 8 ? (
                        <React.Fragment>
                            <span
                                href="#"
                                className="progress-btn green"
                            >
                                Interpreter Assigned
                            </span>
                        </React.Fragment>
                    ) : item.status === 9 ? (
                        <React.Fragment>
                            <span
                                href="#"
                                className="progress-btn yellow"
                            >
                                In Progress
                            </span>
                        </React.Fragment>
                    ) : item.status === 10 ? (
                        <React.Fragment>
                            <span
                                href="#"
                                className="progress-btn green"
                            >
                                completed
                            </span>
                        </React.Fragment>
                    ) : item.status === 11 ? (
                        <React.Fragment>
                            <span
                                href="#"
                                className="progress-btn red"
                            >
                                cancelled
                            </span>
                        </React.Fragment>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}

            </React.Fragment>
        )
    }
}