import React from 'react'
import LoginErrors from './LoginErrors'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loginErrors: false
    }
  }

  handleLogin = (e) => {
    e.preventDefault()
    axios({
      method: 'POST',
      url: 'https://zmate.herokuapp.com/auth/sign_in',
      data: {
        email: this.email.value,
        password: this.password.value
      }
    })
    .then(response => {
      localStorage.setItem('user',
        JSON.stringify({
          'access-token': response.headers['access-token'],
          'client': response.headers['client'],
          'uid': response.data.data.uid
      }))
      window.location = '/'
    })
        .catch( error => {
            console.log(error);
            this.setState({loginErrors: true})
        })
  }

  render () {
    return (
      <Container className="content-container">
        <h2>Log in</h2>
        <LoginErrors loginErrors = {this.state.loginErrors}></LoginErrors>
        <Form onSubmit={this.handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" ref={(input) => this.email = input } />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password"  ref={(input) => this.password = input } />
          </Form.Group>
          <Button variant="danger" type="submit">
            Log in
          </Button>
        </Form>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </Container>
    )
  }
}

export default Login
