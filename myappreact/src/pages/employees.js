import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faUserEdit, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";
import baseHomeFunctions from "../utils/base_functions_home.js";
import StartDisplayingInfoBox from "../elements/info_box.js";

const cookies = new Cookies();
library.add(faTrash, faUserEdit, faExclamationTriangle);
let agreementsTypes = {};


class Employees extends React.Component{
    constructor(props){
        super(props);
        this.state={
            employees: [],
            infoBox:{show: false, classes: 'd-none text-warning', data: {}}
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
        });
    }

    fetchInfoBoxData = (setIntervalBool=true) =>{
        let self = this;
        
        $.ajax({
            url: baseURL + '/get-info-box-data/',
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
                if(data.info_box_data){
                    let result = data.info_box_data
                    if(result.agreement_end_date.length > 0 || result.medical_end_date.length > 0 || result.building_license_end_date.length > 0){
                        self.setState({infoBox: {show: true, classes:'text-warning', data: result}}, ()=>{StartDisplayingInfoBox(self.state.infoBox.data, setIntervalBool);});  
                    }else{
                        self.setState({infoBox: {show: false, classes:'d-none text-warning', data: {}}});  
                    }                              
                }               
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
        });
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
        didOpen: (swalWindow) => {
            // `MySwal` is a subclass of `Swal` with all the same instance & static methods
            // addEmployeeSwal.showLoading()
            baseHomeFunctions.bindAgreementTypesSelectInSwal(agreementsTypes, swalWindow);
            baseHomeFunctions.bindDatesInputsInSwal(swalWindow);  
            $(swalWindow).find('input[name="first_name"').focus();
        },
        preConfirm: () => {
            let form = $('.swal-form.add-employee-form form').first();
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
                    self.fetchInfoBoxData(false);
                });
            };        
        })
    }

    removeEmployee(ev){
        let evTarget = $(ev.target);
        let employeeId = evTarget.closest('tr').data('employee_id');
        let self = this;
        let fullName = evTarget.closest('tr').find('td')[0].innerText +' '+evTarget.closest('tr').find('td')[1].innerText;

        withReactContent(Swal).fire({
            html: <div>
                <h3>Czy <b>na pewno</b> chcesz <b className="text-danger">usunąć</b> z listy pracowników:</h3>
                <h2><span className="text-danger">{fullName}</span>?</h2>
            </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, chcę',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        }).then((result)=>{
            if(result.isConfirmed){
                $.ajax({
                    url: baseURL + '/employee-remove/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"employeeId": employeeId}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Usunięto pracownika: ${data.full_name}.`,
                            showConfirmButton: false,
                            icon: 'success',
                            timer: 3000,
                            // timerProgressBar: true
                        }).then(()=>{
                            self.fetchData();
                            self.fetchInfoBoxData(false);
                        });   
                    },
                    error: function(xhr, status, err) {
                        // let errorText = xhr.responseJSON.messages.errors;
                        withReactContent(Swal).fire({
                            title: 'Nie udało się usunąć pracownika.',
                            showConfirmButton: false,
                            icon: 'error',
                            timer: 3000,
                            // timerProgressBar: true
                        })                 
                    }
                });
            }
        })    

    }

    editEmployee(ev){
        let evTarget = $(ev.target);
        let employeeId = evTarget.closest('tr').data('employee_id');

        // TODO: bug when remove employee
        let self = this;

        $.ajax({
            url: baseURL + '/get-employee-data/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify({"employeeId": employeeId}),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                let employeeData = data.employee;

                let htmlContent = <div className="swal-form edit-employee-form">
                    <h3 className="text-center pb-3">Edytuj pracownika
                    </h3>
                    <div>
                        <form noValidate>
                            <input type="hidden" name='employeeId' value={employeeId}></input>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Imię: </label>
                                </div>
                                <div className='col flex-column'>
                                    <input className='w-100' type='text' name='first_name' placeholder='Imię' defaultValue={employeeData.first_name ? employeeData.first_name : ''} required></input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Nazwisko: </label>
                                </div>
                                <div className='col flex-column'>
                                    <input className='w-100' type='text' name='last_name' placeholder='Nazwisko' defaultValue={employeeData.last_name ? employeeData.last_name : ''} required></input>
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
                                    <input className='w-100' type='date' name='agreement_end_date' defaultValue={employeeData.agreement_end_date ? employeeData.agreement_end_date : ''}></input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Badania lekarskie do: </label>
                                </div>
                                <div className='col flex-column'>
                                    <input className='w-100' type='date' name='medical_end_date' defaultValue={employeeData.medical_end_date ? employeeData.medical_end_date : ''}></input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Uprawnienia do: </label>
                                </div>
                                <div className='col flex-column'>
                                    <input className='w-100' type='date' name='building_license_end_date' defaultValue={employeeData.building_license_end_date ? employeeData.building_license_end_date : ''}></input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Domyślna budowa: </label>
                                </div>
                                <div className='col flex-column'>
                                    <input className='w-100' type='text' name='default_build' defaultValue={employeeData.default_build ? employeeData.default_build: ''}></input>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Komentarz: </label>
                                </div>
                                <div className='col flex-column'>
                                    <textarea className='w-100' name='comments' placeholder='Komentarz...' defaultValue={employeeData.comments ? employeeData.comments : ''}></textarea>
                                </div>
                            </div>            
                        </form>
                    </div>
                </div>

                 // Swal options
                withReactContent(Swal).fire({
                    html: htmlContent,
                    showConfirmButton: true,
                    showCancelButton: true,
                    icon: 'info',
                    confirmButtonText: 'Zapisz',
                    cancelButtonText: 'Anuluj',
                    didOpen: (swalWindow) => {
                        // addEmployeeSwal.showLoading()
                        baseHomeFunctions.bindAgreementTypesSelectInSwal(agreementsTypes, swalWindow);
                        baseHomeFunctions.bindDatesInputsInSwal(swalWindow);
                        if(employeeData.agreement_type){
                            $(swalWindow).find(`select[name="agreement_type"] option[value=${employeeData.agreement_type}]`).attr('selected', true);
                            $(swalWindow).find(`select[name="agreement_type"]`)[0].classList = `agreement-${employeeData.agreement_type} w-100`;
                        }
                        $(swalWindow).find('input[name="first_name"').focus();
                    },
                    preConfirm: () => {
                        let form = $('.swal-form.edit-employee-form form').first();
                        let validation = baseFunctions.formValidation(form);        
                        if(!validation.validation){
                            Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
                        }else{
                            const data = new FormData(form[0]);
                            const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                            let result = false;
                
                            $.ajax({
                                url: baseURL + '/employee-edit/',
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
                            self.fetchInfoBoxData(false);
                        });
                    };        
                });
            },
            error: function(xhr, status, err) {
                console.log('Nie udało się pobrać danych pracownika.');  
                return {};                             
            }
        });
    
    }

    componentDidMount(){
        this.fetchData(); 
        this.fetchInfoBoxData();

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

        setTimeout(() => { 
            $(".custom-fancytable").fancyTable({
                sortColumn: 1,
                pagination: true,
                searchable: true,
                globalSearch: false,
                perPage: 20,
            });

            $('.no-action, .no-action a').off();	 
        }, 300);     
      
    }

    render(){
        const employees = this.state.employees;
       
        return(
            <div>
            <h2 className="text-center">Pracownicy<span className={this.state.infoBox.classes} id="infoBox"><FontAwesomeIcon icon={faExclamationTriangle} /></span></h2>
            <p className="px-2 text-center"><button onClick={this.swalAddEmployee} className="btn btn-primary">Dodaj pracownika</button></p>
            <div className="table-wrapper">
                <table className="custom-fancytable">
                    <thead>
                        <tr className="bg-primary bg-gradient text-light"> 
                            <th data-sortas="case-insensitive">Imię</th> 
                            <th data-sortas="case-insensitive">Nazwisko</th> 
                            <th data-sortas="case-insensitive">Typ umowy</th> 
                            <th data-sortas="case-insensitive">Umowa do</th> 
                            <th data-sortas="case-insensitive">Badania do</th> 
                            <th data-sortas="case-insensitive">Uprawnienia do</th> 
                            <th data-sortas="case-insensitive">Domyślna budowa</th> 
                            <th className="no-action">Komenatrz</th>
                            <th className="no-action th-action">Akcje</th> 
                        </tr> 
                    </thead>
                    <tbody>
                        {employees.map((employee, i) => {
                            const agreeClassName = `agreement-${employee.agreement_type}`;

                            return(
                            <tr key={employee.id} data-employee_id={employee.id}>
                                <td>{employee.first_name}</td>
                                <td>{employee.last_name}</td>
                                <td className={agreeClassName}>{agreementsTypes[employee.agreement_type]}</td>
                                <td data-sortvalue={employee.agreement_end_date}>{baseHomeFunctions.YMDtoDMY(employee.agreement_end_date)}</td>
                                <td data-sortvalue={employee.medical_end_date}>{baseHomeFunctions.YMDtoDMY(employee.medical_end_date)}</td>
                                <td data-sortvalue={employee.building_license_end_date}>{baseHomeFunctions.YMDtoDMY(employee.building_license_end_date)}</td>
                                <td>{employee.default_build}</td>
                                <td className="no-search">{employee.comments}</td>
                                <td className="no-search td-action"><FontAwesomeIcon icon={faUserEdit} onClick={(ev)=>{this.editEmployee(ev)}} title="edytuj"/><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeEmployee(ev)}} title="usuń" /></td>
                            </tr>
                            )
                        })}      
                    </tbody>                           
                </table>
            </div>
            </div>
        )
    }
}

export default Employees;