import React from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class RangeSkill extends React.Component {
  classesGrad = {
    junior: 'slider--yellow',
    middle: 'slider--orange',
    senior: 'slider--red'
  };

  state = {
    value: 0,
    max: 10,
    min: 0,
    classRange: this.classesGrad.junior
  };

  updateColor = val => {
    if(val <= 3) {
      this.setState({classRange: this.classesGrad.junior});
    } else if(val > 3 && val <= 7) {
      this.setState({classRange: this.classesGrad.middle});
    } else if(val > 6 && val <= 10) {
      this.setState({classRange: this.classesGrad.senior});
    }
  };

  componentDidMount() {
    const { value } = this.props;
    this.setState({ value: value });
    this.updateColor(value);
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.handleChange(value);
  }

  handleChange = (value) => {
    this.setState({
      value: value
    });
    this.updateColor(value);
  };

  render() {
    const { value, max, min, classRange } = this.state;
    const { user_id, onSave, skillId } = this.props;

    return (
      <div className='slider'>
        <Slider
          className={classRange}
          min={min}
          max={max}
          value={value}
          tooltip={false}
          onChange={this.handleChange}
          onChangeComplete={onSave.bind(null, {
            user_id: user_id,
            skill_id: skillId,
            value: value
          })}
        />
        <div className="value">{value}</div>
      </div>
    )
  }
}

export default RangeSkill;