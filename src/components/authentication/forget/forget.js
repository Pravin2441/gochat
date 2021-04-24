import React, { Component } from "react";
import Loading from "react-loading";
import { Link } from "react-router-dom";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { auth } from "../../firebase/firebase";
import { Button } from "@material-ui/core";
import ForgetImg from "../../../img/forget.png";
import "./forget.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default class forget extends Component {
  state = {
    email: "",
    loading: false,
  };

  submitData = async () => {
    const { email } = this.state;

    this.setState({ loading: true });

    try {
      if (email) {
        await auth.sendPasswordResetEmail(email);

        alert("Password Reset Link Is Sent");

        this.setState({ loading: false });
      } else {
        alert("Please Enter Valid Data");
        this.setState({ loading: false });
      }
    } catch (e) {
      alert(e);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div style={{
        background: "linear-gradient(45deg,#FE6B8B 30%,#FF8E53 90%)",
        height: "100vh",
      }}>
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
          <div className="center forget-pass-container shadow p-5 ">
            {/* row container starting here */}

            {this.state.loading === false ? (
              <div className="row  ">
                {/* first col starting here */}
                <div className="col-lg-6 col-md-6 left flex">
                  <img src={ForgetImg} className="forget-pass-img" />
                </div>

                <div className="col-lg-6 col-md-6 right flex2">
                  <h1 style={{ fontWeight: "600", color: "#555456" }}>
                    Forget Password
                </h1>
                  <div className="login-inputs">
                    <br></br>
                    <TextValidator
                      variant='outlined'
                      fullWidth
                      margin='normal'
                      label='Email'
                      autoComplete='off'
                      validator={['required']}
                      type="email"
                      errorMessages={['Field is required']}
                      value={this.state.email}
                      onChange={(e) =>
                        this.setState({ email: e.target.value.toLowerCase() })
                      }
                      onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                          this.submitData();
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
                      onClick={() => this.submitData()}
                    >
                      Submit
                  </Button>
                    <div className="mt-4">
                      <Link to="/login" style={{ color: "black" }}>
                        <b className="text-secondary">Already User</b>
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
        </ValidatorForm>
        {/* main login container end */}
      </div>
    );
  }
}
