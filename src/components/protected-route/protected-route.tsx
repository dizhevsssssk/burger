import React from 'react';
import { useSelector } from '../../services/store';
import {
  selectIsAuthChecked,
  selectUserData
} from '../../services/slices/userSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  isPublicRoute?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  isPublicRoute,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUserData);

  if (!isAuthChecked && user !== null) {
    return <Preloader />;
  }

  if (!isPublicRoute && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (isPublicRoute && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
