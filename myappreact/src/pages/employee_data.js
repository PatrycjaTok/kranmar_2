import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faEdit, faUser} from "@fortawesome/free-solid-svg-icons";
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";
import baseHomeFunctions from "../utils/base_functions_home.js";
import SelectEmployeesAndCompanies from "../elements/select_employees_companies.js";
import SelectActionTypes from "../elements/select_action_types.js";

const cookies = new Cookies();
library.add(faTrash, faEdit, faUser);

class Employee extends React.Component{
    constructor(props){
        super(props);
        this.state={
            substitutions: [],
            substitutions_history: [],
            actionTypes: {},
            employee_full_name: '',
        }
    }

    fetchData = () =>{
        let self = this;
        let employee_id =  new URLSearchParams(window.location.search).get('empl');
        let company_id =  new URLSearchParams(window.location.search).get('comp');
        $.ajax({
            url: baseURL + '/get-single-employee-data/',
            method: 'POST',
            dataType: 'json',
            // async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify({
                employee_id : employee_id,
                company_id: company_id
            }),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                self.setState({
                    substitutions: data.substitutions,
                    substitutions_history: data.substitutions_history,
                    actionTypes: data.action_types,
                    employee_full_name: data.employee_full_name
                });                         
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

    removeSubstitution(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let substitutionId = tr.data('substitution_id');
        let substitutionNr = tr.find('td').first().text();
        let substitutionName1 = tr.find('td:nth-child(3)').text();
        let substitutionName2 = tr.find('td:nth-child(4)').text();
        let substitutionType = tr.find('td:nth-child(5)').text();
        let headerText = `Dotyczy: `;
        if(substitutionType){headerText += substitutionType}
        if(substitutionName1){headerText += " | " + substitutionName1}
        if(substitutionName2){headerText += " | " + substitutionName2}

        withReactContent(Swal).fire({
            html: <div>
                <h3>Czy na pewno chcesz <br></br><span className="text-danger">usunąć pozycję <b>nr {substitutionNr}</b></span> ?</h3>
                <p><span>{headerText}</span></p>
            </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, chcę',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        })
        .then((result)=>{
            if(result.isConfirmed){
                $.ajax({
                    url: baseURL + '/substitution-remove/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"substitution_id": substitutionId}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Usunięto pozycję nr ${substitutionNr}.`,
                            showConfirmButton: false,
                            icon: 'success',
                            timer: 3000,
                            // timerProgressBar: true
                        }).then(()=>{
                            self.fetchData();
                        });   
                    },
                    error: function(xhr, status, err) {
                        // let errorText = xhr.responseJSON.messages.errors;
                        withReactContent(Swal).fire({
                            title: 'Nie udało się usunąć pozycji.',
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

    editSubstitution(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let substitutionId = tr.data('substitution_id');

        $.ajax({
            url: baseURL + '/get-substitution-data/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify({"substitution_id": substitutionId}),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                let substitutionData = data.substitution;

                let htmlContent = <div className="swal-form edit-substitution-form">
                    <h3 className="text-center pb-3">Edytuj Zastępstwo
                    </h3>
                    <div className="table-wrapper swal-tabble-wrapper">
                        <form noValidate>
                            <input type="hidden" name='substitution_id' value={substitutionId}></input>
                            <table className="swal-substitutions-table">
                                <thead>
                                    <tr className="bg-primary bg-gradient text-light"> 
                                        <th data-sortas="case-insensitive">Data</th> 
                                        <th data-sortas="case-insensitive">Zastępstwo za</th> 
                                        <th data-sortas="case-insensitive">Zastąpił</th> 
                                        <th data-sortas="case-insensitive">Typ</th> 
                                        <th data-sortas="case-insensitive">Lokalizacja</th> 
                                        <th data-sortas="case-insensitive">Żuraw</th> 
                                        <th data-sortas="numeric">Ilość godzin (h)</th> 
                                        <th data-sortas="numeric">Kwota (zł)</th> 
                                        <th className="no-action">Uwagi/Komentarz</th>
                                    </tr> 
                                </thead>
                                <tbody>
                                    <tr className="bg-gradient">
                                        <td><input className='w-100' type='date' name='date' defaultValue={substitutionData.date ? substitutionData.date : ''} required></input></td>
                                        <td>
                                            <SelectEmployeesAndCompanies name='substituted' defaultSelectValue={substitutionData.substituted ? {value: substitutionData.substituted, label: substitutionData.substituted_full_name} : ''} />
                                        </td>
                                        <td>
                                            <SelectEmployeesAndCompanies name='substituted_by' defaultSelectValue={substitutionData.substituted_by ? {value: substitutionData.substituted_by, label: substitutionData.substituted_by_full_name} : ''} />
                                        </td>
                                        <td>
                                            <SelectActionTypes defaultSelectValue={substitutionData.action_type ?  substitutionData.action_type : ''}/>
                                        </td>
                                        <td><input className='w-100' type='text' name='location' defaultValue={substitutionData.location ? substitutionData.location : ''}></input></td>
                                        <td><input className='w-100' type='text' name='crane' defaultValue={substitutionData.crane ? substitutionData.crane : ''}></input></td>
                                        <td><input className='w-100' type='number' name='duration_hours' defaultValue={substitutionData.duration_hours ? Number(substitutionData.duration_hours) : ''}></input></td>
                                        <td><input className='w-100' type='number' name='amount' defaultValue={substitutionData.amount ? Number(substitutionData.amount) : ''}></input></td>
                                        <td className="no-search"><textarea className='w-100' name='comments' defaultValue={substitutionData.comments ? substitutionData.comments : ''} placeholder='Komentarz...'></textarea></td>
                                    </tr>
                                </tbody>
                            </table>                           
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
                    customClass: {
                        container: 'swal-container-with-table',
                        popup: 'swal-popup-with-table',                        
                    },                      
                    didOpen: (swalWindow) => {
                        // addEmployeeSwal.showLoading()
                        baseHomeFunctions.bindDatesInputsInSwal(swalWindow);                    
                    },
                    preConfirm: () => {
                        let form = $('.swal-form.edit-substitution-form form').first();
                        let validation = baseFunctions.formValidation(form);        
                        if(!validation.validation){
                            Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
                        }else{
                            const data = new FormData(form[0]);
                            const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                            let result = false;
                
                            $.ajax({
                                url: baseURL + '/substitution-edit/',
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
                });
            },
            error: function(xhr, status, err) {
                console.log('Nie udało się pobrać danych zastępstwa.');  
                return {};                             
            }
        });
    
    }

    componentDidMount(){
        this.fetchData(); 

        setTimeout(() => { 
            $(".custom-fancytable").fancyTable({
                sortColumn: 1,
                sortOrder: -1,
                pagination: true,
                searchable: true,
                globalSearch: false,
                perPage: 80,
            });

            $('.no-action, .no-action a').off();	           
        }, 300);   
      
    }

    render(){
        const substitutions = this.state.substitutions;
        const substitutions_history = this.state.substitutions_history;
       
        return(
            <div>
                <h2 className="text-center pb-2 pb-lg-3"><span className="font-smaller px-1 customTextColor"><FontAwesomeIcon icon={faUser}/></span>{this.state.employee_full_name}</h2>
                
                <div className="accordion custom-accordion-class" id="accordionExample">
                    
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed p-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                <h4 className="w-100 text-center mb-0">Zastępstwa</h4>
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body p-0">
                                <div className="card substitutions-card position-relative">
                                    <div className="card-body table-wrapper">
                                        <table className="custom-fancytable substitutions-table">
                                            <thead>
                                                <tr className="bg-primary bg-gradient text-light"> 
                                                    <th className="no-action">Nr</th>
                                                    <th data-sortas="case-insensitive">Data</th> 
                                                    <th data-sortas="case-insensitive">Zastępstwo za</th> 
                                                    <th data-sortas="case-insensitive">Zastąpił</th> 
                                                    <th data-sortas="case-insensitive">Typ</th> 
                                                    <th data-sortas="case-insensitive">Lokalizacja</th> 
                                                    <th data-sortas="case-insensitive">Żuraw</th> 
                                                    <th data-sortas="numeric">Ilość godzin (h)</th> 
                                                    <th data-sortas="numeric">Kwota (zł)</th> 
                                                    <th className="no-action">Uwagi/Komentarz</th>
                                                    <th className="no-action th-action">Akcje</th> 
                                                </tr>                     
                                            </thead>
                                            <tbody>                        
                                                {substitutions.map((substitution, i) => {
                                                    const actionTypeClassName = `action-type-${substitution.action_type}`;
                                                
                                                    return(
                                                    <tr key={substitution.id} data-substitution_id={substitution.id}>                               
                                                        <td>{i+1}</td>
                                                        <td data-sortvalue={substitution.date}>{baseHomeFunctions.YMDtoDMY(substitution.date)}</td>
                                                        <td>{substitution.substituted_full_name}</td>
                                                        <td>{substitution.substituted_by_full_name}</td>
                                                        <td className={actionTypeClassName}>{this.state.actionTypes[substitution.action_type]}</td>
                                                        <td>{substitution.location}</td>
                                                        <td>{substitution.crane}</td>
                                                        <td>{substitution.duration_hours}</td>
                                                        <td>{substitution.amount}</td>
                                                        <td className="no-search">{substitution.comments}</td>
                                                        <td className="no-search td-action"><FontAwesomeIcon icon={faEdit} onClick={(ev)=>{this.editSubstitution(ev)}} title="edytuj"/><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeSubstitution(ev)}} title="usuń" /></td>
                                                    </tr>
                                                    )
                                                })}      
                                            </tbody>                           
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed p-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                <h4 className="w-100 text-center mb-0">Historia - Zastępstwa</h4>
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body p-0">
                                <div className="card history-substitutions-card position-relative">
                                    <div className="card-body table-wrapper">                        
                                        <table className="custom-fancytable substitutions-table">
                                            <thead>
                                                <tr className="bg-primary bg-gradient text-light"> 
                                                    <th className="no-action">Nr</th>
                                                    <th data-sortas="case-insensitive">Data</th> 
                                                    <th data-sortas="case-insensitive">Zastępstwo za</th> 
                                                    <th data-sortas="case-insensitive">Zastąpił</th> 
                                                    <th data-sortas="case-insensitive">Typ</th> 
                                                    <th data-sortas="case-insensitive">Lokalizacja</th> 
                                                    <th data-sortas="case-insensitive">Żuraw</th> 
                                                    <th data-sortas="numeric">Ilość godzin (h)</th> 
                                                    <th data-sortas="numeric">Kwota (zł)</th> 
                                                    <th className="no-action">Uwagi/Komentarz</th>
                                                </tr>                     
                                            </thead>
                                            <tbody>                        
                                                {substitutions_history.map((substitution, i) => {
                                                    const actionTypeClassName = `action-type-${substitution.action_type}`;
                                                
                                                    return(
                                                    <tr key={substitution.id} data-substitution_id={substitution.id}>                               
                                                        <td>{i+1}</td>
                                                        <td data-sortvalue={substitution.date}>{baseHomeFunctions.YMDtoDMY(substitution.date)}</td>
                                                        <td>{substitution.substituted_full_name}</td>
                                                        <td>{substitution.substituted_by_full_name}</td>
                                                        <td className={actionTypeClassName}>{this.state.actionTypes[substitution.action_type]}</td>
                                                        <td>{substitution.location}</td>
                                                        <td>{substitution.crane}</td>
                                                        <td>{substitution.duration_hours}</td>
                                                        <td>{substitution.amount}</td>
                                                        <td className="no-search">{substitution.comments}</td>
                                                    </tr>
                                                    )
                                                })}      
                                            </tbody>                           
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Employee;