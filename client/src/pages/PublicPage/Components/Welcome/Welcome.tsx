import { Button } from "antd";
import { WelcomeContainer } from "./welcome.styled";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <WelcomeContainer>
      <h2>
        Enhance workplace <span>Communication</span> with eCommerce!
      </h2>
      <p>
        Bring teams together and quickly go from big ideas to execution with a
        workspace that makes easier every step.
      </p>
      <Button
        type="primary"
        onClick={() => {
          navigate("/auth/register");
        }}
      >
        Get Started
      </Button>
    </WelcomeContainer>
  );
};

export default Welcome;
