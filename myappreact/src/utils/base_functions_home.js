import $ from 'jquery';

let YMDtoDMY = (ymd) => {
    let dmy = ymd ? ymd.split('-').reverse().join('-') : ymd;
    return dmy;
}

let bindAgreementTypesSelectInSwal = (agreementsTypes, swalWindow) =>{
    if(Object.keys(agreementsTypes).length > 0){
        let swalWindowJQ = $(swalWindow);

        // set agreement types
        let agreementSelect = swalWindowJQ.find('select[name="agreement_type"]').first();
        let agreementSelectHtml = "<option class='bg-white' value=''>Wybierz...</option>";
        for (const [key, value] of Object.entries(agreementsTypes)) {
            agreementSelectHtml += `<option class=agreement-${key} value=${key}>${value}</option>`
        };
        agreementSelect.html(agreementSelectHtml);  
        // handle Select BgColor
        agreementSelect.change((ev)=>{
            let evTarget = $(ev.target);
            ev.target.classList = `agreement-${evTarget.val()} w-100`;
        });
    }   
}

let createDateInputCoverLabel = (input) =>{
    let inputVal = input.val();
    let labelText = 'dd - mm - YYYY';
    if(inputVal){
        labelText = YMDtoDMY(inputVal);
    }
    let coverLabel = $(`<div class='coverLabelForDateInput'>${labelText}</div>`);
    coverLabel.click((ev)=>{
        $(ev.target).siblings("input")[0].showPicker();
    });
    coverLabel.insertAfter(input);
}

let changeDateInputCoverLabel = (input) =>{
    let inputVal = input.val();
    let labelText = 'dd-mm-YYYY';
    if(inputVal){
        labelText = YMDtoDMY(inputVal);
    }
    input.siblings('.coverLabelForDateInput').text(labelText);
}

let bindDatesInputsInSwal = (swalWindow) =>{
    let swalWindowJQ = $(swalWindow);

    let dateInputs = swalWindowJQ.find('input[type="date"]');
    dateInputs.each((ind, input)=>{
        const inputJQ = $(input);
        createDateInputCoverLabel(inputJQ);
        inputJQ.change((ev)=>{
            changeDateInputCoverLabel($(ev.target));
        });
    }) 
}

let handleActionTypesSelectChange = (ev) =>{
    // handle Select BgColor
    let evTarget = $(ev.target);
    ev.target.classList = `action-type-${evTarget.val()} w-100`;
}

let bindDatesInputs = (parent) =>{
    let dateInputs = parent.find('input[type="date"]');
    dateInputs.each((ind, input)=>{
        const inputJQ = $(input);
        createDateInputCoverLabel(inputJQ);
        inputJQ.change((ev)=>{
            changeDateInputCoverLabel($(ev.target));
        });
    }) 
}

const exportedObject = {
    YMDtoDMY,
    bindAgreementTypesSelectInSwal,
    bindDatesInputsInSwal,
    bindDatesInputs,
    handleActionTypesSelectChange,
};

export default  exportedObject;
