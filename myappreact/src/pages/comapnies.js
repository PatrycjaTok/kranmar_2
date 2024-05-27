import React from "react";
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faEdit, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
// import { Select2 } from "select2-react-component";
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";
import baseHomeFunctions from "../utils/base_functions_home.js";

const cookies = new Cookies();
library.add(faTrash, faEdit, faExternalLinkAlt);
let agreementsTypes = {};


class Companies extends React.Component{
    constructor(props){
        super(props);
        this.state={
            companies: [],
        }
    }

    fetchData = () =>{
        let self = this;
        $.ajax({
            url: baseURL + '/get-companies/',
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
                self.setState({companies: data.companies,})
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

    swalAddCompany = () => {
        let self = this;
        const htmlContent = <div className="swal-form add-company-form">
            <h3 className="text-center pb-3">Dodaj Firmę</h3>
            <div>
                <form noValidate>
                    <div className='row mb-3'>
                        <div className='col-12 col-sm-auto'>
                            <label className='my-1 my-sm-0'>Nazwa: </label>
                        </div>
                        <div className='col flex-column'>
                            <input className='w-100' type='text' name='company_name' placeholder='Nazwa' required></input>
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
            $(swalWindow).find('input[name="company_name"').focus();
        },    
        preConfirm: () => {
            let form = $('.swal-form.add-company-form form').first();
            let validation = baseFunctions.formValidation(form);        
            if(!validation.validation){
                Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
            }else{
                const data = new FormData(form[0]);
                const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                let result = false;
    
                $.ajax({
                    url: baseURL + '/company-create/',
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

    removeCompany(ev){
        let evTarget = $(ev.target);
        let companyId = evTarget.closest('tr').data('company_id');
        let self = this;
        let name = evTarget.closest('tr').find('td')[0].innerText;

        withReactContent(Swal).fire({
            html: <div>
                <h3>Czy <b>na pewno</b> chcesz <b className="text-danger">usunąć</b> z listy firm:</h3>
                <h2><span className="text-danger">{name}</span>?</h2>
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
                    url: baseURL + '/company-remove/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"companyId": companyId}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Usunięto firmę: ${data.name}.`,
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
                            title: 'Nie udało się usunąć firmy.',
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

    editCompany(ev){
        let evTarget = $(ev.target);
        let companyId = evTarget.closest('tr').data('company_id');

        // TODO: bug when remove employee
        let self = this;

        $.ajax({
            url: baseURL + '/get-company-data/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify({"companyId": companyId}),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                let companyData = data.company;

                let htmlContent = <div className="swal-form edit-company-form">
                    <h3 className="text-center pb-3">Edytuj firmę
                    </h3>
                    <div>
                        <form noValidate>
                            <input type="hidden" name='companyId' value={companyId}></input>
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Nazwa: </label>
                                </div>
                                <div className='col flex-column'>
                                    <input className='w-100' type='text' name='company_name' placeholder='Nazwa' defaultValue={companyData.name ? companyData.name : ''} required></input>
                                </div>
                            </div>                    
                            <div className='row mb-3'>
                                <div className='col-12 col-sm-auto'>
                                    <label className='my-1 my-sm-0'>Komentarz: </label>
                                </div>
                                <div className='col flex-column'>
                                    <textarea className='w-100' name='comments' placeholder='Komentarz...' defaultValue={companyData.comments ? companyData.comments : ''}></textarea>
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
                        $(swalWindow).find('input[name="company_name"').focus();
                    },            
                    preConfirm: () => {
                        let form = $('.swal-form.edit-company-form form').first();
                        let validation = baseFunctions.formValidation(form);        
                        if(!validation.validation){
                            Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
                        }else{
                            const data = new FormData(form[0]);
                            const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                            let result = false;
                
                            $.ajax({
                                url: baseURL + '/company-edit/',
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
                console.log('Nie udało się pobrać danych firmy.');  
                return {};                             
            }
        });
    
    }

    componentDidMount(){
        this.fetchData(); 

        setTimeout(() => { 
            $(".custom-fancytable").fancyTable({
                sortColumn: 0,
                pagination: true,
                searchable: true,
                globalSearch: false,
                perPage: 20,
                inputPlaceholder: 'Szukaj...'
            });

            $('.no-action, .no-action a').off();	 
        }, 300);     
      
    }

    render(){
        const companies = this.state.companies;
       
        return(
            <div>
            <h2 className="text-center">Firmy</h2>
            <p className="px-2 text-center"><button onClick={this.swalAddCompany} className="btn btn-primary">Dodaj firmę</button></p>
            <div className="table-wrapper">
                <table className="custom-fancytable">
                    <thead>
                        <tr className="bg-primary bg-gradient text-light"> 
                            <th data-sortas="case-insensitive">Nazwa firmy</th> 
                            <th data-sortas="case-insensitive">Komenatrz</th>
                            <th className="no-action th-action">Akcje</th> 
                        </tr> 
                    </thead>
                    <tbody>
                        {companies.map((company, i) => {
                            let href = `/employee-data?comp=${company.id}`;
                            
                            return(
                            <tr key={company.id} data-company_id={company.id}>
                                <td>{company.name}</td>                            
                                <td>{company.comments}</td>
                                <td className="no-search td-action"><Link to={href}><FontAwesomeIcon icon={faExternalLinkAlt} title="Pokaż"/></Link><FontAwesomeIcon icon={faEdit} onClick={(ev)=>{this.editCompany(ev)}} title="edytuj"/><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeCompany(ev)}} title="usuń" /></td>
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

export default Companies;