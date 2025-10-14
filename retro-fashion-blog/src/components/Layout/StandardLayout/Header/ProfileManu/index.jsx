import React, {useState} from 'react';
import {useAuth} from "@/context/AuthContext";
import './index.scss';
import {logout} from "@/services/auth";

const Space = () => {

    return (
        <span style={{ marginRight: '4px' }}></span>
    )
}

const ProfileMenu = ({
         data,
         isAside,
         isHoverable,
         isClickable
    }) => {

    const [isOpen, setIsOpen] = useState(false);
    const { user, loading: authLoading } = useAuth();



    return (
        <div className={isAside ?
            `aside-profile-btn-wrapper switchable-flex is-open`
            : "profile-btn-wrapper switchable is-open"
        }
             onMouseEnter={isHoverable ?  () => setIsOpen(!isOpen)  : null}
             onMouseLeave={isHoverable ?  () => setIsOpen(!isOpen) : null}
             onClick={isClickable ? () => setIsOpen(!isOpen) : null }
        >
            <div className="form-row">

                <button className={
                    `${isAside ? "aside-profile-btn switchable-flex" : "profile-btn switchable"}`
                } >
                    <span data-i18n="auth-profile">Profile</span>
                    <span className="auth-user-name">
                        {!authLoading && user ? (
                            <>
                                :<Space />{user.name}
                            </>
                        ) : ""}
                    </span>
                </button>
            </div>

            <ul className={`auth-nav-list ${isOpen ? "is-open" : ""}`}>
                {data.map((item, index) => (
                    <li key={index}><a data-i18n={item.dataI18n} href={item.link}>{item.name}</a></li>
                ))}
                <li style={{padding: 0}}>
                    <button className="btn-danger"
                            data-i18n="profile-nav-logout-btn"
                            type="button"
                            onClick={() => logout()}>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileMenu;