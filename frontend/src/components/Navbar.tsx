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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userInitial, setUserInitial] = useState('U');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user name for initial
  useEffect(() => {
    const fetchUserInitial = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'Tuklascope-user', currentUser.uid));
          let name = '';
          if (userDoc.exists()) {
            name = userDoc.data().name || '';
          }
          setUserInitial((name && name.trim().length > 0) ? name.trim().charAt(0).toUpperCase() : 'U');
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserInitial('U');
        }
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
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
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

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
  };

  const handleProfileNavigation = () => {
    setProfileOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setProfileOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <nav style={{
      width: '100%',
      background: '#fff',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: isMobile ? '0 1rem' : '0 2rem',
      height: 64,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ 
        fontWeight: 700, 
        fontSize: isMobile ? 20 : 28, 
        color: '#0B3C6A', 
        marginRight: isMobile ? 16 : 32, 
        letterSpacing: 1 
      }}>
        Tuklascope
      </div>

      {/* Desktop Navigation Links */}
      {!isMobile && (
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
      )}

      {/* Streak Counter - Hidden on mobile */}
      {!isMobile && (
        <div style={{ color: '#FF6B2C', fontWeight: 700, fontSize: 18, marginRight: 24 }}>
          12 <span style={{ color: '#1F2937', fontWeight: 400, fontSize: 16 }}>day streak!</span>
        </div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 24,
            color: '#0B3C6A',
            cursor: 'pointer',
            padding: 8,
            marginLeft: 'auto',
            marginRight: 12,
            zIndex: mobileMenuOpen ? 1001 : 'auto',
            position: mobileMenuOpen ? 'relative' : 'static'
          }}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Profile Dropdown */}
      <div
        ref={profileRef}
        style={{
          position: 'relative',
          width: isMobile ? 36 : 40,
          height: isMobile ? 36 : 40,
          borderRadius: '50%',
          background: '#FF6B2C',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: isMobile ? 16 : 20,
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={handleProfileClick}
      >
        {userInitial}
        {profileOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: 8,
            background: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            zIndex: 1000,
            minWidth: 160,
            overflow: 'hidden'
          }}>
            <div 
              style={{ 
                padding: '12px 18px', 
                cursor: 'pointer',
                borderBottom: '1px solid #F3F4F6',
                transition: 'background-color 0.2s',
                color: '#1F2937',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: 1.4
              }} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={handleProfileNavigation}
            >
              Profile
            </div>
            <div 
              style={{ 
                padding: '12px 18px', 
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                color: '#1F2937',
                fontWeight: 500,
                fontSize: 14,
                lineHeight: 1.4
              }} 
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            background: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            zIndex: 99,
            padding: '1rem',
            borderTop: '1px solid #E5E7EB',
          }}
        >
          {/* Streak Counter for Mobile */}
          <div style={{ 
            color: '#FF6B2C', 
            fontWeight: 700, 
            fontSize: 16, 
            marginBottom: 16,
            textAlign: 'center',
            padding: '8px 0',
            borderBottom: '1px solid #E5E7EB'
          }}>
            12 <span style={{ color: '#1F2937', fontWeight: 400, fontSize: 14 }}>day streak!</span>
          </div>
          
          {/* Mobile Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {navLinks.map((link) => (
              <div
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  color: location.pathname === link.path ? '#FF6B2C' : '#1F2937',
                  cursor: 'pointer',
                  padding: '16px 0',
                  borderBottom: '1px solid #F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span style={{ color: '#FF6B2C', fontSize: 16 }}>●</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile-specific CSS */}
      <style>{`
        @media (max-width: 768px) {
          .navbar {
            padding: 0 1rem !important;
          }
          
          .navbar-logo {
            font-size: 20px !important;
            margin-right: 16px !important;
          }
          
          .mobile-menu {
            position: fixed !important;
            top: 64px !important;
            left: 0 !important;
            right: 0 !important;
            background: #fff !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.10) !important;
            z-index: 99 !important;
            padding: 1rem !important;
            border-top: 1px solid #E5E7EB !important;
          }
          
          .mobile-nav-link {
            padding: 16px 0 !important;
            border-bottom: 1px solid #F3F4F6 !important;
            font-size: 18px !important;
          }
          
          .mobile-nav-link:last-child {
            border-bottom: none !important;
          }
          
          .profile-button {
            width: 36px !important;
            height: 36px !important;
            font-size: 16px !important;
          }
        }
        
        @media (max-width: 480px) {
          .navbar-logo {
            font-size: 18px !important;
          }
          
          .mobile-nav-link {
            font-size: 16px !important;
            padding: 14px 0 !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 