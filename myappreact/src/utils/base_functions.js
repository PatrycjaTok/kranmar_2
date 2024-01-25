import $ from 'jquery';

function inputValidation(inputJQ){
let nameInputValidation = ['name', 'surname']
let passwordInputValidation = ['password', 'password1', 'password2']
let checkBoxs = ['checkbox', 'radio']

let pattern;
let inputVal = String(inputJQ.val());
let inputName = inputJQ.attr('name');

if(inputVal.length === 0){
    inputJQ.addClass('invalid');
}else if(!checkBoxs.includes(String((inputJQ.attr('type'))).toLowerCase())){
    if(inputName === 'email'){
    pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    }else if(nameInputValidation.includes(inputName)){
    pattern = /^[a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ][a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ\s\-]*$/
    }else if(passwordInputValidation.includes(inputName)){
    pattern = /^[a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ0-9\*\._][a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ\-0-9\*\._]*$/
    }else if(inputName === 'login'){
    pattern = /^[A-Za-z0-9][A-Za-z0-9._]{2,19}$/
    }else{
    pattern = /.\n*/
    }

    let result = pattern.test(inputVal);
    
    if(!result){
    inputJQ.addClass('invalid');
    }else{
    inputJQ.removeClass('invalid');
    }
}
}

function formValidation(formJQ){
let nameInputValidation = ['name', 'surname']
let passwordInputValidation = ['password', 'password1', 'password2']
let checkBoxs = ['checkbox', 'radio']

let passwords = [];
let validation = true;
let errors = [];

console.log(formJQ)
formJQ.find('input[required]').each((index, input)=>{
    let inputJQ = $(input);
    let pattern;
    let inputVal = String(inputJQ.val());
    let inputName = inputJQ.attr('name');

    if(inputVal.length === 0){
    inputJQ.addClass('invalid');
    validation = false;

    inputJQ.change((ev)=>{
        let evTarget = $(ev.target);
        inputValidation(evTarget);
    });
    
    }else if(!checkBoxs.includes(String((inputJQ.attr('type'))).toLowerCase())){
    if(inputName === 'email'){
        pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    }else if(nameInputValidation.includes(inputName)){
        pattern = /^[a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ][a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ\s\-]*$/
    }else if(passwordInputValidation.includes(inputName)){
        pattern = /^[a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ0-9\*\._][a-zA-ZąĄćĆęĘóÓłŁśŚźŹżŻńŃ\-0-9\*\._]*$/
        passwords.push(inputVal);
    }else if(inputName === 'login'){
        pattern = /^[A-Za-z0-9][A-Za-z0-9._]{2,19}$/
    }else{
        pattern = /.\n*/
    }

    let result = pattern.test(inputVal);
    
    if(!result){
        inputJQ.addClass('invalid');

        inputJQ.change((ev)=>{
        let evTarget = $(ev.target);
        inputValidation(evTarget);
        });

        validation = false;
    }else{
        inputJQ.removeClass('invalid');
    }
    }
})

if(!validation){
    errors.push('Uzupełnij poprawnie pola');
}

if(passwords.length > 1){
    for(let i=0; i<passwords.length-1; i++){
    if(passwords[i] !== passwords[(i + 1)]){
        validation = false;
        errors.push('Hasła nie są takie same.')
    }
    }
}

return {validation: validation, errors: errors};

}


const exportedObject = {
    inputValidation,
    formValidation,
  };
  
export default exportedObject;