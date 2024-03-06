import React from "react";
import $ from 'jquery';
import Cookies from "universal-cookie";
import baseURL from "../utils/request";
// import baseHomeFunctions from "../utils/base_functions_home.js";

const cookies = new Cookies();

class SelectActionTypes extends React.Component{
    constructor(props){
        super(props);
        this.state={
            actionTypes: {},
            value: this.props.defaultSelectValue,
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
                    self.setState({actionTypes: data.action_types});
                    if(self.props.setActionTypes){
                        self.props.setActionTypes(data.action_types);
                    }                    
                }                    
            },
            error: function(xhr, status, err) {
            console.log(err);
            }
        });
    }

    handleActionTypesSelectChange = (ev, outerHandler) =>{
        if(outerHandler){
            this.props.outerState.handler(ev);
        }else{
            let evTarget = $(ev.target);
            let evTargetValue = evTarget.val();
            if(evTargetValue !== this.state.value){
                this.setState({value : evTargetValue});
                // handle Select BgColor
                ev.target.classList = `action-type-${evTargetValue} w-100`;
            }
        }
        
    }

    componentDidMount(){

        if(!this.state.actionTypes || Object.keys(this.state.actionTypes).length === 0){
            this.getActionTypesList();
        }

    }

    render(){
        let actionTypes = this.state.actionTypes;
        let classes = this.props.defaultSelectValue ? `w-100 action-type-${this.props.defaultSelectValue}` : 'w-100';
        return(
            <select className={classes} name='action_type' value={Object.keys(this.props.outerState).length > 0 ? this.props.outerState.value : this.state.value} onChange={(ev)=> {this.handleActionTypesSelectChange(ev, Object.keys(this.props.outerState).length > 0 ? true : false)}} required>
                <option className="bg-white" value=''>Wybierz...</option>   
                {actionTypes && Object.keys(actionTypes).map((actionType, i) => {
                    const actionTypeClassName = `action-type-${actionType}`;

                    return(
                        <option key={actionType} className={actionTypeClassName} value={actionType}>{actionTypes[actionType]}</option>
                    )
                })}   
            </select>               
        )
    }
}

SelectActionTypes.defaultProps = {
    defaultSelectValue: '',
    outerState: {},
};

export default SelectActionTypes;