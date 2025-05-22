import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card-bg border-t border-white/5 py-6">
      <div className="page-container flex justify-center">
        <Link 
          to="/guidelines" 
          className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors duration-300"
        >
          <BookOpen size={20} />
          <span>Platform Guidelines</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;