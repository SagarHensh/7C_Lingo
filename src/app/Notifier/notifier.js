import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Notifier extends React.Component {
    render() {
        return (
            <div>
                <ToastContainer />
            </div>
        )
    }
}