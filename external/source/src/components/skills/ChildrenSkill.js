import React from "react";
import RangeSkill from "./RangeSkill";

export const ChildrenSkill = function(props) {
  const { skill, selectedUser, saveSkillUser } = props;

  return (
    <div className="skills__children">
      - {skill.name}
      <RangeSkill
        value={skill.user_value}
        user_id={selectedUser}
        skillId={skill.id}
        onSave={saveSkillUser}
      />
    </div>
  );
};