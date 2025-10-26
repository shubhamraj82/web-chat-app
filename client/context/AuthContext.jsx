import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token,setToken]= useState(localStorage.getItem("token"));
    const [authUser,setAuthUser] = useState(null);
    const [onlineUsers,setOnlineUsers] = useState([]);
    const [socket,setSocket] = useState(null);

    // check if user is authenticated and if so , set the user data and connect the socket
    const checkAuth=async()=>{
        // Only check auth if token exists
        if(!token) return;
        
        try {
            const {data} = await axios.get("/api/auth/check-auth");
            if(data.success){
                const mappedUser = {
                    ...data.user,
                    fullName: data.user.fullname
                };
                setAuthUser(mappedUser)
                connectsocket(mappedUser);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // Clear invalid token
            localStorage.removeItem("token");
            setToken(null);
        }
    }

    // login function to handle user authentication and socket connection --> this is for both login and register
    const login = async (state,credentials)=>{
        try {
            const {data} =  await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                const mappedUser = {
                    ...data.userData,
                    fullName: data.userData.fullname
                };
                setAuthUser(mappedUser);
                connectsocket(mappedUser);
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
        setAuthUser(null);
        setToken(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"]=null;
        toast.success("Logged out successfully");
        if(socket?.connected){
            socket.disconnect();
        }
    }

    // update profile function to handle user profile updates
    const updateProfile = async (body)=>{
        try {
            const {data}= await axios.put("/api/auth/update-profile", body);
            if(data.success){
                const mappedUser = {
                    ...data.user,
                    fullName: data.user.fullname
                };
                setAuthUser(mappedUser);
                toast.success("profile updated successfully");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }


    // connect socket function to handle socket connection and online users updates
    const connectsocket =(userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendURL,{
            query:{
                userId:userData._id,
            }
        });
        setSocket(newSocket);
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
        socket,
        login,
        logout,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}