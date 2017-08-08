import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

// Actions
import {
  toggleConfirm,
  clearErrors
} from './../../store/actions/generalActions';
import {
  toggleChangeTrack,
  changeTrackStatus
} from './../../store/actions/trackActions';

// Helpers
import { formatDateToServer } from './../../shared/HelpService';

class TrackBlockMenu extends React.Component {
  handleDelete = () => {
    const { date_task, status, id } = this.props.t;
    const date = new Date(date_task);
    const dateStr = date ? formatDateToServer(date) : '';

    this.props.toggleMenu();
    this.props.toggleConfirm(
      true,
      `Delete track from ${dateStr} with status: ${status.toLowerCase()}?`,
      'removeTrack',
      id
    );
  };

  handleEdit = () => {
    this.props.toggleChangeTrack(true, true, this.props.t);
    this.props.clearErrors();
    this.props.toggleMenu();
  };

  handleDecline = () => {
    let { t, token } = this.props;
    if (t.status !== 'Declined') {
      this.props.changeTrackStatus(token, t.id, 'Declined');
      this.props.toggleMenu();
    }
  };

  handleAccept = () => {
    let { t, token } = this.props;
    if (t.status !== 'Accepted') {
      this.props.changeTrackStatus(token, t.id, 'Accepted');
      this.props.toggleMenu();
    }
  };

  render() {
    const { t, menuOpen, activeUser } = this.props;
    const isOwnerOrPm =
      activeUser.roles &&
      (activeUser.roles.includes('owner') || activeUser.roles.includes('pm'));
    const isUserTrack = t.user_id && activeUser.id
      ? activeUser.id === t.user_id
      : true;

    return (
      <div
        className={classnames('track-menu-btns', {
          'track-menu-btns--opened': menuOpen
        })}
      >
        <button className="track-menu-btns__btn" onClick={this.handleEdit}>
          Edit
        </button>
        {isUserTrack
          ? <button
              className="track-menu-btns__btn"
              onClick={this.handleDelete}
            >
              Delete
            </button>
          : null}
        {t.status !== 'Declined' && isOwnerOrPm
          ? <button
              className="track-menu-btns__btn"
              onClick={this.handleDecline}
            >
              Decline
            </button>
          : null}
        {t.status !== 'Accepted' && isOwnerOrPm
          ? <button
              className="track-menu-btns__btn"
              onClick={this.handleAccept}
            >
              Accept
            </button>
          : null}
        <button
          className="track-menu-btns__btn"
          onClick={this.props.toggleMenu}
        >
          Cancel
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeUser: state.userReducer.activeUser
  };
}

export default connect(mapStateToProps, {
  toggleConfirm,
  toggleChangeTrack,
  clearErrors,
  changeTrackStatus
})(TrackBlockMenu);
