import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  List,
  ListItemText,
  Grid,
  Paper,
} from "@material-ui/core";
import PeopleIcon from "@material-ui/icons/People";
import EditTask from "./EditTask";
const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    width: "90%",
  },
}));

class TaskView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      projectid: "",
      taskid: this.props.taskid,
      title: "",
      description: "",
      starttime: "",
      endtime: "",
      status_type: "",
      completiontime: "",
      priority_type: "",
      assignedby: "",
      assignedto: [],
      viewname: "taskdetails", // edit task
    };
    this.pageUpdate = this.pageUpdate.bind(this);
  }
  pageUpdate() {
    this.setState({ viewname: "taskdetails" });
  }
  componentWillMount() {
    this.setState({
      username: "Hello",
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
      assignedto: [
        {
          username: "Something",
        },
        {
          username: "Something",
        },
        {
          username: "Something",
        },
        {
          username: "Something",
        },
      ],
    });
  }
  render() {
    const { classes } = this.props;
    let low, mid;
    low = (
      <Grid container justify="center" direction="row">
        {/* <Typography variant="h4">Manage Files</Typography> */}
        <Button
          color="primary"
          aria-label="edit"
          className={classes.buttonclass}
          onClick={(event) => this.setState({ viewname: "edittask" })}
        >
          Edit Task
        </Button>
        <Button
          color="primary"
          aria-label="edit"
          className={classes.buttonclass}
          onClick={() => null}
        >
          Complete Task
        </Button>
      </Grid>
    );
    mid = (
      <Paper className={classes.paper}>
        <Typography variant="h4">{this.state.title}</Typography>
        <Typography variant="h6">
          {`Status type :` +
            this.state.status_type +
            ` Priorty type :` +
            this.state.priority_type}
        </Typography>
        <Typography variant="subtitle1">
          {`start date:` + this.state.starttime}
        </Typography>
        <Typography variant="subtitle1">
          {`end date:` + this.state.endtime}
        </Typography>
        <Typography variant="subtitle1">
          {`completion date:` + this.state.completiontime}
        </Typography>
        <Typography variant="subtitle1">
          {" "}
          {`Description:` + this.state.description}{" "}
        </Typography>
        <Typography variant="subtitle1">Assigned By:</Typography>
        <ListItem button>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <PeopleIcon></PeopleIcon>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={this.state.assignedby} />
        </ListItem>
        <Typography variant="subtitle1">Members Assigned To:</Typography>
        <List className={classes.listroot}>
          {
            <>
              {this.state.assignedto.map((assignedto) => (
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      <PeopleIcon></PeopleIcon>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={assignedto.username}
                    secondary={assignedto.role}
                  />
                </ListItem>
              ))}
            </>
          }
        </List>
      </Paper>
    );
    if (this.state.viewname === "edittask") {
      mid = <EditTask states={this.state} handleToUpdate={this.pageUpdate} />;
      low = null;
    }
    return [mid, low];
  }
}

export default withStyles(useStyles)(TaskView);
