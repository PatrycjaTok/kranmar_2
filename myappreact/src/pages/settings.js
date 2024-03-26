import React from 'react';
import { Navigate } from 'react-router-dom';
import $ from 'jquery';
import Cookies from "universal-cookie";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import baseURL from "../utils/request";
import baseURLFront from '../utils/base_url_front.js'
import baseFunctions from '../utils/base_functions.js';

const cookies = new Cookies();

let ajaxDangerZone = (data, result={isConfirmed: true}, callbackAfterAjax=()=>{}) =>{
    if(result.isConfirmed){
        $.ajax({
            url: baseURL + '/danger-zoon-change-settings/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify(data),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                withReactContent(Swal).fire({
                    title: 'Zapisano zmiany.',
                    showConfirmButton: false,
                    icon: 'success',
                    timer: 3000,
                    // timerProgressBar: true
                }).then(()=>{
                    callbackAfterAjax();
                })
            },
            error: function(xhr, status, err) {
                // let errorText = xhr.responseJSON.messages.errors;
                withReactContent(Swal).fire({
                    title: 'Nie udało się dokonać zmian.',
                    showConfirmButton: false,
                    icon: 'error',
                    timer: 3000,
                    // timerProgressBar: true
                }).then(()=>{
                    callbackAfterAjax();
                })                 
            }
        })
    }
}

class Settings extends React.Component{
    constructor(props){
        super(props);
        this.state={
            email: ''        
        }
    }

