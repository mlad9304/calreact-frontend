import React from "react"
import PropTypes from "prop-types"
import Appointment from "./Appointment";

class AppointmentList extends React.Component {
  render () {
    const { appointments } = this.props;
    return (
      <React.Fragment>
        {appointments.map(appointment => (
          <Appointment key={appointment.id} appointment={appointment} />
        ))}
      </React.Fragment>
    );
  }
}

AppointmentList.propTypes = {
  appointments: PropTypes.array
};
export default AppointmentList
