import React from "react";
import Header from "./components/Header";
import { createStyles, withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Copyright from "./components/Copyright";
import Footer from "./components/Footer";
import clsx from "clsx";
import { Typography } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteRounded from "@material-ui/icons/DeleteRounded";
import backgrondimage from "./img/background.jpg";
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
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    display: "flex",
    alignItems: "center",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  divforbutton: {
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  buttonclass: {
    margin: theme.spacing(3),
  },
  headinger: {
    padding: theme.spacing(1),
    // background: "#FFFFFF",
    // colorPrimary: "$FF",
  },
  background: {
    backgroundImage: `url(${backgrondimage})`,
    backgroundSize: "cover",

    backgroundRepeat: "no-repeat",
  },
}));

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      authenticated: false,
      pagename: "tasks",
      tasklist: { ongoing: null, completed: null },
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
    let mid;
    const { classes } = this.props;
    const fixedHeightPaper1 = clsx(
      classes.paper,
      classes.fixedHeight,
      classes.background
    );
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    let aftermid = (
      <Grid item xs={12} md={4} lg={3}>
        <Paper className={fixedHeightPaper}>Bhai Bhai Bhai</Paper>
      </Grid>
    );

    if (this.state.pagename === "tasks") {
      mid = null;
      aftermid = (
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>Bhai Bhai Bhai</Paper>
        </Grid>
      );
    }

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
                <Paper className={fixedHeightPaper1}>
                  <Typography variant="h3" className={classes.headinger}>
                    Your Tasks
                  </Typography>
                  <div className={classes.divforbutton}>
                    <Fab
                      color="primary"
                      aria-label="add"
                      className={classes.buttonclass}
                      onClick={(event) =>
                        this.setState({ pagename: "addtask" })
                      }
                    >
                      <AddIcon />
                    </Fab>
                    <Fab
                      color="secondary"
                      aria-label="delete"
                      className={classes.buttonclass}
                      onClick={(event) =>
                        this.setState({ pagename: "deletetask" })
                      }
                    >
                      <DeleteRounded />
                    </Fab>
                  </div>
                  {mid}
                </Paper>
              </Grid>
              {aftermid}
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
export default withStyles(useStyles)(Tasks);
