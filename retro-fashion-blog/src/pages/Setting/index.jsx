import React, {use, useEffect, useMemo, useState} from 'react';
import './index.scss';
import {useAuth} from "@/context/AuthContext";
import defAvatar from "@assets/images/profile.png";
import {loadToCloudinary} from "@/services/image";
import {updateProfile} from "@/services/user";
import * as Yup from "yup";
import {Form, Formik} from "formik";
import {toast} from "react-toastify";
import {useFetching} from "@/hooks/useFetching";
import Spinner from "@components/Loader/Spinner";

const validationSchema = Yup.object({
    name: Yup.string().required("Required").min(2, "Must be at least 2 characters"),
})

const Setting = () => {
    console.log('setting')
    const { user, setUser, isAuth } = useAuth();

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

    const [update, isLoading, error ] = useFetching(async (name) => {
        if(name === user.name && !avatarFile) return [];

        let avatarUrl = null;
        if (avatarFile) avatarUrl = await loadToCloudinary(avatarFile);

        await updateProfile(user, name, avatarUrl);
        setUser({ ...user, name, avatar: avatarUrl || user.avatar });
        return [avatarUrl && "Avatar", user.name !== name && "Name"].filter(Boolean);
    })

    const onSave = async ({ name }) => {
        const changes = await update(name);
        setAvatarFile(null);
        if(changes.length > 0) toast.success(`${changes.join(" and ")} saved successfully`);
        else toast.warn("No changes made");
    }

    // useEffect(() => {
    //     if(user && isAuth) {
    //         setName(user.name);
    //         setAvatarFile(user.avatar);
    //     }
    // }, [user]);

    return (
        <div className="content-section" style={{ height: "50vh" }}>
            <div className="profile-settings">
                <h2 className="main-content-title" id="mainContentTitle" data-i18n="profile-settings">Profile
                    Settings
                </h2>
                <Formik
                    initialValues={{ name: user.name }}
                    validationSchema={validationSchema}
                    onSubmit={onSave}
                    validateOnMount={false}
                    validateOnChange={true}
                    validateOnBlur={true}
                >
                    {({ errors,
                          touched,
                          values,
                          handleChange,
                      }) => (
                          <Form>
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
                                  <label htmlFor="displayName" data-i18n="display-name">
                                      Display Name
                                  </label>
                                  <input
                                      type="text"
                                      placeholder="Enter your name"
                                      data-i18n-attr="placeholder:enter-name"
                                      name="name"
                                      value={values.name}
                                      onChange={handleChange}
                                  />
                                  { errors.name && touched.name ? (
                                      <div className="error-message">{errors.name}</div>
                                  ) : null}
                              </div>
                              <button
                                  id="saveProfileBtn"
                                  data-i18n="save-changes"
                                  type="submit"
                              >
                                  Save Changes
                                  { isLoading && <Spinner style={{ marginLeft: "5px" }} /> }
                              </button>
                          </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Setting;