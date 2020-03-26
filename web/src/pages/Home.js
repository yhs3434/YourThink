import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Home extends Component {
    render() {
        return(
            <div>
                <p>This is Home!</p>
            </div>
        )
    }
}

export default withRouter(Home);