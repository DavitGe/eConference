import { Outlet, useNavigate } from "react-router-dom";
import { LayoutContainer } from "./layout.styles";
import Logo from "../../components/Logo";
import { Button, Flex } from "antd";

function AuthLayout() {
  const navigate = useNavigate();
  const isSignUp = window.location.pathname.includes("register");

  return (
    <>
      <LayoutContainer>
        <Logo height={40} width={200} />
        <Flex>
          <Button
            style={{ height: 46 }}
            onClick={() => {
              isSignUp ? navigate("/auth/login") : navigate("/auth/register");
            }}
          >
            <span style={{ fontSize: 18 }}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </Button>
        </Flex>
      </LayoutContainer>
      <Outlet />
    </>
  );
}

export default AuthLayout;
