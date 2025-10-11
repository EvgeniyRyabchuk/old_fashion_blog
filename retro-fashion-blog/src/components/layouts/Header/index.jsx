import React from 'react';
import "./index.scss";
import Dropdown from "../../Dropdown";

const guestNavListData = [
    {
        name: "Home",
        link: "/",
        dataI18n: "nav-home"
    },
    {
        name: "All posts",
        link: "/posts.html",
        dataI18n: "nav-all-posts",
        data: [
            {
                name: "Male",
                link: "/posts.html?categories=7GGsEDG6hxJke8vh6PFa",
                dataI18n: "nav-male",
            },
            {
                name: "Female",
                link: "/posts.html?categories=JlEtKUSmnLqoTtsDkDMQ",
                dataI18n: "nav-female",
            }
        ]
    },
    {
        name: "Contact",
        link: "/contacts.html",
        dataI18n: "nav-contact",
    },
    {
        name: "About",
        link: "/about.html",
        dataI18n: "nav-about",
    }
];


const Header = () => {
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
                        <div className="aside-profile-btn-wrapper switchable-flex" id="asideProfileBtnWrapper">
                            <div className="form-row">
                                <button className="aside-profile-btn" id="asideProfileBtn">

                                    <span data-i18n="auth-profile">Profile</span>

                                </button>
                            </div>
                            <ul id="asideAuthNavList" className="auth-nav-list d-none">
                                <li><a href="/posts.html">My posts</a></li>
                                <li><a href="/profile/setting.html">Settings</a></li>
                                <li><a href="/profile/comments.html">Comments</a></li>
                                <li style={{padding: 0}}>

                                    <button className="btn-danger" type="button" onClick="logout()">Logout</button>
                                </li>
                            </ul>
                        </div>

                        <ul className="side-menu-list">
                            <li><a className="side-menu-item" href="/" className="dropdown-item"
                                   data-i18n="nav-home">Home</a></li>
                            <li className="dropdown on-click root">
                                <a className="side-menu-item prevent" href="/posts.html" className="dropdown-toggle"
                                   data-i18n="nav-all-posts">All posts</a>

                                <ul className="dropdown-menu">
                                    <li className="">
                                        <a className="side-menu-item" href="/posts.html?categories=7GGsEDG6hxJke8vh6PFa"
                                           className="dropdown-toggle" data-i18n="nav-male">Male</a>
                                    </li>
                                    <li className="">
                                        <a className="side-menu-item" href="/posts.html?categories=JlEtKUSmnLqoTtsDkDMQ"
                                           className="dropdown-item" data-i18n="nav-female">Female</a>
                                    </li>
                                    <li className="">
                                        <a className="side-menu-item"
                                           href="/posts.html?categories=JlEtKUSmnLqoTtsDkDMQ"
                                           className="dropdown-item">Classic</a>
                                    </li>
                                    <li className="">
                                        <a className="side-menu-item"
                                           href="/posts.html?categories=JlEtKUSmnLqoTtsDkDMQ"
                                           className="dropdown-item">Trends</a>
                                    </li>
                                    <li className="">
                                        <a className="side-menu-item"
                                           href="/posts.html?categories=JlEtKUSmnLqoTtsDkDMQ"
                                           className="dropdown-item">News</a>
                                    </li>
                                </ul>
                            </li>
                            <li><a className="side-menu-item" href="/news.html" className="dropdown-item"
                                   data-i18n="nav-contact">Contact</a></li>
                            <li><a className="side-menu-item" href="/news.html" className="dropdown-item"
                                   data-i18n="nav-about">About</a></li>
                            <li className="side-menu-item">
                                <a href="/galerry.html" data-i18n="nav-gallery">Gallery</a>
                            </li>
                        </ul>
                    </aside>
                </div>
                <div className="top-menu-content">
                    <div className="burger-menu-btn" id="burgerMenuBtn"></div>
                    <Dropdown ulClassName={"guest-nav-list"} data={guestNavListData} />
                    {/*<ul className="guest-nav-list">*/}
                    {/*    <li><a href="/" className="dropdown-item" data-i18n="nav-home">Home</a></li>*/}
                    {/*    <li className="dropdown on-hover root">*/}
                    {/*        <a href="/posts.html" className="dropdown-toggle" data-i18n="nav-all-posts">All posts</a>*/}
                    {/*        <ul className="dropdown-menu">*/}
                    {/*            <li className="">*/}
                    {/*                <a href="/posts.html?categories=7GGsEDG6hxJke8vh6PFa" className="dropdown-toggle"*/}
                    {/*                   data-i18n="nav-male">Male</a>*/}
                    {/*            </li>*/}
                    {/*            <li className="">*/}
                    {/*                <a href="/posts.html?categories=JlEtKUSmnLqoTtsDkDMQ" className="dropdown-item"*/}
                    {/*                   data-i18n="nav-female">Female</a>*/}
                    {/*            </li>*/}
                    {/*        </ul>*/}
                    {/*    </li>*/}
                    {/*    <li><a href="/news.html" className="dropdown-item" data-i18n="nav-contact">Contact</a></li>*/}
                    {/*    <li>*/}
                    {/*        <a href="/news.html"*/}
                    {/*           className="dropdown-item"*/}
                    {/*           data-i18n="nav-about">*/}
                    {/*            About*/}
                    {/*        </a>*/}
                    {/*    </li>*/}
                    {/*</ul>*/}

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

                        <div className="profile-btn-wrapper switchable" id="profileBtnWrapper">
                            <div className="form-row">
                                <button className="profile-btn" id="profileBtn">
                                    <span data-i18n="auth-profile">
                                        Profile
                                    </span>
                                    <span id="authUserName" className="auth-user-name"></span>
                                </button>
                            </div>

                            <ul id="authNavList" className="auth-nav-list">
                                <li><a href="/posts.html" data-i18n="auth-my-posts">My posts</a></li>
                                <li><a href="/profile/setting.html" data-i18n="auth-settings">Settings</a></li>
                                <li><a href="/profile/comments.html" data-i18n="auth-comments">Comments</a></li>
                                <li style={{padding: 0}}>
                                    <button className="btn-danger" type="button" onClick="logout()"
                                            data-i18n="auth-logout">Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;