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
            evTarget.addClass();
        });
    }   
}

let bindDatesInputsInSwal = (swalWindow) =>{
    let swalWindowJQ = $(swalWindow);

    // open date window on label click
    let dateInputs = swalWindowJQ.find('input[type="date"]');
    dateInputs.each((ind, input)=>{
        $(input).click((ev)=>{
            let evTarget = $(ev.target);
            $(input).closest('.row').find('label').click();
        });
    }) 
}

const exportedObject = {
    YMDtoDMY,
    bindAgreementTypesSelectInSwal,
    bindDatesInputsInSwal,
};

export default  exportedObject;
