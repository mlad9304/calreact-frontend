import React from "react"
import { Link } from 'react-router-dom';
class AppHeader extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Link to="/">
            <h1>CalReact</h1>
        </Link>
      </React.Fragment>
    );
  }
}

export default AppHeader
