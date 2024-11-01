import axios from "axios";
import { API_URL } from "../../utils/http";
import { LoginPageContainer, LoginPageWrapper } from "./loginpage.styled";
import { Button, Divider, Form, FormProps, Input } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../context/auth";

type fieldTypes = {
  email: string;
  password: string;
};

function LoginPage() {
  const [messageApi, contextHolder] = useMessage();
  const navigate = useNavigate();

  const onFinish: FormProps<fieldTypes>["onFinish"] = (values) => {
    axios
      .post("/api/auth/login", {
        email: values.email,
        password: values.password,
      }, {withCredentials: true})
      .then(({ data }) => {
        authProvider.signin(data.username, data.email);
        messageApi.open({
          type: "success",
          content: "User logged in successfully",
        });
        navigate("/protected");
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "User login failed",
        });
      });
  };
  return (
    <>
      {contextHolder}
      <LoginPageWrapper>
        <LoginPageContainer>
          <Form onFinish={onFinish}>
            <h1>Sign in to eConference</h1>
            <Divider />
            <label>Email</label>
            <Form.Item<fieldTypes>
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email!",
                },
              ]}
              name={"email"}
            >
              <Input placeholder="Enter your email address" />
            </Form.Item>
            <label>Password</label>
            <Form.Item<fieldTypes>
              name={"password"}
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input placeholder="Enter your password" type="password" />
            </Form.Item>
            <a>Forgot password?</a>

            <Button type="primary" htmlType="submit">
              Continue with Email
            </Button>
          </Form>
        </LoginPageContainer>
      </LoginPageWrapper>
    </>
  );
}

export default LoginPage;
