import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { isEqual } from 'lodash';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

// Actions
import {
  toggleChangeTrack,
  createTrack,
  updateTrack,
  getLibraries
} from './../../store/actions/trackActions';
import { clearErrorField } from './../../store/actions/generalActions';

// Helpers
import { getInitNewTrackData } from './../../shared/HelpService';

// Components
import InputAutoSuggest from './../general/InputAutoSuggest';

const initialState = getInitNewTrackData();

class SingeTrack extends React.Component {
  state = initialState;

  componentWillReceiveProps(nextProps) {
    if (nextProps.trackIsOpen !== this.props.trackIsOpen) {
      this.setState(initialState);
    }

    // Set state if opened track edit
    if (!isEqual(nextProps.trackData, this.props.trackData)) {
      this.setState(nextProps.trackData);
    }
  }

  handleClose = () => {
    this.props.toggleChangeTrack(false);
  };

  handleSaveTrack = () => {
    let { isTrackEdit, token } = this.props;
    if (isTrackEdit) {
      this.props.updateTrack(this.state, token);
    } else {
      this.props.createTrack(this.state, token);
    }

    this.props.getLibraries(token, true);
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changeWorkType = type_work => {
    this.props.clearErrorField('type_work');
    this.setState({ type_work });
  };

  handleChangeDate = date => {
    this.setState({ trackDate: date });
  };

  handleFocusInput = e => {
    this.props.clearErrorField(e.target.name);
  };

  changeProject = project => {
    this.setState({ project });
  };

  handleDateFocus = () => {
    this.props.clearErrorField('date_task');
  };

  render() {
    const workTypes = this.props.workTypes.map(r => {
      return {
        value: r,
        label: r
      };
    });

    const { errors, projects, isTrackEdit } = this.props;
    const { project } = this.state;

    return (
      <div
        className={classnames('sidebar', {
          'sidebar--open': this.props.trackIsOpen
        })}
      >
        <div className="sidebar__wrapper">
          <h4 className="sidebar__title">
            {this.props.isTrackEdit ? 'Edit track' : 'Add new track'}
          </h4>

          {this.props.errors.changeTrackError
            ? <p className="confirm__error">
                Sorry, but something gone wrong...
              </p>
            : null}

          <label className="input-headline">
            <span>Project</span>
            {errors.project
              ? <span className="error__text">
                  {errors.project}
                </span>
              : null}
          </label>

          <InputAutoSuggest
            suggestions={projects}
            fieldName="project"
            field={project}
            changeField={this.changeProject}
            needClearOnInit={!isTrackEdit}
          />

          <label className="input-headline">
            <span>Task</span>
            {errors.task
              ? <span className="error__text">
                  {errors.task}
                </span>
              : null}
          </label>
          <textarea
            rows="6"
            value={this.state.task}
            name="task"
            onChange={this.handleInputChange}
            className={classnames('filters__textarea', {
              bgError: errors.task
            })}
            onFocus={this.handleFocusInput}
          />

          <label className="input-headline">
            <span>Work type</span>
            {errors.type_work
              ? <span className="error__text">
                  {errors.type_work}
                </span>
              : null}
          </label>
          <Select
            multi={false}
            searchable={false}
            placeholder=""
            name="type_work"
            value={this.state.type_work}
            options={workTypes}
            onChange={this.changeWorkType}
            className={classnames({
              bgErrorSelect: errors.type_work
            })}
          />

          <label className="input-headline">
            <span>Hours</span>
            {errors.hours
              ? <span className="error__text">
                  {errors.hours}
                </span>
              : null}
          </label>
          <input
            type="number"
            value={this.state.hours}
            name="hours"
            onChange={this.handleInputChange}
            className={classnames('input', {
              bgError: errors.hours
            })}
            onFocus={this.handleFocusInput}
          />

          <label className="input-headline">
            <span>Date</span>
            {errors.date_task
              ? <span className="error__text">
                  {errors.date_task}
                </span>
              : null}
          </label>
          <DatePicker
            dateFormat="DD-MM-YYYY"
            selected={this.state.trackDate}
            onChange={this.handleChangeDate}
            className={classnames('datepicker', {
              bgError: errors.date_task
            })}
            onFocus={this.handleDateFocus}
          />
        </div>
        <div className="sidebarBtns">
          <button
            className="sidebarBtns__btn sidebarBtns__btn--save"
            onClick={this.handleSaveTrack}
          >
            Save
          </button>
          <button
            className="sidebarBtns__btn sidebarBtns__btn--cancel"
            onClick={this.handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    trackIsOpen,
    workTypes,
    trackData,
    isTrackEdit,
    projects
  } = state.trackReducer;
  const { errors, token } = state.generalReducer;

  return {
    trackIsOpen,
    workTypes,
    trackData,
    isTrackEdit,
    errors,
    token,
    projects
  };
}

export default connect(mapStateToProps, {
  toggleChangeTrack,
  createTrack,
  updateTrack,
  clearErrorField,
  getLibraries
})(SingeTrack);
