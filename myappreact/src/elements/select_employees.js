import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cookies from "universal-cookie";
import Select from 'react-select';
import baseURL from "../utils/request";

const cookies = new Cookies();


class SelectEmployees extends React.Component{
    constructor(props){
        super(props);
        this.state={
            employees: [],         
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

    componentDidMount(){

        if(!this.state.employees || Object.keys(this.state.employees).length === 0){
            this.getEmployeesForSelectList();
        }
      
    }

    render(){    
        let employees = this.state.employees;
        let employeesData = [{value: '', label: 'Wybierz...'}]       

        for (const [key, employee] of Object.entries(employees)) {
            employeesData.push({ value: `${employee.id}`, label: `${employee.last_name} ${employee.first_name}` });
        }

        return(
            <span>
                <Select options={employeesData} className="react-select-custom" name={this.props.name} defaultValue={this.props.defaultSelectValue} value={this.props.value} placeholder="Wybierz..." onChange={(ev)=>{this.props.handleSelectChange(ev)}}/>     
            </span>        
        )
    }
}

SelectEmployees.defaultProps = {
    defaultSelectValue: '',
    handleSelectChange: ()=>{},
};

export default SelectEmployees;