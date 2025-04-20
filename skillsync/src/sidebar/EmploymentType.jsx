import React from 'react'
import { InputField } from '../Components/InputField'

const EmploymentType = ({handleChange}) => {
  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Types of Employment</h4>
      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="test"  // Ensure all radio buttons have the same name
            id="all"
            value="all"
            onChange={handleChange}
          />
          <span className="checkmark"></span> Any experience
        </label>
        <InputField
          handleChange={handleChange}
          value="Full-time"
          title="Full-time"
          name="test"  // Same name for grouping
        />
        <InputField
          handleChange={handleChange}
          value="temporary"
          title="Temporary"
          name="test"  // Same name for grouping
        />
                <InputField
          handleChange={handleChange}
          value="Part-time"
          title="Part-time"
          name="test"  // Same name for grouping
        />
      </div>
    </div>
  )
}

export default EmploymentType