import React from "react";
import clsx from "clsx";
import { createStyles, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Box from "@material-ui/core/Box";

import Button from "@material-ui/core/Button";

import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Copyright from "./components/Copyright";
import Header from "./components/Header";

import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import DescriptionIcon from "@material-ui/icons/Description";
import AssignmentReturnedIcon from "@material-ui/icons/AssignmentReturned";

import SettingsIcon from "@material-ui/icons/Settings";

import Avatar from "@material-ui/core/Avatar";
import Footer from "./components/Footer";
import { Redirect } from "react-router-dom";
// import Button from "@material-ui/core/Button";

const drawerWidth = 240;

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  buttondiv: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24",
    padding: "3%",
  },
  menuButton: {
    padding: "7%",
    textAlign: "center",
    display: "flex",
    width: "lg",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    // size: "medium",
    // background: "#FF0000",
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    display: "flex",
    alignItems: "center",
  },
}));

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      authenticated: false,
      pagename: "dashboard",
    };

    // console.log(this.props.username);
    // console.log(this.props.location.state.username);
  }
  // call api here to get rest of user data from backend
  // this.handleClick = this.handleClick.bind(this);

  componentWillMount() {
    if (this.props.username !== undefined) {
      this.setState({
        username: this.props.username,
        authenticated: this.props.authenticated,
      });
    }
    if (this.props.location.state !== undefined) {
      this.setState({
        username: this.props.location.state.username,
        authenticated: this.props.location.state.authenticated,
      });
    } else {
      this.setState({
        username: "",
        authenticated: false,
      });
    }
  }
  componentDidMount() {
    console.log(this.state.username);
    console.log(this.state.authenticated);
  }
  render() {
    if (this.state.authenticated === false) {
      return <h1>Not Authenticated Go to Login Page and Login</h1>;
    }
    if (this.state.pagename === "projects") {
      return (
        <Redirect
          to={{
            pathname: "/projects",
            state: {
              username: this.state.username,
              authenticated: this.state.authenticated,
            },
          }}
        />
      );
    }
    if (this.state.pagename === "tasks") {
      return (
        <Redirect
          to={{
            pathname: "/tasks",
            state: {
              username: this.state.username,
              authenticated: this.state.authenticated,
            },
          }}
        />
      );
    }
    if (this.state.pagename === "reports") {
      return (
        <Redirect
          to={{
            pathname: "/reports",
            state: {
              username: this.state.username,
              authenticated: this.state.authenticated,
            },
          }}
        />
      );
    }
    if (this.state.pagename === "analytics") {
      return (
        <Redirect
          to={{
            pathname: "/analytics",
            state: {
              username: this.state.username,
              authenticated: this.state.authenticated,
            },
          }}
        />
      );
    }
    if (this.state.pagename === "settings") {
      return (
        <Redirect
          to={{
            pathname: "/settings",
            state: {
              username: this.state.username,
              authenticated: this.state.authenticated,
            },
          }}
        />
      );
    }
    if (this.state.pagename === "profiles") {
      return (
        <Redirect
          to={{
            pathname: "/profile",
            state: {
              username: this.state.username,
              authenticated: this.state.authenticated,
            },
          }}
        />
      );
    }

    if (this.state.pagename === "dashboard") {
      const { classes } = this.props;
      const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
      return (
        <div className={classes.root}>
          <CssBaseline />
          <Header
            string={"User:" + this.state.username}
            username={this.state.username}
            authenticated={this.state.authenticated}
          />

          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="xl" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                  <Paper className={fixedHeightPaper}>
                    <div className={classes.buttondiv}>
                      <Button
                        edge="start"
                        color="inherit"
                        className={clsx(classes.menuButton)}
                        style={{ color: "#F19A3E" }}
                        size="medium"
                        onClick={() => this.setState({ pagename: "projects" })}
                      >
                        <AssignmentReturnedIcon style={{ fontSize: 40 }} />
                        Projects
                      </Button>
                    </div>
                    <div className={classes.buttondiv}>
                      <Button
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.setState({ pagename: "tasks" })}
                        className={clsx(classes.menuButton)}
                        style={{ color: "#98D9C2" }}
                      >
                        <DescriptionIcon style={{ fontSize: 40 }} />
                        Tasks
                      </Button>
                    </div>
                    <div className={classes.buttondiv}>
                      <Button
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.setState({ pagename: "reports" })}
                        className={clsx(classes.menuButton)}
                        style={{ color: "#BD4F6C" }}
                      >
                        <LayersIcon style={{ fontSize: 40 }} />
                        Reports
                      </Button>
                    </div>
                    <div className={classes.buttondiv}>
                      <Button
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.setState({ pagename: "analytics" })}
                        className={clsx(classes.menuButton)}
                        style={{ color: "#EF5B5B" }}
                      >
                        <BarChartIcon style={{ fontSize: 40 }} />
                        Analytics
                      </Button>
                    </div>
                    <div className={classes.buttondiv}>
                      <Button
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.setState({ pagename: "settings" })}
                        className={clsx(classes.menuButton)}
                        style={{ color: "#426A5A" }}
                      >
                        <SettingsIcon style={{ fontSize: 40 }} />
                        Settings
                      </Button>
                    </div>
                    <div className={classes.buttondiv}>
                      <Button
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.setState({ pagename: "profiles" })}
                        className={clsx(classes.menuButton)}
                        style={{ color: "#F71735" }}
                      >
                        <PeopleIcon
                          style={{
                            fontSize: 40,
                          }}
                        />
                        Profile
                      </Button>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                  <Paper className={fixedHeightPaper}>
                    <Avatar className={classes.avatar}>
                      <PeopleIcon />
                    </Avatar>
                    <br></br>
                    Profile Info:<br></br> Name: <br></br> Email:<br></br>{" "}
                    Username:
                  </Paper>
                </Grid>
                <Footer />
              </Grid>
              <Box pt={4}>
                <Copyright />
              </Box>
            </Container>
          </main>
        </div>
      );
    }
  }
}
export default withStyles(useStyles)(Dashboard);
