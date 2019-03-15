import React from "react"
import PropTypes from "prop-types"
import $ from 'jquery';
import AppointmentForm from "./AppointmentForm";
import AppointmentList from "./AppointmentList";
import './appointments.css';

class Appointments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appointments: props.appointments,
    };
  }

  componentDidMount() {
    if (this.props.match && sessionStorage.user) {
      $.ajax({
        type: 'GET',
        url: `http://localhost:3001/appointments`,
        dataType: 'JSON',
        headers: JSON.parse(sessionStorage.user),
      }).done(data => {
        this.setState(prevState => ({
          ...prevState,
          appointments: data,
        }))
      });
    }
  }
  
  addNewAppointment = appointment => {
    const appointments = [
      ...this.state.appointments,
      appointment,
    ];
    this.setState(prevState => ({
      ...prevState,
      appointments: appointments.sort((a, b) => (new Date(a.appt_time) - new Date(b.appt_time))),
    }));
  };

  render () {
    const { appointments } = this.state;
    const { addNewAppointment } = this;
    return (
      <React.Fragment>
        <AppointmentForm handleNewAppointment={addNewAppointment} />
        <AppointmentList appointments={appointments} />
      </React.Fragment>
    );
  }
}

Appointments.propTypes = {
  appointments: PropTypes.array
};

Appointments.defaultProps = {
  appointments: [],
};
export default Appointments
