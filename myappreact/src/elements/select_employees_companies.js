import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import Select from 'react-select';
import baseURL from "../utils/request";

const cookies = new Cookies();


class SelectEmployeesAndCompanies extends React.Component{
    constructor(props){
        super(props);
        this.state={
            employees: [],
            companies: [],            
        }
    }

    getEmployeesForSelectList = () =>{
        let self = this;

        $.ajax({
            url: baseURL + '/get-employees-for-select-list/',
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
                if(data.employees){
                    self.setState({employees: data.employees,});            
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

        if(!this.state.employees || Object.keys(this.state.employees).length === 0){
            this.getEmployeesForSelectList();
        }

        if(!this.state.companies || Object.keys(this.state.companies).length === 0){
            this.getCompaniesForSelectList();
        }
    }

    render(){    
        let employees = this.state.employees;
        let companies = this.state.companies;
        let employeesData = [{value: '', label: 'Wybierz...'}]
        let companiesData = []
        let selectData = [            
            {
                label: 'Pracownicy', 
                options: employeesData,               
            },
            {
                label: 'Firmy', 
                options: companiesData
            }
        ];
       

        for (const [key, employee] of Object.entries(employees)) {
            employeesData.push({ value: `employee-${employee.id}`, label: `${employee.last_name} ${employee.first_name}` });
        }

        for (const [key, company] of Object.entries(companies)) {
            companiesData.push({ value: `company-${company.id}`, label: company.name });
        }

        return(
            <span>
                <Select options={selectData} className="react-select-custom" name={this.props.name} defaultValue={this.props.defaultSelectValue} value={this.props.value} placeholder="Wybierz..." onChange={(ev)=>{this.props.handleSelectChange(ev)}}/>     
            </span>        
        )
    }
}

SelectEmployeesAndCompanies.defaultProps = {
    defaultSelectValue: '',
    handleSelectChange: ()=>{},
};

export default SelectEmployeesAndCompanies;