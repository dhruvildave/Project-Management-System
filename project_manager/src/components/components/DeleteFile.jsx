import React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import Listdelfile from "../assets/listdelfile";
import { Paper } from "@material-ui/core";
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

class DeleteProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileid: [],
      selected: 0,
      deleteflag: 0,
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
      username: "",
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    // this.handleClick = this.handleClick.bind(this);
  }
  handleUpdate(fileid, number) {
    this.setState({ fileid: fileid, selected: number, deleteflag: 1 });
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
    this.setState({ username: this.props.username });
    //fetch filelist here
  }
  render() {
    const { classes } = this.props;
    return (
      // <Grid container item xs={12} justify="center" direction="column">
      <Paper className={classes.root}>
        <Listdelfile
          file={this.state.files}
          handleToUpdate={this.handleUpdate}
        />
      </Paper>
      // </Grid>
    );
  }
}

export default withAlert()(withStyles(useStyles)(DeleteProject));
