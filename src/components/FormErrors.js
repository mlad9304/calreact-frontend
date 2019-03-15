import React from "react"
import PropTypes from "prop-types"
class FormErrors extends React.Component {
  render () {
    const { formErrors } = this.props;
    return (
        <React.Fragment>
            {formErrors && Object.keys(formErrors).map(formErrorField => (
                formErrors[formErrorField].map(error => (
                    <p>{formErrorField} {error}</p>
                ))
            ))}
        </React.Fragment>
    );
  }
}

FormErrors.propTypes = {
    formErrors: PropTypes.object
};
export default FormErrors
