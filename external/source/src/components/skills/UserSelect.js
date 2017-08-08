import React from "react";
import Select from "react-select";

export const UsersSelect = function(props) {
  return (
    <Select
      className="select-user"
      multi={false}
      placeholder=""
      options={props.users}
      value={props.state_selected_user}
      labelKey="first_name"
      valueKey="id"
      onChange={props.changeState.bind(null, "user")}
    />
  );
};