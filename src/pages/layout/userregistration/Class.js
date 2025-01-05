import React from "react";

class Class extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        foo: 'bar',
      };
    }
  
    render() {
      return (
        <div>
          <span>My component</span>
        </div>
      );
    }
  }
  
  MyComponent.propTypes = propTypes;
  
  export default Class;
  