// Button.jsx
import React from 'react';

const Button = ({ onClickHandler, value, title }) => {
  // Now simply call the onClickHandler with the value directly
  const handleClick = () => {
    onClickHandler(value); // Pass value directly
  };

  return (
    <button onClick={handleClick} className="px-4 py-1 border text-base hover:bg-secondary hover:text-white">
      {title}
    </button>
  );
};

export default Button;
