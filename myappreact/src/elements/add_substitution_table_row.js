import React from "react";
import SelectEmployeesAndCompanies from "../elements/select_employees_companies.js";
import SelectActionTypes from "../elements/select_action_types.js";

function AddSubstitutionRow(props){

    return (<tr className="add-substitution-row bg-gradient">
        <td className="text-center">+</td>
        <td><input className='w-100' type='date' name='date' value={props.stateAddSubstitutionRow.date} onChange={(ev)=>{props.handleInputChange(ev)}} required></input></td>
        <td>
            <SelectEmployeesAndCompanies name='substituted' value={props.stateAddSubstitutionRow.substituted} handleSelectChange={props.handleSubstitutedChange ? props.handleSubstitutedChange : ()=>{}}/>
        </td>
        <td>
            <SelectEmployeesAndCompanies name='substituted_by' value={props.stateAddSubstitutionRow.substituted_by}  handleSelectChange={props.handleSubstitutedByChange ? props.handleSubstitutedByChange : ()=>{}}/>
        </td>
        <td>
            <SelectActionTypes outerState={{handler: props.handleActionTypeChange ? props.handleActionTypeChange : ()=>{}, value:props.stateAddSubstitutionRow.action_type}} setActionTypes={props.setActionTypes}/>
        </td>
        <td><input className='w-100' type='text' name='location' value={props.stateAddSubstitutionRow.location} onChange={(ev)=>{props.handleInputChange(ev)}}></input></td>
        <td><input className='w-100' type='text' name='crane' value={props.stateAddSubstitutionRow.crane} onChange={(ev)=>{props.handleInputChange(ev)}}></input></td>
        <td><input className='w-100' type='number' name='duration_hours' value={props.stateAddSubstitutionRow.duration_hours} onChange={(ev)=>{props.handleInputChange(ev)}}></input></td>
        <td><input className='w-100' type='number' name='amount' value={props.stateAddSubstitutionRow.amount} onChange={(ev)=>{props.handleInputChange(ev)}}></input></td>
        <td><textarea className='w-100' name='comments' placeholder='Komentarz...' value={props.stateAddSubstitutionRow.comments} onChange={(ev)=>{props.handleInputChange(ev)}}></textarea></td>
        <td className="no-search"><button className="btn btn-primary w-100" onClick={(ev)=>{props.handleAddSubstitution(ev)}}>Dodaj</button></td>
    </tr>)
}

export default  AddSubstitutionRow;