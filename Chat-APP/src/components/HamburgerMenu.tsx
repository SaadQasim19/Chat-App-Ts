import React from 'react';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClick: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClick }) => {
  return (
    <button 
      className="hamburger-menu" 
      onClick={onClick}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      title={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      <div className={`hamburger-lines ${isOpen ? 'open' : ''}`}>
        <span className="line line1"></span>
        <span className="line line2"></span>
        <span className="line line3"></span>
      </div>
    </button>
  );
};

export default HamburgerMenu;
