import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import Topbar from './general/Topbar';
import Tracks from './tracks/Tracks';
import Users from './users/Users';
import Skills from './skills/Skills';
import Stats from './stats/Stats';
import Login from './general/Login';
import NotFound from './general/NotFound';
import Confirm from './general/Confirm';
import PrivateRoute from './general/PrivateRoute';
import SkillsUser from "./skills/SkillsUser";

// Actions
import { setToken } from './../store/actions/generalActions';
import { setActiveUser, meFailed } from './../store/actions/userActions';

class App extends React.Component {
  render() {
    return (
      <div className="wrapper" style={{ background: this.props.bgColor }}>
        {this.props.token ? <Topbar /> : null}
        <Switch>
          <PrivateRoute exact path="/" component={Tracks} props={this.props} />
          <PrivateRoute exact path="/stats" component={Stats} props={this.props} />
          <PrivateRoute exact path="/tracks" component={Tracks} props={this.props} />
          <PrivateRoute exact path="/users" component={Users} props={this.props} />
          <PrivateRoute exact path="/skills" component={Skills} props={this.props} />
          <PrivateRoute exact path="/user-skills" component={SkillsUser} props={this.props} />
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
        <Confirm />
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { bgColor, token } = state.generalReducer;
  let { activeUser } = state.userReducer;
  return {
    bgColor,
    token,
    activeUser
  };
}

export default withRouter(connect(mapStateToProps, { setToken, setActiveUser, meFailed })(App));