    fetchData(){
        let self = this;

        $.ajax({
            url: baseURL + '/get-user-email/',
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
                self.setState({email: data.email});
                // console.log(data.files)
            },
            error: function(xhr, status, err) {
                let errorText = xhr.responseJSON.messages.errors;
                Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
            }
        });    
    }

    accountDelete(){

        withReactContent(Swal).fire({
            html: <div>
                    <h3 className='text-danger'><b>Czy na pewno chcesz usunąć konto?</b></h3>
                </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, usuń',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        }).then((result)=>{
            if(result.isConfirmed){
                $.ajax({
                    url: baseURL + '/account-delete/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        window.location.replace(baseURLFront + '/');
                    },
                    error: function(xhr, status, err) {
                        // let errorText = xhr.responseJSON.messages.errors;
                        withReactContent(Swal).fire({
                            title: 'Nie udało się usunąć konta.',
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

    handleEmailChange(ev){
        let value = ev.target.value;
        this.setState({email: value});
    }

    submitEmail(){
        // let self = this;
        let email = this.state.email

        if(!baseFunctions.inputValidation($('input[name="email"]'))){
            return;
        }
        
        withReactContent(Swal).fire({
            html: <div>
                    <h3 className='text-danger'><b>Czy na pewno chcesz zmienić adres e-mail?</b></h3>
                </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, zmień',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        }).then((result)=>{
            ajaxDangerZone({"email" : email}, result);
        })  
    }

    handleChangePassword(){
        let oldPasswordInput = $('input[name="old_password"]');
        let oldPasswordInputValue = oldPasswordInput.val();
        let passwordInput = $('input[name="password"]');
        let passwordInput2 = $('input[name="password2"]');
        let passwordInputValue = passwordInput.val();
        let passwordInputValue2 = passwordInput2.val();

        if(oldPasswordInputValue.length === 0){
            oldPasswordInput.addClass('invalid');
            return;
        }else{
            oldPasswordInput.removeClass('invalid');
        }

        if(!baseFunctions.inputValidation(passwordInput)){return}
        if(!baseFunctions.inputValidation(passwordInput2)){return}
        
        let messageParagraph = $('.password-validation-message');
        if(passwordInputValue !== passwordInputValue2){
            messageParagraph.text('Podane nowe hasła nie są takie same.');
            messageParagraph.removeClass('d-none');
            return;
        }else{
            messageParagraph.text('');
            messageParagraph.addClass('d-none');
        }

        withReactContent(Swal).fire({
            html: <div>
                    <h3 className='text-danger'><b>Czy na pewno chcesz zmienić hasło?</b></h3>
                </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, zmień',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        }).then((result)=>{
            ajaxDangerZone({
                "new_password" : passwordInputValue,
                "old_password" : oldPasswordInputValue
            }, result, ()=>{
                passwordInput.val('');
                passwordInput2.val('');
                oldPasswordInput.val('');
                window.location.replace(baseURLFront + '/');
            });
        })  
    }

    componentDidMount(){
        this.fetchData();
    }
    
    render(){
        return(
            <div className='account-settings-container'>
                <div>
                    <ul>
                        <li>
                            <div>
                                <label htmlFor="settings_show_messages">Komunikaty</label>
                                <input type="range" id="settings_show_messages" name="messages_show" min="0" max="1" value={this.props.account_settings.messages_show === true ? 1 : 0} onChange={(ev)=>{this.props.handleAccSettingsRangeInputClick(ev)}}></input>
                            </div>
                            <div className='w-100 text-secondary font-smaller'>(np. upływające terminy umów/badań, nadchodzące urlopy...)</div>
                        </li>
                        <li>
                            <div>
                            <label htmlFor="settings_messages_animation">Animacja ikon komunikatów </label>
                            <input type="range" id="settings_messages_animation" name="messages_animation" min="0" max="1" value={this.props.account_settings.messages_animation === true ? 1 : 0} onChange={(ev)=>{this.props.handleAccSettingsRangeInputClick(ev)}}></input>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className='mt-5 settings-danger-zone'>
                    <h4 className='text-center text-danger'>Danger Zone</h4>
                    <ul>
                        <li>
                            <div>
                                <label htmlFor="settings_email">Edytuj adres email</label>
                                <input type="text" id="settings_email" name="email" value={this.state.email} onInput={(ev)=>{this.handleEmailChange(ev)}}></input>
                            </div>
                            <button className='mt-2 btn btn-danger' onClick={()=>{this.submitEmail()}}>Edytuj email</button>
                        </li>
                        <li>
                            <div className="accordion pb-5" id="accordionSettingsPassword">
                                <div className="accordion-item w-100">
                                    <h2 className="accordion-header d-flex justify-content-center" id="accordionSettingsPasswordHeadingOne">
                                    <button className="accordion-button collapsed p-1 w-100 font-12" type="button" data-bs-toggle="collapse" data-bs-target="#accAccordionSettingsPasswordHeadingOne" aria-expanded="false" aria-controls="accAccordionSettingsPasswordHeadingOne">
                                        <span>Zmień hasło</span>
                                    </button>
                                    </h2>
                                    <div id="accAccordionSettingsPasswordHeadingOne" className="accordion-collapse collapse w-100" aria-labelledby="accordionSettingsPasswordHeadingOne" data-bs-parent="#accordionSettingsPassword">
                                        <div className="accordion-body p-2 d-flex flex-column">
                                            <p className='d-none text-danger text-center mb-0 password-validation-message'></p>
                                            <div>
                                                <span className='px-2'>Wpisz <b className='text-danger'>stare</b> hasło:</span>
                                                <input type="password" name="old_password"></input>
                                            </div>
                                            <div>
                                                <span className='px-2'>Wpisz <b className='text-success'>nowe</b> hasło:</span>
                                                <input type="password" name="password"></input>
                                            </div>
                                            <div>
                                                <span className='px-2'>Powtórz <b className='text-success'>nowe</b> hasło:</span>
                                                <input type="password" name="password2"></input>
                                            </div>
                                            <div>
                                                <button className='btn btn-danger' onClick={()=>{this.handleChangePassword()}}>Zmień hasło</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className='mt-5'>
                            <button className='btn btn-danger' onClick={()=>{this.accountDelete()}}>Usuń konto</button>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default Settings;