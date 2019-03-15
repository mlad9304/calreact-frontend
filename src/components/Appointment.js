import React from "react"
import PropTypes from "prop-types"
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/format';
import $ from 'jquery';

class Appointment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appointment: props.appointment,
    };
  }

  componentDidMount() {
    if (this.props.match) {
      $.ajax({
        type: 'GET',
        url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
        dataType: 'JSON',
      }).done(data => {
        this.setState(prevState => ({
          ...prevState,
          appointment: data,
        }))
      });
    }
  }

  render () {
    const { appointment } = this.state;
    return (
      <div className="appointment">
        <Link to={`/appointments/${appointment.id}`}>
          <h3>{appointment.title}</h3>
        </Link>
        <p>{formatDate(appointment.appt_time)}</p>
        <Link to={`/appointments/${appointment.id}/edit`}>
          Edit
        </Link>
      </div>
    );
  }
}

Appointment.propTypes = {
  appointment: PropTypes.object
};

Appointment.defaultProps = {
  appointment: {},
};
export default Appointment
