import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import WorkIcon from "@material-ui/icons/Work";

class Listelemproj extends React.Component {
  render() {
    return (
      <ListItem
        button
        onClick={() => this.props.handleToUpdate(this.props.project.projectid)}
      >
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={this.props.project.name}
          secondary={this.props.project.date}
        />
      </ListItem>
    );
  }
}

export default Listelemproj;
