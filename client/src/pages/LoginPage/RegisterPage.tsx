import axios from "axios";
import { LoginPageContainer, LoginPageWrapper } from "./loginpage.styled";
import { Button, Divider, Form, FormProps, Input } from "antd";
import { API_URL } from "../../utils/http";
import useMessage from "antd/es/message/useMessage";
import { useNavigate } from "react-router-dom";
import { authProvider } from "../../context/auth";

type fieldTypes = {
  username: string;
  email: string;
  password: string;
  repeatPassword?: string;
};

function RegisterPage() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = useMessage();
  const navigate = useNavigate();

  const onFinish: FormProps<fieldTypes>["onFinish"] = (values) => {
    axios
      .post(API_URL + "/auth/register", {
        email: values.email,
        password: values.password,
        username: values.username,
      })
      .then(({ data }) => {
        authProvider.signin(data.username, data.email);
        messageApi.open({
          type: "success",
          content: "User registered successfully",
        });
        navigate("/protected");
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "User registration failed",
        });
      });
  };

  return (
    <>
      {contextHolder}
      <LoginPageWrapper>
        <LoginPageContainer>
          <Form onFinish={onFinish} name="register" form={form}>
            <h1>Sign up to eConference</h1>
            <Divider />
            <label>Username</label>
            <Form.Item<fieldTypes>
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
              name={"username"}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
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
            <label>Repeat Password</label>
            <Form.Item<fieldTypes>
              name={"repeatPassword"}
              rules={[
                {
                  validator(_, value) {
                    if (value !== form.getFieldValue("password")) {
                      return Promise.reject("Passwords do not match");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="Repeat your password" type="password" />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Continue with Email
            </Button>
          </Form>
        </LoginPageContainer>
      </LoginPageWrapper>
    </>
  );
}

export default RegisterPage;
