import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppHeader from './AppHeader';
import Appointments from './Appointments';
import Appointment from './Appointment';
import AppointmentForm from './AppointmentForm';

const AppRouter = (props) => {
    return (
        <Router>
            <React.Fragment>
                <Route path="/" component={AppHeader} />
                <Route exact path="/" component={Appointments} />
                <Route exact path="/appointments/:id" component={Appointment} />
                <Route path="/appointments/:id/edit" component={AppointmentForm} />
            </React.Fragment>
        </Router>
    );
}

export default AppRouter