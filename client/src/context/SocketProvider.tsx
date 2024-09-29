import React, { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { API_URL } from "../utils/http";

const SocketContext = createContext<Socket<any, any> | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export const SocketProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const socket = useMemo(() => io(API_URL.slice(0, -4)), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
