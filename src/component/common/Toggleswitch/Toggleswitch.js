import React, { useEffect } from "react";
import "./Toggleswitch.css";

const ToggleSwitch = ({label, providerId, checked, onChange }) => {

  useEffect(() => {
    console.log("checked changed:", checked);
  }, [checked]);

  return (
    <div className="container" key={providerId}>
      {label}{" "}
      <div className="toggle-switch">
        <input
          type="checkbox"
          className="checkbox"
          id={label}
          checked={checked}          // ✅ correct
          onChange={(e) => onChange(providerId, e.target.checked)}
        />
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
