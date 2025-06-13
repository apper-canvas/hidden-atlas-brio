import React from 'react';
import { motion } from 'framer-motion'; // framer-motion is already a dependency

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, disabled, ...rest }) => {
  const Component = whileHover || whileTap ? motion.button : 'button';

  const motionProps = {};
  if (whileHover) motionProps.whileHover = whileHover;
  if (whileTap) motionProps.whileTap = whileTap;

  return (
    <Component
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...motionProps}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Button;