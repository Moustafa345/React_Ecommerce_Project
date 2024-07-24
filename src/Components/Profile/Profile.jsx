import React, { useEffect, useState , useContext } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingScreen from './../LoadingScreen/LoadingScreen';
import { UserDataContext } from './../../Context/UserDataContext';
import jwtDecode from 'jwt-decode';
import {DOMAIN} from "../../utils/constants";

export default function Profile() {

  const {userToken} = useContext(UserDataContext);
  const [userData, setuserData] = useState(null);
  const [loading, setLoading] = useState(true);

  let decodedToken = jwtDecode(userToken);

async function getuserData(id){
try {

  const {data} = await axios.get(`${DOMAIN}/api/v1/users/${id}`)
  setuserData(data.data);  
  setLoading(false);
} catch (error) {
  console.log(error);
}
}

useEffect(()=>{
  getuserData(decodedToken.id)
},[])

return (
  <>
    {loading ?  <LoadingScreen />

    : 
      <>
    
      <div className="row shadow-lg rounded-top w-75 mx-auto p-2 pt-3 pb-4 mt-5">
        <div className="col-md-9">
          <p className='fw-bolder fs-4 text-main'>Name:</p>
          <p className='fw-bold'>{userData.name}</p>
        </div>
        <div className="col-md-3 text-center">
          <Link to={'/changename'}>
            <button className=' btn bg-main text-white w-100'>Edit Name</button>
          </Link>  
        </div>
      </div>

      <div className="row shadow-lg w-75 mx-auto p-2 pb-4 pt-3">
        <div className="col-md-9">
          <p className='fw-bolder fs-4 text-main'>Email:</p>
          <p className='fw-bold'>{userData.email}</p>
        </div>
        <div className="col-md-3 text-center">
          <Link to={'/changeemail'}>
            <button className=' btn bg-main text-white w-100'>Edit Email</button>
          </Link>
        </div>
      </div>

      <div className="row shadow-lg w-75 mx-auto p-2 pt-3 pb-4">
        <div className="col-md-9">
          <p className='fw-bolder fs-4 text-main'>Password:</p>
          <p className='fw-bold'>********</p>
        </div>
        <div className="col-md-3  text-center">
          <Link to={'/changepassword'}>
            <button className=' btn bg-main text-white w-100'>Edit Password</button>
          </Link>
        </div>
      </div>

      <div className="row shadow-lg w-75 mx-auto p-2 pt-3 pb-4">
        <div className="col-md-9">
          <p className='fw-bolder fs-4 text-main'>Phone Number:</p>
          <p className='fw-bold'>{userData.phone}</p>
        </div>
        <div className="col-md-3 text-center">
          <Link to={'/changenumber'}>
            <button className=' btn bg-main text-white w-100'>Edit Number</button>
          </Link> 
        </div>
      </div>

      <div className="row shadow-lg rounded-bottom w-75 mx-auto p-2 pb-4 pt-3 mb-5">
        <div className="col-md-9">
          <p className='fw-bolder fs-4 text-main'>Addresses:</p>
          {userData.addresses.map((address, idx) => (
            <p  className='fw-bold' key={idx}>
              - {address.details} - {address.city}
            </p>
          ))}
        </div>
        <div className="col-md-3  text-center">
          <Link to={'/editaddresses'}>
            <button className=' btn bg-main text-white w-100'>Edit Addresses</button>
          </Link>
        </div>
      </div>
    </>
    }
  </>
);
    }