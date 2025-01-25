// app/protected/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const ProtectedPage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      setMessage('You are not logged in.');
    } else {
      setMessage('Welcome to the protected page!');
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1>{message}</h1>
    </div>
  );
};

export default ProtectedPage;
