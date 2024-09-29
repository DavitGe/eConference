import { Button, Flex, Input } from "antd";
import Layout from "../../components/Layout/Layout";
import { ProtectedWrapper } from "./protected.styled";
import { RiVideoAddLine } from "react-icons/ri";
import { useCallback, useEffect, useState } from "react";
import ilustration from "./ilustration.svg";
import { useSocket } from "../../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { authProvider } from "../../context/auth";

const ProtectedPage = () => {
  const [meetingLink, setMeetingLink] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", {
        room: meetingLink,
        email: authProvider.email,
      });
    },
    [meetingLink, socket]
  );

  const handleCreateRoom = useCallback(() => {
    const newRoomId = uuid();
    socket.emit("room:join", { room: newRoomId, email: authProvider.email });
  }, []);

  const handleJoinRoom = useCallback(
    (data: any) => {
      const { room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  return (
    <div style={{ backgroundColor: "#FFF", minHeight: "100vh" }}>
      <Layout isNavDisplayed={false} protectedPage />
      <ProtectedWrapper onSubmit={handleSubmitForm}>
        <div>
          <h1>
            Video calls and <span>meetings</span> for everyone
          </h1>
          <p>
            Connect, collaborate, and celebrate from anywhere with eConference.
          </p>
          <Flex gap={12} style={{ marginTop: 64 }}>
            <Button
              type="primary"
              icon={<RiVideoAddLine style={{ marginTop: 4 }} fontSize={18} />}
              style={{ height: 46, fontSize: 18, fontWeight: 500 }}
              onClick={handleCreateRoom}
            >
              New Meeting
            </Button>
            <Input
              placeholder="Enter a code or link"
              size="large"
              style={{ width: 312 }}
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
            <Button
              type="text"
              htmlType="submit"
              size="large"
              disabled={!meetingLink?.length}
            >
              Join
            </Button>
          </Flex>
        </div>
        <img src={ilustration} alt="Illustration" />
      </ProtectedWrapper>
    </div>
  );
};

export default ProtectedPage;
