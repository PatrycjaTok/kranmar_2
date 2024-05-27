import React from "react";
import SelectEmployees from "../elements/select_employees.js";

function AddHolidaysRow(props){

    return (<tr className="add-holiday-row bg-gradient">
        <td className="text-center">+</td>
        <td><input className='w-100' type='date' name='date_from' value={props.stateAddHolidayRow.date_from} onChange={(ev)=>{props.handleInputChange(ev)}} required></input></td>
        <td><input className='w-100' type='date' name='date_to' value={props.stateAddHolidayRow.date_to} onChange={(ev)=>{props.handleInputChange(ev)}} required></input></td>
        <td>
            <SelectEmployees name='employee' value={props.stateAddHolidayRow.employee} handleSelectChange={props.handleEmployeeChange ? props.handleEmployeeChange : ()=>{}}/>
        </td>
        <td></td>
        <td><textarea className='w-100' name='comments' placeholder='Komentarz...' value={props.stateAddHolidayRow.comments} onChange={(ev)=>{props.handleInputChange(ev)}}></textarea></td>
        <td className="no-search"><button className="btn btn-primary w-100" onClick={(ev)=>{props.handleAddHolidays(ev)}}>Dodaj</button></td>
    </tr>)
}

export default  AddHolidaysRow;