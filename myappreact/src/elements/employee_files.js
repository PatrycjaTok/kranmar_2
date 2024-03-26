import React from 'react';
import Files from 'react-files';
import $ from 'jquery';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faFileDownload, faSearchPlus} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import baseURL from "../utils/request";
// import baseURLFront from "../utils/base_url_front";

const cookies = new Cookies();
library.add(faTimes, faFileDownload, faSearchPlus);

class EmployeeFiles extends React.Component{
    constructor(props){
        super(props);
        this.state={
            existing_files: [],
            files: [],
            // filesButtons: {
            //     current: 'building_license',
            //     building_license: {
            //         classes: 'btn btn-primary active'
            //     },
            //     medical: {
            //         classes: 'btn btn-primary'
            //     },
            //     bhp: {
            //         classes: 'btn btn-primary'
            //     },
            //     other: {
            //         classes: 'btn btn-primary'
            //     }
            // },           
        }
    }

    fetchData = () =>{
        let self = this;

        $.ajax({
            url: baseURL + '/get-employee-files/',
            method: 'GET',
            dataType: 'json',
            // async: false,
            headers: {
              "Content-Type": 'application/json',
              "X-CSRFToken": cookies.get("csrftoken")
            },
            data: {"employee_id" : self.props.employee_id},
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                self.setState({existing_files: data.files});
                // console.log(data.files)
            },
            error: function(xhr, status, err) {
                let errorText = xhr.responseJSON.messages.errors;
                Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
            }
        });    
    }

    // handleFileButtonClick = (ev) => {
    //     let fileType = $(ev.target).data('file_type');
    //     if(this.state.filesButtons.current !== fileType){
    //         let copyFilesButtons = { ...this.state.filesButtons}; //create a new copy of state AddSubstitutionRow
    //         copyFilesButtons[this.state.filesButtons.current].classes = 'btn btn-primary'; //change the value of name
    //         copyFilesButtons.current = fileType; //change the value of name
    //         copyFilesButtons[fileType].classes = 'btn btn-primary active'; //change the value of name
    //         this.setState({filesButtons: copyFilesButtons}) // settings state
    //     }
    // }

    handleDropdownChange = (newFiles) => {
        this.setState(prevState => ({files: [...prevState.files, ...newFiles]}));
    }

    handleFileRemove = (fileId) => {
        this.setState(prevState => ({files: prevState.files.filter(prevFile => prevFile.id !== fileId)}));
    }

    handleClearFiles = () => {
        this.setState({files: []});
    }

    handleUploadFiles = () => {
        let self = this;
        let formData = new FormData();
        formData.append('employee_id', this.props.employee_id)
        this.state.files.forEach((file) => {
           formData.append(file.id, new Blob([file], { type: file.type }), file.name || 'file')
        })

        if($('.files .files-list .files-list-item').length === 0){return;};

        $.ajax({
            url: baseURL + '/files-add/',
            method: 'POST',
            dataType: 'json',
            async: false,
            contentType: false,
            processData: false,
            cache: false,
            headers: {
                "X-CSRFToken": cookies.get("csrftoken")
            },
            data: formData,
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
                    self.handleClearFiles();
                    self.fetchData();
                });   
            },
            error: function(xhr, status, err) {
                let errorText = xhr.responseJSON.messages.errors;
                Swal.showValidationMessage(`<i class="fa fa-info-circle"></i> ${errorText}`)               
            }
        });      
    }

    handleDropdownError = (error, file) => {
        withReactContent(Swal).fire({
            title: `Coś poszło nie tak! ${error.code}: ${error.message}`,
            showConfirmButton: false,
            icon: 'error',
            timer: 3000,
        })         
    }

    handleExistingFileRemove = (ev, fileId) => {
        let self = this;
        let evTarget = $(ev.target);
        let file_name = evTarget.closest('.files-list-item-remove-container').siblings('.employee-file').first().find('.file-name p').text();

        withReactContent(Swal).fire({
            html: <div>
                <h3 className="text-danger">Czy na pewno chcesz <br></br>usunąć plik:</h3>
                <h4><span><b>{file_name}</b></span>?</h4>
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
                    url: baseURL + '/file-remove/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"file_id": fileId}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Pomyślnie usunięto plik.`,
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
                            title: 'Nie udało się usunąć pliku.',
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

    handleRemoveAllCheckedFiles = (ev) =>{
        let self = this;
        let evTarget = $(ev.target);
        let checkedFiles = evTarget.closest('.existing-files-container').find('.employee-file-cover.checked');
        let filesNames = [];
        let filesIds = [];
        let checkAllChecked = $('#checkAllFilesCheckbox').prop('checked');
        
        if(checkedFiles.length === 0){return;}

        for (const [key, fileDiv] of Object.entries(checkedFiles)) {
            let fileDivJQ = $(fileDiv);
            let fileName = fileDivJQ.closest('.employee-file').find('.file-name').find('p').text();
            let fileId = fileDivJQ.data('file_id');

            if(fileName.length > 0){
                filesNames.push(fileName);
                filesIds.push(fileId);
            };
        }

        withReactContent(Swal).fire({
            html: <div>
                <h3 className="text-danger">Czy na pewno chcesz <br></br>usunąć {checkAllChecked ? 'wszystkie pliki?': 'pliki:'} </h3>
                {!checkAllChecked && <h4><span>{filesNames.join(', ')}</span> ?</h4>}
            </div>,
            showConfirmButton: true,
            showCancelButton: true,
            icon: 'warning',
            confirmButtonText: 'Tak, usuń',
            cancelButtonText: 'Nie'
            // timerProgressBar: true
        })
        .then((result)=>{
            if(result.isConfirmed){
                $.ajax({
                    url: baseURL + '/file-remove-multiple/',
                    method: 'POST',
                    dataType: 'json',
                    async: false,
                    headers: {
                      "Content-Type": 'application/json',
                      "X-CSRFToken": cookies.get("csrftoken")
                    },
                    data: JSON.stringify({"files_ids": filesIds}),
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        withReactContent(Swal).fire({
                            title: `Pomyślnie usunięto pliki.`,
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
                            title: 'Nie udało się usunąć plików.',
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

    handleImageFilePreview = (ev) =>{
        let evTarget = $(ev.target);
        // let smallImg = evTarget.closest('.employee-file').find('.employee-file-cover img').clone();
        let smallImgSrc = evTarget.closest('.employee-file').find('.employee-file-cover img').prop('src');
        let newImg = `<img src=${smallImgSrc}></img>`;
        let previewContainer = $('#file-preview');
        previewContainer.find('div').html('').append(newImg);
        previewContainer.removeClass('d-none');
    }

    handlePdfFilePreview = (ev) =>{
        let evTarget = $(ev.target);
        let smallIframe = evTarget.closest('.files-list-item-prevew-container').find('.hidden-little-iframe').clone().removeClass('d-none hidden-little-iframe');
        let previewContainer = $('#file-preview');
        previewContainer.find('div').html('').append(smallIframe);
        previewContainer.removeClass('d-none');
    }

    handleExistingFileClick = (ev) =>{
        $(ev.target).closest('.employee-file-cover').toggleClass('checked');
    }

    checkAllFiles = async (ev) =>{
        let evTarget = $(ev.target);
        let isChecked = evTarget.closest('div').find('input[type="checkbox"]').prop("checked");
        
        if(isChecked){
            evTarget.closest('.existing-files-container').find('.employee-file .employee-file-cover').addClass('checked');
        }else{
            evTarget.closest('.existing-files-container').find('.employee-file .employee-file-cover').removeClass('checked');
        }
    }

    componentDidMount(){
        this.fetchData(); 
    }

    render(){
        let files = this.state.files;
        let  existing_files = this.state.existing_files;
        // let emailHref = `mailto:''?subject=Pliki pracownika ` + this.props.employee_full_name +`&body=W załączniku przesyłam pliki pracownika ` + this.props.employee_full_name + `.`;
        return(
            <div className='row'>

                <div className='col-12 col-xl-3 files'>
                    <div>
                        <Files
                            className='files-dropzone'
                            onChange={this.handleDropdownChange}
                            onError={this.handleDropdownError}
                            // accepts={['image/png', '.jpg', '.pdf', '.odt', '.doc', '.docx', '.txt', '.xls']}
                            accepts={['image/*', 'video/mp4', 'audio/*', '.pdf', '.odt', '.doc', '.docx', '.txt', '.xls']}
                            multiple
                            maxFileSize={1000000000}
                            minFileSize={0}
                            clickable>
                            Przeciągnij tu pliki lub kliknij by wybrać
                        </Files>
                        <button className='btn btn-danger mt-1 w-100 w-sm-auto' onClick={this.handleClearFiles}>Usuń wgrane pliki</button>
                        <button className='btn btn-success mt-1 mx-sm-2 w-100 w-sm-auto' onClick={this.handleUploadFiles}>Zapisz pliki</button>
                    </div>

                    {files.length > 0 && (
                        <div className="files-list">
                            <div className='d-flex flex-wrap'>
                                {files.map(file => (
                                    <div key={file.id} className="files-list-item d-flex position-relative mx-1 mx-sm-3">
                                        <div className='text-center'>
                                            <div className="files-list-item-preview">
                                            {file.preview.type === 'image'
                                                ? <img className="files-list-item-preview-image employee-file-upload-cover" src={file.preview.url} />
                                                : <div className="files-list-item-preview-extension employee-file-upload-cover">{file.extension}</div>}
                                            </div>
                                            <div className="files-list-item-content">
                                                <div className="files-list-item-content-item files-list-item-content-item-1 file-name-smaller">{file.name}</div>
                                                <div className="files-list-item-content-item files-list-item-content-item-2 file-size-text-smaller">{file.sizeReadable}</div>
                                            </div>
                                        </div>
                                        <div className='files-list-item-remove-container'>
                                            <button className="files-list-item-remove btn text-danger" onClick={() => this.handleFileRemove(file.id)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div> 

                <div className='col existing-files-container px-0 pb-2 mt-4 mt-sm-0'>
                    <p className='col w-100 bg-custom px-2 py-2 text-center border-radious-custom mb-1'>Zapisane pliki</p>
                    <div className='w-100 px-2'>
                        <div className='d-inline-block px-2 mb-2 cursor-pointer w-100 w-sm-auto text-center'><input type='checkbox' id='checkAllFilesCheckbox' onClick={(ev)=>{this.checkAllFiles(ev)}}></input><label htmlFor='checkAllFilesCheckbox' className='cursor-pointer px-1'>Zaznacz wszystkie</label></div>
                        {/* <div className='d-inline-block px-2 mb-2 cursor-pointer'><a href={emailHref}>Wyślij email</a></div> */}
                        <button className='btn btn-danger mb-2 w-100 w-sm-auto' onClick={(ev)=>{this.handleRemoveAllCheckedFiles(ev)}}>Usuń zaznaczone</button>
                    </div>
                    <div className='d-flex flex-wrap px-2 justify-content-center justify-content-sm-start'>
                        {existing_files.map(file => {
                            let file_id = file.id;
                            let is_image = file.file.endsWith('.jpg') || file.file.endsWith('.png');
                            let is_pdf = file.file.endsWith('.pdf');
                            let file_url = `${file.file}`;
                            let file_url_in_employee_files = file_url.split('/employees_files/').at(-1);
                            let file_extension = file_url.split('.').at(-1);
                            let file_name = file_url.split('/').at(-1);
                            
                            return(
                                <div key={file_id} className='d-inline-flex position-relative'>
                                    <div className='employee-file text-center'>
                                        <div className='position-relative'>
                                            <div className='employee-file-cover' data-file_id={file_id} onClick={(ev)=>{this.handleExistingFileClick(ev)}}>{is_image
                                            ? <img src={require(`../employees_files/${file_url_in_employee_files}`)} />
                                            : <p className='file-extension-name'>{file_extension}</p>
                                            }</div>

                                            {is_image && 
                                                <div className='files-list-item-prevew-container'>
                                                    <button className="files-list-item-preview btn text-primary" onClick={(ev) => this.handleImageFilePreview(ev)} title='Podgląd'>
                                                        <FontAwesomeIcon icon={faSearchPlus} />
                                                    </button>
                                                </div>
                                            }

                                            {is_pdf && 
                                                <div className='files-list-item-prevew-container'>
                                                    <button className="files-list-item-preview btn text-primary" onClick={(ev) => this.handlePdfFilePreview(ev)} title='Podgląd'>
                                                        <FontAwesomeIcon icon={faSearchPlus} />
                                                    </button>
                                                    <iframe className='d-none hidden-little-iframe' src={require(`../employees_files/${file_url_in_employee_files}`)}/>
                                                </div>
                                            }

                                            <div className='files-list-item-download-container'>
                                                <a  href={require(`../employees_files/${file_url_in_employee_files}`)} title='Pobierz' download> <FontAwesomeIcon icon={faFileDownload} /> </a>
                                            </div>
                                    
                                        </div>
                                        <div className='file-name'>
                                            <p>{file_name}</p>
                                        </div>
                                    </div>
                                    <div className='files-list-item-remove-container'>
                                        <button className="files-list-item-remove existing-files-remove btn text-danger" onClick={(ev) => this.handleExistingFileRemove(ev, file.id)} title='Usuń'>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* <div className="btn-group files-btn-group w-100">
                        <a href="#" className={this.state.filesButtons.building_license.classes} data-file_type="building_license" aria-current="page" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>Uprawnienia</a>
                        <a href="#" className={this.state.filesButtons.medical.classes} data-file_type="medical" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>Badania</a>
                        <a href="#" className={this.state.filesButtons.bhp.classes} data-file_type="bhp" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>BHP</a>
                        <a href="#" className={this.state.filesButtons.other.classes} data-file_type="other" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>Inne</a>
                    </div> */}
                </div>                  
            </div>  
        )
    }
}

EmployeeFiles.defaultProps = {
    employee_id: '',
    employee_full_name: ''
};

export default EmployeeFiles;