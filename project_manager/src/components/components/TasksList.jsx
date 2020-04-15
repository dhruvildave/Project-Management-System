import React from "react";
import { withStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
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

  componentDidUpdate() {
    this.props.handleToUpdate(this.state.taskid, this.state.redirect);
  }
  render() {
    const classes = useStyles();
    let ListElement;
    // if (this.state.value === 0) {
    //     let projectson = this.state.projectlist.ongoing.concat(
    //         this.state.projectlist.completed
    //     );

    //     let listItems1 = projectson.map((projectson) => (
    //         <Listelemproj
    //             project={projectson}
    //             handleToUpdate={this.handleToUpdate}
    //         />
    //     ));

    //     ListElement = <List className={classes.list}>{lis1}</List>;tItems
    // }
    // if (this.state.value === 1) {
    //     let projectson = this.state.projectlist.ongoing;
    //     let listItems1 = projectson.map((projectson) => (
    //         <Listelemproj
    //             project={projectson}
    //             handleToUpdate={this.handleToUpdate}
    //         />
    //     ));
    //     ListElement = <List className={classes.list}>{listItems1}</List>;
    // }
    // if (this.state.value === 2) {
    //     let projectscom = this.state.projectlist.completed;
    //     let listItems2 = projectscom.map((projectscom) => (
    //         <Listelemproj
    //             project={projectscom}
    //             handleToUpdate={this.handleToUpdate}
    //         />
    //     ));
    //     ListElement = <List className={classes.list}>{listItems2}</List>;
    // }

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
          <Tab label="Current Tasks" />
          <Tab label="Completed Tasks" />
        </Tabs>
        {/* {ListElement} */}
      </Paper>
    );
  }
}

export default withStyles(useStyles)(TaskList);
