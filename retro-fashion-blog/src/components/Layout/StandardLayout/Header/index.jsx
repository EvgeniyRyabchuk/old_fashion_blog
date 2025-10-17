import React, {useState} from 'react';
import "./index.scss";
import Dropdown from '@components/Dropdown';

import guestNavListData from './data/common-nav';
import ProfileMenu from "./ProfileMenu";
import AuthOffer from "./AuthOffer";
import LangSelector from "./Selectors/LangSelector";
import ThemeSelector from "./Selectors/ThemeSelector";
import SearchSector from "./SearchSector";
import {useAuth} from "@/context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";

const Header = () => {

    const [isAsideOpen, setIsAsideOpen] = useState(false);
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

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

    const onSelected = (link) => {
        link && navigate(link);
        setIsAsideOpen(false);
    }

    return (
        <header>
            <Link className="default-link top-header-link" to={PATHS.HOME}>
                <div className="header-img-block">
                    <h2 className="header-label" data-i18n="header-blog-title">Old Fashion Blog</h2>
                </div>
            </Link>

            <nav className="top-menu">
                <div id="sideMenuWrapper"
                     className={`side-menu-wrapper ${isAsideOpen ? "is-open" : ""}`}
                     onClick={onEmptyAreaClick}
                >
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
                                isClickable={true}
                                isAside={true}
                                onSelected={onSelected}
                            />
                        }

                        <Dropdown
                            ulClassName={"side-menu-list"}
                            onClick={verticalListItemOnClick}
                            onSelected={onSelected}
                            data={guestNavListData}
                        />
                    </aside>
                </div>

                <div className="top-menu-content">
                    <div className="burger-menu-btn" id="burgerMenuBtn" onClick={onBurgerClick}></div>

                    <Dropdown
                        ulClassName={"guest-nav-list"}
                        data={guestNavListData}
                        onSelected={onSelected}
                    />

                    <div className="auth-nav-list-wrapper">
                        {(!authLoading && !user) &&
                            <AuthOffer className={'form-row'} />
                        }

                        <LangSelector />

                        <ThemeSelector />

                        <SearchSector />

                        {(!authLoading && user) &&
                            <ProfileMenu
                                isAside={false}
                                isHoverable={true}
                                onSelected={onSelected}
                            />
                        }
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;