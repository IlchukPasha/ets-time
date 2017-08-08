import React from 'react';
import { connect } from 'react-redux';

// Icons
import FaPlus from 'react-icons/lib/fa/plus';

// Actions
import { getUsers, toggleChangeUser } from './../../store/actions/userActions';
import { clearErrors } from './../../store/actions/generalActions';

// Components
import User from './User';
import ChangeUser from './ChangeUser';

class Users extends React.Component {
  componentDidMount() {
    this.props.getUsers(this.props.token);
  }

  openChangeUser = () => {
    this.props.toggleChangeUser(true);
    this.props.clearErrors();
  };

  render() {
    const users = this.props.users.map((u, i) => {
      return <User user={u} key={i} bgColor={this.props.bgColor} />;
    });

    return (
      <div className="container" style={{ background: this.props.bgColor }}>
        {users}
        <ChangeUser />
        <div className="mainBtns">
          <button
            className="mainBtns__btn"
            onClick={this.openChangeUser}
            style={{ color: this.props.bgColor }}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { token, bgColor } = state.generalReducer;
  return {
    token,
    bgColor,
    users: state.userReducer.users
  };
}

export default connect(mapStateToProps, {
  getUsers,
  toggleChangeUser,
  clearErrors
})(Users);
