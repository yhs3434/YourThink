function moreAuto(moreFunc) {
    const docElem = document.documentElement;
    if (docElem.scrollTop + window.innerHeight >= docElem.scrollHeight) {
        moreFunc();
    }
}

exports.moreAuto = moreAuto;