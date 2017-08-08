import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';

// Actions
import { clearErrorField } from './../../store/actions/generalActions';

class InputAutoSuggest extends React.Component {
  state = {
    suggestions: [],
    activeSuggestion: 0,
    field: ''
  };

  // Set field state if it edit and clean when add
  componentWillReceiveProps(nextProps) {
    if (!this.state.field && nextProps.field && !nextProps.needClearOnInit) {
      this.setState({ field: nextProps.field });
    } else if (!nextProps.field && nextProps.needClearOnInit) {
      this.setState({ field: '' });
    }
  }

  // On chage input get suggestion and change field from parent
  autoSuggest = e => {
    const value = e.target.value;

    if (value.length < 2) {
      this.setState({ field: value, suggestions: [] });
      return false;
    }

    const { suggestions, changeField } = this.props;
    const sgs = suggestions
      .filter(s => value && s.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      .map(s => {
        return {
          value: s,
          active: false
        };
      });

    this.setState({ suggestions: sgs, field: value, activeSuggestion: 1 });
    changeField(value);
  };

  // On mouse hover suggestion set it active
  onSuggestionHover = index => {
    this.setState({ activeSuggestion: index + 1 });
  };

  // Clear suggestions when click outside input
  handleSuggestionBlur = () => {
    setTimeout(() => {
      this.setState({ suggestions: [] });
    }, 100);
  };

  // Focus input
  handleFocusInput = e => {
    this.props.clearErrorField(e.target.name);
  };

  // On mouse click on suggestion select it as active and change parent field
  onSuggestionClick = () => {
    const { activeSuggestion, suggestions } = this.state;
    const value = suggestions[activeSuggestion - 1].value;

    this.setState({
      field: value,
      suggestions: []
    });
    this.props.changeField(value);
  };

  // Handle keyboard actions for autosuggest great experience
  handleKeyDown = event => {
    const { suggestions, activeSuggestion } = this.state;
    const key = event.keyCode;
    const suggestionElement = this.refs.suggestions;

    if (!suggestions.length) return false;

    switch (key) {
      // On arrow down press
      case 40:
        event.preventDefault();

        if (activeSuggestion === suggestions.length) {
          suggestionElement.scrollTop = 0;
        } else if (activeSuggestion >= 5) {
          const top = suggestionElement.scrollTop;
          suggestionElement.scrollTop = top + 26;
        }

        this.setState({
          activeSuggestion: this._findActiveSuggestion(true)
        });
        break;

      // On arrow up press
      case 38:
        event.preventDefault();

        if (activeSuggestion === 1) {
          suggestionElement.scrollTop = 1000;
        } else if (activeSuggestion < 5) {
          const top = suggestionElement.scrollTop;
          suggestionElement.scrollTop = top - 26;
        }

        this.setState({
          activeSuggestion: this._findActiveSuggestion(false)
        });
        break;

      // On enter press
      case 13:
        const value = suggestions[activeSuggestion - 1].value;
        this.setState({
          field: value,
          suggestions: []
        });
        this.props.changeField(value);
        break;

      // On escape press
      case 27:
        this.setState({ suggestions: [] });
        break;

      default:
        break;
    }
  };

  // Calculate active suggestion after keyboard action
  _findActiveSuggestion = positive => {
    const { activeSuggestion, suggestions } = this.state;

    if (positive) {
      return activeSuggestion
        ? activeSuggestion === suggestions.length ? 1 : activeSuggestion + 1
        : 1;
    } else {
      return activeSuggestion
        ? activeSuggestion === 1 ? suggestions.length : activeSuggestion - 1
        : suggestions.length;
    }
  };

  render() {
    const { suggestions, activeSuggestion, field } = this.state;
    const { errors, fieldName } = this.props;

    const Suggestions = (
      <div className="suggestions__values" ref="suggestions">
        {suggestions.map((sg, index) =>
          <div
            key={index}
            className={classnames('suggestions__value', {
              'suggestions__value-active': index + 1 === activeSuggestion
            })}
            onMouseEnter={() => {
              this.onSuggestionHover(index);
            }}
            onClick={this.onSuggestionClick}
          >
            {sg.value}
          </div>
        )}
      </div>
    );

    return (
      <div className="relative">
        <input
          type="text"
          value={field}
          onChange={this.autoSuggest}
          className={classnames('input suggestions', {
            bgError: errors[fieldName]
          })}
          onFocus={this.handleFocusInput}
          onBlur={this.handleSuggestionBlur}
          onKeyDown={this.handleKeyDown}
        />
        {suggestions.length ? Suggestions : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.generalReducer.errors
  };
}

export default connect(mapStateToProps, { clearErrorField })(InputAutoSuggest);
