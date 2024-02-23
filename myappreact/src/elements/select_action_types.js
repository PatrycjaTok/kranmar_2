import React from "react";
import $ from 'jquery';
import Cookies from "universal-cookie";
import baseURL from "../utils/request";
import baseHomeFunctions from "../utils/base_functions_home.js";

const cookies = new Cookies();

class SelectActionTypes extends React.Component{
    constructor(props){
        super(props);
        this.state={
            actionTypes: {},
        }
    }

   
    getActionTypesList = () =>{
        let self = this;
        
        $.ajax({
            url: baseURL + '/get-action-types/',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if (data.action_types){
                    self.setState({actionTypes: data.action_types})
                }                    
            },
            error: function(xhr, status, err) {
            console.log(err);
            }
        });
    }

    componentDidMount(){

        if(!this.state.actionTypes || Object.keys(this.state.actionTypes).length === 0){
            this.getActionTypesList();
        }	     
    }

    render(){
        let actionTypes = this.state.actionTypes;
       
        return(
           
            <select className='w-100' name='action_type' onChange={(ev)=> {baseHomeFunctions.handleActionTypesSelectChange(ev)}} required>
                <option className="bg-white" value=''>Wybierz...</option>   
                {actionTypes && Object.keys(actionTypes).map((actionType, i) => {
                    const actionTypeClassName = `action-type-${actionType}`;
                    return(
                        <option key={i} className={actionTypeClassName} value={actionType}>{actionTypes[actionType]}</option>
                    )
                })}   
            </select>
                        
        )
    }
}

export default SelectActionTypes;