import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

// Components
import Settings from "./Settings";

// Icons
import FaBlocks from "react-icons/lib/fa/th";
import FaLines from "react-icons/lib/fa/align-justify";
import FaCog from "react-icons/lib/fa/cog";
import FaPower from "react-icons/lib/fa/power-off";
import logo from "./../../data/selecto.svg";
import TrackIcon from "react-icons/lib/ti/time";
import UserIcon from "react-icons/lib/fa/user";
import GeneralSkills from "react-icons/lib/go/repo";
import UserSkills from "react-icons/lib/fa/graduation-cap";
import ChartIcon from "react-icons/lib/fa/pie-chart";

// Actions
import { changeTrackView } from "./../../store/actions/trackActions";
import { setActiveUser } from "./../../store/actions/userActions";
import { setToken } from "./../../store/actions/generalActions";

// Helpers
import { getFirstLetter } from "./../../shared/HelpService";

// Actions
import { getLibraries } from "./../../store/actions/trackActions";

class Topbar extends React.Component {
  state = {
    settingsOpen: false
  };

  componentDidMount() {
    let { token } = this.props;
    this.props.getLibraries(token);
  }

  changeView = view => {
    this.props.changeTrackView(view);
    localStorage.setItem("viewType", view);
  };

  toggleSettings = () => {
    this.setState({ settingsOpen: !this.state.settingsOpen });
  };

  logoutHandler = () => {
    this.props.setActiveUser({ first_name: "", last_name: "" });
    this.props.setToken("");
    localStorage.removeItem("token");
    this.props.history.push("/login");
  };

  render() {
    const { viewType, location, bgColor, activeUser } = this.props;
    const { settingsOpen } = this.state;
    const trackUrl = location.pathname.includes("tracks") ||
      location.pathname === "/";
    const userUrl = location.pathname.includes("users");
    const skillsUrl = location.pathname === "/skills";
    const userSkillsUrl = location.pathname === "/user-skills";
    const statUrl = location.pathname.includes("stats");

    const isOwnerOrPm = (trackUrl ||
      userUrl ||
      skillsUrl ||
      userSkillsUrl ||
      statUrl) &&
      activeUser.roles &&
      (activeUser.roles.includes("owner") || activeUser.roles.includes("pm"));

    return (
      <div className="topbar">
        <h4 className="topbar__headline">
          <img src={logo} alt="Selecto" height="20px" />
          <span className="p-l-20">
            {
              `${getFirstLetter(activeUser.first_name)}. ${activeUser.last_name}`
            }
          </span>
          <FaPower className="logout" onClick={this.logoutHandler} />
        </h4>

        <div className="topbar__menu" style={{ color: bgColor }}>
          {trackUrl
            ? <FaBlocks
                className={classnames("topbar__icon", {
                  "topbar__icon--active": viewType === "block"
                })}
                onClick={() => this.changeView("block")}
              />
            : null}

          {trackUrl
            ? <FaLines
                className={classnames("topbar__icon", "p-r-20", {
                  "topbar__icon--active": viewType === "line"
                })}
                onClick={() => this.changeView("line")}
              />
            : null}

          {isOwnerOrPm
            ? <div className="topbar__menu--wrapper">
                <Link
                  to="/tracks"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": trackUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <TrackIcon />
                </Link>
                <Link
                  to="/users"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": userUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <UserIcon />
                </Link>
                <Link
                  to="/skills"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": skillsUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <GeneralSkills />
                </Link>
                <Link
                  to="/user-skills"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": userSkillsUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <UserSkills />
                </Link>
                <Link
                  to="/stats"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": statUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <ChartIcon />
                </Link>
              </div>
            : <div className="topbar__menu--wrapper">
                <Link
                  to="/tracks"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": trackUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <TrackIcon />
                </Link>

                <Link
                  to="/stats"
                  className={classnames("topbar__menu--btn", {
                    "topbar__menu--active": statUrl
                  })}
                  style={{ background: bgColor }}
                >
                  <ChartIcon />
                </Link>
              </div>}

          <div className="topbar__icons" style={{ color: bgColor }}>
            <FaCog
              className="topbar__icon p-l-20"
              onClick={this.toggleSettings}
            />
            <Settings
              settingsOpen={settingsOpen}
              toggleSettings={this.toggleSettings}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    viewType: state.trackReducer.view,
    bgColor: state.generalReducer.bgColor,
    token: state.generalReducer.token,
    activeUser: state.userReducer.activeUser
  };
}

export default withRouter(
  connect(mapStateToProps, {
    changeTrackView,
    setActiveUser,
    setToken,
    getLibraries
  })(Topbar)
);
