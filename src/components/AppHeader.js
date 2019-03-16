import React from "react"
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import { Container, Navbar, Nav } from 'react-bootstrap';

class AppHeader extends React.Component {

  componentDidMount () {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:3001/auth/validate_token',
      dataType: "JSON",
      headers: JSON.parse(sessionStorage.getItem('user'))
		})
		.fail((data) => {
			this.props.history.push('/login');
		})
  }

  handleSignOut = (e) => {
		e.preventDefault();
    
    $.ajax({
			type: 'DELETE',
			url: 'http://localhost:3001/auth/sign_out',
			data: JSON.parse(sessionStorage.user),
		})
		.done(() => {
			sessionStorage.removeItem('user');
			this.props.history.push('/login');
    });

  }

  render () {
    if(sessionStorage.getItem('user')) {
      return (
        <React.Fragment>
          <Navbar bg="dark" variant="dark" fixed="top">
            <Container>
              <Navbar.Brand>
                <Link to='/'>
                  CalReact
                </Link>
              </Navbar.Brand>
              <Nav className="ml-auto">
                <Nav.Item>
                  <Nav.Link>{JSON.parse(sessionStorage.getItem('user')).uid}</Nav.Link>
                </Nav.Item>
                <Nav.Link href="#" onClick={this.handleSignOut}>Sign out</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        </React.Fragment>
      );
    } else {
      return (
        <Redirect to='/login' />
      );
    }
  }
}

export default AppHeader
