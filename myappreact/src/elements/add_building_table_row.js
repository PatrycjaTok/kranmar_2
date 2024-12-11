import React from "react";
import SelectCompanies from "../elements/select_companies.js";
import SelectEmployeesAndCompanies from "../elements/select_employees_companies.js";

function AddBuildingRow(props){

    return (<tr className="add-building-row bg-gradient" data-is_jumper={props.stateAddBuildingRow.is_jumper ? true:false}>
        <td className="text-center">+</td>
        <td><input className='w-100' type='text' data-validate_only_length='1' name='name' value={props.stateAddBuildingRow.name} onChange={(ev)=>{props.handleInputChange(ev)}} required></input></td>
        <td><input className='w-100' type='text' name='crane' value={props.stateAddBuildingRow.crane} onChange={(ev)=>{props.handleInputChange(ev)}}></input></td>
        <td><input className='w-100' type='date' name='date_start' value={props.stateAddBuildingRow.date_start} onChange={(ev)=>{props.handleInputChange(ev)}} required></input></td>
        <td><input className='w-100' type='date' name='date_end' value={props.stateAddBuildingRow.date_end} onChange={(ev)=>{props.handleInputChange(ev)}} required></input></td>
        <td></td>
        <td>
            <SelectCompanies name='company_fv' value={props.stateAddBuildingRow.company_fv} handleSelectChange={props.handleCompanyFVChange ? props.handleCompanyFVChange : ()=>{}}/>
        </td>
        <td>
            <SelectEmployeesAndCompanies name='default_employee' value={props.stateAddBuildingRow.default_employee} handleSelectChange={props.handleEmployeeChange ? props.handleEmployeeChange : ()=>{}}/>
            <h6 className="d-flex text-white pt-2 pb-0 mb-1"><span className="d-flex align-items-center">Czy jest skoczek?</span>
                <input className='form-check-input is-jumper-smaller' type='checkbox' name='is_jumper' value={props.stateAddBuildingRow.is_jumper} onChange={(ev)=>{props.handleCheckboxChange(ev)}}></input>
            </h6> 
            {props.stateAddBuildingRow.is_jumper && <SelectEmployeesAndCompanies name='jumper' value={props.stateAddBuildingRow.jumper} handleSelectChange={props.handleJumperChange ? props.handleJumperChange : ()=>{}}/>}
        </td>
        <td><textarea className='w-100' name='comments' placeholder='Komentarz...' value={props.stateAddBuildingRow.comments} onChange={(ev)=>{props.handleInputChange(ev)}}></textarea></td>
        <td className="no-search"><button className="btn btn-primary w-100" onClick={(ev)=>{props.handleAddBuilding(ev)}}>Dodaj</button></td>
    </tr>)
}

export default  AddBuildingRow;