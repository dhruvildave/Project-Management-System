import React from "react";
import { Container, Grid, Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import backgrondimage from "../img/background.jpg";
import clsx from "clsx";
import Copyright from "./Copyright";
import ProjectFileManager from "./ProjectFileManager";
import TaskManagerProj from "./TaskManagerProj";
import NotesList from "./NotesList";
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
  maxheightpaper: {
    height: "100%",
  },
}));

class ProjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectid: 42069,
      name: "ProjectPage",
      date: "",
      path: "",
      username: "",
      shortdescription: "",
      description:
        "Chal Hai ayyarrr idhhar kuchsdnisavue rbvaeuyvgiekru vbveryguviuaegivg evhaegivygeyg vkeviuaegvcvvbwaryvgauyv vabuiusvyd auy waygci",
      files: [],
      members: [],
    };
  }
  componentWillMount() {
    if (this.props.projectid !== undefined) {
      this.setState({
        projectid: this.props.projectid,
      });
      this.setState({ username: this.props.username });
    }

    console.log("Mounting Project Page");
    this.setState({
      files: [
        { fileid: 1, filename: "Okay 1", lastupdated: "12-35-3566" },
        {
          fileid: 2,
          filename: "Okay 2",
          lastupdated: "12-35-3566",
        },
        {
          fileid: 3,
          filename: "Okay 3",
          lastupdated: "12-35-3566",
        },
      ],
      tasks: [
        {
          taskid: 1,
          title: "Task1",
          description: "Description1",
          starttime: "12-14-2000",
          endtime: "45-36-2777",
          status: "active",
          priority: "normal",
        },
        {
          taskid: 2,
          title: "Task2",
          description: "Description2",
          starttime: "12-14-2000",
          endtime: "45-36-2777",
          status: "active",
          priority: "normal",
        },
        {
          taskid: 3,
          title: "Task3",
          description: "Description3",
          starttime: "12-14-2000",
          endtime: "45-36-2777",
          status: "active",
          priority: "normal",
        },
      ],
      members: [
        {
          username: "Something",
          role: "leader",
        },
        {
          username: "Something",
          role: "leader",
        },
        {
          username: "Something",
          role: "leader",
        },
        {
          username: "Something",
          role: "leader",
        },
      ],
    });

    // console.log(this.state.tasks);
  }
  componentDidMount() {
    // fetch rest of the data here
  }

  render() {
    let projectmid, notes, tasks;

    const { classes } = this.props;
    // const fixedHeightPaper1 = clsx(
    //   classes.paper,
    //   classes.fixedHeight,
    //   classes.background
    // );
    const fixedHeightPaper2 = clsx(
      classes.paper,
      classes.fixedHeight,
      classes.background,
      classes.maxheightpaper
    );
    projectmid = (
      <ProjectFileManager
        files={this.state.files}
        projectid={this.state.projectid}
        members={this.state.members}
        description={this.state.description}
        shortdescription={this.state.shortdescription}
        date={this.state.date}
        path={this.state.path}
        name={this.state.name}
        username={this.state.username}
      />
    );

    notes = (
      <NotesList username={this.state.username} projid={this.state.projectid} />
    );
    tasks = (
      <TaskManagerProj
        username={this.state.username}
        projid={this.state.projectid}
      />
    );

    // const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper2}>
              <Typography variant="h3" className={classes.headinger}>
                {this.state.name}
              </Typography>
              {projectmid}
            </Paper>
          </Grid>
          {notes}
          {tasks}
        </Grid>
        <Box pt={4}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default withStyles(useStyles)(ProjectsPage);
