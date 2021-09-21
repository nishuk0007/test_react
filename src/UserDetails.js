import React, { useEffect } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

function UserDetails() {
  const params = useParams();
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const fetchUser = async() => {
      try{
        const res = await axios.get(`${process.env.REACT_APP_API}/users/${params.id}`)
        const resUser = res.data;
        setUser(resUser);
      } catch(e) {
        console.log(e);
      }
    } 
    fetchUser();
  }, [params.id])
  return (
    <div className="user-details-container">
      <div>
        Name : {user.name}
      </div>
      <div className="mt-2">
        Username : {user.username}
      </div>
      <div className="mt-2">
        Is Active : {user.is_active ? 'Yes' : 'No'}
      </div>
      <div className="mt-2">
        Is Staff : {user.is_staff ? 'Yes' : 'No'}
      </div>
      <div className="mt-2">
        Is Superuser : {user.is_superuser ? 'Yes' : 'No'}
      </div>
    </div>
  )
}

export default UserDetails;
