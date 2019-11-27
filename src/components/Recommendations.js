import React, { Component } from 'react';

class Recommendations extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      recommendations: []
    }
  }

  // Fetch all recommendations on first mount
  componentDidMount() {
    this.getRecommendations();
  }

  // Retrieves the list of recommendations from the backend
  getRecommendations = () => {
    fetch('/recommend')
      .then((response) => response.json())
      .then((data) => this.setState({ recommendations: data.recommendations }))
  }
 
  render() {
    const { recommendations } = this.state;
    
    return (
      <div className="container">
        <div className="row pt-5">
          <div className="col-12 col-lg-6 offset-lg-3">
            <h1 className="text-center">Book Recommendations</h1>
          </div>
        </div>
       {/* Check to see if any items are found*/}
       {recommendations.length ? (
        <div>
          {/* Render the list of items */}
          {recommendations.map((item, index) => {
            return(
              <div key={index}>
                {item.audience}
                {item.location}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <h2>No Recommendations Found</h2>
        </div>
      )
    }     
    </div>
    );
  }
}

export default Recommendations;