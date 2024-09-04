import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { Button, Flex } from "antd";
import { LayoutContainer } from "./layout.styles";

function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <LayoutContainer>
        <Flex align="center" gap={24}>
          <Logo height={40} width={200} />
          <nav>
            <ul>
              <li>
                <a href="/app/home">Home</a>
              </li>
              <li>
                <a href="/app/about">About</a>
              </li>
              <li>
                <a href="/app/contact">Contact</a>
              </li>
            </ul>
          </nav>
        </Flex>
        <Flex align="center" gap={16}>
          <Button
            style={{ height: 40 }}
            onClick={() => {
              navigate("/auth/login");
            }}
          >
            <span style={{ fontSize: 16 }}>Log In</span>
          </Button>
          <Button
            style={{ height: 40 }}
            onClick={() => {
              navigate("/auth/register");
            }}
            type="primary"
          >
            <span style={{ fontSize: 16 }}>Sign Up Free</span>
          </Button>
        </Flex>
      </LayoutContainer>
      <Outlet />
    </>
  );
}

export default Layout;
