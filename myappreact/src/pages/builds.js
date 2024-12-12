import React from "react";
import $ from 'jquery';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faEdit, faExchangeAlt, faExclamationTriangle, faExternalLinkAlt} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import fancyTable from "../scripts/fancytable.min.js";
import baseURL from "../utils/request";
import baseFunctions from "../utils/base_functions";
import baseHomeFunctions from "../utils/base_functions_home.js";
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import AddBuildingRow from "../elements/add_building_table_row.js";
import SelectEmployeesAndCompanies from "../elements/select_employees_companies.js";
import SelectCompanies from "../elements/select_companies.js";

const cookies = new Cookies();
library.add(faTrash, faEdit, faExchangeAlt, faExclamationTriangle);
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

const initialAddBuildingDict = {
    name: '',
    crane: '',
    date_start: '',
    date_end: '',
    company_builds: {value: '', label: 'Wybierz...'},
    company_fv: {value: '', label: 'Wybierz...'},
    manager_phone_number: '',
    default_employee: {value: '', label: 'Wybierz...'},
    is_jumper: false,
    jumper: {value: '', label: 'Wybierz...'},
    comments: '',
}

const todayDate = new Date();
const currentDateYear = todayDate.getFullYear();
let currentDateDay = todayDate.getDate();
let currentDateMonth = todayDate.getMonth();
if(currentDateDay<10){currentDateDay = "0" + currentDateDay;}
currentDateMonth = currentDateMonth+1;
if(currentDateMonth<10){currentDateMonth = "0" + currentDateMonth;}

let todayDateYMD = `${currentDateYear}-${currentDateMonth}-${currentDateDay}`;
let todayDateDisplay = `${currentDateDay}-${currentDateMonth}-${currentDateYear}`;

class Builds extends React.Component{

    constructor(props){
        super(props);
        this.chartRef = React.createRef();
        this.state={
            AddBuildingRow: {...initialAddBuildingDict},
            settedDateYear: currentDateYear,
            builds: [],
            chartData: {
                labels: [''],
                responsive: true,
                maintainAspectRatio: false,
                datasets: [{
                    label: '',
                    data: [{x: `${currentDateYear}-01-01`, y: 0}, {x: `${currentDateYear}-12-31`, y: 0}],
                    borderColor: 'transparent',
                    tension: 0
                }]
            },
            weeksChartLabels: [],
            monthsChartLabels: [],
        };
        this.handleEmployeeChange = this.handleEmployeeChange.bind(this);
        this.handleJumperChange = this.handleJumperChange.bind(this);
        this.handleCompanyFVChange = this.handleCompanyFVChange.bind(this);
    }

