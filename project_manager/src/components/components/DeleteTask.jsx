import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Listdeltask from "../assets/listdeltask";
import { Grid, Paper } from "@material-ui/core";
import { withAlert } from "react-alert";
const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  button: {
    padding: theme.spacing(2),
  },
}));

class DeleteTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskid: [],
      selected: 0,
      deleteflag: 0,
      tasks: [],
      username: "",
      projectid: "",
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }
  handleUpdate(projid, number) {
    this.setState({ taskid: projid, selected: number, deleteflag: 1 });
  }
  componentDidUpdate() {
    if (this.state.deleteflag === 1) {
      this.setState({ deleteflag: 0 });
      this.props.alert.success("sucessfully deleted");
      this.props.handleToUpdate();

      //call delete here
    }
  }
  componentWillMount() {
    this.setState({
      username: this.props.username,
      projectid: this.props.projectid,
    });

    this.setState({
      tasks: [
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
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <Grid
        container
        item
        xs={12}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid
          container
          xs={6}
          justify="center"
          className={classes.button}
        ></Grid>
        <Paper className={classes.root}>
          <Listdeltask
            task={this.state.tasks}
            handleToUpdate={this.handleUpdate}
          />
        </Paper>
      </Grid>
    );
  }
}

export default withAlert()(withStyles(useStyles)(DeleteTask));
