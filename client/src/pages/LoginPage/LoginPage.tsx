import axios from "axios";
import { API_URL } from "../../utils/http";
import { LoginPageContainer, LoginPageWrapper } from "./loginpage.styled";
import { Button, Divider, Form, FormProps, Input } from "antd";

type fieldTypes = {
  email: string;
  password: string;
};

function LoginPage() {
  const onFinish: FormProps<fieldTypes>["onFinish"] = (values) => {
    axios.post(API_URL + "/auth/login", {
      email: values.email,
      password: values.password,
    });
  };
  return (
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
  );
}

export default LoginPage;