    fetchData = (date_year=currentDateYear) => {
        let self = this;
        
        $.ajax({
            url: baseURL + '/get-builds/',
            method: 'GET',
            dataType: 'json',
            // async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: {"date_year" : `${date_year}`},
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                if(data.builds){  
                    let allDates = [];
                    let heights = [1, 0.5, 1.5, 0.75, 1.25];
                    let datasets = [];
                    let globalChartLabels = [];
                    let monthsChartLabels = [];
                    let weeksChartLabels = [];
                    let chartData = {                       
                        labels: globalChartLabels,
                        datasets: datasets
                    } 
                    
                    data.chart_labels.forEach((label, i)=>{
                        if(label.month){
                            monthsChartLabels.push(label.value);
                        }else if (label.week){
                            weeksChartLabels.push(label.value);
                        }

                        globalChartLabels.push(label.value);
                    }) 
                    
                    // label for today
                    datasets.push({
                        label: 'Dziś',
                        data: [{x: todayDateYMD, y: 0}, {x: todayDateYMD, y: 2}],
                        borderColor: '#f11ff1',
                        tension: 0,    
                        pointStyle: false,                   
                        // fill: true
                        tooltip:{
                            callbacks:{                              
                                label: function(context) {
                                    let label = context.dataset.label || '';   

                                    return label;
                                },

                                labelColor: function(context) {
                                    let labelSquareBorderColor = context.element.options.borderColor;

                                    return {
                                        backgroundColor: labelSquareBorderColor,
                                        borderColor: 'black',
                                        borderWidth: 0,
                                    };
                                },
                               
                            }
                        }
                    });
                    
                    data.builds.forEach(buildData => {
  
                        let dateStart = Number(buildData.date_start.show_on_chart) === 1 ? buildData.date_start.value : null;
                        let dateEnd= Number(buildData.date_end.show_on_chart) === 1 ? buildData.date_end.value : null;

                        let yHeightStart = heights[0];
                        let yHeightEnd = heights[0];

                        if(dateStart !== null && allDates.includes(dateStart)){
                            let sameDateStartCounter = (allDates.filter((date_1) => date_1 === dateStart)).length; 
                            if(sameDateStartCounter < 5){yHeightStart = heights[sameDateStartCounter]};
                        }
                        
                        if(dateEnd !== null && allDates.includes(dateEnd)){
                            let sameDateEndCounter = (allDates.filter((date_1) => date_1 === dateEnd)).length; 
                            if(sameDateEndCounter < 5){yHeightEnd = heights[sameDateEndCounter]};
                        }                  
                        
                        datasets.push({
                            label: buildData.name + ', Żuraw: ' + buildData.crane,
                            data: [{x: dateStart, y: yHeightStart}],
                            borderColor: 'green',
                            tension: 0,
                            fill: {value: 0},
                            backgroundColor: '#0000000e',
                            // scales: { 
                            // },
                            pointRadius: 5,
                            pointHoverRadius: 7,   
                            pointBackgroundColor: 'rgb(0 211 11)',  
                            // pointBorderColor: color,   
                            pointBorderWidth: 1,                    
                            tooltip:{
                                callbacks:{
                                    label: function(context) {
                                        let label = context.dataset.label || '';  
                                        return label;
                                    },

                                    labelColor: function(context) {
                                        let labelSquareBorderColor = context.element.options.borderColor;

                                        return {
                                            backgroundColor: labelSquareBorderColor,
                                            borderColor: 'black',
                                            borderWidth: 0,
                                        };
                                    },

                                    afterLabel: function(context) {                  
                                        let afterLabel = 'Start budowy';
                                        return afterLabel;
                                    },
                                }
                            }
                          
                        });

                        datasets.push({
                            label: buildData.name + ', Żuraw: ' + buildData.crane,
                            data: [{x: dateEnd, y: yHeightEnd}],
                            borderColor: 'red',
                            tension: 0,
                            fill: {value: 0},
                            backgroundColor: '#0000000e',
                            // scales: { 
                            // },
                            pointRadius: 5,
                            pointHoverRadius: 7,   
                            pointBackgroundColor: 'red',  
                            // pointBorderColor: color,   
                            pointBorderWidth: 1,                    
                            tooltip:{
                                callbacks:{
                                    label: function(context) {
                                        let label = context.dataset.label || '';   

                                        return label;
                                    },

                                    labelColor: function(context) {
                                        let labelSquareBorderColor = context.element.options.borderColor;

                                        return {
                                            backgroundColor: labelSquareBorderColor,
                                            borderColor: 'black',
                                            borderWidth: 0,
                                        };
                                    },

                                    afterLabel: function(context) {                  
                                        let afterLabel = 'Koniec budowy';
                                        return afterLabel;
                                    },
                                }
                            }
                          
                        });

                        allDates.push(dateStart, dateEnd);
                    });

                    self.setState({builds: data.builds, chartData: chartData, monthsChartLabels: monthsChartLabels, weeksChartLabels: weeksChartLabels});
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

    handleInputChange = (ev) =>{
        let name = ev.target.name;
        let value = ev.target.value;
        let copyAddBuildingRow = { ...this.state.AddBuildingRow}; //create a new copy of state AddSubstitutionRow
        copyAddBuildingRow[name] = value; //change the value of name
        this.setState({AddBuildingRow: copyAddBuildingRow}) // settings state
    }


    handleCheckboxChange = (ev) =>{
        let name = ev.target.name;
        let checked = ev.target.checked;
        let copyAddBuildingRow = { ...this.state.AddBuildingRow}; //create a new copy of state AddSubstitutionRow
        copyAddBuildingRow[name] = checked; //change the value of name
        this.setState({AddBuildingRow: copyAddBuildingRow}) // settings state
    }

    handleSwalEditBuildingCheckboxChange = (ev) =>{
        let checked = ev.target.checked;

        if(checked){
            $('#swalEditBuildingJumperInput').removeClass('d-none');  
            $('.swal-building-table').addClass('isJumper');
        }else{
            $('#swalEditBuildingJumperInput').addClass('d-none');  
            $('.swal-building-table').removeClass('isJumper');
        }        
    }

    handleOnInputYear(ev){
        let year = ev.target.value;
        this.fetchData(year);
        this.setState({settedDateYear: year})
    }

    handleEmployeeChange(ev){     
        let copyAddBuildingRow = { ...this.state.AddBuildingRow, default_employee : {value: ev.value, label:ev.label}}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddBuildingRow: copyAddBuildingRow}) // settings state
    }

    handleJumperChange(ev){     
        let copyAddBuildingRow = { ...this.state.AddBuildingRow, jumper : {value: ev.value, label:ev.label}}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddBuildingRow: copyAddBuildingRow}) // settings state
    }

