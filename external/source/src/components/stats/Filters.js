import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './../../../node_modules/moment/locale/en-gb';
import { find } from 'lodash';

// Actions
import { getUsers } from './../../store/actions/userActions';

// Helpers
import { getInitFilters } from './../../shared/HelpService';
import { withRouter } from "react-router-dom";

class Filters extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitFilters();
    this.getStatByUserID = props.getStatByUserID;
    this.toggleFilters = props.toggleFilters;
    this.setHeaderData = props.setHeaderData;
  }

  componentDidMount() {
    this.props.getUsers(this.props.token);
  }

  componentWillReceiveProps() {

    if (this.state.state_selected_user === null && this.props.user_id) {
      this.setState({ state_selected_user: this.props.user_id, user: this.props.user_id });
    }

    if (this.state.state_selected_user === null && this.props.user_id) {
      this.getStatByUserID(this.props.token, 3, this.state.date);

      let date = this.state.dates[this.state.state_selected_date].label;
      let username = this.props.activeUser.first_name + ' ' + this.props.activeUser.last_name;
      this.setHeaderData(date, username);
    }
  }

  applyFilters = () => {
    let { user: user_id, date: raw_date } = this.state;
    this.toggleFilters();
    this.getStatByUserID(this.props.token, user_id, raw_date);

    let date = this.state.dates[this.state.state_selected_date].label;
    let u = find(this.props.users, user => user.id === user_id);
    this.setHeaderData(date, u ? u.first_name + ' ' + u.last_name : 'Not found');
  };

  changeState = (props, selected) => {
    switch (props) {
      case 'user':
        this.setState({ state_selected_user: selected.value, user: selected.value });
        break;
      case 'date':
        this.setState({ state_selected_date: selected.value, date: selected.raw_label });
        break;
      default:
        break;
    }
  };

  render() {
    const { users: us, toggleFilters } = this.props;
    const users = us.map(v => {
      return {
        value: v.id,
        label: `${v.first_name} ${v.last_name}`
      };
    });
    const dates = this.state.dates;
    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': this.props.parentState.showFilters
        })}
      >
        <div className="sidebar__wrapper">
          <h4 className="sidebar__title">Change filters</h4>

          <label className="input-headline">User</label>
          <Select
            multi={false}
            searchable={true}
            placeholder=""
            value={this.state.state_selected_user}
            options={users}
            onChange={this.changeState.bind(this, 'user')}
          />

          <label className="input-headline">Month</label>
          <Select
            multi={false}
            searchable={true}
            placeholder=""
            value={this.state.state_selected_date}
            options={dates}
            onChange={this.changeState.bind(this, 'date')}
          />
        </div>
        <div className="sidebarBtns">
          <button className="sidebarBtns__btn sidebarBtns__btn--save" onClick={this.applyFilters}>
            Apply filters
          </button>
          <button className="sidebarBtns__btn sidebarBtns__btn--cancel" onClick={() => toggleFilters()}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    filters: state.trackReducer.filters,
    token: state.generalReducer.token,
    users: state.userReducer.users,
    user_id: state.userReducer.activeUser.id,
    activeUser: state.userReducer.activeUser
  };
}
export default withRouter(
  connect(mapStateToProps, { getUsers })(Filters)
)
