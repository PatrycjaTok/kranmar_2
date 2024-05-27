import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faEdit, faExchangeAlt, faExclamationTriangle, faExternalLinkAlt, faUmbrellaBeach} from "@fortawesome/free-solid-svg-icons";
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";
import baseHomeFunctions from "../utils/base_functions_home.js";
import SelectEmployeesAndCompanies from "../elements/select_employees_companies.js";
import SelectActionTypes from "../elements/select_action_types.js";
import AddSubstitutionRow from "../elements/add_substitution_table_row.js";
import StartDisplayingInfoBox from "../elements/info_box.js";
import StartDisplayingHolidayInfoBox from  "../elements/holiday_info_box.js"

const cookies = new Cookies();
library.add(faTrash, faEdit, faExchangeAlt, faExclamationTriangle, faUmbrellaBeach);

const initialAddSubstitutionDict = {
    date: '',
    location: '',
    crane: '',
    duration_hours: '',
    amount: '',
    comments: '',
    substituted: {value: '', label: 'Wybierz...'},
    substituted_by: {value: '', label: 'Wybierz...'},
    action_type: '',
}

class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            substitutions: [],
            actionTypes: {},
            AddSubstitutionRow: {...initialAddSubstitutionDict},
            infoBox:{show: false, classes: 'd-none text-warning'},
            holidaysInfoBox: {show: false, classes: 'd-none text-smooth-orange'},
        }
        this.handleSubstitutedByChange = this.handleSubstitutedByChange.bind(this);
        this.handleSubstitutedChange = this.handleSubstitutedChange.bind(this);
        this.handleActionTypeChange = this.handleActionTypeChange.bind(this);
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

    fetchInfoBoxData = () =>{
        let setIntervalBool = true;

        if(!this.props.account_settings.messages_animation){setIntervalBool=false;}
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
                        self.setState({infoBox: {show: true, classes:'text-warning'}}); 
                        StartDisplayingInfoBox(result, setIntervalBool);
                    }else{
                        self.setState({infoBox: {show: false, classes:'d-none text-warning'}});  
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

    fetchHolidaysInfoBoxData = () =>{
        let setIntervalBool = true;

        if(!this.props.account_settings.messages_animation){setIntervalBool=false;}
        let self = this;
        
        $.ajax({
            url: baseURL + '/get-holidays-info-box-data/',
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
                if(data.holidays_info_box_data){
                    let result = data.holidays_info_box_data
                    if(result.length > 0){
                        self.setState({holidaysInfoBox: {show: true, classes:'text-smooth-orange'}}); 
                        StartDisplayingHolidayInfoBox(result, setIntervalBool);
                    }else{
                        self.setState({holidaysInfoBox: {show: false, classes:'d-none text-smooth-orange'}});  
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

    setActionTypes = (actionTypes) =>{
        this.setState({actionTypes: actionTypes});
    }

    handleInputChange = (ev) =>{

        let name = ev.target.name;
        let value = ev.target.value;
        let copyAddSubstitutionRow = { ...this.state.AddSubstitutionRow}; //create a new copy of state AddSubstitutionRow
        copyAddSubstitutionRow[name] = value; //change the value of name
        this.setState({AddSubstitutionRow: copyAddSubstitutionRow}) // settings state
    }

    handleSubstitutedChange(ev){     
        let copyAddSubstitutionRow = { ...this.state.AddSubstitutionRow, substituted : {value: ev.value, label:ev.label}}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddSubstitutionRow: copyAddSubstitutionRow}) // settings state
    }

    handleSubstitutedByChange(ev){
        let copyAddSubstitutionRow = { ...this.state.AddSubstitutionRow, substituted_by : {value: ev.value, label:ev.label}}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddSubstitutionRow: copyAddSubstitutionRow}) // settings state
    }

    handleActionTypeChange(ev){
        let copyAddSubstitutionRow = { ...this.state.AddSubstitutionRow, action_type : ev.target.value}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddSubstitutionRow: copyAddSubstitutionRow}) // settings state
        ev.target.classList = `action-type-${ev.target.value} w-100`;
    }

    handleAddSubstitution = (ev) =>{
        let evTarget = $(ev.target);
        let dataRow = evTarget.closest('.add-substitution-row');
        let validation = true;
        const self = this;

        dataRow.find('input:required, select:required, textarea:required').each((ind, elem)=>{        
            if($(elem).attr('name')){
                if(!baseFunctions.inputValidation($(elem))){validation = false;}
            }
        })
        if(validation){
            let requestData = {};

            dataRow.find('input, select, textarea').each((ind, elem)=>{        
                if($(elem).attr('name')){
                    requestData[$(elem).attr('name')] = $(elem).val();
                }
            })

            $.ajax({
                url: baseURL + '/substitution-create/',
                method: 'POST',
                dataType: 'json',
                async: false,
                headers: {
                  "Content-Type": 'application/json',
                  "X-CSRFToken": cookies.get("csrftoken")
                },
                data: JSON.stringify(requestData),
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    withReactContent(Swal).fire({
                        title: data.messages.success,
                        showConfirmButton: false,
                        icon: 'success',
                        timer: 3000,
                        // timerProgressBar: true
                    }).then(()=>{
                        self.fetchData();
                        self.setState({AddSubstitutionRow: {...initialAddSubstitutionDict}}, () => { 
                            // clear date-inputs values
                            dataRow.find('input[type="date"]').change();
                            // reset actionTYpe select bgcolor
                            dataRow.find('select[name="action_type"]').first()[0].classList = `w-100`;
                        })
                    })  
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
        
    }

    ToHistorySwal(){
        let self = this;
        let backed_result = false;

        let htmlContent = <div className="swal-form to-history-form">
            <h3 className="text-center text-warning pb-0">Przenieś do historii
            </h3>
            <p className="pb-2">Jeśli chcesz przenieść zastępstwa do historii <span className="fw-bold text-decoration-underline">wybierz miesiąc i rok do przeniesienia</span>.</p>
            <div>
                <form noValidate>
                    <div className='row mb-3'>
                        <div className='col-12 col-sm-auto'>
                            <label className='my-1 my-sm-0 fw-bold'>Miesiąc i rok: </label>
                        </div>
                        <div className='col flex-column'>
                            <input className='w-100' type='month' name='date_to_history' onClick={(ev)=>{baseHomeFunctions.handleMonthsInputLabelClick(ev)}}></input>
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
            icon: 'warning',
            confirmButtonText: 'Przenieś',
            cancelButtonText: 'Anuluj',
            preConfirm: () => {
                let form = $('.swal-form.to-history-form form').first();
                let inputDateToHistory = form.find('input[name="date_to_history"]')
                let inputDateToHistoryValue = inputDateToHistory.val(); 
                let validation = inputDateToHistoryValue;    
       
                if(!validation){
                    inputDateToHistory.addClass('invalid');
                    Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> Wybierz datę.`);
                }else{      
                    inputDateToHistory.removeClass('invalid');

                    $.ajax({
                        url: baseURL + '/substitutions-to-history/',
                        method: 'POST',
                        dataType: 'json',
                        async: false,
                        headers: {
                            "Content-Type": 'application/json',
                            "X-CSRFToken": cookies.get("csrftoken")
                        },
                        data: JSON.stringify({"date" : inputDateToHistoryValue}),
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function(data) {
                            backed_result = data;
                        },
                        error: function(xhr, status, err) {
                            let errorText = xhr.responseJSON.messages.errors;
                            Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
                        }
                    });       
                }
            },
        }).then((result) => {
            if(result.isConfirmed){

                withReactContent(Swal).fire({
                    title: backed_result.messages.success,
                    showConfirmButton: false,
                    icon: 'success',
                    timer: 5000,
                    // timerProgressBar: true
                }).then(()=>{
                    self.fetchData();
                });

            };        
        });
    }

    removeSubstitution(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let substitutionId = tr.data('substitution_id');
        let substitutionNr = tr.find('td').first().text();
        let substitutionName1 = tr.find('td:nth-child(3) span').text();
        let substitutionName2 = tr.find('td:nth-child(4) span').text();
        let substitutionType = tr.find('td:nth-child(5)').text();
        let headerText = `Dotyczy: `;
        if(substitutionType){headerText += substitutionType}
        if(substitutionName1.length > 1){headerText += " | " + substitutionName1}
        if(substitutionName2.length > 1){headerText += " | " + substitutionName2}

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
                                            <SelectActionTypes setActionTypes={this.setActionTypes} defaultSelectValue={substitutionData.action_type ?  substitutionData.action_type : ''}/>
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
                inputPlaceholder: 'Szukaj...'
            });

            $('.no-action, .no-action a').off();	 

            baseHomeFunctions.bindDatesInputs($('tr.add-substitution-row'));          
        }, 300);   

        setTimeout(() => { 
            this.fetchInfoBoxData();
            this.fetchHolidaysInfoBoxData();        
        }, 600); 
      
    }

    render(){
        const substitutions = this.state.substitutions;
       
        return(
            <div className="position-relative">
            <h2 className="text-center pb-2 pb-lg-3 position-relative">Zastępstwa {this.props.account_settings.messages_show && <span><span className={this.state.infoBox.classes} id="infoBox"><FontAwesomeIcon icon={faExclamationTriangle} /></span> <span className={this.state.holidaysInfoBox.classes} id="holidaysInfoBox"><FontAwesomeIcon icon={faUmbrellaBeach} /></span></span>}</h2>
            <button className="btn btn-secondary to-history-btn" onClick={()=>{this.ToHistorySwal()}}>Przenieś <FontAwesomeIcon icon={faExchangeAlt} className="px-2" title="Przeniś do historii"></FontAwesomeIcon></button>
            <div className="table-wrapper">
                <div></div>
                <table className="custom-fancytable substitutions-table">
                    <thead>
                        <tr className="bg-primary bg-gradient text-light"> 
                            <th className="no-action">Nr</th>
                            <th data-sortas="case-insensitive">Data</th> 
                            <th data-sortas="case-insensitive">Zastępstwo za</th> 
                            <th data-sortas="case-insensitive">Zastąpił</th> 
                            <th data-sortas="case-insensitive" className="table-td-s">Typ</th> 
                            <th data-sortas="case-insensitive">Lokalizacja</th> 
                            <th data-sortas="case-insensitive">Żuraw</th> 
                            <th data-sortas="numeric" className="table-td-xs">Ilość godzin (h)</th> 
                            <th data-sortas="numeric" className="table-td-xs">Kwota (zł)</th> 
                            <th data-sortas="case-insensitive" className="table-td-xl">Uwagi/Komentarz</th>
                            <th className="no-action th-action">Akcje</th> 
                        </tr> 
                        <AddSubstitutionRow setActionTypes={this.setActionTypes} handleAddSubstitution={this.handleAddSubstitution} handleInputChange={this.handleInputChange} stateAddSubstitutionRow={this.state.AddSubstitutionRow} handleSubstitutedChange={this.handleSubstitutedChange} handleSubstitutedByChange={this.handleSubstitutedByChange} handleActionTypeChange={this.handleActionTypeChange}/>
                    </thead>
                    <tbody>                        
                        {substitutions.map((substitution, i) => {
                            const actionTypeClassName = `action-type-${substitution.action_type}`;
                            let substitutedButton = '';
                            
                            if((substitution.substituted).startsWith('employee-')){
                                let href = "/employee-data?empl=" + (substitution.substituted).split('-')[1];
                                substitutedButton = (<Link to={href} className="redirect-icon px-1"><FontAwesomeIcon icon={faExternalLinkAlt} title="Pokaż"/></Link>)
                            }else if((substitution.substituted).startsWith('company-')){
                                let href = "/employee-data?comp=" + (substitution.substituted).split('-')[1];
                                substitutedButton = (<Link to={href} className="redirect-icon px-1"><FontAwesomeIcon icon={faExternalLinkAlt} title="Pokaż"/></Link>)
                            }
                            
                            let substitutedByButton = '';
                            if((substitution.substituted_by).startsWith('employee-')){
                                let href = "/employee-data?empl=" + (substitution.substituted_by).split('-')[1];
                                substitutedByButton = (<Link to={href} className="redirect-icon px-1"><FontAwesomeIcon icon={faExternalLinkAlt} title="Pokaż"/></Link>) 
                            }else if((substitution.substituted_by).startsWith('company-')){
                                let href = "/employee-data?comp=" + (substitution.substituted_by).split('-')[1];
                                substitutedByButton = (<Link to={href} className="redirect-icon px-1"><FontAwesomeIcon icon={faExternalLinkAlt} title="Pokaż"/></Link>) 
                            }

                            return(
                            <tr key={substitution.id} data-substitution_id={substitution.id}>                               
                                <td>{i+1}</td>
                                <td data-sortvalue={substitution.date}>{baseHomeFunctions.YMDtoDMY(substitution.date)}</td>
                                <td><span>{substitution.substituted_full_name}</span> {substitutedButton}</td>
                                <td><span>{substitution.substituted_by_full_name}</span> {substitutedByButton}</td>
                                <td className={actionTypeClassName}>{this.state.actionTypes[substitution.action_type]}</td>
                                <td>{substitution.location}</td>
                                <td>{substitution.crane}</td>
                                <td>{substitution.duration_hours}</td>
                                <td>{substitution.amount}</td>
                                <td>{substitution.comments}</td>
                                <td className="no-search td-action"><FontAwesomeIcon icon={faEdit} onClick={(ev)=>{this.editSubstitution(ev)}} title="edytuj"/><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeSubstitution(ev)}} title="usuń" /></td>
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