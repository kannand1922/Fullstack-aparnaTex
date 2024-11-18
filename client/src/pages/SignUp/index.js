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
import "./signup.scss";

const SignupForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "User", // Add role field
    },

    onSubmit: (values) => {
      fetchData(values);
    },
  });

  const [show, setShow] = useState(false);

  const fetchData = async (values) => {
    try {
      const response = await userService.getSignupDetails(values);
      console.log(response);
      setShow(false);
      if (response) {
        localStorage.setItem("authToken", 12);
        localStorage.setItem("role", response.user.role);
        localStorage.setItem("id", response.user.id);
        navigate("/home");
      }
    } catch (error) {
      console.log(error.response.data.error);
      setShow(true);
    }
  };

  return (
    <div style={{ width: "75%" }}>
      <form onSubmit={formik.handleSubmit}>
        <InputLabel className="inputLabel">Name</InputLabel>
        <InputBase
          style={{ padding: "0px 10px" }}
          id="name"
          name="name"
          type="text"
          className="inputBase"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
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
        {/* <InputLabel className="inputLabel">Role</InputLabel>
        <FormControl fullWidth>
          <Select
            id="role"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Role" }}
          >
            <MenuItem value="" disabled>
              Select Role
            </MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
        </FormControl>
        <br /> */}

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
          SignUp
        </Button>
      </form>
      <div className="registerDiv">
        Already have an account?
        <span
          style={{ color: "#383838", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </div>
    </div>
  );
};

function Signup() {
  return (
    <div className="signuppage">
      <div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
          }}
        >
          SignUp
        </div>
        <div className="signupConatainer">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export default Signup;
