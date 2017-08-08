import React from "react";
import { connect } from "react-redux";
import ChartJS from "chart.js";
import { map, each, find } from "lodash";
import randomcolor from 'randomcolor';

// get api
import { getStatByUserID } from "./../../store/actions/statActions";

// Components
import Select from "react-select";

// Chart settings
import {
  colors,
  dataChartPerStatus,
  dataChartPerDay,
  dataChartPerMonth,
  dataChartRadar,
  dataChartPerTypeWork,
  dataChartPerProjects
} from "./chartSettings";
import { getInitFilters } from "../../shared/HelpService";
import { getUsers } from "../../store/actions/userActions";
import { withRouter } from "react-router-dom";

const Filter = function(props) {
  const { data, selectedValue, changeState } = props;
  return (
    <div className="statistic__filters__item">
      <Select
        multi={false}
        searchable={true}
        placeholder=""
        clearable={false}
        value={selectedValue}
        options={data}
        onChange={changeState.bind(this)}
      />
    </div>
  );
};

class Stats extends React.Component {
  state = {
    isGet: false
  };

  changeState = (props, selected) => {
    switch (props) {
      case "user":
        this.setState({
          state_selected_user: selected.value,
          user: selected.value
        });
        break;
      case "date":
        this.setState({
          state_selected_date: selected.value,
          date: selected.raw_label
        });
        break;
      default:
        break;
    }
  };

  constructor(props) {
    super(props);
    this.state = getInitFilters();
  }

  /* init charts */
  componentDidMount() {
    const {activeUser} = this.props;
    if(activeUser.hasOwnProperty('id')) {
      this.setInitialFilter(this.props);

      if(activeUser.roles.includes("owner") || activeUser.roles.includes("pm")) {
        this.props.getUsers(this.props.token);
      }
    }

    const { byStatus, byDay, byMonth, byRadar, byTypeWork, byProjects } = this.refs;
    const chartPerStatusCtx = byStatus.getContext('2d');
    const chartPerTypeWorkCtx = byTypeWork.getContext('2d');
    const chartPerProjectsCtx = byProjects.getContext('2d');
    const chartPerDayCtx = byDay.getContext('2d');
    const chartPerMonthCtx = byMonth.getContext('2d');
    const chartRadarCtx = byRadar.getContext('2d');

    this.chartPerProjects = new ChartJS(chartPerProjectsCtx, dataChartPerProjects);
    this.chartPerTypeWork = new ChartJS(chartPerTypeWorkCtx, dataChartPerTypeWork);
    this.chartPerStatus = new ChartJS(chartPerStatusCtx, dataChartPerStatus);
    this.chartPerDay = new ChartJS(chartPerDayCtx, dataChartPerDay);
    this.chartPerMonth = new ChartJS(chartPerMonthCtx, dataChartPerMonth);
    this.chartRadar = new ChartJS(chartRadarCtx, dataChartRadar);


  }

  componentWillReceiveProps(np) {
    const { types } = this.props;
    this.setInitialFilter(np);

    // pie chart by status in current month
    dataChartPerStatus.data.labels = map(np.per_status, "status");
    dataChartPerStatus.data.datasets = [];
    dataChartPerStatus.data.datasets.push({
      data: map(np.per_status, "total"),
      backgroundColor: map(np.per_status, item => colors[item.status])
    });
    this.chartPerStatus.update();

    // pie chart by type work in current month
    dataChartPerTypeWork.data.labels = map(np.per_type_work, 'type_work');
    dataChartPerTypeWork.data.datasets = [];
    dataChartPerTypeWork.data.datasets.push({
      data: map(np.per_type_work, 'total'),
      backgroundColor: randomcolor.randomColor({ luminosity: 'bright', count: np.per_type_work.length })
    });
    this.chartPerTypeWork.update();

    // pie chart by type work in current month
    dataChartPerProjects.data.labels = map(np.per_projects, 'project');
    dataChartPerProjects.data.datasets = [];
    dataChartPerProjects.data.datasets.push({
      data: map(np.per_projects, 'total'),
      backgroundColor: randomcolor.randomColor({ luminosity: 'bright', count: np.per_projects.length })
    });
    this.chartPerProjects.update();

    // update bar chart per day
    dataChartPerDay.data.labels = map(np.per_day, "date");
    dataChartPerDay.data.datasets = [];
    each(types, type => {
      dataChartPerDay.data.datasets.push({
        label: type,
        data: map(np.per_day, type),
        backgroundColor: colors[type]
      });
    });
    this.chartPerDay.update();

    // update chart per months if we need this
    dataChartPerMonth.data.labels = map(np.per_months, "month");
    dataChartPerMonth.data.datasets = [];
    each(types, type => {
      dataChartPerMonth.data.datasets.push({
        label: type,
        data: map(np.per_months, type),
        backgroundColor: colors[type]
      });
    });
    this.chartPerMonth.update();

    // update radar chart
    dataChartRadar.data.labels = map(np.radar, "name");
    dataChartRadar.data.datasets = [];
    dataChartRadar.data.datasets.push({
      borderColor: "deepskyblue",
      borderWidth: 2,
      data: map(np.radar, "percent"),
      label: "Skill percentage"
    });
    this.chartRadar.update();
  }

