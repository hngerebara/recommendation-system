import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';


class Home extends React.Component {
  componentDidMount() {
    const { onLoad } = this.props;

    axios('http://localhost:4000/recommend')
      .then((res) => onLoad(res.data));
  }
  render() {
    const { articles } = this.props;

    return (
      <div className="container">
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            <h1 className="text-center">Book Recommendations</h1>
          </div>
        </div>
        <div className="row pt-5">
          {articles.map((article) => {
              return (
                <div className="col-md-4">
                <div className="card mb-5">
                    <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80" className="card-img-top" alt="recommedation image"></img>
                  <div className="card-content">
                    <h5>Audience: {article.audience}</h5>
                    <h5><a href="article.location.split('recommending:')[1].trim()"> view recommendation</a></h5>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);