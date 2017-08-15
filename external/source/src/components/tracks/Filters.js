import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import './../../../node_modules/moment/locale/en-gb';
import { filter } from 'lodash';

// Actions
import { toggleTrackFilters, setTrackFilters } from './../../store/actions/trackActions';
import { getUsers } from './../../store/actions/userActions';

// Helpers
import { getInitFiltersForTrack } from './../../shared/HelpService';

class Filters extends React.Component {
  state = Object.assign({}, getInitFiltersForTrack(), { initial: false });

  componentDidMount() {
    let { filters } = this.props;
    this.setState(filters);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.filters);

    if (this.state.initial) {
      return false;
    }

    const roles = nextProps.activeUser.roles;
    if (roles && (roles.includes('owner') || roles.includes('pm'))) {
      this.setState({ initial: true });
      this.props.getUsers(nextProps.token);
    }
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChangeStartDate = date => {
    this.setState({ startDate: date });
  };

  handleChangeEndDate = date => {
    this.setState({ endDate: date });
  };

  handleClose = () => {
    this.props.toggleTrackFilters();
  };

  handleUseFilters = () => {
    let filters = this.state;
    this.props.toggleTrackFilters();
    this.props.setTrackFilters(filters);
  };

  changeWorkType = selected => {
    this.setState({ type_work: selected ? selected.value : '' });
  };

  changeStatus = selected => {
    this.setState({ status: selected ? selected.value : '' });
  };

  changeUser = selected => {
    this.setState({ user: selected ? selected.value : '' });
  };

  render() {
    const { workTypes: wt, statusTypes: st, users: us, activeUser } = this.props;

    const workTypes = wt.map(v => {
      return {
        value: v,
        label: v
      };
    });

    const statusTypes = st.map(v => {
      return {
        value: v,
        label: v
      };
    });

    const isOwnerOrPm = activeUser.roles && (activeUser.roles.includes('owner') || activeUser.roles.includes('pm'));

    const users = filter(us, { locked: 0 }).map(v => {
      return {
        value: v.id,
        label: `${v.first_name} ${v.last_name}`
      };
    });

    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': this.props.filtersIsOpen
        })}
      >
        <div className="sidebar__wrapper">
          <h4 className="sidebar__title">Change filters</h4>

          <label className="input-headline">Status</label>
          <Select
            multi={false}
            searchable={false}
            placeholder=""
            name="status"
            value={this.state.status}
            options={statusTypes}
            onChange={this.changeStatus}
          />
          {isOwnerOrPm ? <label className="input-headline">User</label> : null}
          {isOwnerOrPm
            ? <Select
                multi={false}
                searchable={true}
                placeholder=""
                name="user"
                value={this.state.user}
                options={users}
                onChange={this.changeUser}
              />
            : null}

          <label className="input-headline">Start date</label>
          <DatePicker
            dateFormat="DD-MM-YYYY"
            selected={this.state.startDate}
            onChange={this.handleChangeStartDate}
            className="datepicker"
            locale="en-gb"
          />

          <label className="input-headline">End date</label>
          <DatePicker
            dateFormat="DD-MM-YYYY"
            selected={this.state.endDate}
            onChange={this.handleChangeEndDate}
            className="datepicker"
            locale="en-gb"
          />

          <label className="input-headline">Work type</label>
          <Select
            multi={false}
            searchable={false}
            placeholder=""
            name="type_work"
            value={this.state.type_work}
            options={workTypes}
            onChange={this.changeWorkType}
          />

          <label className="input-headline">Project</label>
          <input
            type="text"
            value={this.state.project}
            name="project"
            onChange={this.handleInputChange}
            className="input"
          />

          <label className="input-headline">Task</label>
          <input type="text" value={this.state.task} name="task" onChange={this.handleInputChange} className="input" />
        </div>
        <div className="sidebarBtns">
          <button className="sidebarBtns__btn sidebarBtns__btn--save" onClick={this.handleUseFilters}>
            Apply filters
          </button>
          <button className="sidebarBtns__btn sidebarBtns__btn--cancel" onClick={this.handleClose}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { filtersIsOpen, workTypes, statusTypes, filters } = state.trackReducer;
  return {
    filtersIsOpen,
    workTypes,
    statusTypes,
    filters,
    token: state.generalReducer.token,
    users: state.userReducer.users
  };
}

export default connect(mapStateToProps, {
  toggleTrackFilters,
  setTrackFilters,
  getUsers
})(Filters);
