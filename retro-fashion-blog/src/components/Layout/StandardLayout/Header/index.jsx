import React, {useEffect, useState} from 'react';
import "./index.scss";
import Dropdown from '@components/Dropdown';

import guestNavListData from './data/all/dropdown-menu-data.json';
import adminProfileList from './data/auth/admin-profile.json';
import commonProfileList from './data/auth/common.json';
import ProfileMenu from "./ProfileManu";
import AuthOffer from "./AuthOffer";
import LangSelector from "./Selectors/LangSelector";
import ThemeSelector from "./Selectors/ThemeSelector";
import SearchSector from "./SearchSector";
import {useAuth} from "@/context/AuthContext";

const Header = () => {

    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const { user, loading: authLoading } = useAuth();

    const onBurgerClick = () => {
        setIsAsideOpen(!isAsideOpen);
    }

    const onEmptyAreaClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsAsideOpen(!isAsideOpen);
        }
    }

    const verticalListItemOnClick = (e) => {
        const curT = e.currentTarget;
        if (e.target.tagName === "A" && e.target.classList.contains("prevent")) {
            e.preventDefault();
            if(curT.tagName.toLowerCase() === 'li') {
                curT.classList.toggle("is-open");
            }
        }
    }

    return (
        <header>
            <a className="default-link top-header-link" href="/">
                <div className="header-img-block">
                    <h2 className="header-label" data-i18n="header-blog-title">Old Fashion Blog</h2>
                </div>
            </a>

            <nav className="top-menu">
                <div id="sideMenuWrapper"
                     className={`side-menu-wrapper ${isAsideOpen ? "is-open" : ""}`}
                     onClick={onEmptyAreaClick}>
                    <aside id="sideMenu" className={`side-menu ${isAsideOpen ? "is-open" : ""}`}>
                        <div className="top-aside-block">
                            <div className="close-aside" id="closeAside" onClick={onBurgerClick}></div>
                            <span data-i18n="header-menu">Menu</span>
                        </div>

                        {(!authLoading && !user) &&
                            <AuthOffer className={'form-row d-flex-center'} style={{ margin: "20px 0" }} />
                        }

                        {(!authLoading && user) &&
                            <ProfileMenu
                                data={[...adminProfileList, ...commonProfileList]}
                                isClickable={true}
                                isAside={true}
                            />
                        }

                        <Dropdown
                            ulClassName={"side-menu-list"}
                            onClick={verticalListItemOnClick}
                            data={guestNavListData}
                        />

                    </aside>
                </div>
                <div className="top-menu-content">
                    <div className="burger-menu-btn" id="burgerMenuBtn" onClick={onBurgerClick}></div>

                    <Dropdown ulClassName={"guest-nav-list"} data={guestNavListData} />

                    <div className="auth-nav-list-wrapper">
                        {(!authLoading && !user) &&
                            <AuthOffer className={'form-row'} />
                        }

                        <LangSelector />

                        <ThemeSelector />

                        <SearchSector />

                        {(!authLoading && user) &&
                            <ProfileMenu
                                data={[...adminProfileList, ...commonProfileList]}
                                isAside={false}
                                isHoverable={true}
                            />
                        }

                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;