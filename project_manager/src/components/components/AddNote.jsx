import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Paper, TextField, MenuItem, Button } from "@material-ui/core";

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
    // width: "36%",
  },
}));

class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      title: "",
      description: "",
      color: "",
      fetchmethod: "user",
      projectid: "",
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    //call mutation here
    console.log(this.state);
    //on sucess redirect
    this.props.handleToUpdate();
    // Different Mutation Called Based on fetch method
  }
  render() {
    const { classes } = this.props;
    const color = [
      { value: "red", label: "red" },
      { value: "green", label: "green" },
      { value: "blue", label: "blue" },
    ];
    let body = (
      <Grid container item xs={12} justify="center">
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
                id="color"
                name="color"
                label="color"
                value={this.state.color}
                fullWidth
                onChange={(event) =>
                  this.setState({ color: event.target.value })
                }
                //   autoComplete="billing address-level2"
              >
                {color.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
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
          Add
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
      </Grid>
    );
    return body;
  }
}

export default withStyles(useStyles)(AddNote);
