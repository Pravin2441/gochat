import React, { Component } from "react";
import Loading from "react-loading";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { auth, firestore } from "../../firebase/firebase";
import { Button } from "@material-ui/core";
import "./login.css";
import LoginImg from "../../../img/login.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class login extends Component {
  state = {
    email: "",
    password: "",
    loading: false,
  };

  componentDidMount = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user && auth.currentUser.emailVerified) {
        await this.setState({ isLoging: true });

        this.props.history.push("/chat");
      }
    });
  };

  loginUser = async () => {
    const { email, password } = this.state;

    this.setState({ loading: true });

    try {
      if (email && password) {
        var data = await auth.signInWithEmailAndPassword(email, password);

        if (auth.currentUser.emailVerified) {
          let user = data.user;

          if (user) {
            toast.success("Successfully Login");

            await this.props.history.push("/chat");
          }
        } else {
          await auth.currentUser.sendEmailVerification();

          toast.info(
            "First Please Check Email For Verification Then Login Again"
          );

          auth.signOut();
          localStorage.clear();
        }

        this.setState({ loading: false });
      } else {
        toast.error("Please Enter Valid Data");
        this.setState({ loading: false });
      }
    } catch (e) {
      alert(e);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div
        style={{
          background: "linear-gradient(45deg,#FE6B8B 30%,#FF8E53 90%)",
          height: "100vh",
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <ValidatorForm
          onError={(errors) => {
            for (const err of errors) {
              console.log(err.props.errorMessages[0]);
            }
          }}
        >
          {/* main login container start */}

          <div className="center login-container shadow p-5 ">
            {/* row container starting here */}
            {this.state.loading === false ? (
              <div className="row  ">
                {/* first col starting here */}
                <div className="col-lg-6 col-md-6 left flex">
                  <img src={LoginImg} className="login-img" />
                </div>

                <div className="col-lg-6 col-md-6 right flex2">
                  <h1 style={{ fontWeight: "600", color: "#555456" }}>Login</h1>
                  <div className="login-inputs">
                    <TextValidator
                      variant="outlined"
                      autoComplete="off"
                      validators={["required", "isEmail"]}
                      value={this.state.email}
                      onChange={(e) =>
                        this.setState({ email: e.target.value.toLowerCase() })
                      }
                      errorMessages={[
                        " Field is required",
                        "Email is not valid",
                      ]}
                      fullWidth
                      margin="normal"
                      label="Email"
                    />

                    <TextValidator
                      type="password"
                      variant="outlined"
                      autoComplete="off"
                      fullWidth
                      margin="normal"
                      label="Password"
                      type="password"
                      validators={["required"]}
                      errorMessages={[" Field is required"]}
                      onChange={(e) =>
                        this.setState({ password: e.target.value })
                      }
                      onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                          this.loginUser();
                        }
                      }}
                    />

                    <br />

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      style={{
                        background:
                          "linear-gradient(45deg,#FE6B8B 30%,#FF8E53 90%)",
                        outline: "none",
                        color: "#fff",
                      }}
                      onClick={() => this.loginUser()}
                    >
                      Login
                    </Button>
                    <div className="mt-3">
                      <Link to="/forget" style={{ color: "black" }}>
                        <b className="text-secondary">Forget Password</b>
                      </Link>
                    </div>

                    <div style={{ fontWeight: "700" }}>Or</div>

                    <div className="">
                      <Link to="/signup" style={{ color: "black" }}>
                        <b className="text-secondary">Create Account</b>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* first col ending here */}
              </div>
            ) : (
              <center>
                <div
                  className="shadow p-3"
                  style={{ backgroundColor: "#E7E7E7" }}
                >
                  <Loading type="bars" color="black" height={100} width={100} />

                  <h3>Processing...</h3>
                </div>
              </center>
            )}

            {/* row container ending here */}
          </div>

          {/* main login container end */}
        </ValidatorForm>
      </div>
    );
  }
}
