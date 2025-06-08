import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8 rounded-t-lg shadow-inner">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} ShikshaSetu. All rights reserved.</p>
        <p className="text-xs mt-1">Empowering education through connection.</p>
      </div>
    </footer>
  );
}