  componentWillUnmount() {
    this.chartPerStatus = null;
    this.chartPerDay = null;
    this.chartPerMonth = null;
    this.chartRadar = null;
    this.chartPerProjects = null;
    this.chartPerTypeWork = null;
  }

  setInitialFilter = (props) => {
    if (props.activeUser) {

      const { activeUser, token } = props;
      if (this.state.state_selected_user === null && !this.state.user) {
        if(activeUser.roles.includes("owner") || activeUser.roles.includes("pm")) {
          this.props.getUsers(this.props.token);
        }
        this.setState({ state_selected_user: props.activeUser.id });
        this.setState({ user: props.activeUser.id });
        props.getStatByUserID(token, activeUser.id, this.state.date);
        let date = this.state.dates[this.state.state_selected_date].label;
        let username = activeUser.first_name +
          " " +
          activeUser.last_name;
        this.setHeaderData(date, username);
      }
    }
  };

  toggleFilters = () => {
    this.setState({ showFilters: !this.state.showFilters });
  };

  setHeaderData = (header_period, header_username) => {
    this.setState({ header_period, header_username });
  };

  applyFilters = () => {
    let { user: user_id, date: raw_date } = this.state;
    this.props.getStatByUserID(this.props.token, user_id, raw_date);

    let date = this.state.dates[this.state.state_selected_date].label;
    if(this.props.users.length) {
      let u = find(this.props.users, user => user.id === user_id);
      this.setHeaderData(
        date,
        u ? u.first_name + " " + u.last_name : "Not found"
      );
    }
  };

  render() {
    const { activeUser } = this.props;
    const dates = this.state.dates;

    const { users: us } = this.props;
    const users = us.map(v => {
      return {
        value: v.id,
        label: `${v.first_name} ${v.last_name}`
      };
    });

    let isMember;
    if (activeUser.roles) {
      isMember = !(activeUser.roles.includes("owner") ||
        activeUser.roles.includes("pm"));
    }

    return (
      <div>
        <div className="container">
          <div className="statistic statistic--block">
            <div className="statistic__wrapper">
              <span className="statistic__number">
                {this.state.header_period}
              </span>
              <span className="statistic__label">Period</span>
            </div>
            <div className="statistic__wrapper">
              <span className="statistic__number">
                {this.state.header_username}
              </span>
              <span className="statistic__label">Member</span>
            </div>
          </div>
          {isMember
            ? <div className="statistic__filters">
                <Filter
                  data={dates}
                  selectedValue={this.state.state_selected_date}
                  changeState={this.changeState.bind(this, "date")}
                />
                <button
                  type="button"
                  className="sidebarBtns__btn sidebarBtns__btn--save stats__apply-filter"
                  onClick={this.applyFilters}
                >
                  apply
                </button>
              </div>
            : <div className="statistic__filters">
                <Filter
                  data={dates}
                  selectedValue={this.state.state_selected_date}
                  changeState={this.changeState.bind(this, "date")}
                />

                <Filter
                  data={users}
                  selectedValue={this.state.state_selected_user}
                  changeState={this.changeState.bind(this, "user")}
                />
                <button
                  type="button"
                  className="sidebarBtns__btn sidebarBtns__btn--save stats__apply-filter"
                  onClick={this.applyFilters}
                >
                  apply
                </button>
              </div>}
          <div className="stats">
            <div className="stats__label">By status (per tasks)</div>
            <canvas ref="byStatus" />
          </div>
          <div className="stats">
            <div className="stats__label">By type of work (per hours)</div>
            <canvas ref="byTypeWork" />
          </div>
          <div className="stats">
            <div className="stats__label">By project (per hours)</div>
            <canvas ref="byProjects" />
          </div>
          <div className="stats">
            <div className="stats__label">Current Month</div>
            <canvas ref="byDay" />
          </div>
          <div className="stats">
            <div className="stats__label">Skill Radar</div>
            <canvas ref="byRadar" />
          </div>
          <div className="stats">
            <div className="stats__label">All Activity</div>
            <canvas ref="byMonth" />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.generalReducer.token,
    bgColor: state.generalReducer.bgColor,
    per_status: state.statReducer.per_status,
    per_type_work: state.statReducer.per_type_work,
    per_day: state.statReducer.per_day,
    per_months: state.statReducer.per_months,
    users: state.userReducer.users,
    per_projects: state.statReducer.per_projects,
    radar: state.statReducer.radar,
    filters: state.trackReducer.filters,
    types: state.trackReducer.statusTypes,
    activeUser: state.userReducer.activeUser
  };
}

export default withRouter(
  connect(mapStateToProps, { getStatByUserID, getUsers })(Stats)
);