    handleCompanyFVChange(ev){     
        let copyAddBuildingRow = { ...this.state.AddBuildingRow, company_fv : {value: ev.value, label:ev.label}}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddBuildingRow: copyAddBuildingRow}) // settings state
    }

    handleAddBuilding = (ev) =>{
        let evTarget = $(ev.target);
        let dataRow = evTarget.closest('.add-building-row');
        let validation = true;
        const self = this;

        dataRow.find('input:required, select:required, textarea:required').each((ind, elem)=>{        
            if($(elem).attr('name')){
                if(!baseFunctions.inputValidation($(elem))){validation = false;}
            }
        })

        if(validation){
            let requestData = {};

            dataRow.find('input, select, textarea').each((ind, elem)=>{        
                if($(elem).attr('name')){
                    requestData[$(elem).attr('name')] = $(elem).val();
                }
            })

            $.ajax({
                url: baseURL + '/building-create/',
                method: 'POST',
                dataType: 'json',
                async: false,
                headers: {
                  "Content-Type": 'application/json',
                  "X-CSRFToken": cookies.get("csrftoken")
                },
                data: JSON.stringify(requestData),
                xhrFields: {
                    withCredentials: true
                },
                success: function(data) {
                    withReactContent(Swal).fire({
                        title: data.messages.success,
                        showConfirmButton: false,
                        icon: 'success',
                        timer: 3000,
                        // timerProgressBar: true
                    }).then(()=>{
                        self.fetchData();
                        self.setState({AddBuildingRow: {...initialAddBuildingDict}}, () => { 
                            // clear date-inputs values        
                            dataRow.find('input[type="date"]').change();  
                            // clear checkbox-inputs values
                            dataRow.find('input[type="checkbox"]').prop('checked', false).change();                       
                        })
                    })  
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
        
    }

    removeBuilding(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let buildingId = tr.data('building_id');
        let buildingName = tr.find('td:nth-child(2)').text();
        let craneName = tr.find('td:nth-child(3)').text();
        let headerText = `${buildingName}`;
        if (craneName !== '' && craneName.length > 0){
            headerText += `, żuraw ${craneName}`;
        }

        withReactContent(Swal).fire({
            html: <div>
                <h3>Czy na pewno chcesz <br></br><span className="text-danger"><b>USUNĄĆ</b> budowę: <br></br><br></br>{headerText}</span>?</h3>
            </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, chcę',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        })
        .then((result)=>{
            if(result.isConfirmed){
                $.ajax({
                    url: baseURL + '/building-remove/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"building_id": buildingId}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Usunięto budowę ${headerText}.`,
                            showConfirmButton: false,
                            icon: 'success',
                            timer: 3000,
                            // timerProgressBar: true
                        }).then(()=>{
                            self.fetchData();
                        });   
                    },
                    error: function(xhr, status, err) {
                        // let errorText = xhr.responseJSON.messages.errors;
                        withReactContent(Swal).fire({
                            title: 'Nie udało się usunąć budowy.',
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

    editBuilding(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let buildingId = tr.data('building_id');

        $.ajax({
            url: baseURL + '/get-building-data/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify({"building_id": buildingId}),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                let buildingData = data.building;           
                let htmlContent = <div className="swal-form edit-holiday-form edit-building-form">
                    <h3 className="text-center pb-3">Edytuj Budowę
                    </h3>
                    <div className="table-wrapper swal-tabble-wrapper">
                        <form noValidate>
                            <input type="hidden" name='building_id' value={buildingId}></input>
                            <table className={buildingData.is_jumper ? "swal-holidays-table swal-building-table isJumper" : "swal-holidays-table swal-building-table"}>
                                <thead>
                                    <tr className="bg-primary bg-gradient text-light"> 
                                        <th data-sortas="case-insensitive">Budowa</th> 
                                        <th data-sortas="case-insensitive" className="table-td-m">Żuraw</th> 
                                        <th data-sortas="case-insensitive" className="table-td-xs">Od</th> 
                                        <th data-sortas="case-insensitive" className="table-td-xs">Do</th>
                                        <th data-sortas="case-insensitive">Firma (FV)</th> 
                                        <th data-sortas="case-insensitive">Domyślny pracownik</th>                               
                                        <th data-sortas="case-insensitive" className="table-td-xl-2">Uwagi/Komentarz</th>
                                    </tr> 
                                </thead>
                                <tbody>
                                    <tr className="bg-gradient swal-holidays-row">
                                        <td><input className='w-100' type='text' data-validate_only_length='1'  name='name' defaultValue={buildingData.name ? buildingData.name : ''} required></input></td>
                                        <td><input className='w-100' type='text' name='crane' defaultValue={buildingData.crane ? buildingData.crane : ''}></input></td>
                                        <td><input className='w-100' type='date' name='date_start' defaultValue={buildingData.date_start ? buildingData.date_start : ''} required></input></td>
                                        <td><input className='w-100' type='date' name='date_end' defaultValue={buildingData.date_end ? buildingData.date_end : ''} required></input></td>
                                        <td>
                                            <SelectCompanies name='company_fv' defaultSelectValue={buildingData.company_fv ? {value: buildingData.company_fv, label: buildingData.company_fv_full_name} : ''}/>
                                        </td>
                                        <td>
                                            <SelectEmployeesAndCompanies name='default_employee' defaultSelectValue={buildingData.default_employee ? {value: buildingData.default_employee, label: buildingData.default_employee_full_name} : ''}/>
                                            <h6 className="d-flex text-white pt-2 pb-0 mb-1">
                                                <span className="d-flex align-items-center text-primary">Czy jest skoczek?</span>
                                                <input id='swalEditBuildingIsJumperInp' className='form-check-input is-jumper-smaller' type='checkbox' data-name='is_jumper' onChange={(ev)=>{self.handleSwalEditBuildingCheckboxChange(ev)}}></input>
                                            </h6> 
                                            <span id='swalEditBuildingJumperInput' className={buildingData.is_jumper ? "" : "d-none"}><SelectEmployeesAndCompanies name='jumper' defaultSelectValue={buildingData.jumper ? {value: buildingData.jumper, label: buildingData.jumper_full_name} : ''}/></span>
                                        </td>
                                        <td className="no-search"><textarea className='w-100' name='comments' defaultValue={buildingData.comments ? buildingData.comments : ''} placeholder='Komentarz...'></textarea></td>
                                    </tr>
                                </tbody>
                            </table>           
                        </form>
                    </div>
                </div>

                 // Swal options
                withReactContent(Swal).fire({
                    html: htmlContent,
                    showConfirmButton: true,
                    showCancelButton: true,
                    icon: 'info',
                    confirmButtonText: 'Zapisz',
                    cancelButtonText: 'Anuluj',
                    customClass: {
                        container: 'swal-container-with-table',
                        popup: 'swal-popup-with-table',                        
                    },                
                    didOpen: (swalWindow) => {
                        // addEmployeeSwal.showLoading()
                        baseHomeFunctions.bindDatesInputsInSwal(swalWindow);   
                        if(buildingData.is_jumper){
                            $('#swalEditBuildingIsJumperInp').prop('checked', true).change();                           
                        }                                  
                    },
                    preConfirm: () => {
                        let form = $('.swal-form.edit-holiday-form.edit-building-form form').first();
                        let validation = baseFunctions.formValidation(form);        
                        if(!validation.validation){
                            Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
                        }else{
                            const data = new FormData(form[0]);
                            data.append('is_jumper', form.find('input[data-name="is_jumper"]')[0].checked);
                            const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                            let result = false;

                            $.ajax({
                                url: baseURL + '/building-edit/',
                                method: 'POST',
                                dataType: 'json',
                                async: false,
                                headers: {
                                  "Content-Type": 'application/json',
                                  "X-CSRFToken": cookies.get("csrftoken")
                                },
                                data: objectData,
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function(data) {
                                    result = data;
                                },
                                error: function(xhr, status, err) {
                                  let errorText = xhr.responseJSON.messages.errors;
                                  Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
                                }
                            });
                
                            if(result){return result;}
                        }
                    },
                }).then((result) => {
                    if(result.isConfirmed){
                        withReactContent(Swal).fire({
                            title: result.value.messages.success,
                            showConfirmButton: false,
                            icon: 'success',
                            timer: 3000,
                            // timerProgressBar: true
                        }).then(()=>{
                            self.fetchData();
                        });
                    };        
                });
            },
            error: function(xhr, status, err) {
                console.log('Nie udało się pobrać danych budów.');  
                return {};                             
            }
        });
    
    }

    // handleChartLiClick = (ev, datasetIndex) =>{
    //     let chart = this.chartRef.current;
    //     chart.setDatasetVisibility(datasetIndex, !chart.isDatasetVisible(datasetIndex));
        
    //     // legend update
    //     $(ev.target).closest('li').toggleClass('legend-box-dataset-hide')
    //     chart.update();
    //     ev.stopPropagation();
    // }

    // handleChartLiMouseOver = (ev, datasetIndex) =>{     
    //     let activeHoverColor = '#4cff00';   
    //     let chart = this.chartRef.current;
    //     let metaDataset = chart.getDatasetMeta(datasetIndex).dataset;

    //     metaDataset.options.borderColor = activeHoverColor;
    //     metaDataset.options.borderWidth = 4;
    //     metaDataset._points[0].options.borderColor = activeHoverColor;
    //     metaDataset._points[0].options.backgroundColor = activeHoverColor;
    //     metaDataset._points[1].options.borderColor = activeHoverColor;
    //     metaDataset._points[1].options.backgroundColor = activeHoverColor;
    //     chart.render();
    //     ev.stopPropagation();
    // }

    // handleChartLiMouseOut = (ev, datasetIndex) =>{ 
    //     let chart = this.chartRef.current;
    //     let metaDataset = chart.getDatasetMeta(datasetIndex).dataset;
    //     let lastHoverLineColor = $(ev.target).closest('li').find('span').css('background-color');

    //     metaDataset.options.borderColor = lastHoverLineColor;
    //     metaDataset.options.borderWidth = 3;
    //     metaDataset._points[0].options.borderColor = lastHoverLineColor;
    //     metaDataset._points[0].options.backgroundColor = lastHoverLineColor;
    //     metaDataset._points[1].options.borderColor = lastHoverLineColor;
    //     metaDataset._points[1].options.backgroundColor = lastHoverLineColor;
    //     chart.render();
    //     ev.stopPropagation();
    // }

    // updateChartLegend = () => {
    //     let self = this;
    //     let ulElementPast = $('#HolidaysChartLegend div[data-piece_of_time="past"] ul');
    //     let ulElementCurrenAndPast = $('#HolidaysChartLegend div[data-piece_of_time="current_and_future"] ul');
    //     let chart = this.chartRef.current;

    //     ulElementPast.html('');
    //     ulElementCurrenAndPast.html('');
        
    //     if(chart && chart.legend.legendItems && chart.legend.legendItems.length > 0){   
    //         setTimeout(()=>{
    //             chart.legend.legendItems.forEach((dataset, index) => {
    //                 let text = dataset.text;
    //                 let datasetIndex = dataset.datasetIndex;
    //                 let bColor = dataset.strokeStyle;
    //                 let firstPoint = chart.data.datasets[dataset.datasetIndex].data[0].x;
        
    //                 const liElement = $(`<li><span style=" border-color:${bColor}; background-color:${bColor}"></span><p>${text}</p></li>`);
                    
    //                 liElement.click((ev)=>{
    //                     self.handleChartLiClick(ev, datasetIndex);
    //                 })

    //                 liElement.mouseover((ev)=>{
    //                     self.handleChartLiMouseOver(ev, datasetIndex);
    //                 })

    //                 liElement.mouseout((ev)=>{
    //                     self.handleChartLiMouseOut(ev, datasetIndex);
    //                 })
    
    //                 if(firstPoint < String(todayDateYMD)){
    //                     ulElementPast.prepend(liElement);
    //                 }else{
    //                     ulElementCurrenAndPast.prepend(liElement);
    //                 }
                    
    //             });
    //         }, 300)    
    //     }

    // }

    // componentDidUpdate(prevProps, prevState){ 
    //     if(prevState.chartData !== this.state.chartData){
    //         this.updateChartLegend();
    //     };
    // }

    componentDidMount(){
        this.fetchData(); 

        setTimeout(() => { 
            $(".custom-fancytable").fancyTable({
                sortColumn: 5,
                sortOrder: 1,
                pagination: true,
                searchable: true,
                globalSearch: false,
                perPage: 40,
                inputPlaceholder: 'Szukaj...'
            });

            $('.no-action, .no-action a').off();	 

            baseHomeFunctions.bindDatesInputs($('tr.add-building-row')); 
            
            // scroll chart to current month
            const scrollContainer = document.getElementById('BuildingsChartContainer');   
            if(scrollContainer){
                let scrollContainerWidth = scrollContainer.scrollWidth; 
                if(scrollContainerWidth && Number(scrollContainerWidth)>0) { 
                    let currentMonthBox = $('#BuildingsChartContainer .month-box')[Number(currentDateMonth)-1];
                    let left = currentMonthBox.offsetLeft;
                    // $('#BuildingsChartContainer')[0].scrollLeft = left - ($('#BuildingsChartContainer').width()/(scrollContainerWidth/$('#BuildingsChartContainer').width()));
                    $('#BuildingsChartContainer')[0].scrollTo({
                        left: left - ($('#BuildingsChartContainer').width()/(scrollContainerWidth/$('#BuildingsChartContainer').width())),
                        behavior: "smooth",
                      });
                } 
            }
            
        }, 300);   
      
    }

    render(){ 
        let self = this;
        let settedDateYear = this.state.settedDateYear;
        let februaryDaysCount = new Date(settedDateYear, 2, 0).getDate();
        let builds = this.state.builds;
        let chartData = this.state.chartData;
        let chartOptions = {
            responsive: true,
            maintainAspectRatio: false,   
            plugins: {
                legend: {
                    display: false
                }
            },         
            scales: {
              y: {
                beginAtZero: true,
                stepSize: 1,
                max: 2,
                ticks:{
                    autoSkip: false,
                    callback: function(val, index, ticks) {
                        // console.log(this)
                        // console.log(ticks)
                        if(this.getLabelForValue(val) == 3){
                            return '';
                        }
                        return;
                    },                  
                } 
              },
              x: {
                ticks:{
                    maxTicksLimit: 80,
                    autoSkip: false,
                    callback: function(val, index, ticks) {
                        // console.log(this)
                        // console.log(ticks)
                        const label = this.getLabelForValue(val);

                        if(label===todayDateYMD){                 
                            return baseHomeFunctions.YMDtoDMY(label);
                        }

                        if(self.state.monthsChartLabels.includes(label)){
                            return baseHomeFunctions.YMDtoDMY(label);
                        }else if(self.state.weeksChartLabels.includes(this.getLabelForValue(val))){
                            return '';
                        }else{
                            return;
                        }
                        
                    },                  
                } 
              }             
            }

        };

        return(
            <div className="position-relative holidays-page">
                <h2 className="text-center pb-2 pb-lg-3">Budowy <span className="holidays-year-container"><input className='' type='number' name='date_year' defaultValue={currentDateYear} onInput={(ev)=>{this.handleOnInputYear(ev)}}></input></span></h2>
                
                {/* <div id='HolidaysChartLegend' className="chart-js-custom-legend-box pb-1">
                    
                    <div className="accordion pb-1" id="accordionChartLegendCurrent">
                        <div className="accordion-item">
                            <h2 className="accordion-header d-flex justify-content-center" id="ChartLegendCurrentHeadingOne">
                            <button className="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse" data-bs-target="#accChartLegendcollapseOne2" aria-expanded="false" aria-controls="accChartLegendcollapseOne2">
                                <span className="fw-bolder">Pokaż legendę</span>
                            </button>
                            </h2>
                            <div id="accChartLegendcollapseOne2" className="accordion-collapse collapse" aria-labelledby="ChartLegendCurrentHeadingOne" data-bs-parent="#accordionChartLegendCurrent">
                            <div className="accordion-body p-1">
                                <div data-piece_of_time="current_and_future">
                                    <ul>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="accordion" id="accordionChartLegendPast">
                        <div className="accordion-item">
                            <h2 className="accordion-header d-flex justify-content-center" id="ChartLegendPastHeadingOne">
                            <button className="accordion-button collapsed p-1" type="button" data-bs-toggle="collapse" data-bs-target="#accChartLegendcollapseOne" aria-expanded="false" aria-controls="accChartLegendcollapseOne">
                                <span>Legendy z przeszłości</span>
                            </button>
                            </h2>
                            <div id="accChartLegendcollapseOne" className="accordion-collapse collapse" aria-labelledby="ChartLegendPastHeadingOne" data-bs-parent="#accordionChartLegendPast">
                            <div className="accordion-body p-1">
                                <div data-piece_of_time="past">
                                    <ul>
                                    </ul>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                </div> */}

                <div id='BuildingsChartContainer' className="d-flex justify-content-start w-100">
                    <div className="chartContainer pb-2">
                        <Chart ref={this.chartRef} type='line' data={chartData} options={chartOptions}/>
                        <div className="chart-absolute-paint-area">
                            <div className="month-box" data-days_count='31'>
                                <p>Styczeń</p>
                            </div>
                            <div className="month-box month-box-february" data-days_count={februaryDaysCount}>
                                <p>Luty</p>
                            </div>
                            <div className="month-box" data-days_count='31'>
                                <p>Marzec</p>
                            </div>
                            <div className="month-box" data-days_count='30'>
                                <p>Kwiecień</p>
                            </div>
                            <div className="month-box" data-days_count='31'>
                                <p>Maj</p>
                            </div>
                            <div className="month-box" data-days_count='30'>
                                <p>Czerwiec</p>
                            </div>
                            <div className="month-box" data-days_count='31'>
                                <p>Lipiec</p>
                            </div>
                            <div className="month-box" data-days_count='31'>
                                <p>Sierpień</p>
                            </div>
                            <div className="month-box" data-days_count='30'>
                                <p>Wrzesień</p>
                            </div>
                            <div className="month-box" data-days_count='31'>
                                <p>Październik</p>
                            </div>
                            <div className="month-box" data-days_count='30'>
                                <p>Listopad</p>
                            </div>
                            <div className="month-box" data-days_count='31'>
                                <p>Grudzień</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="table-wrapper lg-d-flex-justify-center pt-5">
                    <div className="mb-3">
                        <table className="custom-fancytable buildings-table">
                            <thead>
                                <tr className="bg-primary bg-gradient text-light"> 
                                    <th className="no-action table-td-xxs"></th>
                                    <th data-sortas="case-insensitive">Budowa</th> 
                                    <th data-sortas="case-insensitive" className="table-td-m">Żuraw</th> 
                                    <th data-sortas="case-insensitive" className="table-td-xs">Od</th> 
                                    <th data-sortas="case-insensitive" className="table-td-xs">Do</th> 
                                    <th data-sortas="numeric" className="table-td-xs">Status</th> 
                                    <th data-sortas="case-insensitive">Firma (FV)</th> 
                                    <th data-sortas="case-insensitive">Domyślny pracownik</th>                               
                                    <th data-sortas="case-insensitive" className="table-td-xl-2">Uwagi/Komentarz</th>
                                    <th className="no-action th-action">Akcje</th> 
                                </tr> 
                                <AddBuildingRow handleAddBuilding={this.handleAddBuilding} handleInputChange={this.handleInputChange} stateAddBuildingRow={this.state.AddBuildingRow} handleEmployeeChange={this.handleEmployeeChange} handleJumperChange={this.handleJumperChange} handleCompanyFVChange={this.handleCompanyFVChange} handleCheckboxChange={this.handleCheckboxChange}/>
                            </thead>
                            <tbody>                        
                                {builds.length > 0 && builds.map((building, i) => {                        

                                    return(
                                    <tr key={building.id} data-building_id={building.id}>                               
                                        <td className="text-center"></td>
                                        <td>{building.name}</td>
                                        <td>{building.crane}</td>
                                        <td data-sortvalue={building.date_start.value}>{baseHomeFunctions.YMDtoDMY(building.date_start.value)}</td>
                                        <td data-sortvalue={building.date_end.value}>{baseHomeFunctions.YMDtoDMY(building.date_end.value)}</td>
                                        <td data-sortvalue={building.status.key === 'active' ? '2' : (building.status.key === 'upcoming' ? '1' : (building.status.key === 'ended' ? '3' : '0'))} data-building_status={building.status.key} className="text-center">{building.status.name}</td>
                                        <td>{building.company_fv_full_name}</td>
                                        <td>{building.default_employee_full_name}{building.is_jumper && <p className="mb-0"><span className="little-label-s text-primary">Skoczek: </span>{building.jumper_full_name}</p>}</td>
                                        <td>{building.comments}</td>
                                        <td className="no-search td-action"><FontAwesomeIcon icon={faEdit} onClick={(ev)=>{this.editBuilding(ev)}} title="edytuj"/><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeBuilding(ev)}} title="usuń" /></td>
                                    </tr>
                                    )
                                })}      
                            </tbody>                           
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Builds;