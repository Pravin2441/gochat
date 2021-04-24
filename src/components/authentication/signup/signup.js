import React, { Component } from "react";
import Loading from "react-loading";
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core'
import { auth, firestore } from "../../firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import SignupImg from "../../../img/signup.png";
import "./signup.css";

export default class signup extends Component {
  state = {
    name: "",
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

  createUser = async () => {
    const { name, email, password } = this.state;

    this.setState({ loading: true });

    const exists = await this.checkForUniqueName(name);

    if (name.length >= 15) {
      toast.warn("Name Length Must Be 1-15");
      return;
    }

    try {
      if (name && email && password) {
        if (exists) {
          await auth
            .createUserWithEmailAndPassword(email, password)
            .then(async (result) => {
              await firestore.collection("users").add({
                name,
                id: result.user.uid,
                email,
                password,
                URL: "https://moorestown-mall.com/noimage.gif",
                description: "",
                imgname: "",
                isonline: false,
                blocklist: [],
                isverify: false,
              });
            })
            .catch((e) => {
              alert(e);
            });

          await auth.currentUser.sendEmailVerification();

          toast.success("User Created Successfully Check Email For Verification");
          this.setState({ loading: false });

          await auth.signOut();

          await this.props.history.push("login");
        } else {
          toast.error("Please Choose Other Name This Is Already Taken");
          this.setState({ loading: false });
        }
      } else {
        toast.error("Please Enter Valid Data");
        this.setState({ loading: false });
      }
    } catch (e) {
      alert(e);
      this.setState({ loading: false });
    }
  };

  checkForUniqueName = async (name) => {
    const exists = await (await firestore.collection("users").get()).docs
      .map((docs) => docs.data().name)
      .includes(name);

    return !exists;
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
          <div className="center signup-container shadow p-5 ">
            {/* row container starting here */}

            {this.state.loading === false ? (
              <div className="row  ">
                {/* first col starting here */}
                <div className="col-lg-6 col-md-6 left flex2">
                  <img className="signup-img" src={SignupImg} />
                </div>

                <div className="col-lg-6 col-md-6 right flex2">
                  <h1 style={{ fontWeight: "600", color: "#555456" }}>Signup</h1>
                  <div className="login-inputs">

                    <TextValidator
                      variant='outlined'
                      autoComplete='off'
                      type="text"
                      errorMessages={['Field is required']}
                      fullWidth
                      margin='normal'
                      label='Name'
                      validators={['required']}
                      value={this.state.name}
                      onChange={(e) => {
                        this.setState({ name: e.target.value.toLowerCase() });
                      }}

                    />

                    <TextValidator

                      type="email"
                      value={this.state.email}
                      onChange={(e) => {
                        this.setState({ email: e.target.value.toLowerCase() });
                      }}
                      label='Email'
                      type='email'
                      margin='normal'
                      fullWidth
                      variant='outlined'
                      autoComplete='off'
                      validators={["required", "isEmail"]}
                      errorMessages={['Field is required', 'Email is not valid']}
                    />

                    <TextValidator
                      type="password"
                      value={this.state.password}
                      onChange={(e) => {
                        this.setState({ password: e.target.value });
                      }}
                      label='Password'
                      fullWidth
                      margin='normal'
                      autoComplete='off'
                      validators={['required']}
                      errorMessages={['Field is required']}
                      variant='outlined'
                    />
                    <br />
                    <Button
                      fullWidth
                      variant="contained"
                      style={{
                        background:
                          "linear-gradient(45deg,#FE6B8B 30%,#FF8E53 90%)",
                        outline: "none",
                        color: "#fff",
                      }}
                      onClick={() => this.createUser()}
                    >
                      Signup
                  </Button>
                    <div className="mt-3">
                      <Link to="/forget" style={{ color: "black" }}>
                        <b className="text-secondary">Forget Password</b>
                      </Link>
                    </div>

                    <div style={{ fontWeight: "700" }}>Or</div>

                    <div className="">
                      <Link to="/login" style={{ color: "black" }}>
                        <b className="text-secondary">Already Account</b>
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
                    <center>
                      <Loading type="bars" color="black" height={100} width={100} />
                    </center>

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
