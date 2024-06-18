import "./detail.css";
import { useUserStore } from "../../lib/userStore";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatstore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";



const Detail = ()=>{
    const {currentUser} = useUserStore();
    const {chatId, user, isCurrentUserBlock, isReceiverBlock, changeBlock} = useChatStore();
    const handleBlock = async ()=>{
        if(!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc (userDocRef, {
                blocked: isReceiverBlock ? arrayRemove(user.id) : arrayUnion(user.id),
            })
            changeBlock()
        } catch (error) {
            console.log(error)
        }
    }


    return(
        <div className="detail">
            Detail
            <div className="user">
                <img src={user?.avatar || 'avatar.png'}/>
                <h2>{user?.username}</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et saepe minima suscipit est corrupti autem enim mollitia possimus nihil iste eum ad ex harum voluptas deleniti, quae illo laboriosam ab?</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat setting</span>
                        <img src="./arrowUp.png"/>
                    </div>
                </div>
                <button onClick={handleBlock}>{isCurrentUserBlock ? "You are blocked" : isReceiverBlock ? "User blocked" : "Block user"}</button>
                <button className="logout" onClick={()=>auth.signOut()} >Log Out</button>

            </div>
        </div>
    )
}

export default Detail;
