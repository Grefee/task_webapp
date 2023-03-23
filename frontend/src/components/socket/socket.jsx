import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const IP = process.env.REACT_APP_IP_ADD;
const ipPort = process.env.REACT_APP_IP_PORT;

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io.connect(`http://${IP}:${ipPort}`,{});
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
