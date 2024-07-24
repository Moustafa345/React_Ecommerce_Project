import axios from "axios";
import { createContext } from "react";
import {DOMAIN} from "../../src/utils/constants";

export let UserDataContext = createContext(); // Creating a context for user data

export default function UserContextProvider(props) {
  // Component for managing user data and providing related functions

  async function getuserData(id) {
    // Function for getting user data by ID
    try {
      const { data } = await axios.get(
        `${DOMAIN}/api/v1/users/${id}`
      );
      return data;
    } catch (error) {
      return error;
    }
  }

  let userToken = localStorage.getItem("userToken"); // Getting the user token from local storage
  let headers = { token: userToken }; // Creating headers object with the user token

  return (
    <UserDataContext.Provider value={{ getuserData, headers, userToken }}>
      {props.children}
    </UserDataContext.Provider>
  );
}
