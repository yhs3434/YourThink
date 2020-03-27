import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Redirect extends Component {
    componentDidMount() {
        const {page, mode} = this.props.match.params;
        this.props.history.replace(`/${page}/${mode}`);
    }
    render() {
        return(
            <div>
                redirect...
            </div>
        )
    }
}

export default withRouter(Redirect);