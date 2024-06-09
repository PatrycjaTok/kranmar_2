import { useEffect, useState } from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from 'react-router-dom';

library.add(faDoorOpen);

let currentLink = "/";

function NavBarTop(props){
    const location = useLocation();
    const [links, setLinks] = useState({
        "/" : {
            dropdown: false,
            current: true,
            label: "Home/Zastępstwa",
        },
        "/holidays" : {
            dropdown: false,
            current: false,
            label: "Urlopy",
        },
        "/employees" : {
            dropdown: false,
            current: false,
            label: "Pracownicy",
        },
        "/companies" : {
            dropdown: false,
            current: false,
            label: "Firmy",
        },       
        'navbarDropdownHistory' : {
            dropdown: true,
            current: false,
            id: 'navbarDropdownHistory',
            label: 'Historia',
            items: {
                "/history-changes": {
                    current: false,                 
                    label: "Historia Zastępstw",
                }
            }
            
        },
        "/settings" : {
            dropdown: false,
            current: false,
            label: "Ustawienia",
        },
    });

    useEffect(() => {
        let path = location.pathname;
        let dropdownsLinksHistory = ['/history-changes', '/history-holidays']

        // Check Date
        props.handleDateCheck();

        if(currentLink !== path){

            if(!dropdownsLinksHistory.includes(path) && !dropdownsLinksHistory.includes(currentLink)){
                setLinks({
                    ...links,
                    [currentLink]: {
                        ...links[currentLink],
                        ['current']: false,
                    },
                    [path]: {
                        ...links[path],
                        'current': true,
                    },                
                });
            }else if(!dropdownsLinksHistory.includes(currentLink) && dropdownsLinksHistory.includes(path)){                
                setLinks({
                    ...links,
                    [currentLink]: {
                        ...links[currentLink],
                        ['current']: false,
                    },
                    ['navbarDropdownHistory']:{
                        ...links['navbarDropdownHistory'],
                        ['current']: true,
                        ['items']: {
                            ...links['navbarDropdownHistory']['items'],
                            [path]:{
                                ...links['navbarDropdownHistory']['items'][path],
                                ['current']: true,
                            },
                        }
                    }
                });
            }else if(!dropdownsLinksHistory.includes(path) && dropdownsLinksHistory.includes(currentLink)){
                setLinks({
                    ...links,  
                    [path]: {
                        ...links[path],
                        'current': true,
                    },                   
                    ['navbarDropdownHistory']:{
                        ...links['navbarDropdownHistory'],
                        ['current']: false,
                        ['items']: {
                            ...links['navbarDropdownHistory']['items'],
                            [currentLink]:{
                                ...links['navbarDropdownHistory']['items'][currentLink],
                                ['current']: false,
                            },
                        }
                    }
                });
            }else{
                setLinks({
                    ...links,                
                    ['navbarDropdownHistory']:{
                        ...links['navbarDropdownHistory'],               
                        ['items']: {
                            ...links['navbarDropdownHistory']['items'],
                            [currentLink]:{
                                ...links['navbarDropdownHistory']['items'][currentLink],
                                ['current']: false,
                            },
                            [path]:{
                                ...links['navbarDropdownHistory']['items'][path],
                                ['current']: true,
                            },
                        }
                    }
                });
            }

            currentLink = path;        
        }
        
    }, [location]);

    return(

        <nav className="row navbar navbar-expand-lg navbar-light py-1 mx-0">
            <div className="container-fluid col order-2 order-sm-1 pb-3 pb-sm-0 pb-lg-2 pb-xxl-0">
                <Link className="navbar-brand d-flex align-items-center" to="/"><img src='../../favicon.ico' className='navLogo'></img>Kranmar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">                    
                    {Object.entries(links).map(([href, data]) => {         
                        if(!data.dropdown){
                            return(
                                <li className="nav-item" key={href}>
                                    <Link className={data.current ? "nav-link active" : "nav-link"} to={href} onClick={(ev)=>{collapseNav(ev)}}>{data.label}</Link>
                                </li>
                            )
                        }

                        let dropdownItems = [];
                        for (const [itemhref, itemdata] of Object.entries(data.items)) {                 
                            dropdownItems.push(
                                <li key={itemhref}>
                                    <Link className={itemdata['current'] ? "dropdown-item active" : "dropdown-item"} to={itemhref} onClick={(ev)=>{collapseNav(ev)}}>{itemdata['label']}</Link>
                                </li>
                            )
                        }
                        
                        return(
                            <li className="nav-item dropdown" key={data.id}>
                                <a className={data.current ? "nav-link dropdown-toggle active" : "nav-link dropdown-toggle"} href="#" id={data.id} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {data.label}
                                </a>
                                <ul className="dropdown-menu" aria-labelledby={data.id}>
                                    {dropdownItems}
                                </ul>
                            </li>  
                        )
                        
                    })}                    
                </ul>
                </div>
            </div>
            <div className='logoutBtnContainer col-auto order-1 order-sm-2'><button type="button" className="btn" title='Wyloguj' onClick={props.handleLogout}><div className='d-flex align-items-center'><FontAwesomeIcon icon={faDoorOpen} /><span>Wyloguj </span></div></button></div>
        </nav>

    )
}

function collapseNav(ev){
    let evTarget = $(ev.target);
    let navbar = evTarget.closest('#navbar');
    let toggleButton = navbar.siblings('button.navbar-toggler');
    if(toggleButton.css('display') !== 'none' && navbar.hasClass('show')){
        navbar.removeClass('show')
    }
}

export default  NavBarTop; 