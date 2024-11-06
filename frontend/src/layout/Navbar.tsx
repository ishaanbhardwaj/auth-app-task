import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import logo from '../assets/images/logo.svg';
import './Navbar.css';
import { useUserName } from '../hooks/useUserName';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { userName, isLoading } = useUserName();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/signin');
      addToast('success', 'Logged out successfully');
    } catch (error) {
      addToast('error', 'Failed to logout. Please try again.');
    }
  };
  const start = (
    <img src={logo} alt="Logo" className="w-2rem ml-2" />
  );

  const end = (
    <Button
      icon="pi pi-sign-out"
      className="p-button-danger border-circle"
      onClick={handleLogout}
    />
  );

  return (
    <div className="fixed top-2 left-0 right-0 z-5 navbar-container p-4">
      <Menubar
        className="shadow-2 border-round-6xl"
        start={start}
        model={[{ 
          label: isLoading 
            ? 'Welcome' 
            : `Welcome to the application${userName ? `, ` : ''}${userName ? userName : ''}`,
          template: (item) => (
            <span>
              {isLoading ? item.label : (
                <>
                  Welcome to the application
                  {userName && <>, <strong>{userName}</strong></>}
                </>
              )}
            </span>
          ),
          className: 'text-xl font-medium font-italic ml-4' 
        }]}
        end={end}
      />
    </div>
  );
};

export default Navbar;