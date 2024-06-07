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
import AddHolidaysRow from "../elements/add_holidays_table_row.js";
import SelectEmployees from "../elements/select_employees.js";

const cookies = new Cookies();
library.add(faTrash, faEdit, faExchangeAlt, faExclamationTriangle);
ChartJS.register(LineController, LineElement, PointElement, LinearScale, Title);

const initialAddHolidayDict = {
    date_from: '',
    date_to: '',
    employee: {value: '', label: 'Wybierz...'},
    duration_days: '',
    comments: '',
}

const todayDate = new Date();
const currentDateYear = todayDate.getFullYear();
let currentDateDay = todayDate.getDate();
let currentDateMonth = todayDate.getMonth();
if(currentDateDay<10){currentDateDay = "0" + currentDateDay;}
if(currentDateMonth<10){currentDateMonth = "0" + (currentDateMonth+1);}

let todayDateYMD = `${currentDateYear}-${currentDateMonth}-${currentDateDay}`;
let todayDateDisplay = `${currentDateDay}-${currentDateMonth}-${currentDateYear}`;

class Holidays extends React.Component{

    constructor(props){
        super(props);
        this.chartRef = React.createRef();
        this.state={
            AddHolidayRow: {...initialAddHolidayDict},
            settedDateYear: currentDateYear,
            holidays: [],
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
            monthsChartLabels: []
        };
        this.handleEmployeeChange = this.handleEmployeeChange.bind(this);
    }

    fetchData = (date_year=currentDateYear) => {
        let self = this;
        
        $.ajax({
            url: baseURL + '/get-holidays/',
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
                if(data.holidays){  

                    let colors = ['red', 'blue', 'green', 'orange', '#0cc7dd', 'purple'];
                    let heights = [0.5, 1, 1.5, 2, 2.5, 0.75, 1.25, 1.75, 2.25];
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
                        data: [{x: todayDateYMD, y: 0}, {x: todayDateYMD, y: 3}],
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
                    
                    data.holidays.forEach(holidayData => {
                        const color = colors[0];
                        const yHeight = heights[0];
                        
                        datasets.push({
                            label: holidayData.employee_full_name,
                            data: [{x: holidayData.date_from, y: yHeight}, {x: holidayData.date_to, y: yHeight}],
                            borderColor: color,
                            tension: 0,
                            fill: {value: 0},
                            backgroundColor: '#0000000e',
                            // scales: { 
                            // },
                            pointRadius: 4,
                            pointHoverRadius: 6,   
                            pointBackgroundColor: color,  
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
                                        let afterLabel = context.dataIndex === 0 ? 'start' : 'koniec';
                                        return afterLabel;
                                    },
                                }
                            }
                          
                        });

                        colors.push(colors.shift());
                        heights.push(heights.shift());
                    });

                    self.setState({holidays: data.holidays, chartData: chartData, monthsChartLabels: monthsChartLabels, weeksChartLabels: weeksChartLabels});
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
        let copyAddHolidayRow = { ...this.state.AddHolidayRow}; //create a new copy of state AddSubstitutionRow
        copyAddHolidayRow[name] = value; //change the value of name
        this.setState({AddHolidayRow: copyAddHolidayRow}) // settings state
    }

    handleOnInputYear(ev){
        let year = ev.target.value;
        this.fetchData(year);
        this.setState({settedDateYear: year})
    }

    handleEmployeeChange(ev){     
        let copyAddHolidayRow = { ...this.state.AddHolidayRow, employee : {value: ev.value, label:ev.label}}; //create a new copy of state and change AddSubstitutionRow
        this.setState({AddHolidayRow: copyAddHolidayRow}) // settings state
    }

