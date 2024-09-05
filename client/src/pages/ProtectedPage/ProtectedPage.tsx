import { Button, Flex, Input } from "antd";
import Layout from "../../components/Layout/Layout";
import { ProtectedWrapper } from "./protected.styled";
import { RiVideoAddLine } from "react-icons/ri";
import { useState } from "react";
import ilustration from "./ilustration.svg";

const ProtectedPage = () => {
  const [meetingLink, setMeetingLink] = useState("");
  return (
    <div style={{ backgroundColor: "#FFF", minHeight: "100vh" }}>
      <Layout isNavDisplayed={false} protectedPage />
      <ProtectedWrapper>
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
            <Button type="text" size="large" disabled={!meetingLink?.length}>
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
