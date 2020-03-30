import React from 'react';

const MyLi = ({memoTitle, memoContent, published}) => {
    const style = {
        wrap: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        }
    }
    return (
        <div className="li-common" style={style.wrap}>
            <span>{memoTitle}</span>
            <span>{memoContent}</span>
            <span>{published}</span>
        </div>
    )
}

export default MyLi;