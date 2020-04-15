import React from "react";
import { Container, Fab, Grid, Typography, Box } from "@material-ui/core";
import { withStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import backgrondimage from "../img/background.jpg";
import clsx from "clsx";
import AddIcon from "@material-ui/icons/Add";
import DeleteRounded from "@material-ui/icons/DeleteRounded";
import TaskList from "./TasksList";
import TaskView from "./TaskView";
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

class TaskManagerProj extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      projectid: 42069,
      tasks: [],
      viewname: "alltasklist", // add task delete task view task ( edit task )
      taskid: 42069,
      redirect: 0,
    };
    this.pageUpdate = this.pageUpdate.bind(this);
    this.handleToUpdate = this.handleToUpdate.bind(this);
  }
  pageUpdate(pagename) {
    this.setState({ viewname: pagename });
  }
  handleToUpdate(taskid) {
    this.setState({ taskid: taskid, viewname: "viewtask" });
  }
  componentWillMount() {
    if (
      this.props.username !== undefined &&
      this.props.projectid !== undefined
    ) {
      this.setState({
        username: this.props.username,
        projectid: this.props.projectid,
      });
    }
    this.setState({
      tasks: {
        completed: [
          {
            projectid: 1,
            taskid: 1,
            title: "Something",
            description: "tou have to make sthis",
            starttime: "12-2-5555",
            endtime: "2-45-4566",
            status_type: "active",
            completiontime: "2-3-5555",
            priority_type: "normal",
            assignedby: "arpitvagehal",
          },
          {
            projectid: 1,
            taskid: 1,
            title: "Something",
            description: "tou have to make sthis",
            starttime: "12-2-5555",
            endtime: "2-45-4566",
            status_type: "active",
            completiontime: "2-3-5555",
            priority_type: "normal",
            assignedby: "arpitvagehal",
          },
        ],
        ongoing: [
          {
            projectid: 1,
            taskid: 1,
            title: "Something",
            description: "tou have to make sthis",
            starttime: "12-2-5555",
            endtime: "2-45-4566",
            status_type: "active",
            completiontime: "2-3-5555",
            priority_type: "normal",
            assignedby: "arpitvagehal",
          },
          {
            projectid: 1,
            taskid: 1,
            title: "Something",
            description: "tou have to make sthis",
            starttime: "12-2-5555",
            endtime: "2-45-4566",
            status_type: "active",
            completiontime: "2-3-5555",
            priority_type: "normal",
            assignedby: "arpitvagehal",
          },
        ],
      },
    });
    // fetch all tasks here
  }
  componentDidUpdate() {
    //fetch all tasks here again
  }
  render() {
    const { classes } = this.props;
    let mid = (
      <TaskList
        tasklist={this.state.tasks}
        handleToUpdate={this.handleToUpdate}
      />
    );
    const fixedHeightPaper1 = clsx(
      classes.paper,
      classes.fixedHeight,
      classes.background
    );
    let top = (
      <Grid container spacing={3}>
        <Grid container justify="center" direction="row">
          {/* <Typography variant="h4">Manage Files</Typography> */}
          <Fab
            color="primary"
            aria-label="add"
            className={classes.buttonclass}
            onClick={(event) => this.setState({ viewname: "addtask" })}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="delete"
            className={classes.buttonclass}
            onClick={(event) => this.setState({ viewname: "deletetask" })}
          >
            <DeleteRounded />
          </Fab>
        </Grid>
      </Grid>
    );

    if (this.state.viewname === "viewtask") {
      mid = (
        <TaskView
          username={this.state.username}
          projectid={this.state.projectid}
          taskid={this.state.taskid}
        />
      );
    }
    return (
      <Grid item xs={12} md={8} lg={9} justify="center">
        <Paper className={fixedHeightPaper1} justify="center">
          <Typography variant="h3" component="h3">
            Task List
          </Typography>
          {top}
          {mid}
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(TaskManagerProj);
