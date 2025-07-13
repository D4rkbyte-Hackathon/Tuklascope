import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut, db, doc, getDoc } from '../database/firebase';

const gradeLevels = [
  'Senior High (Grades 11-12)',
  'Junior High (Grades 7-10)',
  'Elementary (Grades 1-6)'
];

const Navbar = () => {
  const [grade, setGrade] = useState(gradeLevels[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userInitial, setUserInitial] = useState('U');

  // Fetch user name for initial
  useEffect(() => {
    const fetchUserInitial = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'Tuklascope-user', currentUser.uid));
        let name = '';
        if (userDoc.exists()) {
          name = userDoc.data().name || '';
        }
        setUserInitial((name && name.trim().length > 0) ? name.trim().charAt(0).toUpperCase() : 'U');
      } else {
        setUserInitial('U');
      }
    };
    fetchUserInitial();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/home' },
    { label: 'Skill Tree', path: '/skill-tree' },
    { label: 'Pathways', path: '/pathways' },
    { label: 'Pathfinder', path: '/pathfinder' },
    { label: 'Profile', path: '/profile' },
    { label: 'Leaderboard', path: '/leaderboard' }
  ];

  return (
    <nav style={{
      width: '100%',
      background: '#fff',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 2rem',
      height: 64,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ fontWeight: 700, fontSize: 28, color: '#0B3C6A', marginRight: 32, letterSpacing: 1 }}>Tuklascope</div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: 32, flex: 1 }}>
        {navLinks.map((link) => (
          <div
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              fontWeight: 600,
              fontSize: 18,
              color: location.pathname === link.path ? '#FF6B2C' : '#1F2937',
              cursor: 'pointer',
              borderBottom: location.pathname === link.path ? '3px solid #FF6B2C' : 'none',
              paddingBottom: 2
            }}
          >
            {link.label}
          </div>
        ))}
      </div>

      {/* Streak Counter */}
      <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 18, marginRight: 24 }}>
        12 <span style={{ color: '#1F2937', fontWeight: 400, fontSize: 16 }}>day streak!</span>
      </div>

      {/* Profile Dropdown */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#FF6B2C',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 20,
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setProfileOpen((open) => !open)}
      >
        {userInitial}
      </div>
      {profileOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 48,
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          zIndex: 10,
          minWidth: 160
        }}>
          <div style={{ padding: '12px 18px', cursor: 'pointer' }} onClick={() => { setProfileOpen(false); navigate('/profile'); }}>Profile</div>
          <div style={{ padding: '12px 18px', cursor: 'pointer' }} onClick={async () => {
            const auth = getAuth();
            await signOut(auth);
            setProfileOpen(false);
            navigate('/');
          }}>Logout</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 