import React from 'react';
import classnames from 'classnames';
import numeraljs from 'numeraljs';

// Helpers
import { getTop, getFirstLetter } from './../../shared/HelpService';

class TracksStatistic extends React.Component {
  render() {
    const { tracks, view, activeUser } = this.props;
    const hours = tracks ? tracks.reduce((total, t) => total + +t.hours, 0) : 0;
    const declined = tracks ? tracks.filter(i => i.status === 'Declined').length : 0;

    const topProject = getTop(tracks, 'project');
    const topWorker = getTop(tracks, 'user_id', 'first_name', 'last_name');

    return (
      <div
        className={classnames('statistic', {
          'statistic--block': view === 'block'
        })}
      >
        <div className="statistic__wrapper">
          <span className="statistic__number">
            {tracks.length ? tracks.length : 0}
          </span>
          <span className="statistic__label">tracks</span>
        </div>

        <div className="statistic__wrapper">
          <span className="statistic__number">
            {numeraljs(hours).format('0.00')}
          </span>
          <span className="statistic__label">hours</span>
        </div>

        <div className="statistic__wrapper">
          <span className="statistic__number">
            {declined}
          </span>
          <span className="statistic__label">declined</span>
        </div>

        <div className="statistic__wrapper">
          <span className="statistic__number">
            {topProject ? topProject.project : '-'}
          </span>
          <span className="statistic__label">top project</span>
        </div>

        {activeUser.roles && activeUser.roles.includes('owner')
          ? <div className="statistic__wrapper">
              <span className="statistic__number">
                {topWorker ? `${getFirstLetter(topWorker.first_name)}. ${topWorker.last_name}` : '-'}
              </span>
              <span className="statistic__label">top worker</span>
            </div>
          : null}

      </div>
    );
  }
}

export default TracksStatistic;
