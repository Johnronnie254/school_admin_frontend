import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { addNotification } from '../store/slices/uiSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      dispatch(loginSuccess(data));
      dispatch(addNotification({
        message: 'Successfully logged in',
        type: 'success',
      }));
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'An error occurred'));
      dispatch(addNotification({
        message: 'Login failed',
        type: 'error',
      }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addNotification({
      message: 'Successfully logged out',
      type: 'info',
    }));
  };

  return {
    ...auth,
    login,
    logout: handleLogout,
  };
};

export default useAuth; 