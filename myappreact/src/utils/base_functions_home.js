import $ from 'jquery';

let YMDtoDMY = (ymd) => {
    let dmy = ymd ? ymd.split('-').reverse().join('-') : ymd;
    return dmy;
}

const exportedObject = {
    YMDtoDMY,
};

export default  exportedObject;
