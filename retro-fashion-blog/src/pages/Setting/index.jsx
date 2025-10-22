import React, {useEffect, useState} from 'react';
import './index.scss';
import {useAuth} from "@/context/AuthContext";
import defAvatar from "@assets/images/profile.png";
import {loadToCloudinary} from "@/services/image";
import {updateProfile} from "@/services/user";

const Setting = () => {
    console.log('setting')
    const { user, isAuth } = useAuth();
    const [name, setName] = useState("");

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || defAvatar);

    // Preview avatar on file select
    const onAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    const onSave = async () => {
        if (!user) return alert("Not logged in");
        try {
            if (avatarFile) {
                const avatarUrl = await loadToCloudinary(avatarFile);
                await updateProfile(user, name, avatarUrl);
            }
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error updating profile: " + err.message);
        }
    }

    useEffect(() => {
        if(user && isAuth) {
            setName(user.name);
            setAvatarFile(user.avatar);
        }
    }, [user]);

    return (
        <div className="content-section" style={{ height: "50vh" }}>
            <div className="profile-settings">
                <h2 className="main-content-title" id="mainContentTitle" data-i18n="profile-settings">Profile
                    Settings</h2>
                <div className="avatar-section">
                    <div className="avatar-wrapper">
                        <img id="avatarPreview"
                             src={avatarPreview || defAvatar}
                             alt="Avatar"
                        />
                        <label htmlFor="avatarInput" className="avatar-upload">
                            <span>+</span>
                        </label>
                        <input
                            type="file"
                            id="avatarInput"
                            accept="image/*"
                            onChange={onAvatarChange}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label
                        htmlFor="displayName"
                        data-i18n="display-name"
                    >
                        Display Name
                    </label>
                    <input
                        type="text" id="displayName"
                        placeholder="Enter your name"
                        data-i18n-attr="placeholder:enter-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button
                    id="saveProfileBtn"
                    data-i18n="save-changes"
                    onClick={onSave}
                >Save Changes
                </button>
            </div>
        </div>
    );
};

export default Setting;