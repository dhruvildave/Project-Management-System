import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import FileCopy from "@material-ui/icons/FileCopy";
// import Paper from "@material-ui/core/Paper";
import { Typography, CssBaseline } from "@material-ui/core";

import { createStyles, withStyles } from "@material-ui/core/styles";
const useStyles = createStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
}));
class Listfileproj extends React.Component {
  render() {
    const { classes } = this.props;
    let filelist = this.props.files.map((files) => (
      <ListItem button onClick={() => this.props.handleToUpdate(files.fileid)}>
        <ListItemAvatar>
          <Avatar className={classes.avatar}>
            <FileCopy />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={files.filename}
          secondary={`Last updated: ` + files.lastupdated}
        ></ListItemText>
        {/* <Card project={this.props.project}></Card> */}
      </ListItem>
    ));
    console.log(this.props.files);
    return (
      <>
        <CssBaseline />
        <Typography variant="h5">Your Project Files</Typography>
        {filelist}
      </>
    );
    // return filelist;
  }
}

export default withStyles(useStyles)(Listfileproj);
