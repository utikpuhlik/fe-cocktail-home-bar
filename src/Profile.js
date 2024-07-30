import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${URL}/auth/me`, {
          withCredentials: true, // Важно для отправки и получения cookies
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [URL]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      {/* Добавьте любые другие поля, которые хотите отобразить */}
    </div>
  );
};

export default Profile;
