import React from "react";
import Header from "./components/Header";
import { createStyles, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Copyright from "./components/Copyright";
import { Avatar, Typography } from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import Footer from "./components/Footer";
import { execute, makePromise } from "apollo-link";
import { getUser, link } from "./queries";
import { withAlert } from "react-alert";
import browndesk from "./img/browndesk.jpg";
import clsx from "clsx";

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
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
    margin: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 500,
    width: "100%",
  },
  fixedHeight: {
    display: "flex",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  background: {
    backgroundImage: `url(${browndesk})`,
    backgroundSize: "cover",

    backgroundRepeat: "no-repeat",
  },
}));

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      authenticated: false,
      pagename: "settings",
      //   projectlist: { ongoing: null, completed: null },
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
    const operation = {
      query: getUser,
      variables: {
        username: this.props.location.state.username,
      }, //optional
    };
    console.log(this.state.username);
    makePromise(execute(link, operation))
      .then((data) => {
        // console.log(`received data ${JSON.stringify(data, null, 2)}`)
        console.log(data);
        if (data.data.getUser) {
          this.setState({
            firstname: data.data.getUser.firstname,
            lastname: data.data.getUser.lastname,
            emailid: data.data.getUser.email,
          });
        } else {
          this.props.alert.error("cannot fetch user data");
        }
      })
      .catch((error) => this.props.alert.error(`received error ${error}`));
  }

  componentDidMount() {
    console.log(this.state.username);
    console.log(this.state.authenticated);
  }

  render() {
    if (this.state.authenticated === false) {
      return <h1>Not Authenticated Go to Login Page and Login</h1>;
    }
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const backpaper = clsx(classes.paper, classes.background);
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
              <Grid item xs={12} md={8} lg={9} direction="row">
                <Paper>
                  <Grid container justify="center" direction="row" spacing={2}>
                    <Grid
                      item
                      direction="row"
                      justify="center"
                      className={classes.root}
                      xs={12}
                      sm={6}
                    >
                      <Paper className={backpaper}></Paper>
                    </Grid>
                    <Grid
                      item
                      direction="row"
                      justify="center"
                      className={classes.root}
                      xs={12}
                      sm={6}
                    >
                      <Paper className={classes.paper}>Idhar Setting kar</Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper className={fixedHeightPaper}>
                  <Avatar className={classes.avatar}>
                    <PeopleIcon />
                  </Avatar>
                  <Typography variant="h6">
                    <br></br>
                    Profile Info:<br></br> Name:
                    {this.state.firstname +
                      ` ` +
                      this.state.lastname} <br></br> Email: {this.state.emailid}
                    <br></br> Username:{this.state.username}
                  </Typography>
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
export default withAlert()(withStyles(useStyles)(Settings));
