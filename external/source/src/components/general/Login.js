import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// Helpers
import { loginApi } from './../../shared/ApiService';

// Actions
import {
  setErrors,
  clearErrorField,
  setToken
} from './../../store/actions/generalActions';
import { setActiveUser } from './../../store/actions/userActions';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    isLoading: false
  };

  handleChangeInput = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFocusInput = e => {
    this.props.clearErrorField(e.target.name);
  };

  handleSubmit = e => {
    e.preventDefault();

    if (this.state.isLoading) return false;

    let { email, password } = this.state;
    this.setState({ isLoading: true });

    loginApi(email, password).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        this.setState({ isLoading: false });

        resp.json().then(resp => {
          let token = resp.token;
          if (token) {
            localStorage.setItem('token', token);
            this.props.setActiveUser(resp);
            this.props.setToken(token);
          }
        });
      } else {
        this.setState({ isLoading: false });
        if (resp.status === 404) {
          this.props.setErrors({ email: true, password: true });
        } else {
          resp.json().then(resp => {
            this.props.setErrors(resp.errors);
          });
        }
      }
    });
  };

  render() {
    const { errors, token } = this.props;

    const loginComponent = (
      <div className="login-wrapper">
        <form
          autoComplete="true"
          onSubmit={this.handleSubmit}
          className="login-form"
        >
          <h4 className="input-headline m-0">Selecto tracker</h4>
          <input
            type="email"
            required
            name="email"
            value={this.state.email}
            onChange={this.handleChangeInput}
            onFocus={this.handleFocusInput}
            placeholder="Email"
            className={classnames('input login__input', {
              bgError: errors.email
            })}
          />

          <input
            type="password"
            required
            name="password"
            value={this.state.password}
            onChange={this.handleChangeInput}
            onFocus={this.handleFocusInput}
            placeholder="Password"
            className={classnames('input login__input', {
              bgError: errors.password
            })}
          />

          <button type="submin" className="button login-button">
            {this.state.isLoading
              ? <div className="spinner-btn">
                  <div className="double-bounce1" />
                  <div className="double-bounce2" />
                </div>
              : <span>Login</span>}
          </button>
        </form>
      </div>
    );

    return (
      <div>
        {token
          ? <Redirect
              to={{
                pathname: '/tracks'
              }}
            />
          : loginComponent}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { errors, token } = state.generalReducer;
  return {
    errors,
    token
  };
}

export default connect(mapStateToProps, {
  setErrors,
  clearErrorField,
  setToken,
  setActiveUser
})(Login);
