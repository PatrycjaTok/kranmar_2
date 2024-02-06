import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
// import { Select2 } from "select2-react-component";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";

const cookies = new Cookies();
let agreementsTypes = {};


class Employees extends React.Component{
    constructor(props){
        super(props);
        this.state={
            employees: [],
        }
    }

    fetchData = () =>{
        let self = this;
        $.ajax({
            url: baseURL + '/get-employees/',
            method: 'GET',
            dataType: 'json',
            // async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                self.setState({employees: data.employees,})
            },
            error: function(xhr, status, err) {
                let errorText = xhr.responseJSON.messages.errors;   
                withReactContent(Swal).fire({
                    title: errorText,
                    showConfirmButton: false,
                    icon: 'error',
                    timer: 3000,
                    // timerProgressBar: true
                })                       
            }
        })
    }

    swalAddEmployee = () => {
        let self = this;
        const htmlContent = <div className="swal-form add-employee-form">
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
                </form>
            </div>
        </div>
    
        // Swal options
        withReactContent(Swal).fire({
        html: htmlContent,
        showCloseButton: true,
        confirmButtonText: "Dodaj",
        showLoaderOnConfirm: true,
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
                    agreementSelectHtml += `<option class=agreement-${key} value=${key}>${value}</option>`
                };
                agreementSelect.html(agreementSelectHtml);  
                // handle Select BgColor
                agreementSelect.change((ev)=>{
                    let evTarget = $(ev.target);
                    ev.target.classList = `agreement-${evTarget.val()} w-100`;
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
        preConfirm: () => {
            const form = $('.swal-form.add-employee-form form').first();
            let validation = baseFunctions.formValidation(form);        
            if(!validation.validation){
                Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
            }else{
                const data = new FormData(form[0]);
                const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                let result = false;
    
                $.ajax({
                    url: baseURL + '/employee-create/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: objectData,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        result = data;
                    },
                    error: function(xhr, status, err) {
                      let errorText = xhr.responseJSON.messages.errors;
                      Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
                    }
                });
    
                if(result){return result;}
            }
        },
        }).then((result) => {
            if(result.isConfirmed){
                withReactContent(Swal).fire({
                    title: result.value.messages.success,
                    showConfirmButton: false,
                    icon: 'success',
                    timer: 3000,
                    // timerProgressBar: true
                }).then(()=>{
                    self.fetchData();
                });
            };        
        })
    }

    componentDidMount(){
        this.fetchData();
    }

    render(){
        const employees = this.state.employees;
    
        return(
            <div>
            <p><button onClick={this.swalAddEmployee} className="btn btn-primary">Dodaj pracownika</button></p>
            <table>
                <tbody>
                    {employees.map((employee, i) => {
                       return(
                        <tr key={i} data-employee_id={employee.id}>
                            <td>{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td>{employee.agreement_type}</td>
                            <td>{employee.agreement_end_date}</td>
                            <td>{employee.medical_end_date}</td>
                            <td>{employee.building_license_end_date}</td>
                            <td>{employee.default_build}</td>
                            <td>{employee.comments}</td>
                        </tr>
                       )
                    })}                 
                </tbody>
            </table>
            
            </div>
        )
    }
}

export default Employees;