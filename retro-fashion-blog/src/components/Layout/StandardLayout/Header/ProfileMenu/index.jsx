import React, {useMemo, useState} from 'react';
import {useAuth} from "@/context/AuthContext";
import './index.scss';
import {logout} from "@/services/auth";
import { Authenticated as ProfileList } from '@components/Layout/StandardLayout/Header/data';

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

    const [isOpen, setIsOpen] = useState(false);
    const { user, loading: authLoading } = useAuth();

    const linkList = useMemo(() =>
            user.isAdmin ?
                [...ProfileList.admin, ...ProfileList.common] :
                [...ProfileList.user, ...ProfileList.common],
        [user]
    )


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
                    <span data-i18n="auth-profile">Profile</span>
                    <span className="auth-user-name">
                        {!authLoading && user && (
                            <>
                                :<Space />{user.name}
                            </>
                        )}
                    </span>
                </button>
            </div>

            <ul className={`auth-nav-list ${isOpen ? "is-open" : ""}`}>
                {linkList.map((item, index) => (
                    <li key={index} onClick={() => onSelected(item.link) }>
                        <a  data-i18n={item.dataI18n}
                            href={item.link}
                            onClick={(e) => e.preventDefault()}>
                            {item.name}
                        </a>
                    </li>
                ))}
                <li style={{padding: 0}}>
                    <button className="btn-danger"
                            data-i18n="profile-nav-logout-btn"
                            type="button"
                            onClick={() => {
                                logout();
                                onSelected();
                            }}>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileMenu;