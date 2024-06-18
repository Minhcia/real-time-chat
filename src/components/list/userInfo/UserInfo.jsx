import { useUserStore } from "../../../lib/userStore";
import "./userInfo.css";

const UserInfo = ()=>{
    const {currentUser} = useUserStore();
    return(
        <div className="userinfo">
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt="none"/>
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="" alt="none"/>  
                <img src="./video.png"/>
                <img src=""/>
            </div>
        </div>
    )
}


export default UserInfo