    handleAddHoliday = (ev) =>{
        let evTarget = $(ev.target);
        let dataRow = evTarget.closest('.add-holiday-row');
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
                url: baseURL + '/holidays-create/',
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
                        self.setState({AddHolidayRow: {...initialAddHolidayDict}}, () => { 
                            // clear date-inputs values
                            dataRow.find('input[type="date"]').change();
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

    removeHoliday(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let holidayId = tr.data('holiday_id');
        let holidayNr = tr.find('td').first().text();
        let holidayEmployeeName = tr.find('td:nth-child(4)').text();
        let headerText = `Dotyczy: ${holidayEmployeeName}.`;

        withReactContent(Swal).fire({
            html: <div>
                <h3>Czy na pewno chcesz <br></br><span className="text-danger">usunąć pozycję <b>nr {holidayNr}</b></span> ?</h3>
                <p><span>{headerText}</span></p>
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
                    url: baseURL + '/holiday-remove/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"holiday_id": holidayId}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Usunięto urlop nr ${holidayNr}: ${holidayEmployeeName}.`,
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
                            title: 'Nie udało się usunąć urlopu.',
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

    editHoliday(ev){
        let self = this;
        let tr = $(ev.target).closest('tr');
        let holidayId = tr.data('holiday_id');

        $.ajax({
            url: baseURL + '/get-holiday-data/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: JSON.stringify({"holiday_id": holidayId}),
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                let holidayData = data.holiday;

                let htmlContent = <div className="swal-form edit-holiday-form">
                    <h3 className="text-center pb-3">Edytuj Urlop
                    </h3>
                    <div className="table-wrapper swal-tabble-wrapper">
                        <form className="d-flex justify-content-center" noValidate>
                            <input type="hidden" name='holiday_id' value={holidayId}></input>
                            <table className="swal-holidays-table">
                                <thead>
                                    <tr className="bg-primary bg-gradient text-light"> 
                                        <th data-sortas="case-insensitive">Od</th> 
                                        <th data-sortas="case-insensitive">Do</th> 
                                        <th data-sortas="case-insensitive">Kto</th>                                        
                                        <th className="no-action">Uwagi/Komentarz</th>
                                    </tr> 
                                </thead>
                                <tbody>
                                    <tr className="bg-gradient swal-holidays-row">
                                        <td><input className='w-100' type='date' name='date_from' defaultValue={holidayData.date_from ? holidayData.date_from : ''} required></input></td>
                                        <td><input className='w-100' type='date' name='date_to' defaultValue={holidayData.date_to ? holidayData.date_to : ''} required></input></td>
                                        <td>
                                            <SelectEmployees name='employee' defaultSelectValue={holidayData.employee_id ? {value: holidayData.employee_id, label: holidayData.employee_full_name} : ''} />
                                        </td>                             
                                        <td className="no-search"><textarea className='w-100' name='comments' defaultValue={holidayData.comments ? holidayData.comments : ''} placeholder='Komentarz...'></textarea></td>
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
                    },
                    preConfirm: () => {
                        let form = $('.swal-form.edit-holiday-form form').first();
                        let validation = baseFunctions.formValidation(form);        
                        if(!validation.validation){
                            Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${validation.errors}`);
                        }else{
                            const data = new FormData(form[0]);
                            const objectData = JSON.stringify(Object.fromEntries(data.entries()));
                            let result = false;
                
                            $.ajax({
                                url: baseURL + '/holiday-edit/',
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
                console.log('Nie udało się pobrać danych urlopów.');  
                return {};                             
            }
        });
    
    }

    handleChartLiClick = (ev, datasetIndex) =>{
        let chart = this.chartRef.current;
        chart.setDatasetVisibility(datasetIndex, !chart.isDatasetVisible(datasetIndex));
        
        // legend update
        $(ev.target).closest('li').toggleClass('legend-box-dataset-hide')
        chart.update();
        ev.stopPropagation();
    }

    handleChartLiMouseOver = (ev, datasetIndex) =>{     
        let activeHoverColor = '#4cff00';   
        let chart = this.chartRef.current;
        let metaDataset = chart.getDatasetMeta(datasetIndex).dataset;

        metaDataset.options.borderColor = activeHoverColor;
        metaDataset.options.borderWidth = 4;
        metaDataset._points[0].options.borderColor = activeHoverColor;
        metaDataset._points[0].options.backgroundColor = activeHoverColor;
        metaDataset._points[1].options.borderColor = activeHoverColor;
        metaDataset._points[1].options.backgroundColor = activeHoverColor;
        chart.render();
        ev.stopPropagation();
    }

    handleChartLiMouseOut = (ev, datasetIndex) =>{ 
        let chart = this.chartRef.current;
        let metaDataset = chart.getDatasetMeta(datasetIndex).dataset;
        let lastHoverLineColor = $(ev.target).closest('li').find('span').css('background-color');

        metaDataset.options.borderColor = lastHoverLineColor;
        metaDataset.options.borderWidth = 3;
        metaDataset._points[0].options.borderColor = lastHoverLineColor;
        metaDataset._points[0].options.backgroundColor = lastHoverLineColor;
        metaDataset._points[1].options.borderColor = lastHoverLineColor;
        metaDataset._points[1].options.backgroundColor = lastHoverLineColor;
        chart.render();
        ev.stopPropagation();
    }

    updateChartLegend = () => {
        let self = this;
        let ulElementPast = $('#HolidaysChartLegend div[data-piece_of_time="past"] ul');
        let ulElementCurrenAndPast = $('#HolidaysChartLegend div[data-piece_of_time="current_and_future"] ul');
        let chart = this.chartRef.current;

        ulElementPast.html('');
        ulElementCurrenAndPast.html('');
        
        if(chart && chart.legend.legendItems && chart.legend.legendItems.length > 0){   
            setTimeout(()=>{
                chart.legend.legendItems.forEach((dataset, index) => {
                    let text = dataset.text;
                    let datasetIndex = dataset.datasetIndex;
                    let bColor = dataset.strokeStyle;
                    let firstPoint = chart.data.datasets[dataset.datasetIndex].data[0].x;
                    let secondPoint = chart.data.datasets[dataset.datasetIndex].data[1].x;
        
                    const liElement = $(`<li><span style=" border-color:${bColor}; background-color:${bColor}"></span><p>${text}</p></li>`);
                    
                    liElement.click((ev)=>{
                        self.handleChartLiClick(ev, datasetIndex);
                    })

                    liElement.mouseover((ev)=>{
                        self.handleChartLiMouseOver(ev, datasetIndex);
                    })

                    liElement.mouseout((ev)=>{
                        self.handleChartLiMouseOut(ev, datasetIndex);
                    })
    
                    if(firstPoint < String(todayDateYMD) && secondPoint < String(todayDateYMD)){
                        ulElementPast.prepend(liElement);
                    }else{
                        ulElementCurrenAndPast.prepend(liElement);
                    }
                    
                });
            }, 300)    
        }

    }

    componentDidUpdate(prevProps, prevState){ 
        if(prevState.chartData !== this.state.chartData){
            this.updateChartLegend();
        };
    }

    componentDidMount(){
        this.fetchData(); 

        setTimeout(() => { 
            $(".custom-fancytable").fancyTable({
                sortColumn: 1,
                sortOrder: -1,
                pagination: true,
                searchable: true,
                globalSearch: false,
                perPage: 40,
                inputPlaceholder: 'Szukaj...'
            });

            $('.no-action, .no-action a').off();	 

            baseHomeFunctions.bindDatesInputs($('tr.add-holiday-row')); 
            
            // scroll chart to current month
            const scrollContainer = document.getElementById('HolidaysChartContainer');   
            if(scrollContainer){
                let scrollContainerWidth = scrollContainer.scrollWidth; 
                if(scrollContainerWidth && Number(scrollContainerWidth)>0) { 
                    let currentMonthBox = $('#HolidaysChartContainer .month-box')[Number(currentDateMonth)-1];
                    let left = currentMonthBox.offsetLeft;
                    // $('#HolidaysChartContainer')[0].scrollLeft = left - ($('#HolidaysChartContainer').width()/(scrollContainerWidth/$('#HolidaysChartContainer').width()));
                    $('#HolidaysChartContainer')[0].scrollTo({
                        left: left - ($('#HolidaysChartContainer').width()/(scrollContainerWidth/$('#HolidaysChartContainer').width())),
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
        let holidays = this.state.holidays;
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
                max: 3,
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
                <h2 className="text-center pb-2 pb-lg-3">Urlopy <span className="holidays-year-container"><input className='' type='number' name='date_year' defaultValue={currentDateYear} onInput={(ev)=>{this.handleOnInputYear(ev)}}></input></span></h2>
                
                <div id='HolidaysChartLegend' className="chart-js-custom-legend-box pb-1">
                    
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
                    
                </div>

                <div id='HolidaysChartContainer' className="d-flex justify-content-start w-100">
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
                    <table className="custom-fancytable holidays-table">
                        <thead>
                            <tr className="bg-primary bg-gradient text-light"> 
                                <th className="no-action table-td-xxs">Nr</th>
                                <th data-sortas="case-insensitive">Od</th> 
                                <th data-sortas="case-insensitive">Do</th> 
                                <th data-sortas="case-insensitive">Kto</th> 
                                <th data-sortas="numeric" className="table-td-xs">Ilość dni (d)</th> 
                                <th data-sortas="case-insensitive">Uwagi/Komentarz</th>
                                <th className="no-action th-action">Akcje</th> 
                            </tr> 
                            <AddHolidaysRow handleAddHolidays={this.handleAddHoliday} handleInputChange={this.handleInputChange} stateAddHolidayRow={this.state.AddHolidayRow} handleEmployeeChange={this.handleEmployeeChange}/>
                        </thead>
                        <tbody>                        
                            {holidays.length > 0 && holidays.map((holiday, i) => {                        

                                return(
                                <tr key={holiday.id} data-holiday_id={holiday.id}>                               
                                    <td>{i+1}</td>
                                    <td data-sortvalue={holiday.date_from}>{baseHomeFunctions.YMDtoDMY(holiday.date_from)}</td>
                                    <td data-sortvalue={holiday.date_to}>{baseHomeFunctions.YMDtoDMY(holiday.date_to)}</td>
                                    <td>{holiday.employee_full_name}</td>
                                    <td>{holiday.duration_days}</td>
                                    <td>{holiday.comments}</td>
                                    <td className="no-search td-action"><FontAwesomeIcon icon={faEdit} onClick={(ev)=>{this.editHoliday(ev)}} title="edytuj"/><FontAwesomeIcon icon={faTrash} onClick={(ev)=>{this.removeHoliday(ev)}} title="usuń" /></td>
                                </tr>
                                )
                            })}      
                        </tbody>                           
                    </table>
                </div>
            </div>
        )
    }
}

export default Holidays;