import React from "react";
import { ChildrenSkill } from "./ChildrenSkill";

export const ParentSkill = function(props) {
  const { parentSkill, selectedUser, saveSkillUser } = props;

  return (
    <div className="skills-wrapper">
      <span className="skills__parent">
        {parentSkill.name}
      </span>
      <div className="skills__children__outer">
        {parentSkill.children.map((skill, index) => (
          <ChildrenSkill
            key={index}
            skill={skill}
            selectedUser={selectedUser}
            saveSkillUser={saveSkillUser}
          />
        ))}
      </div>
    </div>
  );
};