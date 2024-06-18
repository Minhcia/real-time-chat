import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../lib/userStore";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatstore";
import { async } from "@firebase/util";


const Chat = ()=>{
    const [chat, setChat] = useState();
    const [emoji, setEmoji] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState({
        file: null,
        url: "",
    })
    const handleEmoji = e =>{
        console.log(e)
        setText((prev) => prev + e.emoji);
        setEmoji(false)
    }

    const handleImg = (e) => {
        if (e.target.files[0]) {
          setImg({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0]),
          });
        }
      };

    console.log(text)

    const endRef = useRef(null);
    useEffect(()=>{
        endRef.current.scrollIntoView({behavior:"smooth"})
    },[chat]);
    console.log(chat)

    const {chatId, user,isCurrentUserBlock, isReceiverBlock} = useChatStore()
    
    useEffect (()=>{
        const unSub = onSnapshot(doc(db, "chats", chatId), (res)=>{
            setChat(res.data())
        })

        return () =>{
            unSub()
        }
    },[chatId])

    
    

    const {currentUser,} = useUserStore()

    const handleSend = async () => {
        if (text === "") return;
    
        let imgUrl = null;
    
        try {
          if (img.file) {
            imgUrl = await upload(img.file);
          }
    
          await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
              senderId: currentUser.id,
              text,
              createdAt: new Date(),
              ...(imgUrl && { img: imgUrl }),
            }),
          });
    
          const userIDs = [currentUser.id, user.id];
    
          userIDs.forEach(async (id) => {
            const userChatsRef = doc(db, "userchats", id);
            const userChatsSnapshot = await getDoc(userChatsRef);
    
            if (userChatsSnapshot.exists()) {
              const userChatsData = userChatsSnapshot.data();
    
              const chatIndex = userChatsData.chats.findIndex(
                (c) => c.chatId === chatId
              );
    
              userChatsData.chats[chatIndex].lastMessage = text;
              userChatsData.chats[chatIndex].isSeen =
                id === currentUser.id ? true : false;
              userChatsData.chats[chatIndex].updatedAt = Date.now();
    
              await updateDoc(userChatsRef, {
                chats: userChatsData.chats,
              });
            }
          });
        } catch (err) {
          console.log(err);
        } finally{
        setImg({
          file: null,
          url: "",
        });
    
        setText("");
        }
      };

    return(
        <div className="chat">
            Chat
            <div className="top">
                <div className="user">
                    <img src= {currentUser.avatar ||  "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{currentUser.username}</span>
                    </div>
                    <div className="icons">
                    <input type="file" id="file" style={{display:"none"}} onChange={handleImg}></input>
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                    </div>
                </div>

            </div>
            <div className="center">
                    {chat?.messages?.map((message) => (
                        <div
                            className={
                            message.senderId === currentUser?.id ? "messageown" : "message"
                            }
                            key={message?.createAt}
                        >
                            <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            {/* <span>{format(message.createdAt.toDate())}</span> */}
                                </div>
                            </div>
                ))}
                            {img.url && (
                                <div className="messageown">
                                    <div className="texts">
                                    <img src={img.url} alt="" />
                                    </div>
                                </div>
                            )}
                    <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <input className="text" 
                placeholder="Type your message" 
                onChange={e => setText(e.target.value)}
                value = {text}
                >
                
                </input>
                <div className="icons">
                <label htmlFor="file">
                    <img src="./img.png" alt="" />
                </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
            disabled = {isCurrentUserBlock || isReceiverBlock}
          />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <div className="emoji">
                    <img src="" onClick={()=>setEmoji((prev)=>!prev) }/>
                    <EmojiPicker open={emoji} onEmojiClick={handleEmoji}/>
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlock || isReceiverBlock}>Send</button>
            </div>
            
        </div>
    )
}

export default Chat;
