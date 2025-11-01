import React, {useEffect, useMemo, useState} from 'react';
import "./index.scss";
import Dropdown from '@components/Dropdown';

import guestNavListData from './data/common-nav';
import LangSelector from "./Selectors/LangSelector";
import ThemeSelector from "./Selectors/ThemeSelector";
import SearchSector from "./SearchSector";
import {useAuth} from "@/context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";
import AuthOffer from "./AuthOffer";
import ProfileMenu from "@components/Layout/StandardLayout/Header/ProfileMenu";
import {useFetching} from "@/hooks/useFetching";
import {fetchAllCategories} from "@/services/categories";

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


    const [categories, setCategories] = useState([]);
    const [fetchCategories, isLoading, error] = useFetching(async () => {
        const cList = await fetchAllCategories();
        setCategories(cList.map(c => ({ name: c.name_en, link: `${PATHS.POSTS}?categories=${c.id}`, dataI18n: c.dataI18n })))
    })
    useEffect(() => {
        fetchCategories();
    }, []);

    //TODO: to multi deep
    const mobileGuestNavCategoriesList = useMemo(() => {
        return guestNavListData.map((item, index) => {
            if(item.name === "All posts" && categories.length > 0) {
                return {
                    ...item, data: categories
                };
            }
            return item;
        })
    }, [categories])


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
                            data={mobileGuestNavCategoriesList}
                            isClickable={true}
                        />
                    </aside>
                </div>

                <div className="top-menu-content">
                    <div className="burger-menu-btn" id="burgerMenuBtn" onClick={onBurgerClick}></div>
                    {/* desktop dropdown */}
                    <Dropdown
                        ulClassName={"guest-nav-list"}
                        data={mobileGuestNavCategoriesList}
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