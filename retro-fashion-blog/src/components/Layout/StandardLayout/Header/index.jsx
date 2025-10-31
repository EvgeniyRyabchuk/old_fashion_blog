import React, {useMemo, useState} from 'react';
import "./index.scss";
import Dropdown from '@components/Dropdown';

import guestNavListData from './data/common-nav';
import ProfileMenu from "./ProfileMenu";
import Index from "./AuthOffer";
import LangSelector from "./Selectors/LangSelector";
import ThemeSelector from "./Selectors/ThemeSelector";
import SearchSector from "./SearchSector";
import {useAuth} from "@/context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";
import AuthOffer from "./AuthOffer";

const Header = () => {
    console.log('header')
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

    //TODO: to multi deep
    const mobileGuestNavListData = useMemo(() => {
        return guestNavListData.map((item, index) => {
            if(item.data && item.data.length > 0) {
                return {...item, data: [
                            { name: item.name, link: item.link, dataI18n: item.dataI18n },
                        ...item.data]};
            }
            return item;
        })
    }, [])

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
                            <AuthOffer
                                className={'auth-offer-mobile form-row d-flex-center'}
                                onSelected={onSelected}
                            />
                        }

                        {(!authLoading && user) &&
                            <ProfileMenu
                                isClickable={true}
                                isAside={true}
                                onSelected={onSelected}
                            />
                        }
                        {/* mobile dropdown */}
                        <Dropdown
                            ulClassName={"side-menu-list"}
                            onClick={verticalListItemOnClick}
                            onSelected={onSelected}
                            data={mobileGuestNavListData}
                            isClickable={true}
                        />
                    </aside>
                </div>

                <div className="top-menu-content">
                    <div className="burger-menu-btn" id="burgerMenuBtn" onClick={onBurgerClick}></div>
                    {/* desktop dropdown */}
                    <Dropdown
                        ulClassName={"guest-nav-list"}
                        data={guestNavListData}
                        onSelected={onSelected}
                        isHoverable={true}
                    />

                    <div className="auth-nav-list-wrapper">
                        {(!authLoading && !user) &&
                            <AuthOffer
                                onSelected={onSelected}
                                className={'auth-offer form-row d-flex-center'}
                            />
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