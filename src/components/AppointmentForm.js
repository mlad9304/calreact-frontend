import React from "react"
import PropTypes from "prop-types"
import moment from 'moment';
import Datetime from 'react-datetime';
import FormErrors from './FormErrors';
import 'react-datetime/css/react-datetime.css';
import $ from 'jquery';

class AppointmentForm extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      title: { value: '', valid: false },
      appt_time: { value: new Date(), valid: false },
      formErrors: {},
      formValid: false,
      editing: false,
    };
  }

  componentDidMount () {
    this._isMounted = true;
    if(this.props.match) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.user),
      }).done((data) => {
        this.setState({
          title: {value: data.title, valid: true},
          appt_time: {value: new Date(data.appt_time), valid: true},
          editing: this.props.match.path === '/appointments/:id/edit'
        });
      });
    }
  }

  handleChange = e => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    this.handleUserInput(fieldName, fieldValue);
  };

  setApptTime = e => {
    const fieldName = 'appt_time';
    const fieldValue = e.toDate();
    this.handleUserInput(fieldName, fieldValue);
  }

  handleUserInput = (fieldName, fieldValue) => {
    const { validateField } = this;
    this.setState(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        value: fieldValue,
      },
    }), () => {
      validateField(fieldName, fieldValue);
    });
  };

  validateField = (fieldName, fieldValue) => {
    let fieldValid;
    let formErrors = [];
    const { validateForm } = this;
    switch (fieldName) {
      case 'title':
        fieldValid = fieldValue.trim().length > 2;
        if (!fieldValid) {
          formErrors = [' should be at least 3 characters long'];
        }
        break;
      case 'appt_time':
        fieldValid = moment(fieldValue).isValid() &&
          moment(fieldValue).isAfter();

          if (!fieldValid) {
            formErrors = [' should not be in the past'];
          }
        break;
      default:
        break;
    }
    this.setState(prevState => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        valid: fieldValid,
      },
      formErrors: {
        [fieldName]: formErrors,
      },
    }), () => {
      validateForm();
    })
  };

  validateForm = () => {
    this.setState(prevState => ({
      ...prevState,
      formValid: prevState.title.valid &&
        prevState.appt_time.valid,
    }));
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.state.editing ?
      this.updateAppointment() :
      this.addAppointment();
  }

  updateAppointment = () => {
    const appointment = {title: this.state.title.value,
      appt_time: this.state.appt_time.value};
    $.ajax({
      type: "PATCH",
      url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
      data: {appointment: appointment},
      headers: JSON.parse(sessionStorage.user),
    })
    .done((data) => {
      console.log('appointment updated!');
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({formErrors: response.responseJSON,
        formValid: false});
    });
  };

  addAppointment = () => {
    const { title, appt_time } = this.state;
    const { resetFormErrors } = this;

    $.ajax({
      method: 'POST',
      url: 'http://localhost:3001/appointments',
      data: { 
        appointment: {
          title: title.value,
          appt_time: appt_time.value,
        },
      },
      headers: JSON.parse(sessionStorage.user),
    })
    .done(data => {
      this.props.handleNewAppointment(data);
      resetFormErrors();
    }).fail(response => {
      this.setState(prevState => ({
        ...prevState,
        formErrors: response.responseJSON,
      }));
    });;
  };

  deleteAppointment = () => {
    if(window.confirm("Are you sure you want to delete this appointment?")) {
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/appointments/${this.props.match.params.id}`,
        headers: JSON.parse(sessionStorage.user),
      })
      .done((data) => {
        this.resetFormErrors();
        this.props.history.push('/');
      })
      .fail((response) => {
        console.log('appointment deleting failed!');
      });
    }
  }

  resetFormErrors = () => {
    this.setState(prevState => ({
      ...prevState,
      formErrors: {},
    }));
  };

  render () {
    const { title, appt_time, formErrors, formValid } = this.state;
    const { handleChange, handleFormSubmit, setApptTime } = this;
    const inputProps = {
      name: 'appt_time',
    };
    return (
      <React.Fragment>
        <h2>
          {this.state.editing ?
            'Update appointment' :
            'Make a new appointment' }
        </h2>
        <FormErrors formErrors={formErrors} />
        <form onSubmit={handleFormSubmit}>
          <input
            name="title"
            placeholder="Appointment title"
            value={title.value}
            onChange={handleChange}
          />
          <Datetime input={false} open={true} inputProps={inputProps}
            value={moment(appt_time.value)}
            onChange={event => setApptTime(event)}
          />
          <input
            type="submit"
            value={this.state.editing ?
              'Update Appointment' :
              'Make Appointment'}
            className="submit-button"
            disabled={!formValid}
          />
        </form>
        {this.state.editing && (
          <p>
            <button onClick={this.deleteAppointment}>
              Delete appointment
            </button>
          </p>
        )}
      </React.Fragment>
    );
  }
}

AppointmentForm.propTypes = {
  handleNewAppointment: PropTypes.func,
};

export default AppointmentForm
