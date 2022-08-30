import {React, useContext, useEffect, useState} from 'react';
import {useLocation} from 'wouter';
import {UserContext} from "../App";
const Home = () =>{
    const [,setLocation] = useLocation();
    const { user,setUser} = useContext(UserContext);
    return( 
        <div>
            Hello World
        </div>
    )
}
export default Home;