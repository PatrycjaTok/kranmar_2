import React from 'react';
import Files from 'react-files';
import $ from 'jquery';
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes} from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import baseURL from "../utils/request";

const cookies = new Cookies();
library.add(faTimes);

class EmployeeFiles extends React.Component{
    constructor(props){
        super(props);
        this.state={
            filesButtons: {
                current: 'building_license',
                building_license: {
                    classes: 'btn btn-primary active'
                },
                medical: {
                    classes: 'btn btn-primary'
                },
                bhp: {
                    classes: 'btn btn-primary'
                },
                other: {
                    classes: 'btn btn-primary'
                }
            },
            files: []
        }
    }

    handleFileButtonClick = (ev) => {
        let fileType = $(ev.target).data('file_type');
        if(this.state.filesButtons.current !== fileType){
            let copyFilesButtons = { ...this.state.filesButtons}; //create a new copy of state AddSubstitutionRow
            copyFilesButtons[this.state.filesButtons.current].classes = 'btn btn-primary'; //change the value of name
            copyFilesButtons.current = fileType; //change the value of name
            copyFilesButtons[fileType].classes = 'btn btn-primary active'; //change the value of name
            this.setState({filesButtons: copyFilesButtons}) // settings state
        }
    }

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
        const formData = new FormData()
        this.state.files.forEach((file) => {
           formData.append(file.id, new Blob([file], { type: file.type }), file.name || 'file')
        })

        console.log(formData)

        // const objectData = JSON.stringify(Object.fromEntries(data.entries()));

        $.ajax({
            url: baseURL + '/files-add/',
            method: 'POST',
            dataType: 'json',
            async: false,
            headers: {
                "Content-Type": 'application/json',
                "X-CSRFToken": cookies.get("csrftoken")
            },
            data: formData,
            xhrFields: {
                withCredentials: true
            },
            success: function(data) {
                // result = data;
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

    render(){
        let files = this.state.files;

        return(
            <div className='row'>

                <div className='col-12 col-xl-3 files'>
                    <div>
                        <Files
                            className='files-dropzone'
                            onChange={this.handleDropdownChange}
                            onError={this.handleDropdownError}
                            accepts={['image/png', '.jpg', '.pdf', '.odt', '.doc', '.docx', '.txt', '.xls']}
                            multiple
                            maxFileSize={10000000}
                            minFileSize={0}
                            clickable>
                            Przeciągnij tu pliki lub kliknij by wybrać
                        </Files>
                        <button className='btn btn-danger mt-1' onClick={this.handleClearFiles}>Usuń wszystkie pliki</button>
                        <button className='btn btn-success mt-1 mx-2' onClick={this.handleUploadFiles}>Zapisz pliki</button>
                    </div>

                    {files.length > 0 && (
                        <div className="files-list">
                            <div className='d-flex flex-wrap'>
                                {files.map(file => (
                                    <div key={file.id} className="files-list-item d-flex position-relative mx-1 mx-sm-3">
                                        <div className='text-center'>
                                            <div className="files-list-item-preview">
                                            {file.preview.type === 'image'
                                                ? <img className="files-list-item-preview-image" src={file.preview.url} />
                                                : <div className="files-list-item-preview-extension">{file.extension}</div>}
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

                <div className='col w-100'>
                    <div className="btn-group files-btn-group w-100">
                        <a href="#" className={this.state.filesButtons.building_license.classes} data-file_type="building_license" aria-current="page" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>Uprawnienia</a>
                        <a href="#" className={this.state.filesButtons.medical.classes} data-file_type="medical" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>Badania</a>
                        <a href="#" className={this.state.filesButtons.bhp.classes} data-file_type="bhp" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>BHP</a>
                        <a href="#" className={this.state.filesButtons.other.classes} data-file_type="other" onClick={(ev)=>{this.handleFileButtonClick(ev)}}>Inne</a>
                    </div>
                </div>  

            </div>  
        )
    }
}

// SelectActionTypes.defaultProps = {
//     defaultSelectValue: '',
//     outerState: {},
// };

export default EmployeeFiles;