import React from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { withRouter } from "react-router-dom";

// Icons
import FaPencil from "react-icons/lib/fa/pencil";
import FaUnblock from "react-icons/lib/fa/check-square-o";
import FaBlock from "react-icons/lib/fa/ban";
import FaGraduationCap from "react-icons/lib/fa/graduation-cap";

// Actions
import {
toggleChangeUser,
updateUser
} from "./../../store/actions/userActions";
import { clearErrors } from "./../../store/actions/generalActions";

class User extends React.Component {
  handleEdit = () => {
    this.props.toggleChangeUser(true, true, this.props.user);
    this.props.clearErrors();
  };

  handleChangeStatus = newStatus => {
    let { user, token } = this.props;

    let rolesArray = typeof user.roles === "string"
      ? user.roles.split(",")
      : [];

    let positionArray = typeof user.position === "string"
      ? user.position.split(",")
      : [];

    let userObj = Object.assign({}, user, {
      roles: rolesArray,
      position: positionArray
    });

    this.props.updateUser(userObj, token, newStatus);
  };

  goToSkills = userId => {
    this.props.history.push({
        pathname: '/user-skills',
        state: { userId: userId }
      });
  };

  render() {
    const { user, bgColor } = this.props;
    return (
      <div className="track track__line">
        <div className="track__info--line">
          <h3 className="track__user track__user--line">
            {user.email}
          </h3>
          <h4 className="track__type track__type--line">
            {user.roles}
          </h4>
          <h4 className="track__type track__type--line">
            {user.position}
          </h4>
          <p className="track__date track__date--line">
            {user.first_name + " " + user.last_name}
          </p>
        </div>
        <div className="track__menuBtn--line" style={{ color: bgColor }}>
          <div
            className={classnames("track__status track__status--line", {
              "track__status--accepted": user.locked === 0,
              "track__status--declined": user.locked === 1
            })}
          >
            {user.locked ? "Blocked" : "Active"}
          </div>
          <div
            className="track__menuBtnLine--btn m-l-10"
            onClick={this.handleEdit}
            title="Edit user"
          >
            <FaPencil />
          </div>
          <div
            className="track__menuBtnLine--btn"
            onClick={() => this.handleChangeStatus(0)}
            title="Unblock user"
          >
            <FaUnblock />
          </div>
          <div
            className="track__menuBtnLine--btn"
            onClick={() => this.goToSkills(user.id)}
            title="Skills user"
          >
            <FaGraduationCap />
          </div>
          <div
            className="track__menuBtnLine--btn"
            onClick={() => this.handleChangeStatus(1)}
            title="Block user"
          >
            <FaBlock />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    bgColor: state.generalReducer.bgColor,
    token: state.generalReducer.token
  };
}

export default withRouter(
  connect(mapStateToProps, {
    toggleChangeUser,
    clearErrors,
    updateUser
  })(User)
);
