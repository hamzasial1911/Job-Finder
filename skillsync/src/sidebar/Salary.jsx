import React, { useState } from 'react';
import Button from './Button';
import { InputField } from '../Components/InputField';

const Salary = ({ handleChange, handleClick }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
    handleChange(e);
  };

  return (
    <div>
      <h4 className='text-lg font-small mb-1'>Salary</h4>
      <div className="flex mb-4">
        <Button onClickHandler={handleClick} value="Hourly" title="Hourly" />
        <Button onClickHandler={handleClick} value="Monthly" title="Monthly" />
        <Button onClickHandler={handleClick} value="Yearly" title="Yearly" />
      </div>
      <div>
        <label className="sidebar-label-container">
          <input
            type="radio"
            name="salary"
            id="all"
            value="all"
            // checked={selectedValue === 'all'}
            onChange={handleRadioChange}
          />
          <span className="checkmark"></span> All
        </label>
        <InputField
          handleChange={handleChange}
          value={30}
          title="<30000K"
          name="salary"
          checked={selectedValue === '30000'}
          onChange={handleRadioChange}
        />
        <InputField
          handleChange={handleChange}
          value={50}
          title="<50000K"
          name="salary"
          checked={selectedValue === '0000'}
          onChange={handleRadioChange}
        />
        <InputField
          handleChange={handleChange}
          value={80}
          title="<80000K"
          name="salary"
          checked={selectedValue === '80000'}
          onChange={handleRadioChange}
        />
        <InputField
          handleChange={handleChange}
          value={100}
          title="<100000K"
          name="salary"
          checked={selectedValue === '100000'}
          onChange={handleRadioChange}
        />
      </div>
    </div>
  );
};

export default Salary;
