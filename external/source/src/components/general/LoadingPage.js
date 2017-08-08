import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

class LoadingPage extends React.Component {
  render() {
    const loading = this.props.meFailed
      ? <Redirect to="/login" />
      : <div className="spinner">
          <div className="double-bounce1" />
          <div className="double-bounce2" />
        </div>;
    return loading;
  }
}

function mapStateToProps(state) {
  return {
    meFailed: state.userReducer.meFailed
  };
}

export default connect(mapStateToProps, {})(LoadingPage);
