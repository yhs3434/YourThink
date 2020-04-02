import React from 'react';

const MyLi = ({memoTitle, memoContent, published}) => {
    const style = {
        wrap: {
            display: 'flex',
            flexDirection: 'column',
        }
    }
    return (
        <div className="li-common" style={style.wrap}>
            <div>
                <div className="li-memoTitle">{memoTitle}</div>
            </div>
            <div>
                <div className="li-memoContent">{memoContent}</div>
                <div className="li-published">{published}</div>
            </div>
        </div>
    )
}

export default MyLi;