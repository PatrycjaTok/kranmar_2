// import React from "react";
import $ from 'jquery';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import baseHomeFunctions from "../utils/base_functions_home.js";

function StartDisplayingInfoBox(data, setIntervalBool=true, firstUsage=true){
    let infoBox = $('#infoBox');
    let titles = {
        'agreement_end_date': 'UMOWY',
        'medical_end_date': 'BADAŃ LEKARSKICH',
        'building_license_end_date': 'UPRAWNIEŃ',
    }

    if(setIntervalBool){
        setInterval(()=>{
            if(infoBox.hasClass('text-warning')){
                infoBox.removeClass('text-warning').addClass('text-danger');
            }else{
                infoBox.removeClass('text-danger').addClass('text-warning');
            }
        }, 1000);
    }

    let htmlContent = $(`<div></div>`);
    htmlContent.append(`<h2 class="text-center text-danger pb-2">!! Upływa/upłynął termin !!</h2>`);     

    for (const [key, value] of Object.entries(data)) {
        if(value.length > 0){
            let contextcContainer = $(`<div></div>`);
            contextcContainer.append(`<h5 class="fw-bold">${titles[key]} dla: </h5>`);
            
            value.forEach(infoEmployee => {
                contextcContainer.append(`<p><b>${infoEmployee['name']}</b>: mija za <b>${infoEmployee['delta']}</b> dni (${baseHomeFunctions.YMDtoDMY(infoEmployee['date'])})</p>`);
            });

            htmlContent.append(contextcContainer);
        }
    }
    
    infoBox.unbind('click').click(()=>{
            // Swal options
        withReactContent(Swal).fire({
            html: htmlContent,
            showConfirmButton: true,
            showCancelButton: false,
            showCloseButton: true,
            icon: 'warning',
            confirmButtonText: 'Zamknij',
            customClass: {
                confirmButton: 'min-w-120',
                popup: 'info-box-swal-popup'                   
            },    
        });
    });
}

export default StartDisplayingInfoBox;