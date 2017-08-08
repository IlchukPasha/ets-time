import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

// Data
import colors from './../../data/colors';

// Icons
import FaArrowUp from 'react-icons/lib/fa/arrow-up';

// Actions
import {
  changeBgColor,
  toggleStatistic
} from './../../store/actions/generalActions';

class Settings extends React.Component {
  state = { bgColor: '', showStatistic: true };

  changeInput = e => {
    this.setState({ [e.target.name]: !this.state.showStatistic });
  };

  componentDidMount() {
    let { bgColor, showStatistic } = this.props;
    this.setState({ bgColor, showStatistic });
  }

  handleClickColor = color => {
    this.setState({ bgColor: color });
  };

  saveSettings = () => {
    const { bgColor, showStatistic } = this.state;
    localStorage.setItem('bdColor', bgColor);
    localStorage.setItem('showStatistic', showStatistic);
    this.props.changeBgColor(bgColor);
    this.props.toggleStatistic(showStatistic);
    this.props.toggleSettings();
  };

  render() {
    const { settingsOpen, toggleSettings } = this.props;
    const { bgColor } = this.state;
    const colorsSection = colors.map((i, index) =>
      <div
        key={index}
        className="sidebar__color"
        style={{ background: i }}
        onClick={() => this.handleClickColor(i)}
      >
        {bgColor === i
          ? <FaArrowUp className="sidebar__color-pointer" />
          : null}
      </div>
    );

    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': settingsOpen
        })}
      >
        <div className="sidebar__wrapper">
          <h4 className="sidebar__title">Settings</h4>

          <label
            className="input-headline flex-left m-t-30"
            htmlFor="checkStatistic"
          >
            <span>Show statistic</span>
            <input
              id="checkStatistic"
              type="checkbox"
              name="showStatistic"
              checked={this.state.showStatistic}
              onChange={this.changeInput}
              className="m-l-20"
            />
          </label>
          <label className="input-headline">Background color</label>
          <div className="sidebar__colors">
            {colorsSection}
          </div>
        </div>
        <div className="sidebarBtns">
          <button
            className="sidebarBtns__btn sidebarBtns__btn--save"
            onClick={this.saveSettings}
          >
            Save settings
          </button>
          <button
            className="sidebarBtns__btn sidebarBtns__btn--cancel"
            onClick={toggleSettings}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { bgColor, showStatistic } = state.generalReducer;
  return {
    bgColor,
    showStatistic
  };
}

export default connect(mapStateToProps, { changeBgColor, toggleStatistic })(
  Settings
);
