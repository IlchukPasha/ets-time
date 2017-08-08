import React from 'react';
import { connect } from 'react-redux';

// Help service
import {
  getAllSkillsApi,
  addNewSkillApi,
  deleteSkillApi
} from './../../shared/ApiService';

// Icons
import FaPlus from 'react-icons/lib/fa/plus-circle';
import FaCircle from 'react-icons/lib/fa/circle';
import FaTrash from 'react-icons/lib/fa/trash-o';

class Skills extends React.Component {
  state = {
    skills: [],
    newSkillText: ''
  };

  componentDidMount() {
    getAllSkillsApi(this.props.token).then(resp => {
      this.setState({ skills: resp });
    });
  }

  changeNewSkillText = e => {
    this.setState({ newSkillText: e.target.value });
  };

  addNewSkill = index => {
    let skills = this.state.skills;
    skills.forEach(s => {
      s.showInput = false;
    });
    skills[index].showInput = true;
    this.setState({ skills, newSkillText: '' });
  };

  deleteSkill = id => {
    const { token } = this.props;
    deleteSkillApi(token, id).then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        getAllSkillsApi(token).then(resp => {
          this.setState({ skills: resp });
        });
      }
    });
  };

  addNewSkillHandler = index => {
    let { token } = this.props;
    let parentId = this.state.skills[index].id;

    addNewSkillApi(token, parentId, this.state.newSkillText, '').then(resp => {
      if (resp.status >= 200 && resp.status < 300) {
        getAllSkillsApi(token).then(resp => {
          this.setState({ skills: resp });
        });
      }
    });
  };

  render() {
    const allSkills = this.state.skills.map((s, index) => (
      <div key={index} className="skills-wrapper">
        <span className="skills__parent">
          <span>
            {s.name}
          </span>
          <span className="f-s-14 font-regular">
            {' - '}{s.children.length ? s.children.length : 0}
          </span>
        </span>

        {s.children.map((c, index) => (
          <div key={index} className="skills__children">
            <div className="centered p-t-5 p-b-5">
              <FaCircle />
              <span className="p-l-5 p-r-5">{c.name}</span>
              <FaTrash
                className="pointer"
                onClick={() => {
                  this.deleteSkill(c.id);
                }}
              />
            </div>
          </div>
        ))}

        {!s.showInput
          ? <button
              onClick={() => {
                this.addNewSkill(index);
              }}
              className="skills__add"
            >
              <span>+ add new skill</span>
            </button>
          : null}

        {s.showInput
          ? <div>
              <input
                type="text"
                value={this.state.newSkillText}
                onChange={this.changeNewSkillText}
                className="skillsadd__input"
              />
              <FaPlus
                className="skillsadd__btn"
                onClick={() => {
                  this.addNewSkillHandler(index);
                }}
              />
            </div>
          : null}
      </div>
    ));

    return (
      <div
        className="container skills-container"
        style={{ background: this.props.bgColor }}
      >
        {this.state.skills.length
          ? <div className="skills">
              {allSkills}
            </div>
          : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.generalReducer.token,
    users: state.userReducer.users
  };
}

export default connect(mapStateToProps, {})(Skills);
