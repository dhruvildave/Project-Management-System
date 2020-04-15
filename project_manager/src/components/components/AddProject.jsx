import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import { Grid, TextField, Paper, Button } from "@material-ui/core";
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
}));

class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillMount() {
    if (this.props.username !== undefined) {
      this.setState({ username: this.props.username });
    }
  }
  handleClick(event) {
    event.preventDefault();
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

    today = yyyy + "-" + mm + "-" + dd;
    return (
      <Grid container item xs={12} justify="center">
        <Paper className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="Name"
                name="Name"
                label="Project name"
                fullWidth
                //   autoComplete="fname"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="description1"
                name="description1"
                label="Short Description 1"
                fullWidth
                //   autoComplete="billing address-line1"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                id="description2"
                name="description2"
                label="Description"
                fullWidth
                //   autoComplete="billing address-line2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="path"
                name="path"
                label="path"
                fullWidth
                //   autoComplete="billing address-level2"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                id="date"
                name="date"
                label="Date"
                defaultValue={today}
                fullWidth
                inputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Paper>
        <Grid container xs={6} justify="center">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(event) => this.handleClick(event)}
          >
            Add Project
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(useStyles)(AddProject);
