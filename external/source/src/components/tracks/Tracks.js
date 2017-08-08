import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

// Components
import Track from './Track';
import Filters from './Filters';
import ChangeTrack from './ChangeTrack';
import TracksStatistic from './TracksStatistic';

// Actions
import {
  getTracks,
  toggleTrackFilters,
  clearTrackFilters,
  toggleChangeTrack,
  setVars
} from './../../store/actions/trackActions';
import { clearErrors } from './../../store/actions/generalActions';

// Helpers
import { showClearFilters } from './../../shared/HelpService';

// Icons
import FaPlus from 'react-icons/lib/fa/plus';
import FaFilter from 'react-icons/lib/fa/filter';
import FaTimes from 'react-icons/lib/fa/ban';

class Tracks extends React.Component {
  state = { showFilters: false };

  componentDidMount() {
    let { token, filters } = this.props;
    this.props.getTracks(token, filters);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showFilters: showClearFilters(nextProps.filters) });

    if (!isEqual(nextProps.filters, this.props.filters)) {
      this.props.getTracks(nextProps.token, nextProps.filters);
    }

    if (nextProps._need_upd_list) {
      this.props.setVars({ _need_upd_list: false });
      this.props.getTracks(nextProps.token, nextProps.filters);
    }
  }

  openFilters = () => {
    this.props.toggleTrackFilters();
  };

  clearFilters = () => {
    this.props.clearTrackFilters();
  };

  openChangeTrack = () => {
    this.props.toggleChangeTrack(true);
    this.props.clearErrors();
  };

  render() {
    const { showFilters } = this.state;
    const { bgColor, token, tracks, view, activeUser, showStatistic } = this.props;

    const trackComponents = tracks.map((t, i) => {
      return <Track token={token} trackData={t} key={i} view={view} bgColor={bgColor} />;
    });

    return (
      <div className="container" style={{ background: bgColor }}>
        {showStatistic ? <TracksStatistic tracks={tracks} view={view} activeUser={activeUser} /> : null}
        {trackComponents}
        <Filters activeUser={activeUser} />
        <ChangeTrack />
        <div className="mainBtns">
          <button className="mainBtns__btn" onClick={this.openChangeTrack} style={{ color: bgColor }}>
            <FaPlus />
          </button>
          <button className="mainBtns__btn" onClick={this.openFilters} style={{ color: bgColor }}>
            <FaFilter />
          </button>
          {showFilters
            ? <button className="mainBtns__btn" onClick={this.clearFilters} style={{ color: bgColor }}>
                <FaTimes />
              </button>
            : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { tracks, filters, view, _need_upd_list } = state.trackReducer;
  let { bgColor, token, showStatistic } = state.generalReducer;
  let { activeUser } = state.userReducer;

  return {
    _need_upd_list,
    tracks,
    filters,
    view,
    bgColor,
    token,
    activeUser,
    showStatistic
  };
}

export default connect(mapStateToProps, {
  getTracks,
  toggleTrackFilters,
  clearTrackFilters,
  toggleChangeTrack,
  clearErrors,
  setVars
})(Tracks);
