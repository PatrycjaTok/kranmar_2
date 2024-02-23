import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faUserEdit} from "@fortawesome/free-solid-svg-icons";
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";
import baseHomeFunctions from "../utils/base_functions_home.js";
import SelectEmployeesAndCompanies from "../elements/select_employees_companies.js";
import SelectActionTypes from "../elements/select_action_types.js";

const cookies = new Cookies();
library.add(faTrash, faUserEdit);


class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            substitutions: [],
        }
    }

    fetchData = () =>{
        let self = this;
        $.ajax({
            url: baseURL + '/get-substitutions/',
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
                if(data.substitutions){
                    self.setState({substitutions: data.substitutions});
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

    // swalAddEmployee = () => {
    //     let self = this;
    //     const htmlContent = <div className="swal-form add-employee-form">
    //         <h3 className="text-center pb-3">Dodaj Pracownika</h3>
    //         <div>
    //             <form noValidate>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Imię: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <input className='w-100' type='text' name='first_name' placeholder='Imię' required></input>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Nazwisko: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <input className='w-100' type='text' name='last_name' placeholder='Nazwisko' required></input>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Typ Umowy: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <select className='w-100' name='agreement_type' >
    //                             <option className="bg-white" value=''>Wybierz...</option>                            
    //                         </select>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Umowa do: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <input className='w-100' type='date' name='agreement_end_date'></input>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Badania lekarskie do: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <input className='w-100' type='date' name='medical_end_date'></input>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Uprawnienia do: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <input className='w-100' type='date' name='building_license_end_date'></input>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Domyślna budowa: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <input className='w-100' type='text' name='default_build'></input>
    //                     </div>
    //                 </div>
    //                 <div className='row mb-3'>
    //                     <div className='col-12 col-sm-auto'>
    //                         <label className='my-1 my-sm-0'>Komentarz: </label>
    //                     </div>
    //                     <div className='col flex-column'>
    //                         <textarea className='w-100' name='comments' placeholder='Komentarz...'></textarea>
    //                     </div>
    //                 </div>            
    //             </form>
    //         </div>
    //     </div>
    
    //     // Swal options
    //     withReactContent(Swal).fire({
    //     html: htmlContent,
    //     showCloseButton: true,
    //     confirmButtonText: "Dodaj",
    //     showLoaderOnConfirm: true,
    //     didOpen: (swalWindow) => {
    //         // `MySwal` is a subclass of `Swal` with all the same instance & static methods
    //         // addEmployeeSwal.showLoading()
    //         baseHomeFunctions.bindAgreementTypesSelectInSwal(agreementsTypes, swalWindow);
    //         baseHomeFunctions.bindDatesInputsInSwal(swalWindow);  
    //         $(swalWindow).find('input[name="first_name"').focus();
    //     },
    //     preConfirm: () => {
    //         let form = $('.swal-form.add-employee-form form').first();
    //         let validation = baseFunctions.formValidation(form);        
    //         if(!validation.validation){
    //             Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
    //         }else{
    //             const data = new FormData(form[0]);
    //             const objectData = JSON.stringify(Object.fromEntries(data.entries()));
    //             let result = false;
    
    //             $.ajax({
    //                 url: baseURL + '/employee-create/',
    //                 method: 'POST',
    //                 dataType: 'json',
    //                 async: false,
    //                 headers: {
    //                   "Content-Type": 'application/json',
    //                   "X-CSRFToken": cookies.get("csrftoken")
    //                 },
    //                 data: objectData,
    //                 xhrFields: {
    //                     withCredentials: true
    //                 },
    //                 success: function(data) {
    //                     result = data;
    //                 },
    //                 error: function(xhr, status, err) {
    //                   let errorText = xhr.responseJSON.messages.errors;
    //                   Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
    //                 }
    //             });
    
    //             if(result){return result;}
    //         }
    //     },
    //     }).then((result) => {
    //         if(result.isConfirmed){
    //             withReactContent(Swal).fire({
    //                 title: result.value.messages.success,
    //                 showConfirmButton: false,
    //                 icon: 'success',
    //                 timer: 3000,
    //                 // timerProgressBar: true
    //             }).then(()=>{
    //                 self.fetchData();
    //             });
    //         };        
    //     })
    // }

    // removeEmployee(ev){
    //     let evTarget = $(ev.target);
    //     let employeeId = evTarget.closest('tr').data('employee_id');
    //     let self = this;
    //     let fullName = evTarget.closest('tr').find('td')[0].innerText +' '+evTarget.closest('tr').find('td')[1].innerText;

    //     withReactContent(Swal).fire({
    //         html: <div>
    //             <h3>Czy <b>na pewno</b> chcesz <b className="text-danger">usunąć</b> z listy pracowników:</h3>
    //             <h2><span className="text-danger">{fullName}</span>?</h2>
    //         </div>,
    //         showConfirmButton: true,
    //         showCancelButton: true,
    //         icon: 'warning',
    //         confirmButtonText: 'Tak, chcę',
    //         cancelButtonText: 'Nie'
    //         // timerProgressBar: true
    //     }).then((result)=>{
    //         if(result.isConfirmed){
    //             $.ajax({
    //                 url: baseURL + '/employee-remove/',
    //                 method: 'POST',
    //                 dataType: 'json',
    //                 async: false,
    //                 headers: {
    //                   "Content-Type": 'application/json',
    //                   "X-CSRFToken": cookies.get("csrftoken")
    //                 },
    //                 data: JSON.stringify({"employeeId": employeeId}),
    //                 xhrFields: {
    //                     withCredentials: true
    //                 },
    //                 success: function(data) {
    //                     withReactContent(Swal).fire({
    //                         title: `Usunięto pracownika: ${data.full_name}.`,
    //                         showConfirmButton: false,
    //                         icon: 'success',
    //                         timer: 3000,
    //                         // timerProgressBar: true
    //                     }).then(()=>{
    //                         self.fetchData();
    //                     });   
    //                 },
    //                 error: function(xhr, status, err) {
    //                     // let errorText = xhr.responseJSON.messages.errors;
    //                     withReactContent(Swal).fire({
    //                         title: 'Nie udało się usunąć pracownika.',
    //                         showConfirmButton: false,
    //                         icon: 'error',
    //                         timer: 3000,
    //                         // timerProgressBar: true
    //                     })                 
    //                 }
    //             });
    //         }
    //     })    

    // }

    // editEmployee(ev){
    //     let evTarget = $(ev.target);
    //     let employeeId = evTarget.closest('tr').data('employee_id');

    //     // TODO: bug when remove employee
    //     let self = this;

    //     $.ajax({
    //         url: baseURL + '/get-employee-data/',
    //         method: 'POST',
    //         dataType: 'json',
    //         async: false,
    //         headers: {
    //           "Content-Type": 'application/json',
    //           "X-CSRFToken": cookies.get("csrftoken")
    //         },
    //         data: JSON.stringify({"employeeId": employeeId}),
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         success: function(data) {
    //             let employeeData = data.employee;

    //             let htmlContent = <div className="swal-form edit-employee-form">
    //                 <h3 className="text-center pb-3">Edytuj pracownika
    //                 </h3>
    //                 <div>
    //                     <form noValidate>
    //                         <input type="hidden" name='employeeId' value={employeeId}></input>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Imię: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <input className='w-100' type='text' name='first_name' placeholder='Imię' defaultValue={employeeData.first_name ? employeeData.first_name : ''} required></input>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Nazwisko: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <input className='w-100' type='text' name='last_name' placeholder='Nazwisko' defaultValue={employeeData.last_name ? employeeData.last_name : ''} required></input>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Typ Umowy: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <select className='w-100' name='agreement_type' >
    //                                     <option className="bg-white" value=''>Wybierz...</option>                            
    //                                 </select>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Umowa do: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <input className='w-100' type='date' name='agreement_end_date' defaultValue={employeeData.agreement_end_date ? employeeData.agreement_end_date : ''}></input>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Badania lekarskie do: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <input className='w-100' type='date' name='medical_end_date' defaultValue={employeeData.medical_end_date ? employeeData.medical_end_date : ''}></input>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Uprawnienia do: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <input className='w-100' type='date' name='building_license_end_date' defaultValue={employeeData.building_license_end_date ? employeeData.building_license_end_date : ''}></input>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Domyślna budowa: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <input className='w-100' type='text' name='default_build' defaultValue={employeeData.default_build ? employeeData.default_build: ''}></input>
    //                             </div>
    //                         </div>
    //                         <div className='row mb-3'>
    //                             <div className='col-12 col-sm-auto'>
    //                                 <label className='my-1 my-sm-0'>Komentarz: </label>
    //                             </div>
    //                             <div className='col flex-column'>
    //                                 <textarea className='w-100' name='comments' placeholder='Komentarz...' defaultValue={employeeData.comments ? employeeData.comments : ''}></textarea>
    //                             </div>
    //                         </div>            
    //                     </form>
    //                 </div>
    //             </div>

    //              // Swal options
    //             withReactContent(Swal).fire({
    //                 html: htmlContent,
    //                 showConfirmButton: true,
    //                 showCancelButton: true,
    //                 icon: 'info',
    //                 confirmButtonText: 'Zapisz',
    //                 cancelButtonText: 'Anuluj',
    //                 didOpen: (swalWindow) => {
    //                     // addEmployeeSwal.showLoading()
    //                     baseHomeFunctions.bindAgreementTypesSelectInSwal(agreementsTypes, swalWindow);
    //                     baseHomeFunctions.bindDatesInputsInSwal(swalWindow);
    //                     if(employeeData.agreement_type){
    //                         $(swalWindow).find(`select[name="agreement_type"] option[value=${employeeData.agreement_type}]`).attr('selected', true);
    //                         $(swalWindow).find(`select[name="agreement_type"]`)[0].classList = `agreement-${employeeData.agreement_type} w-100`;
    //                     }
    //                     $(swalWindow).find('input[name="first_name"').focus();
    //                 },
    //                 preConfirm: () => {
    //                     let form = $('.swal-form.edit-employee-form form').first();
    //                     let validation = baseFunctions.formValidation(form);        
    //                     if(!validation.validation){
    //                         Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
    //                     }else{
    //                         const data = new FormData(form[0]);
    //                         const objectData = JSON.stringify(Object.fromEntries(data.entries()));
    //                         let result = false;
                
    //                         $.ajax({
    //                             url: baseURL + '/employee-edit/',
    //                             method: 'POST',
    //                             dataType: 'json',
    //                             async: false,
    //                             headers: {
    //                               "Content-Type": 'application/json',
    //                               "X-CSRFToken": cookies.get("csrftoken")
    //                             },
    //                             data: objectData,
    //                             xhrFields: {
    //                                 withCredentials: true
    //                             },
    //                             success: function(data) {
    //                                 result = data;
    //                             },
    //                             error: function(xhr, status, err) {
    //                               let errorText = xhr.responseJSON.messages.errors;
    //                               Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
    //                             }
    //                         });
                
    //                         if(result){return result;}
    //                     }
    //                 },
    //             }).then((result) => {
    //                 if(result.isConfirmed){
    //                     withReactContent(Swal).fire({
    //                         title: result.value.messages.success,
    //                         showConfirmButton: false,
    //                         icon: 'success',
    //                         timer: 3000,
    //                         // timerProgressBar: true
    //                     }).then(()=>{
    //                         self.fetchData();
    //                     });
    //                 };        
    //             });
    //         },
    //         error: function(xhr, status, err) {
    //             console.log('Nie udało się pobrać danych pracownika.');  
    //             return {};                             
    //         }
    //     });
    
    // }

    componentDidMount(){
        this.fetchData(); 

        setTimeout(() => { 
            $(".custom-fancytable").fancyTable({
                sortColumn: 2,
                pagination: true,
                searchable: true,
                globalSearch: false,
                perPage: 20,
            });

            $('.no-action, .no-action a').off();	 
            baseHomeFunctions.bindDatesInputs($('tr.add-substitution-row'));
        }, 300);   
      
    }

    render(){
        const substitutions = this.state.substitutions;
       
        return(
            <div>
            <h2 className="text-center pb-2 pb-lg-4">Zastępstwa</h2>
            <div className="table-wrapper">
                <table className="custom-fancytable">
                    <thead>
                        <tr> 
                            <th className="no-action">Miesiąc</th> 
                            <th className="no-action">Nr</th>
                            <th data-sortas="case-insensitive">Data (dd.mm)</th> 
                            <th data-sortas="case-insensitive">Zastępstwo za</th> 
                            <th data-sortas="case-insensitive">Zastąpił</th> 
                            <th data-sortas="case-insensitive">Typ</th> 
                            <th data-sortas="case-insensitive">Lokalizacja</th> 
                            <th data-sortas="case-insensitive">Żuraw</th> 
                            <th data-sortas="case-insensitive">Ilość godzin (h)</th> 
                            <th data-sortas="case-insensitive">Kwota (zł)</th> 
                            <th className="no-action">Uwagi/Komentarz</th>
                            <th className="no-action th-action">Akcje</th> 
                        </tr> 
                    </thead>
                    <tbody>
                        <tr className="add-substitution-row">
                            <td></td>
                            <td></td>
                            <td><input className='w-100' type='date' name='date' required></input></td>
                            <td>
                               <SelectEmployeesAndCompanies />
                            </td>
                            <td>
                                <SelectEmployeesAndCompanies />
                            </td>
                            <td>
                                <SelectActionTypes />
                            </td>
                            <td><input className='w-100' type='text' name='location'></input></td>
                            <td><input className='w-100' type='text' name='crane'></input></td>
                            <td><input className='w-100' type='number' name='durtation_hours'></input></td>
                            <td><input className='w-100' type='number' name='amount'></input></td>
                            <td><textarea className='w-100' name='comments' placeholder='Komentarz...'></textarea></td>
                            <td className="no-search"><button className="btn btn-primary w-100">Dodaj</button></td>
                        </tr>
                        {substitutions.map((substitution, i) => {
                            const actionTypeClassName = `action-type-${substitution.action_type}`;

                            return(
                            <tr key={i} data-substitution_id={substitution.id}>                               
                                <td>{i+1}</td>
                                <td></td>
                                <td data-sortvalue={substitution.date}>{baseHomeFunctions.YMDtoDMY(substitution.date)}</td>
                                <td>{substitution.substituted}</td>
                                <td>{substitution.substituted_by}</td>
                                <td className={actionTypeClassName}>{this.state.actionTypes[substitution.action_type]}</td>
                                <td>{substitution.location}</td>
                                <td>{substitution.crane}</td>
                                <td>{substitution.duration_hours}</td>
                                <td>{substitution.amount}</td>
                                <td className="no-search">{substitution.comments}</td>
                                {/* <td className="no-search td-action"><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeEmployee(ev)}} title="usuń" /><FontAwesomeIcon icon={faUserEdit} onClick={(ev)=>{this.editEmployee(ev)}} title="edytuj"/></td> */}
                                <td className="no-search td-action"></td>
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

export default Dashboard;