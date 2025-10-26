import { Children, createContext,useContext,useEffect,useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const chatContext=createContext();

export const ChatProvider=({Children})=>{

    const [messages,setMessages]=useState([]);
    const [users,setUsers]=useState([]);
    const [selectedChatUser,setSelectedChatUser]=useState(null);
    const [unseenMessages,setUnseenMessages]=useState({});

    const {socket,axios} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers=async()=>{
        try {
            const {data}=await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to get messages with a particular user
    const getMessages=async(userId)=>{
        try {
            const {data} =await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to send message to a particular user
    const sendMessage=async(messageData)=>{
        try {
            const {data}=await axios.post(`/api/messages/send/${selectedChatUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.message]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages=async()=>{
        if(!socket) return ;

        socket.on("newMessage", (newMessage)=>{
            if(selectedChatUser && newMessage.senderId === selectedChatUser._id){
                newMessage.seen= true;
                setMessages((prevMessages)=>[...prevMessages,newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages,[newMessage.senderId]: prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
                }))
            }
        })
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages=()=>{
        if(!socket) return;
        socket.off("newMessage");
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=>unsubscribeFromMessages();
    },[socket,selectedChatUser]);



    const value={
        messages,users,selectedChatUser,setSelectedChatUser,getUsers,sendMessage,unseenMessages,setUnseenMessages, getMessages, setMessages

    }
    return (
        <chatContext.Provider value={value}>
            {Children}
        </chatContext.Provider>
    )
}