import React from "react";
import { withStyles, Paper } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import Listelemtask from "../assets/listelemtask";
const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    width: "80%",
  },
  list: {
    width: "100%",
    maxWidth: 360,
  },
}));

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      tasklist: this.props.tasklist,
      taskid: 42069,
      redirect: 0,
    };
    this.handleToUpdate = this.handleToUpdate.bind(this);
  }

  handleToUpdate(someArg) {
    this.setState({ taskid: someArg, redirect: 1 });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.taskid !== this.state.taskid) {
      this.props.handleToUpdate(this.state.taskid, this.state.redirect);
    }
    // console.log(this.state.tasklist);
  }
  render() {
    const classes = useStyles();
    let ListElement;
    if (this.state.value === 0) {
      let projectson = this.state.tasklist.ongoing.concat(
        this.state.tasklist.completed
      );
      // console.log(projectson);
      let listItems1 = projectson.map((projectson) => (
        <Listelemtask task={projectson} handleToUpdate={this.handleToUpdate} />
      ));

      ListElement = <List className={classes.list}>{listItems1}</List>;
    }
    if (this.state.value === 1) {
      let projectson = this.state.tasklist.ongoing;
      let listItems1 = projectson.map((projectson) => (
        <Listelemtask task={projectson} handleToUpdate={this.handleToUpdate} />
      ));
      ListElement = <List className={classes.list}>{listItems1}</List>;
    }
    if (this.state.value === 2) {
      let projectscom = this.state.tasklist.completed;
      let listItems2 = projectscom.map((projectscom) => (
        <Listelemtask task={projectscom} handleToUpdate={this.handleToUpdate} />
      ));
      ListElement = <List className={classes.list}>{listItems2}</List>;
    }

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={(event, value) => this.setState({ value: value })}
          indicatorColor="primary"
          textColor="primary"
          centered
          variant="fullWidth"
        >
          <Tab label="All Tasks" />
          <Tab label="Active Tasks" />
          <Tab label="Inactive Tasks" />
          <Tab label="Working Tasks" />
          <Tab label="Completed Tasks" />
        </Tabs>
        {ListElement}
      </Paper>
    );
  }
}

export default withStyles(useStyles)(TaskList);
