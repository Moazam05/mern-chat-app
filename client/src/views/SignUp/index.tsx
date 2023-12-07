// React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// React Icons
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// Utils Imports
import { onKeyDown } from "../../utils";
// Validation Schema
import { signupSchema } from "./components/validationSchema";
// MUI Imports
import { Box, Button } from "@mui/material";
// Custom Imports
import { Heading, SubHeading } from "../../components/Heading";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import DotLoader from "../../components/Spinner/dotLoader";
// Redux API
import { useSignupMutation } from "../../redux/api/authApiSlice";

interface ISSignupForm {
  userName: string;
  password: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  // states
  const [showPassword, setShowPassword] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formValues, setFormValues] = useState<ISSignupForm>({
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
  const [signupUser, { isLoading }] = useSignupMutation();

  const signupHandler = async (data: ISSignupForm) => {
    const payload = {
      username: data.userName,
      password: data.password,
    };

    try {
      const user: any = await signupUser(payload);

      if (user?.data?.status) {
        setToast({
          ...toast,
          message: "User created successfully",
          appearence: true,
          type: "success",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
      <Box className="bg-blue-50 h-screen flex items-center">
        <Box className="w-full max-w-md mx-auto  rounded-xl ">
          <Heading
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Sign Up
          </Heading>
          <Box>
            <Formik
              initialValues={formValues}
              onSubmit={(values: ISSignupForm) => {
                signupHandler(values);
              }}
              validationSchema={signupSchema}
            >
              {(props: FormikProps<ISSignupForm>) => {
                const { values, touched, errors, handleBlur, handleChange } =
                  props;

                return (
                  <Form onKeyDown={onKeyDown}>
                    <Box
                      sx={{
                        marginTop: "20px",
                        height: "95px",
                      }}
                    >
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
                        marginTop: "20px",
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
                          margin: "10px 0 20px 0",
                        }}
                      >
                        {isLoading ? (
                          <DotLoader color="#fff" size={12} />
                        ) : (
                          "Sign Up"
                        )}
                      </Button>
                    </Box>
                    <Box className="flex items-center mb-2">
                      Already have an account?
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
                          navigate("/login");
                        }}
                      >
                        Login
                      </Box>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Box>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default SignUp;
