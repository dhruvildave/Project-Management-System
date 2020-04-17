import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Grid, TextField, Paper, Button, MenuItem } from "@material-ui/core";
const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  root: {
    width: "80%",
    padding: theme.spacing(2),
    margin: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    width: "36%",
  },
}));

class AddTask extends React.Component {
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
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    if (this.props.username !== undefined) {
      this.setState({ username: this.props.username });
    }
    this.setState(this.props.states);
    this.setState({ assignedto: [] });
  }
  handleClick(event) {
    event.preventDefault();
    console.log(this.state.assignedto);
    console.log("Clicker");
    //if success redirect back
    this.props.handleToUpdate();
  }
  render() {
    const { classes } = this.props;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    const status_type = [
      { value: "active", label: "active" },
      { value: "inactive", label: "inactive" },
      { value: "working", label: "working" },
    ];
    const priority_type = [
      { value: "highest", label: "highest" },
      { value: "high", label: "high" },
      { value: "normal", label: "normal" },
      { value: "low", label: "low" },
    ];
    today = yyyy + "-" + mm + "-" + dd;

    return (
      <>
        <Paper className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="title"
                name="titile"
                label="Task title"
                fullWidth
                value={this.state.title}
                //   autoComplete="fname"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                multiline
                id="description"
                name="description"
                label="Description"
                fullWidth
                value={this.state.description}
                //   autoComplete="billing address-line2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                select
                id="status_type"
                name="status_type"
                label="status_type"
                value={this.state.status_type}
                fullWidth
                onChange={(event) =>
                  this.setState({ status_type: event.target.value })
                }
                //   autoComplete="billing address-level2"
              >
                {status_type.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                select
                id="priority_type"
                name="priority_type"
                label="priority_type"
                helperText="priority type"
                value={this.state.priority_type}
                onChange={(event) =>
                  this.setState({ priority_type: event.target.value })
                }
                fullWidth
                //   autoComplete="billing address-level2"
              >
                {priority_type.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                id="date"
                name="date"
                label="StartDate"
                defaultValue={this.state.starttime}
                fullWidth
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                id="date"
                name="date"
                label="EndDate"
                defaultValue={this.state.endtime}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="title"
                name="titile"
                label="Assigned To : Enter username seperated by a comma"
                fullWidth
                value={this.state.assignedto}
                onChange={(event) => {
                  this.setState({
                    assignedto: event.target.value.split(","),
                  });
                }}
                //
                //   autoComplete="fname"
              />
            </Grid>
          </Grid>
        </Paper>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(event) => this.handleClick(event)}
        >
          Edit Task
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={this.props.handleToUpdate}
        >
          Back
        </Button>
      </>
    );
  }
}

export default withStyles(useStyles)(AddTask);
