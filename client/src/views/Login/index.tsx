// React Imports
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Material UI Imports
import { Box, Button } from "@mui/material";
// React Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Utils Imports
import { onKeyDown } from "../../utils";
// Redux Imports
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setUser } from "../../redux/auth/authSlice";
// Component Imports
import { Heading, SubHeading } from "../../components/Heading";
import DotLoader from "../../components/Spinner/dotLoader";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import * as Yup from "yup";
import { Cookies } from "react-cookie";

const loginSchema = Yup.object().shape({
  userName: Yup.string().required("User Name is required").nullable(),
  password: Yup.string().required("Password is required").nullable(),
});

interface ISLoginForm {
  userName: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  // states
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISLoginForm>({
    userName: "",
    password: "",
  });

  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const hideShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  // Sign Up Api Bind
  const [loginUser, { isLoading }] = useLoginMutation();

  const LoginHandler = async (data: ISLoginForm) => {
    const payload = {
      username: data.userName,
      password: data.password,
    };

    try {
      const user: any = await loginUser(payload);

      if (user?.data?.status) {
        dispatch(setUser(user?.data));
        cookies.set("user", JSON.stringify(user?.data), { path: "/" });
        localStorage.setItem("user", JSON.stringify(user?.data));
        navigate("/");
      }
      if (user?.error) {
        setToast({
          ...toast,
          message: user?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("SignUp Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  return (
    <>
      <div className="bg-blue-50 h-screen flex items-center">
        <Box className="w-full max-w-md mx-auto  rounded-xl ">
          <Heading
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Login
          </Heading>
          <Box>
            <Formik
              initialValues={formValues}
              onSubmit={(values: ISLoginForm) => {
                LoginHandler(values);
              }}
              validationSchema={loginSchema}
            >
              {(props: FormikProps<ISLoginForm>) => {
                const { values, touched, errors, handleBlur, handleChange } =
                  props;

                return (
                  <Form onKeyDown={onKeyDown} style={{ width: "100%" }}>
                    <Box sx={{ height: "95px", marginTop: "20px" }}>
                      <SubHeading sx={{ marginBottom: "5px" }}>
                        User Name
                      </SubHeading>
                      <PrimaryInput
                        type="text"
                        label=""
                        name="userName"
                        placeholder="User Name"
                        value={values.userName}
                        helperText={
                          errors.userName && touched.userName
                            ? errors.userName
                            : ""
                        }
                        error={
                          errors.userName && touched.userName ? true : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Box>
                    <Box sx={{ height: "95px" }}>
                      <SubHeading sx={{ marginBottom: "5px" }}>
                        Password
                      </SubHeading>
                      <PrimaryInput
                        type={showPassword ? "text" : "password"}
                        label=""
                        name="password"
                        placeholder="Password"
                        value={values.password}
                        helperText={
                          errors.password && touched.password
                            ? errors.password
                            : ""
                        }
                        error={
                          errors.password && touched.password ? true : false
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onClick={hideShowPassword}
                        endAdornment={
                          showPassword ? (
                            <AiOutlineEye color="disabled" />
                          ) : (
                            <AiOutlineEyeInvisible color="disabled" />
                          )
                        }
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        marginTop: "15px",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={isLoading}
                        sx={{
                          padding: "5px 30px",
                          textTransform: "capitalize",
                          margin: "0 0 20px 0",
                        }}
                      >
                        {isLoading ? (
                          <DotLoader color="#fff" size={12} />
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        margin: "0 0 10px 0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Don't Have an account?
                      <Box
                        sx={{
                          marginLeft: "5px",
                          color: "#70b3f3",
                          fontWeight: 500,
                          cursor: "pointer",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                        onClick={() => {
                          navigate("/signup");
                        }}
                      >
                        Sign Up
                      </Box>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </div>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default Login;
