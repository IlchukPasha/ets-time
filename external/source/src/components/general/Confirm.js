import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

// Actions
import { toggleConfirm } from './../../store/actions/generalActions';
import { removeTrack } from './../../store/actions/trackActions';

class Confirm extends React.Component {
  handleClose = () => {
    this.props.toggleConfirm(false, 'text');
  };

  handleClickOk = () => {
    let { action, param, token } = this.props;
    if (action === 'removeTrack') {
      this.props.removeTrack(param, token);
    }
  };

  render() {
    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': this.props.confirmIsOpen
        })}
      >
        <div className="sidebar__wrapper centered">
          <h4 className="headline-centered">{this.props.text}</h4>
          <div>
            <button onClick={this.handleClickOk} className="button">Ok</button>
            <button onClick={this.handleClose} className="button">
              Cancel
            </button>
          </div>
          {this.props.deleteTrack
            ? <p className="confirm__error">
                Sorry, but something gone wrong...
              </p>
            : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { text, action, param } = state.generalReducer.confirmData;
  return {
    text,
    action,
    param,
    confirmIsOpen: state.generalReducer.confirmIsOpen,
    deleteTrack: state.generalReducer.errors.deleteTrack,
    token: state.generalReducer.token
  };
}

export default connect(mapStateToProps, { toggleConfirm, removeTrack })(
  Confirm
);
