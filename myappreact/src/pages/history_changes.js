import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseHomeFunctions from "../utils/base_functions_home.js";

const cookies = new Cookies();

class HistoryChanges extends React.Component{
    constructor(props){
        super(props);
        this.state={
            substitutions: [],
            actionTypes: {},
        }
    }

    fetchData = () =>{
        let self = this;
        
        $.ajax({
            url: baseURL + '/get-history-substitutions/',
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

    setActionTypes = () =>{
        const self = this;
        
        $.ajax({
            url: baseURL + '/get-action-types/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.action_types){
                    self.setState({actionTypes: data.action_types});                                  
                }                    
            },
            error: function(xhr, status, err) {
            console.log(err);
            }
        });
    }

    removeSubstitutionsFromDBSwal(){
        let self = this;
        let backed_result = false;

        let htmlContent = <div className="swal-form remove-substitution-from-db-form">
            <h2 className="text-center text-warning pb-0">Usuń na zawsze</h2>
            <h4 className="pb-0 text-danger"><b>UWAGA!</b><br></br> wybrane pozycje zostaną na zawsze (<span className="fw-bold text-decoration-underline">nieodwracalnie</span>) usunięte.</h4>
            <p className="pb-2">Jeśli mimo to chcesz kontynuować wybierz miesiąc i rok.</p>
            <div>
                <form noValidate>
                    <div className='row mb-3'>
                        <div className='col-12 col-sm-auto'>
                            <label className='my-1 my-sm-0 fw-bold'>Miesiąc i rok: </label>
                        </div>
                        <div className='col flex-column'>
                            <input className='w-100' type='month' name='date_to_remove' onClick={(ev)=>{baseHomeFunctions.handleMonthsInputLabelClick(ev)}}></input>
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
            confirmButtonText: 'Usuń na zawsze',
            confirmButtonColor: 'red',
            cancelButtonText: 'Anuluj',
            preConfirm: () => {
                let form = $('.swal-form.remove-substitution-from-db-form form').first();
                let inputDateToRemove = form.find('input[name="date_to_remove"]')
                let inputDateToRemoveValue = inputDateToRemove.val(); 
                let validation = inputDateToRemoveValue.length > 0;    
       
                if(!validation){
                    inputDateToRemove.addClass('invalid');
                    Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> Wybierz datę.`);
                }else{      
                    inputDateToRemove.removeClass('invalid');

                    $.ajax({
                        url: baseURL + '/substitutions-to-remove-from-db/',
                        method: 'POST',
                        dataType: 'json',
                        async: false,
                        headers: {
                            "Content-Type": 'application/json',
                            "X-CSRFToken": cookies.get("csrftoken")
                        },
                        data: JSON.stringify({"date" : inputDateToRemoveValue}),
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

    // removeSubstitution(ev){
    //     let self = this;
    //     let tr = $(ev.target).closest('tr');
    //     let substitutionId = tr.data('substitution_id');
    //     let substitutionNr = tr.find('td').first().text();
    //     let substitutionName1 = tr.find('td:nth-child(3)').text();
    //     let substitutionName2 = tr.find('td:nth-child(4)').text();
    //     let substitutionType = tr.find('td:nth-child(5)').text();
    //     let headerText = `Dotyczy: `;
    //     if(substitutionType){headerText += substitutionType}
    //     if(substitutionName1){headerText += " | " + substitutionName1}
    //     if(substitutionName2){headerText += " | " + substitutionName2}

    //     withReactContent(Swal).fire({
    //         html: <div>
    //             <h3>Czy na pewno chcesz <br></br><span className="text-danger">usunąć pozycję <b>nr {substitutionNr}</b></span> ?</h3>
    //             <p><span>{headerText}</span></p>
    //         </div>,
    //         showConfirmButton: true,
    //         showCancelButton: true,
    //         icon: 'warning',
    //         confirmButtonText: 'Tak, chcę',
    //         cancelButtonText: 'Nie'
    //         // timerProgressBar: true
    //     })
    //     .then((result)=>{
    //         if(result.isConfirmed){
    //             $.ajax({
    //                 url: baseURL + '/substitution-remove/',
    //                 method: 'POST',
    //                 dataType: 'json',
    //                 async: false,
    //                 headers: {
    //                   "Content-Type": 'application/json',
    //                   "X-CSRFToken": cookies.get("csrftoken")
    //                 },
    //                 data: JSON.stringify({"substitution_id": substitutionId}),
    //                 xhrFields: {
    //                     withCredentials: true
    //                 },
    //                 success: function(data) {
    //                     withReactContent(Swal).fire({
    //                         title: `Usunięto pozycję nr ${substitutionNr}.`,
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
    //                         title: 'Nie udało się usunąć pozycji.',
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


    componentDidMount(){
        this.fetchData(); 

        if(!this.state.actionTypes || Object.keys(this.state.actionTypes).length === 0){
            this.setActionTypes();
        }

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
        }, 300);   
      
    }

    render(){
        const substitutions = this.state.substitutions;
       
        return(
            <div className="position-relative">
            <h2 className="text-center pb-2 pb-lg-3">Historia - Zastępstwa</h2>
            <button className="btn btn-danger mb-3 mb-sm-0 to-history-btn position-relative position-sm-absolute" onClick={()=>{this.removeSubstitutionsFromDBSwal()}}>Usuń trwale</button>
            <div className="table-wrapper">
                <div></div>
                <table className="custom-fancytable substitutions-table">
                    <thead>
                        <tr className="bg-secondary bg-gradient text-light"> 
                            <th className="no-action">Nr</th>
                            <th data-sortas="case-insensitive">Data</th> 
                            <th data-sortas="case-insensitive" className="min-w-220">Zastępstwo za</th> 
                            <th data-sortas="case-insensitive" className="min-w-220">Zastąpił</th> 
                            <th data-sortas="case-insensitive" className="table-td-s">Typ</th> 
                            <th data-sortas="case-insensitive">Lokalizacja</th> 
                            <th data-sortas="case-insensitive">Żuraw</th> 
                            <th data-sortas="numeric" className="table-td-xs">Ilość godzin (h)</th> 
                            <th data-sortas="numeric" className="table-td-xs">Kwota (zł)</th> 
                            <th data-sortas="case-insensitive" className="table-td-xl">Uwagi/Komentarz</th>
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
                                <td>{substitution.comments}</td>                            
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

export default HistoryChanges;