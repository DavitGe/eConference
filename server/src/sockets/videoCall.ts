import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const videoCall = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  console.log("A user connected:", socket.id);

  // Handle offer signaling
  socket.on("offer", (data) => {
    console.log("Received offer:", data);
    socket.broadcast.emit("offer", data); // Broadcast the offer to other peers
  });

  // Handle answer signaling
  socket.on("answer", (data) => {
    console.log("Received answer:", data);
    socket.broadcast.emit("answer", data); // Broadcast the answer to other peers
  });

  // Handle ICE candidate signaling
  socket.on("ice-candidate", (data) => {
    console.log("Received ICE candidate:", data);
    socket.broadcast.emit("ice-candidate", data); // Broadcast ICE candidates
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};
