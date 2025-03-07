import React from "react";
import $ from 'jquery';
import Cookies from "universal-cookie";
import baseURL from "../utils/request";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEyeSlash} from "@fortawesome/free-solid-svg-icons";
// import baseHomeFunctions from "../utils/base_functions_home.js";

const cookies = new Cookies();
library.add(faEyeSlash);

class HideColumnInTable extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tableColumns: {}
        }
    }


    handleBtnClick = (ev) =>{
        let self=this;
        let htmlSwalContent = `<div class="swal-hide-show-columns">
        <h3 class="text-center pb-3">Pokaż/ukryj kolumny</h3>
        <div class="">`;
        let tableHeadersAndIndexes = {};

        for (const [key, value] of Object.entries(this.state.tableColumns)) {
            let text = value.text;
            let checked = value.show ? 'checked' : '';
            htmlSwalContent += `<div class="listPosition" data-column_index=${key}><label><input type="checkbox" ${checked}></input> ${text}</label></div>`
        }

        htmlSwalContent +=`</div></div>`;

            // Swal options
        withReactContent(Swal).fire({
            html: htmlSwalContent,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'info',
            confirmButtonText: 'Zapisz',
            cancelButtonText: 'Anuluj',   
            preConfirm: () => {
                $('.swal-hide-show-columns').find('.listPosition').each(function( index, value ) {
                    let valJQ = $(value);
                    let ind = valJQ.data('column_index');
                    let text = valJQ.text()
                    let checked = valJQ.find('input').prop('checked');
                    tableHeadersAndIndexes[`${ind}`] = {
                        'show': checked, 
                        'text': text
                    };
                });

                this.setState({tableColumns: tableHeadersAndIndexes});
            },                  
        }).then((result) => {
            if(result.isConfirmed){
                let table = $('.hide-show-table-column').parent().find('table');
                for (const [key, value] of Object.entries(self.state.tableColumns)) {
                    let ind = Number(key) + 1;
                    if(value.show){
                        table.find(`tr th:nth-child(${ind})`).removeClass('d-none');
                        table.find(`tr td:nth-child(${ind})`).removeClass('d-none');
                    }else{
                        table.find(`tr th:nth-child(${ind})`).addClass('d-none');
                        table.find(`tr td:nth-child(${ind})`).addClass('d-none');
                    }
                }
                
            };        
        });
    }

    componentDidMount(){
        let table = $('.hide-show-table-column').parent().find('table');
        let tableHeadersAndIndexes = {};
        table.find('tr').first().find('th').each(function( index, value ) {
            tableHeadersAndIndexes[`${index}`] = {
                'show': true, 
                'text': $(value).text()
            };
        });
        this.setState({tableColumns: tableHeadersAndIndexes});

    }

    render(){
        return(
            <button className="btn btn-primary hide-column-btn" onClick={(ev)=> {this.handleBtnClick(ev)}}>
                <span className="hide-column-btn-text">Widoczność kolumn</span> <FontAwesomeIcon icon={faEyeSlash} title="Pokaż/ukryj kolumnę"/>
            </button>               
        )
    }
}


export default HideColumnInTable;