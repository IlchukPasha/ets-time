import React from 'react';
import { connect } from 'react-redux';
import {
  getSkillsFromUserApi,
  attachSkillUser
} from './../../shared/ApiService';
import { getUsers } from './../../store/actions/userActions';
import { UsersSelect, ParentSkill } from './index';

class SkillsUser extends React.Component {
  state = {
    skills: [],
    state_selected_user: null
  };

  componentDidMount() {
    this.props.getUsers(this.props.token);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.state) {
      const _id = nextProps.location.state.userId;
      this.changeState('user', {id: _id});
    } else {
      this.getCacheSelectedUser();
    }
  }

  changeState = (props, selected) => {
    switch (props) {
      case 'user':
        const _id = !selected ? null : selected.id;
        this.cacheSelectedUser(_id);
        this.setState({ state_selected_user: _id });
        if (_id) {
          getSkillsFromUserApi(this.props.token, _id).then(resp => {
            this.setState({ skills: resp });
          });
        } else {
          this.setState({ skills: [] });
        }
        break;
      default:
        break;
    }
  };

  cacheSelectedUser = _id => {
    localStorage.setItem('selected-user-skills', _id);
  };

  getCacheSelectedUser = () => {
    if (localStorage.getItem('selected-user-skills')) {
      let _id = +localStorage.getItem('selected-user-skills');

      this.setState({ state_selected_user: _id });
      getSkillsFromUserApi(this.props.token, _id).then(resp => {
        this.setState({ skills: resp });
      });
    }
  };

  saveSkillUser = event => {
    attachSkillUser(this.props.token, event).then(resp => {
      console.log(resp);
    });
  };

  render() {
    const { state_selected_user } = this.state;

    const allSkills = this.state.skills.map((skill, index) =>
      <ParentSkill
        key={index}
        parentSkill={skill}
        selectedUser={state_selected_user}
        saveSkillUser={this.saveSkillUser}
      />
    );

    return (
      <div className="container skills-user-wrapper">
        <UsersSelect
          users={this.props.users}
          state_selected_user={state_selected_user}
          changeState={this.changeState}
        />
        {this.state.skills.length
          ? <div className="skills">
              {allSkills}
            </div>
          : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { token } = state.generalReducer;

  return {
    token,
    activeUser: state.userReducer.activeUser,
    users: state.userReducer.users
  };
}

export default connect(mapStateToProps, {
  getUsers
})(SkillsUser);
