import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import { Select2 } from "select2-react-component";
import baseURL from "../utils/request";

let agreementsTypes = {};

const swalAddEmployee = () => {
    const addEmployeeSwal = withReactContent(Swal);
    const htmlContent = <div className="swal-form">
        <h3 className="text-center pb-3">Dodaj Pracownika</h3>
        <div>
            <form noValidate>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Imię: </label>
                    </div>
                    <div className='col flex-column'>
                        <input className='w-100' type='text' name='first_name' placeholder='Imię' required></input>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Nazwisko: </label>
                    </div>
                    <div className='col flex-column'>
                        <input className='w-100' type='text' name='last_name' placeholder='Nazwisko' required></input>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Typ Umowy: </label>
                    </div>
                    <div className='col flex-column'>
                        <select className='w-100' name='agreement_type' >
                            <option className="bg-white" value=''>Wybierz...</option>                            
                        </select>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Umowa do: </label>
                    </div>
                    <div className='col flex-column'>
                        <input className='w-100' type='date' name='agreement_end_date'></input>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Badania lekarskie do: </label>
                    </div>
                    <div className='col flex-column'>
                        <input className='w-100' type='date' name='medical_end_date'></input>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Uprawnienia do: </label>
                    </div>
                    <div className='col flex-column'>
                        <input className='w-100' type='date' name='building_license_end_date'></input>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Domyślna budowa: </label>
                    </div>
                    <div className='col flex-column'>
                        <input className='w-100' type='text' name='default_build'></input>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <label className='my-1 my-sm-0'>Komentarz: </label>
                    </div>
                    <div className='col flex-column'>
                        <textarea className='w-100' name='comments' placeholder='Komentarz...'></textarea>
                    </div>
                </div>


                {/* <div className='row mb-3'>
                    <div className='col-12 col-sm-auto'>
                        <p className='my-1 my-sm-0'>Typ umowy</p>
                    </div>
                    <div className='col flex-column'>
                        <Select2
                            data={[
                                { text: 'bug', id: 1 },
                                { text: 'feature', id: 2 },
                                { text: 'documents', id: 3 },
                                { text: 'discussion', id: 4 },
                            ]}
                            options={{
                                placeholder: 'search by tags',
                            }}
                        />
                    </div>
                </div> */}                
            </form>
        </div>
    </div>

    // Swal options
    addEmployeeSwal.fire({
    html: htmlContent,
    showCloseButton: true,
    confirmButtonText: "Dodaj",
    willOpen: () => {
        if(!agreementsTypes || Object.keys(agreementsTypes).length === 0){
            $.ajax({
                url: baseURL + '/get-agreements-types/',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    if (data.agreements_types){
                        agreementsTypes = data.agreements_types;
                    }
                },
                error: function(xhr, status, err) {
                console.log(err);
                }
            }); 
        }     
    },
    didOpen: (swalWindow) => {
        // `MySwal` is a subclass of `Swal` with all the same instance & static methods
        // addEmployeeSwal.showLoading()
        if(Object.keys(agreementsTypes).length > 0){
            let swalWindowJQ = $(swalWindow);

            // set agreement types
            let agreementSelect = swalWindowJQ.find('select[name="agreement_type"]').first();
            let agreementSelectHtml = "<option class='bg-white' value=''>Wybierz...</option>";
            for (const [key, value] of Object.entries(agreementsTypes)) {
                let classColor =  key.replace('/', '');
                agreementSelectHtml += `<option class=agreement-${classColor} value=${key}>${value}</option>`
            };
            agreementSelect.html(agreementSelectHtml);  
            // handle Select BgColor
            agreementSelect.change((ev)=>{
                let evTarget = $(ev.target);
                ev.target.classList = `agreement-${evTarget.val().replace("/","")} w-100`;
                evTarget.addClass();
            });
            
            // open date window on label click
            let dateInputs = swalWindowJQ.find('input[type="date"]');
            dateInputs.each((ind, input)=>{
                $(input).click((ev)=>{
                    let evTarget = $(ev.target);
                    $(input).closest('.row').find('label')
                });
            })

        }    
    },
    })
    // }).then(() => {
    // return addEmployeeSwal.fire(<p>Shorthand works too</p>)
    // })
}


class Employees extends React.Component{
    render(){
        return(
            <div>
            <p><button onClick={swalAddEmployee} className="btn btn-primary">Dodaj pracownika</button></p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            <p>Pracownicy</p>
            </div>
        )
    }
}

export default Employees;