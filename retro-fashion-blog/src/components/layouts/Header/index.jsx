import React, {useEffect} from 'react';
import "./index.scss";
import Dropdown from '@components/Dropdown';

import guestNavListData from './data/all/dropdown-menu-data.json';
import userProfileList from './data/auth/user-profile.json';
import adminProfileList from './data/auth/admin-profile.json';
import commonProfileList from './data/auth/common.json';
import ProfileMenu from "@layouts/Header/ProfileMenu";

const Header = () => {


    const verticalListItemOnClick = (e) => {
        const curT = e.currentTarget;
        if (e.target.tagName === "A" && e.target.classList.contains("prevent")) {
            e.preventDefault();
            if(curT.tagName.toLowerCase() === 'li') {
                curT.classList.toggle("is-open");
            }
        }
    }

    useEffect(() => {

        const searchPostLoader = document.getElementById("searchPostLoader");

        const headerSearch = document.getElementById("headerSearch");
        const searchToggle = document.getElementById("searchToggle");
        const searchClose = document.getElementById("searchClose");
        const searchInput = document.getElementById("searchInput");
        const searchControll = document.getElementById("searchControll")
        const searchContent = document.getElementById("searchContent");
        const searchSeeMoreLink = searchContent.querySelector("#searchSeeMore");

        const authNavList =  document.getElementById("authNavList");
        const asideAuthNavList = document.querySelector("#asideAuthNavList");


        const profileBtnWrapper = document.getElementById("profileBtnWrapper")
        const asideProfileBtnWrapper = document.getElementById("asideProfileBtnWrapper");

//TODO: change
//         document.getElementById("profileBtnWrapper").addEventListener("mouseenter", (e) => {
//             authNavList.classList.toggle("is-open");
//         })
//         document.getElementById("profileBtnWrapper").addEventListener("mouseleave", (e) => {
//             authNavList.classList.toggle("is-open");
//         })

// open profile in aside menu
//         document.getElementById("asideProfileBtnWrapper").addEventListener("click", (e) => {
//             asideAuthNavList.classList.toggle("is-open");
//             document.querySelector("#asideProfileBtn").classList.toggle("is-open");
//         })


        const setAsideIsOpen = () => {
            document.querySelector("#sideMenu").classList.toggle("is-open");
            // document.querySelector("#burgerMenuBtn").classList.toggle("is-open");
            document.querySelector("#sideMenuWrapper").classList.toggle("is-open");
            document.body.classList.toggle("no-scroll");
        }

// open aside menu
        document.getElementById("burgerMenuBtn").addEventListener("click", (e) => {
            setAsideIsOpen();
        })
        document.querySelector("#closeAside").addEventListener("click", (e) => {
            setAsideIsOpen();
        })
        document.getElementById("sideMenuWrapper").addEventListener("click", (e) => {
            if (e.target === e.currentTarget) {
                setAsideIsOpen();
            }
        });

        ///////////////////// dropdown
        // document.querySelectorAll(".dropdown.on-click").forEach(dropdown => {
        //     dropdown.addEventListener("click", e => {
        //         // only preventDefault if the first child <a> is clicked
        //         verticalListItemOnClick(e)
        //     });
        // });

    }, []);



    return (
        <header>
            <a className="default-link top-header-link" href="/">
                <div className="header-img-block">
                    <h2 className="header-label" data-i18n="header-blog-title">Old Fashion Blog</h2>
                </div>
            </a>

            <nav className="top-menu">
                <div id="sideMenuWrapper" className="side-menu-wrapper">
                    <aside id="sideMenu" className="side-menu">
                        <div className="top-aside-block">
                            <div className="close-aside" id="closeAside"></div>
                            <span data-i18n="header-menu">Menu</span>
                        </div>
                        <div className="form-row d-flex-center" style={{margin: "20px 0"}}>
                            <a className="login-btn" href="/auth/login.html" data-i18n="auth-login">Login</a>
                            <a className="sign-up-btn" href="/auth/register.html" data-i18n="auth-sign-up">Sign Up</a>
                        </div>

                        <ProfileMenu
                            data={[...adminProfileList, ...commonProfileList]}
                            rootСlassName={"aside-profile-btn-wrapper"}
                            btnClassName={"aside-profile-btn"}
                            switchableClass={"switchable-flex"}
                            isClickable={true}
                        />

                        <Dropdown
                            ulClassName={"side-menu-list"}
                            onClick={verticalListItemOnClick}
                            data={guestNavListData}
                        />

                    </aside>
                </div>
                <div className="top-menu-content">
                    <div className="burger-menu-btn" id="burgerMenuBtn"></div>

                    <Dropdown
                        ulClassName={"guest-nav-list"}
                        data={guestNavListData}
                    />

                    <div className="auth-nav-list-wrapper">
                        <div id="headerNavLoginBtnForm" className="form-row">
                            <a className="login-btn" style={{margin: "0 5px"}} href="/auth/login.html"
                               data-i18n="auth-login">Login</a>
                            <a className="sign-up-btn" style={{margin: "0 5px"}} href="/auth/register.html"
                               data-i18n="auth-sign-up">Sign Up</a>
                        </div>

                        <div className="form-row">
                            <select className="language-select" id="languageSelect">
                                <option value="ru" data-i18n="lang-ru">RU</option>
                                <option value="ua" data-i18n="lang-ua">UA</option>
                                <option selected value="en" data-i18n="lang-en">EN</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <select className="theme-select" id="themeSelector">
                                <option value="default" data-i18n="theme-default">Default</option>
                                <option value="light" data-i18n="theme-light">Light</option>
                                <option value="dark" data-i18n="theme-dark">Dark</option>
                            </select>
                        </div>

                        <div className="form-row header-search" id="headerSearch">
                            <div className="d-flex-center form-row search-controll" id="searchControll">
                                <button className="search-close" id="searchClose" type="button">&times;</button>
                                <input className="search-input"
                                       id="searchInput"
                                       type="text" placeholder="Search..."
                                       data-i18n-attr="placeholder:search-placeholder"
                                />
                                <button className="btn-info search-btn" id="searchBtn" type="button"
                                        data-i18n="search-button">Search
                                </button>

                                <button className="search-toggle" id="searchToggle" type="button"></button>
                            </div>

                            <div id="searchContent" className="search-content">
                                <div id="searchPostLoader" className="loader-wrapper abs bg-transparent">
                                    <div className="loader">
                                        <div className="circle-wrapper-1">
                                            <div className="circle-1"></div>
                                        </div>
                                        <div className="circle-wrapper-2">
                                            <div className="circle-2"></div>
                                        </div>
                                        <div className="circle-wrapper-3">
                                            <div className="circle-3"></div>
                                        </div>
                                        <div className="circle-wrapper-4">
                                            <div className="circle-4"></div>
                                        </div>
                                        <div className="circle-wrapper-5">
                                            <div className="circle-5"></div>
                                        </div>
                                        <div className="circle-wrapper-6">
                                            <div className="circle-6"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-none no-data-li" data-i18n="search-no-results">
                                    No results found
                                </div>
                                <ul id="searchPostList" className="search-post-list">
                                </ul>
                                <a id="searchSeeMore" href="" className="d-none see-more" data-i18n="search-see-more">See
                                    More...</a>
                            </div>
                        </div>

                        <ProfileMenu
                            data={[...adminProfileList, ...commonProfileList]}
                            rootСlassName={"profile-btn-wrapper"}
                            btnClassName={"profile-btn"}
                            onHoverable={true}
                            switchableClass={"switchable"}
                        />

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;