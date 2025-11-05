import React, {useMemo, useState} from 'react';
import {useAuth} from "@/context/AuthContext";
import './index.scss';
import {logout} from "@/services/auth";
import { Authenticated as ProfileList } from '@/constants/navigation';
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";
import defAvatar from "@assets/images/profile.png";
import {useLang} from "@/context/LangContext";

const Space = () => {

    return (
        <span style={{ marginRight: '4px' }}></span>
    )
}

const ProfileMenu = ({
         isAside,
         isHoverable,
         isClickable,
         onSelected
    }) => {
    const { t } = useLang();
    const [isOpen, setIsOpen] = useState(false);
    const { user, loading: authLoading } = useAuth();

    const linkList = useMemo(() =>
            user.isAdmin ?
                [...ProfileList.admin, ...ProfileList.common] :
                [...ProfileList.user, ...ProfileList.common],
        [user]
    )

    const navigate = useNavigate();

    return (
        <div className={isAside
            ? "aside-profile-btn-wrapper switchable-flex is-open"
            : "profile-btn-wrapper switchable is-open"
        }
             onMouseEnter={() => isHoverable && setIsOpen(true) }
             onMouseLeave={() => isHoverable && setIsOpen(false) }
             onClick={() => {
                 isClickable && setIsOpen(!isOpen);
             }}
        >
            <div className="form-row">
                <button className={
                    `${isAside ? "aside-profile-btn switchable-flex" : "profile-btn switchable"}`
                } >

                    <span >{t("profile-nav-welcome")}</span>
                    <span className="auth-user-name">
                        {!authLoading && user && (
                            <>
                                <Space />{user.name}
                            </>
                        )}
                    </span>
                    <img
                        className="profile-btn-image"
                        width="22"
                        height="22"
                        src={user.avatar || defAvatar}
                        alt=""
                    />
                </button>
            </div>

            <ul className={`auth-nav-list ${isOpen ? "is-open" : ""}`}>
                {linkList.map((item, index) => (
                    <li key={index} onClick={() => onSelected(item.link) }>
                        <Link
                            data-i18n={item.dataI18n}
                            to={item.link}
                            onClick={(e) => {
                                e.preventDefault();
                                setIsOpen(false);
                            }}
                        >
                            {t(item.dataI18n)}
                        </Link>
                    </li>
                ))}
                <li style={{padding: 0}}>
                    <button className="btn-danger"
                            data-i18n="profile-nav-logout-btn"
                            type="button"
                            onClick={() => {
                                logout();
                                navigate(PATHS.HOME);
                                onSelected();
                            }}>
                        {t("profile-nav-logout-btn")}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileMenu;