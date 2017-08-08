import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

// Actions
import {
  toggleChangeUser,
  createUser,
  updateUser
} from './../../store/actions/userActions';
import { clearErrorField } from './../../store/actions/generalActions';

// Helpers
import { getInitNewUserData } from './../../shared/HelpService';

const initialState = getInitNewUserData();

class SingeUser extends React.Component {
  state = initialState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.userIsOpen !== this.props.userIsOpen) {
      this.setState(initialState);
    }

    // Set state if opened user edit
    if (!isEqual(nextProps.userData, this.props.userData)) {
      this.setState(nextProps.userData);
    }
  }

  handleClose = () => {
    this.props.toggleChangeUser(false);
  };

  handleSaveUser = () => {
    let { isUserEdit, token } = this.props;
    let { roles, position } = this.state;

    let rolesArray;
    let positionArray;

    let rolesString = typeof roles === 'string';
    let positionString = typeof position === 'string';

    if (rolesString) {
      rolesArray = typeof roles === 'string' ? roles.split(',') : [];
    } else {
      rolesArray = roles.length > 0 ? roles.map(i => i.value) : [];
    }

    if (positionString) {
      positionArray = typeof position === 'string' ? position.split(',') : [];
    } else {
      positionArray = position.length > 0 ? position.map(i => i.value) : [];
    }

    let user = Object.assign({}, this.state, {
      roles: rolesArray,
      position: positionArray
    });

    if (isUserEdit) {
      this.props.updateUser(user, token, user.locked);
    } else {
      this.props.createUser(user, token);
    }
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleFocusInput = e => {
    this.props.clearErrorField(e.target.name);
  };

  changeRoles = roles => {
    this.setState({ roles });
    this.props.clearErrorField('roles');
  };

  changePositions = position => {
    this.setState({ position });
    this.props.clearErrorField('position');
  };

  render() {
    const { errors, roles: rs, positions: ps, isUserEdit } = this.props;

    const roles = rs.map(r => {
      return {
        value: r,
        label: r
      };
    });

    const positions = ps.map(r => {
      return {
        value: r,
        label: r
      };
    });

    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': this.props.userIsOpen
        })}
      >
        <div className="sidebar__wrapper">
          <h4 className="sidebar__title">
            {this.props.isUserEdit ? 'Edit user' : 'Add new user'}
          </h4>

          {this.props.errors.changeUserError
            ? <p className="confirm__error">
                Sorry, but something gone wrong...
              </p>
            : null}

          <label className="input-headline">
            <span>First name</span>
            {errors.first_name
              ? <span className="error__text">{errors.first_name}</span>
              : null}
          </label>
          <input
            type="text"
            value={this.state.first_name}
            name="first_name"
            onChange={this.handleInputChange}
            className={classnames('input', {
              bgError: errors.first_name
            })}
            onFocus={this.handleFocusInput}
          />

          <label className="input-headline">
            <span>Last name</span>
            {errors.last_name
              ? <span className="error__text">{errors.last_name}</span>
              : null}
          </label>
          <input
            type="text"
            value={this.state.last_name}
            name="last_name"
            onChange={this.handleInputChange}
            className={classnames('input', {
              bgError: errors.last_name
            })}
            onFocus={this.handleFocusInput}
          />

          {!isUserEdit
            ? <label className="input-headline">
                <span>Email</span>
                {errors.email
                  ? <span className="error__text">{errors.email}</span>
                  : null}
              </label>
            : null}
          {!isUserEdit
            ? <input
                type="email"
                value={this.state.email}
                name="email"
                onChange={this.handleInputChange}
                className={classnames('input', {
                  bgError: errors.email
                })}
                onFocus={this.handleFocusInput}
              />
            : null}

          <label className="input-headline">
            <span>Roles</span>
            {errors.roles
              ? <span className="error__text">
                  {errors.roles.length > 1 ? errors.roles[0] : errors.roles}
                </span>
              : null}
          </label>
          <Select
            multi={true}
            searchable={false}
            placeholder=""
            name="Roles"
            value={this.state.roles}
            options={roles}
            onChange={this.changeRoles}
            className={classnames({
              bgErrorSelect: errors.roles
            })}
          />

          <label className="input-headline">
            <span>Position</span>
            {errors.position
              ? <span className="error__text">
                  {errors.position.length > 1
                    ? errors.position[0]
                    : errors.position}
                </span>
              : null}
          </label>
          <Select
            multi={true}
            searchable={false}
            placeholder=""
            name="Position"
            value={this.state.position}
            options={positions}
            onChange={this.changePositions}
            className={classnames({
              bgErrorSelect: errors.position
            })}
          />

          <label className="input-headline">
            <span>Rate</span>
            {errors.rate
              ? <span className="error__text">{errors.rate}</span>
              : null}
          </label>
          <input
            type="number"
            value={this.state.rate}
            name="rate"
            onChange={this.handleInputChange}
            className={classnames('input', {
              bgError: errors.rate
            })}
            onFocus={this.handleFocusInput}
          />

          <label className="input-headline">
            <span>Password</span>
            {errors.password
              ? <span className="error__text">{errors.password}</span>
              : null}
          </label>
          <input
            type="password"
            value={this.state.password}
            name="password"
            onChange={this.handleInputChange}
            className={classnames('input', {
              bgError: errors.password
            })}
            onFocus={this.handleFocusInput}
          />

        </div>
        <div className="sidebarBtns">
          <button
            className="sidebarBtns__btn sidebarBtns__btn--save"
            onClick={this.handleSaveUser}
          >
            Save
          </button>
          <button
            className="sidebarBtns__btn sidebarBtns__btn--cancel"
            onClick={this.handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let {
    userIsOpen,
    userData,
    isUserEdit,
    roles,
    positions
  } = state.userReducer;
  let { errors, token } = state.generalReducer;
  return {
    roles,
    positions,
    userIsOpen,
    userData,
    isUserEdit,
    errors,
    token
  };
}

export default connect(mapStateToProps, {
  toggleChangeUser,
  createUser,
  updateUser,
  clearErrorField
})(SingeUser);
