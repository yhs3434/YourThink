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
            <span className="li-memoTitle">{memoTitle}</span>
            <div>
                <span className="li-memoContent">{memoContent}</span>
                <span className="li-published">{published}</span>
            </div>
        </div>
    )
}

export default MyLi;