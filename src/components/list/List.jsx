import ChatList from "./chatlist/ChatList";
import "./list.css";
import "./userInfo/UserInfo"
import UserInfo from "./userInfo/UserInfo";



const List = ()=>{
    return(
        <div className="list">
            List
            <UserInfo/>
            <ChatList/>
        </div>
    )
}

export default List;
