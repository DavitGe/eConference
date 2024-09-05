import { Link, Outlet, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { Button, Flex } from "antd";
import { LayoutContainer } from "./layout.styles";

interface ILayoutProps {
  isBgTransparent?: boolean;
  isNavDisplayed?: boolean;
  height?: number;
  isAuthHeader?: boolean;
  protectedPage?: boolean;
}
function Layout({
  isBgTransparent = true,
  isNavDisplayed = true,
  protectedPage = false,
  height,
  isAuthHeader,
}: ILayoutProps) {
  const navigate = useNavigate();
  const isSignUp = window.location.pathname.includes("register");

  return (
    <>
      <LayoutContainer
        isBgTransparent={isBgTransparent}
        height={height}
        isAuthHeader={isAuthHeader}
      >
        <Flex align="center" gap={24}>
          <Link to="/home">
            <Logo height={40} width={200} />
          </Link>
          {isNavDisplayed ? (
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
          ) : null}
        </Flex>
        {protectedPage ? null : (
          <Flex align="center" gap={16}>
            <Button
              style={{ height: isAuthHeader ? 46 : 40 }}
              onClick={() => {
                navigate(
                  isAuthHeader
                    ? isSignUp
                      ? "/auth/login"
                      : "/auth/register"
                    : "/auth/login"
                );
              }}
            >
              <span style={{ fontSize: isAuthHeader ? 18 : 16 }}>
                {isAuthHeader ? (isSignUp ? "Sign In" : "Sign Up") : "Log In"}
              </span>
            </Button>
            {!isAuthHeader ? (
              <Button
                style={{ height: 40 }}
                onClick={() => {
                  navigate("/auth/register");
                }}
                type="primary"
              >
                <span style={{ fontSize: 16 }}>Sign Up Free</span>
              </Button>
            ) : null}
          </Flex>
        )}
      </LayoutContainer>
      <Outlet />
    </>
  );
}

export default Layout;
