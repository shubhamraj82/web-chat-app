import { Children, createContext, useEffect, useState } from "react";
import axios from "axios";
import toast  from "react"
import {io} from "socket.io-client"

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ Children }) => {

    const [token,setToken]= useState(localStorage.getItem("token"));
    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [socket,setSocket] = useState(null);

    // check if user is authenticated and if so , set the user data and connect the socket
    const checkAuth=async()=>{
        try {
            const {data} = await axios.get("/api/auth/check-auth");
            if(data.success){
                setAuthUser(data.user)
                connectsocket(data.user);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // login function to handle user authentication and socket connection --> this is for both login and register
    const login = async (state,credentials)=>{
        try {
            const {data} =  await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                connectsocket(data.userData);
                axios.defaults.headers.common["token"]=data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // logout function to handle user logout and socket disconnection
    const logout=()=>{
        localStorage.removeItem("token");
        setAuthUser(nulll);
        setToken(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"]=null;
        toast.success("Logged out successfully");
        socket.disconnect();
    }

    // update profile function to handle user profile updates


    // connect socket function to handle socket connection and online users updates
    const connectsocket =(userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendURL,{
            query:{
                userId:userData._id,
            }
        });
        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket
    }

    return (
        <AuthContext.Provider value={value}>
            {Children}
        </AuthContext.Provider>
    )
}