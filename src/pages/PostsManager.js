import React, { Component, Fragment } from 'react';
import { withAuth } from '@okta/okta-react';
import { withRouter, Route, Redirect, Link } from 'react-router-dom';
import {
  withStyles,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import MySpeedDial from '../components/SpeedDial';

import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import moment from 'moment';
import { find, orderBy } from 'lodash';
import { compose } from 'recompose';

import PostEditor from '../components/PostEditor';
import ErrorSnackbar from '../components/ErrorSnackbar';

const styles = theme => ({
  posts: {
    marginTop: theme.spacing(2),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  },
});

const API = process.env.REACT_APP_API || 'http://localhost:3001';

class PostsManager extends Component {
  state = {
    loading: true,
    posts: [],
    error: null,
  };

  componentDidMount() {
    this.getPosts();
  }

  async fetch(method, endpoint, body) {
    try {
      const response = await fetch(`${API}${endpoint}`, {
        method,
        body: body && JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${await this.props.auth.getAccessToken()}`,
        },
      });
      return await response.text().then(function(text) {
        return text ? JSON.parse(text) : {}
      });
    } catch (error) {
      console.error(error);

      this.setState({ error });
    }
  }

  async getPosts() {
    this.setState({ loading: false, posts: (await this.fetch('get', '/posts')) || [] });
  }

  savePost = async (post) => {
    await this.fetch('put', `/saveStock`, post);

    this.props.history.goBack();
    this.getPosts();
  }

  deletePost = async (post) => {
    await this.fetch('delete', `/removeStock`, post);

    this.props.history.goBack();
    this.getPosts();
  }

  renderPostEditor = ({ match: { params: { id } } }) => {
    if (this.state.loading) return null;
    const post = find(this.state.posts, { id: Number(id) });

    if (!post) {
      if (id == 'new') {
        return <PostEditor post={post} onSave={this.savePost} />;
      } else if (id == 'delete'){
        return <PostEditor post={post} onSave={this.deletePost} />;
      }
    }
    return <Redirect to="/posts" />;

  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Typography variant="h4">Stock News</Typography>
        {this.state.posts.length > 0 ? (
          <Paper elevation={1} className={classes.posts}>
            <List>
              {orderBy(this.state.posts, ['updatedAt', 'title'], ['desc', 'asc']).map(post => (
                <ListItem key={post.id} button component={Link} to={`/posts/${post.id}`} divider='false' >
                  <ListItemText
                    primary={post.title}
                    secondary={post.ticker}
                  />
                  </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          !this.state.loading && <Typography variant="subtitle1">No posts to display</Typography>
        )}
        
        <MySpeedDial actions = {[
          { icon: <AddIcon />, name: 'Add' , linkName: "/posts/new"},
          { icon: <EditIcon />, name: 'Edit' , linkName: "/posts/new"},
          { icon: <DeleteIcon />, name: 'Delete' , linkName: "/posts/delete"},
        ]}/>

        <Route exact path="/posts/:id" render={this.renderPostEditor} />
        {this.state.error && (
          <ErrorSnackbar
            onClose={() => this.setState({ error: null })}
            message={this.state.error.message}
          />
        )}
      </Fragment>
    );
  }
}

export default compose(
  withAuth,
  withRouter,
  withStyles(styles),
)(PostsManager);
