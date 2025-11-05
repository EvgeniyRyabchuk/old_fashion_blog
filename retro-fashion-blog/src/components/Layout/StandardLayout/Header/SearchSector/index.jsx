import React, {useEffect, useRef, useState} from 'react';
import { StandardLoader } from "@components/Loader";
import useDebounce from "@/hooks/useDebounce";
import queryStrHandler from "@utils/query-string-handler";
import breakpoints from "@/constants/breakpoints";
import {Link, useNavigate} from "react-router-dom";
import PATHS from "@/constants/paths";
import {fetchPostsBySearch} from "@/services/posts";
import {defSeeMoreTriggerCount} from "@/constants/default";
import './index.scss';
import {useLang} from "@/context/LangContext";

//TODO: fetch into service
//TODO: mouse click up call close


const SearchSector = () => {
    const { t } = useLang();
    const [text, setText] = useState('');
    const debouncedText = useDebounce(text, 500);
    const navigate = useNavigate();
    const [searchPostList, setSearchPostList] = useState([]);

    const [isActiveHeaderSearch, setActiveHeaderSearch] = useState(false);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [isSearchContentOpen, setIsSearchContentOpen] = useState(false);

    const [isSeeMoreOpen, setIsSeeMoreOpen] = useState(false);
    const [seeMoreLink, setSeeMoreLink] = useState("");

    const [isNoData, setIsNoData] = useState(false);


    const searchControlRef = useRef(null); // ✅ useRef instead of getElementById

    const closeSearchPanel = () => {
        setActiveHeaderSearch(false);
        if (window.innerWidth <= breakpoints.lg)
            document.body.classList.toggle("no-scroll");
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchControlRef.current &&                      // ref is defined
                !searchControlRef.current.contains(e.target) &&  // clicked outside
                isActiveHeaderSearch
            ) {
                closeSearchPanel();
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isActiveHeaderSearch]); // re-run when active state changes

    const showSeeMore = (text, length) => {
        if (length >= defSeeMoreTriggerCount) {
            setIsSeeMoreOpen(true);
        }
    }

    const textChanged = async (text) => {
        queryStrHandler.changePostsSearch(text);
        setActiveHeaderSearch(true);
        setIsLoaderActive(true)

        const items = await fetchPostsBySearch(text);

        if (items.length > 0) {
            setIsNoData(false);
            showSeeMore(text, items.length);
        } else {
            setIsNoData(true);
        }

        setSearchPostList(items);
        setIsSearchContentOpen(true);
        setIsLoaderActive(false);
    }

    const closeAll = () => {
        setIsSearchContentOpen(false);
        setIsLoaderActive(false);
        setIsSeeMoreOpen(false);
        setIsNoData(false);
    }

    useEffect(() => {
        if(text !== "") textChanged(text);
    }, [debouncedText]);
    useEffect(() => {
        if(text === "") {
            closeAll();
        }
    }, [text]);

    const removePostList = () => {
        setIsSeeMoreOpen(false);
        setIsNoData(false);
        setIsSearchContentOpen(true);
    }

    const onInputChange = (e) => {
        const newText = e.target.value;
        setText(newText)
        setSearchPostList([]);
        setIsLoaderActive(true);
        removePostList();
    }

    const onSearchToggleClick = () => {
        setActiveHeaderSearch(true);
        document.body.classList.toggle("no-scroll");
    }

    const onSearchBtnClick = () => {
        if(!text) return;
        onSearchCloseClick();
        navigate(`${PATHS.POSTS}?search=${text}`);
    }

    const onSearchCloseClick = () => {
        setActiveHeaderSearch(false);
        if(window.innerWidth <= breakpoints.lg)
            document.body.classList.toggle("no-scroll");
        setText("");
        setSearchPostList([]);
        removePostList();
        closeAll();
    }

    return (
        <div
            className={`form-row header-search ${isActiveHeaderSearch ? "active" : ""}`}
            id="headerSearch"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="d-flex-center form-row search-controll" id="searchControll" ref={searchControlRef} >
                <button className="search-close"
                        id="searchClose"
                        type="button"
                        onClick={onSearchCloseClick}
                >&times;</button>
                <input className="search-input"
                       id="searchInput"
                       type="text"
                       placeholder={t("search-placeholder")}
                       data-i18n-attr="placeholder:search-placeholder"
                       onChange={onInputChange}
                       value={text}
                       onClick={() => {
                           setActiveHeaderSearch(true);

                       }}
                />
                <button className="btn-info search-btn"
                        id="searchBtn"
                        type="button"
                        data-i18n="search-button"
                        onClick={onSearchBtnClick}
                >
                    {t("search-button")}
                </button>
                <button className="search-toggle"
                        id="searchToggle"
                        type="button"
                        onClick={onSearchToggleClick}
                ></button>
            </div>
            {
                isActiveHeaderSearch && text === "" && window.innerWidth <= breakpoints.lg &&
                <div className="search-text-tip">
                    {t("enter-post-title-to-find")}
                </div>
            }

            <div id="searchContent"
                 className={`search-content 
                    ${isLoaderActive || isSearchContentOpen ? "is-open" : ""} 
                 `}
                 style={{
                     height: isLoaderActive ? "300px" : "",
                 }}
            >
                <StandardLoader isActive={isLoaderActive} />

                <div
                    className={`no-data-li ${!isNoData ? "d-none" : ""}`}
                >
                    {t("search-no-results") || "No results found"}
                </div>


                <ul id="searchPostList" className="search-post-list">
                    {searchPostList.slice(0, defSeeMoreTriggerCount).map((post) => (
                        <li key={post.id}>
                            <Link
                                to={PATHS.POST(post.id)}
                                onClick={e => {
                                    e.preventDefault();
                                    navigate(PATHS.POST(post.id));
                                    closeSearchPanel();
                                }
                            }>
                                <div className="post-cover d-flex-v-center">
                                    <img src={post.coverUrl} alt="Post Img"/>
                                </div>
                                <div className="post-title-wrapper">
                                  <span className="post-title">
                                    {post.title}
                                  </span>
                                </div>
                            </Link>
                        </li>)
                    )}
                </ul>

                <Link
                    id="searchSeeMore"
                    to={seeMoreLink}
                    className={`see-more ${!isSeeMoreOpen ? "d-none" : ""}`}
                    data-i18n="search-see-more"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`${PATHS.POSTS}?search=${text}`);
                        closeSearchPanel();
                    }}
                >
                    {t("search-see-more")}
                </Link>
            </div>
        </div>
    );
};

export default SearchSector;