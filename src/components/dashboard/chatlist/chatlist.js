import React, { Component } from "react";
import Deleting from "react-loading";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { firestore, auth, storage } from "../../firebase/firebase";
import IconButton from "@material-ui/core/IconButton";
import Room from "../chatroom/chatroom";
import NewChatForm from "../newchatform/newchatform";
import More from "./more/more";
import TextField from "@material-ui/core/TextField";
import { Grid, Divider } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import "./chatlist.css";

export default class chatlist extends Component {
  state = {
    profilePicture: "",
    showChatScreen: false,
    name: "",
    index: "",
    showNewChatForm: false,
    searchValue: "",
    longPress: false,
    showMoreOptions: false,
    docid: "",
    delMsgIndex: "",
    deleting: false,
  };

  componentDidMount = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        this.props.history.push("/login");
      } else {
        await this.getProfileData(user.uid);
      }
    });
  };

  getProfileData = async (ID) => {
    await firestore
      .collection("users")
      .where("id", "==", ID)
      .get()
      .then(async (snapshot) => {
        await snapshot.forEach(async (obj) => {
          const data = obj.data();

          await this.setState({ profilePicture: data.URL, name: data.name });
        });
      });
  };

  selectChat = async (index) => {
    const { longPress } = this.state;

    if (!longPress) {
      await this.setState({ index: index, showChatScreen: true });
    }
  };

  logOutUser = async () => {
    const confirm = window.confirm("Are You Sure To Logout ?");
    const { userEmail } = this.props;

    if (confirm) {
      await this.onlineStatusUpdate(userEmail);
      await auth.signOut();
      this.props.history.push("/");
    }
  };

  onlineStatusUpdate = async (email) => {
    const id = await firestore
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        return snapshot.docs.map((ob) => ob.id)[0];
      });

    await firestore.collection("users").doc(id).update({
      isonline: false,
    });
  };

  backButtonClick = async () => {
    this.setState({ showChatScreen: false, showNewChatForm: false });

    await this.props.searchChat("");
  };

  searchChat = async () => {
    const { searchValue } = this.state;

    await this.props.searchChat(searchValue.toLowerCase());
  };

  touchStart = async (chat, index) => {
    this.buttonPressTimer = setTimeout(async () => {
      await this.setState({
        longPress: true,
        showMoreOptions: true,
        docid: chat.docid,
        delMsgIndex: index,
      });
    }, 1000);
  };

  touchEnd = async () => {
    clearTimeout(this.buttonPressTimer);
    var timer = setTimeout(async () => {
      await this.setState({ longPress: false });
    }, 400);
  };

  moreOptions = async (type) => {
    const { docid, delMsgIndex } = this.state;
    const tempData = this.props.chats[delMsgIndex].messages;

    switch (type) {
      case "delete":
        const confirm = window.confirm("Are You Sure To Delete?");

        if (confirm) {
          await this.setState({ deleting: true, showMoreOptions: false });
          await tempData.map(async (obj) => {
            if (obj.type === "img") {
              await storage.ref(`chats/${docid}/${obj.imgnm}`).delete();
            }
          });

          await firestore.collection("chats").doc(docid).delete();
        }

        await this.setState({ docid: "", deleting: false });
        break;

      case "cancel":
        await this.setState({ showMoreOptions: false });
        break;
    }
  };

  render() {
    return (
      <div class="chatlist-main">
        <div>
          {this.state.showNewChatForm === false ? (
            <div>
              {this.state.showChatScreen === false ? (
                <div>
                  <div className="home-profile">
                    <img
                      className="mb-1"
                      onClick={() => this.props.history.push("/profile")}
                      src={
                        this.state.profilePicture ||
                        "https://moorestown-mall.com/noimage.gif"
                      }
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "50%",
                        margin: "3px",
                        display: "block",
                      }}
                    />
                    <IconButton
                      aria-label="account od current user"
                      color="inherit"
                    >
                      <ExitToAppIcon
                        color="primary"
                        onClick={() => this.logOutUser()}
                      ></ExitToAppIcon>
                    </IconButton>
                  </div>
                  <div className="new-chat">
                    <p>New Chat</p>
                    <AddCircleIcon
                      color="primary"
                      fontSize="large"
                      onClick={() => this.setState({ showNewChatForm: true })}
                    ></AddCircleIcon>
                  </div>
                  <div className="input-field">
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item className="grid-item">
                        <TextField
                          className="search-field"
                          type="search"
                          placeholder="Search Chats"
                          id="outlined-search"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={async (e) => {
                            await this.setState({
                              searchValue: e.target.value,
                            });
                            await this.searchChat();
                          }}
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Divider />
                  </div>

                  {this.props.chats.length > 0 ? (
                    <div className="overflow">
                      {this.props.chats.map((chat, index) => (
                        <div
                          className=" text-light p-2 mt-2 pointer"
                          style={{
                            backgroundColor: "#0575E6",
                            borderRadius: "20px",
                          }}
                          onClick={() => this.selectChat(index)}
                          onTouchStart={() => this.touchStart(chat, index)}
                          onTouchEnd={() => this.touchEnd()}
                          onMouseDown={() => this.touchStart(chat, index)}
                          onMouseUp={() => this.touchEnd()}
                          onMouseLeave={() => this.touchEnd()}
                          key={index}
                        >
                          <div className="chat-list">
                            <img
                              className="chat-list-img mr-3"
                              src={this.props.allUserData
                                .map((list) => {
                                  if (
                                    list.email ===
                                    (chat.users[0] !== this.props.userEmail
                                      ? chat.users[0]
                                      : chat.users[1])
                                  ) {
                                    return list.URL;
                                  } else {
                                    return "";
                                  }
                                })
                                .join("")
                                .trim("")}
                              style={{ border: "1px solid white" }}
                            />

                            <div>
                              <h4 style={{ textAlign: "left" }}>
                                {this.props.allUserData.map((list) => {
                                  if (
                                    list.email ===
                                    (chat.users[0] !== this.props.userEmail
                                      ? chat.users[0]
                                      : chat.users[1])
                                  ) {
                                    return list.name;
                                  }
                                })}
                              </h4>

                              <h6>
                                {chat.messages[chat.messages.length - 1]
                                  .type === "text" ? (
                                  <span className="mr-1">
                                    {chat.messages.length > 0
                                      ? chat.messages[
                                          chat.messages.length - 1
                                        ].message.substring(0, 10)
                                      : ""}
                                  </span>
                                ) : (
                                  <span className="mr-1">Image</span>
                                )}
                                <span>
                                  <h6 style={{ display: "inline-block" }}>
                                    {chat.messages.length > 0
                                      ? chat.messages[chat.messages.length - 1]
                                          .time
                                      : ""}
                                  </h6>
                                </span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3>Sorry No Chats. Let's Start New One</h3>
                    </div>
                  )}
                </div>
              ) : (
                <Room
                  chatData={this.props.chats[this.state.index]}
                  allUserData={this.props.allUserData}
                  userEmail={this.props.userEmail}
                  backButtonClick={() => this.backButtonClick()}
                  profilePicture={
                    this.state.profilePicture ||
                    "https://moorestown-mall.com/noimage.gif"
                  }
                />
              )}
            </div>
          ) : (
            <NewChatForm
              userEmail={this.props.userEmail}
              backButtonClick={() => this.backButtonClick()}
              allUserData={this.props.allUserData}
              history={this.props.history}
            />
          )}
        </div>

        {this.state.showMoreOptions ? (
          <More moreOptions={(type) => this.moreOptions(type)} />
        ) : null}

        {this.state.deleting ? (
          <div
            className="center p-3 shadow"
            style={{ borderRadius: "20px", backgroundColor: "white" }}
          >
            <center>
              <Deleting type="bars" color="black" height={100} width={100} />
            </center>
            <h4>Deleting...</h4>
            <h6>Please Dont Close The App</h6>
          </div>
        ) : null}
      </div>
    );
  }
}
