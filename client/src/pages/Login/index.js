import { useFormik } from "formik";
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  InputBase,
  Button,
} from "@mui/material";
import { useState } from "react";
import userService from "../../api/auth";
import { useNavigate } from "react-router";
import "./login.scss";

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "", // Added role field
    },
    onSubmit: (values) => {
      fetchData(values);
    },
  });

  const [show, setShow] = useState(false);

  const fetchData = async (values) => {
    try {
      const response = await userService.getLoginDetails(values);
      setShow(false);
      if (response) {
        localStorage.setItem("authToken", 12);
        localStorage.setItem("role", response.user.role);
        localStorage.setItem("id",response.user.id)
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
      setShow(true);
    }
  };

  return (
    <div style={{ width: "75%" }}>
      <form onSubmit={formik.handleSubmit}>
        <InputLabel className="inputLabel">Email</InputLabel>
        <InputBase
          style={{ padding: "0px 10px" }}
          id="email"
          name="email"
          type="email"
          className="inputBase"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <InputLabel className="inputLabel">Password</InputLabel>
        <InputBase
          style={{ padding: "0px 10px" }}
          id="password"
          name="password"
          type="password"
          className="inputBase"
          onChange={formik.handleChange}
          value={formik.values.password}
        />

        <br />
        {show && (
          <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
            Invalid Credentials
          </div>
        )}
        <Button
          variant="contained"
          type="submit"
          style={{
            backgroundColor: "#383838",
            borderColor: "transparent",
            width: "100%",
            height: "50px",
            marginTop: "15px",
          }}
        >
          Login
        </Button>
      </form>
      <div className="register">
        Don't have an account?
        <span
          style={{ color: "#383838", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Register
        </span>{" "}
      </div>
    </div>
  );
};

function Login() {
  return (
    <div className="LoginPage">
      <div>
        <div
          style={{ textAlign: "center", fontWeight: "bold", color: "white" }}
        >
          Login
        </div>
        <div className="LoginContainer">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default Login;
