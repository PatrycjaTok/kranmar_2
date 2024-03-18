// import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import baseHomeFunctions from "../utils/base_functions_home.js";

function StartDisplayingHolidayInfoBox(data, setIntervalBool=true, firstUsage=true){
    let infoBox = $('#holidaysInfoBox');

    if(setIntervalBool){
        setInterval(()=>{
            if(infoBox.hasClass('text-smooth-pink')){
                infoBox.removeClass('text-smooth-pink').addClass('text-smooth-orange');
            }else{
                infoBox.removeClass('text-smooth-orange').addClass('text-smooth-pink');
            }
        }, 3000);
    }

    let htmlContent = $(`<div></div>`);
    htmlContent.append(`<h2 class="text-center text-info pb-0 mb-3 text-decoration-none">Nadchodzące urlopy:</h2>`);     

    if(data.length > 0){
        data.forEach(holiday => {
            htmlContent.append(`<p><b>${holiday['employee_full_name']}</b>: za <b>${holiday['delta']}</b> dni (od <b>${baseHomeFunctions.YMDtoDMY(holiday['date_from'])}</b> do <b>${baseHomeFunctions.YMDtoDMY(holiday['date_to'])})</b></p>`);
        });

    }
    
    infoBox.unbind('click').click(()=>{
            // Swal options
        withReactContent(Swal).fire({
            html: htmlContent,
            showConfirmButton: true,
            showCancelButton: false,
            showCloseButton: true,
            icon: 'info',
            confirmButtonText: 'Zamknij',
            customClass: {
                confirmButton: 'min-w-120',
                popup: 'info-box-swal-popup'                   
            },    
        });
    });
}

export default StartDisplayingHolidayInfoBox;