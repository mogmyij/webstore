import React from 'react';
import { COMPANY_NAME } from '@/config/constants';

const Footer = () => {
  return (
    <footer className="bg-white text-custom-gray py-4 px-6 text-center">
      <p>© 2025 {COMPANY_NAME}. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
