import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import List from './components/list/List';
import Detail from './components/detail/Detail';
import Chat from './components/chat/Chat';
import Login from './components/login/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import {useUserStore} from './lib/userStore';
import { useChatStore } from './lib/chatstore';


const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      {/* <Notification /> */}
    </div>
  );
};

export default App;