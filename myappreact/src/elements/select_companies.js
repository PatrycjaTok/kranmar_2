import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import Select from 'react-select';
import baseURL from "../utils/request";

const cookies = new Cookies();


class SelectCompanies extends React.Component{
    constructor(props){
        super(props);
        this.state={
            companies: [],            
        }
    }

    getCompaniesForSelectList = () =>{
        let self = this;
        $.ajax({
            url: baseURL + '/get-companies-for-select-list/',
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
                if(data.companies){
                    self.setState({companies: data.companies,});
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

    componentDidMount(){

        if(!this.state.companies || Object.keys(this.state.companies).length === 0){
            this.getCompaniesForSelectList();
        }
    }

    render(){    
        let companies = this.state.companies;
        let companiesData = [{value: '', label: 'Wybierz...'}]
       
        for (const [key, company] of Object.entries(companies)) {
            companiesData.push({ value: `${company.id}`, label: company.name });
        }

        return(
            <span>
                <Select options={companiesData} className="react-select-custom" name={this.props.name} defaultValue={this.props.defaultSelectValue} value={this.props.value} placeholder="Wybierz..." onChange={(ev)=>{this.props.handleSelectChange(ev)}}/>     
            </span>        
        )
    }
}

SelectCompanies.defaultProps = {
    defaultSelectValue: '',
    handleSelectChange: ()=>{},
};

export default SelectCompanies;