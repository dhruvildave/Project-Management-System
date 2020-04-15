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
import ProjectList from "./components/ProjectList";
import backgrondimage from "./img/background.jpg";
import ProjectsPage from "./components/ProjectsPage";
import AddProject from "./components/AddProject";
import DeleteProject from "./components/DeleteProject";
import { withAlert } from "react-alert";
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
    flexDirection: "row",
    padding: theme.spacing(3),
  },
  buttonclass: {
    margin: theme.spacing(3),
  },
  headinger: {
    padding: theme.spacing(1),
    // background: "#FFFFFF",
  },
  background: {
    backgroundImage: `url(${backgrondimage})`,
    backgroundSize: "cover",

    backgroundRepeat: "no-repeat",
  },
}));

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      authenticated: false,
      pagename: "projects",
      projectid: 42069,
      projectlist: {
        ongoing: [
          {
            projectid: 1,
            name: "AAAAAAAAAAAAAAAA",
            date: "12-4-20",
            path: "git:arpit-vaghela:a",
            username: "arpit-vaghela",
            description: "This is a longer detailed description",
            shortdescription: "Something there",
          },
        ],
        completed: [
          {
            projectid: 2,
            name: "BBBBBBBBBBBBB",
            date: "12-4-20",
            path: "git:arpit-vaghela:a",
            username: "arpit-vaghela",
            description: "This is a longer detailed description",
            shortdescription: "Something there",
          },
        ],
      },
    };
    this.handleToUpdate = this.handleToUpdate.bind(this);
    this.pageUpdate = this.pageUpdate.bind(this);
    // console.log(this.props.username);
    // console.log(this.props.location.state.username);
  }
  // call api here to get rest of user data from backend
  // this.handleClick = this.handleClick.bind(this);

  handleToUpdate(projectid1, redirect) {
    if (redirect === 1) {
      this.setState({ projectid: projectid1, pagename: "projectpage" });
    }
  }
  pageUpdate() {
    this.setState({ pagename: "projects" });
  }
  componentWillMount() {
    if (this.props.username !== undefined) {
      this.setState({
        username: this.props.username,
        authenticated: this.props.authenticated,
        pagename: this.props.pagename,
      });
    }
    if (this.props.location.state !== undefined) {
      this.setState({
        username: this.props.location.state.username,
        authenticated: this.props.location.state.authenticated,
        pagename: this.props.location.state.pagename,
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
    console.log(this.state.pagename);
  }

  render() {
    console.log(this.state.pagename);
    if (this.state.authenticated === false) {
      return <h1>Not Authenticated Go to Login Page and Login</h1>;
    }
    let mid, maincontent;
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

    if (this.state.pagename === "projects") {
      mid = (
        <>
          <Grid container item justify="center" direction="row">
            <Fab
              color="primary"
              aria-label="add"
              className={classes.buttonclass}
              onClick={(event) => this.setState({ pagename: "addproject" })}
            >
              <AddIcon />
            </Fab>
            <Fab
              color="secondary"
              aria-label="delete"
              className={classes.buttonclass}
              onClick={(event) => this.setState({ pagename: "deleteproject" })}
            >
              <DeleteRounded />
            </Fab>
          </Grid>
          <ProjectList
            projectlist={this.state.projectlist}
            handleToUpdate={this.handleToUpdate}
          />
        </>
      );
      aftermid = (
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={fixedHeightPaper}>Bhai Bhai Bhai</Paper>
        </Grid>
      );
      maincontent = (
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper1}>
                <Typography variant="h3" className={classes.headinger}>
                  Your Projects
                </Typography>

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
      );
    }
    if (this.state.pagename === "projectpage") {
      maincontent = (
        <ProjectsPage
          projectid={this.state.projectid}
          username={this.state.username}
          handleToUpdate={this.pageUpdate}
        />
      );
    }
    if (this.state.pagename === "addproject") {
      mid = (
        <AddProject
          username={this.state.username}
          handleToUpdate={this.pageUpdate}
        />
      );
      maincontent = (
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper1}>
                <Typography variant="h3" className={classes.headinger}>
                  Add Project
                </Typography>

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
      );
    }
    if (this.state.pagename === "deleteproject") {
      mid = (
        <DeleteProject
          username={this.state.username}
          handleToUpdate={this.pageUpdate}
        />
      );
      maincontent = (
        <Container maxWidth="xl" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper1}>
                <Typography variant="h3" className={classes.headinger}>
                  Delete Project
                </Typography>

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
          {maincontent}
        </main>
      </div>
    );
  }
}
export default withAlert()(withStyles(useStyles)(Projects));
