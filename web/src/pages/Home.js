import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Home extends Component {
    render() {
        const style = {
            wrap: {
                maxWidth: '800px',
                width: '90%'
            }
        }
        return(
            <div style={style.wrap}>
                <blockquote>
                    <p>
                        우리는 모두 같은 심연으로부터 비롯된 시도이며 투척이다.
                        하지만 각자가 자기 나름의 목표를 향하여 노력한다.
                        우리가 서로를 이해할 수는 있다.
                        그러나 삶의 의미를 해석할 수 있는 건 자기 자신뿐이다.
                    </p>
                    <cite>데미안 - 헤르만 헤세</cite>
                </blockquote>
            </div>
        )
    }
}

export default withRouter(Home);