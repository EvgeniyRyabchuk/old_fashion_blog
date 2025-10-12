import React, {useEffect, useRef, useState} from 'react';
import Loader from "@components/Loader";
import useDebounce from "@/hooks/useDebounce";
import queryStrHandler from "@utils/query-string-handler";
import breakpoints from "@/constants/breakpoints";
import { db } from "@/firebase/config";


async function fetchPostsBySearch(term) {
    if(term === "" || !term) {
        console.log("No term → return all posts or skip");
        return [];
    }
    const postsRef = db.collection("posts");
    // 1. Search posts by title
    const postsByTitleSnap = await postsRef
        .orderBy("searchIndex")
        .orderBy("createdAt", "desc")
        .startAt(term.toLowerCase())
        .endAt(term.toLowerCase() + "\uf8ff")
        .limit(10)
        .get();

    const posts = postsByTitleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // renderPostsForSearch(posts);
    return posts;
}




// const searchPostLoader = document.getElementById("searchPostLoader");
//
// const searchPostLoader = document.getElementById("searchPostLoader");
//
// const headerSearch = document.getElementById("headerSearch");
// const searchToggle = document.getElementById("searchToggle");
// const searchClose = document.getElementById("searchClose");
// const searchInput = document.getElementById("searchInput");
// const searchControll = document.getElementById("searchControll")
// const searchContent = document.getElementById("searchContent");
// const searchSeeMoreLink = searchContent.querySelector("#searchSeeMore");
//
// const noDataLi = searchContent.querySelector(".no-data-li")

const SearchSector = () => {
    const [text, setText] = useState('');
    const debouncedText = useDebounce(text, 500);

    const [searchPostList, setSearchPostList] = useState([]);

    const [isActiveHeaderSearch, setActiveHeaderSearch] = useState(false);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [isSearchContentOpen, setIsSearchContentOpen] = useState(false);

    const [isSeeMoreOpen, setIsSeeMoreOpen] = useState(false);
    const [seeMoreLink, setSeeMoreLink] = useState("");

    const [isNoData, setIsNoData] = useState(false);


    const searchControlRef = useRef(null); // ✅ useRef instead of getElementById

    const showSeeMore = (text, length) => {
        const seeMoreTriggerCount = 3;
        const searchUrl = `/posts.html?${queryStrHandler.strQName.search}=${text}`;
        if (length >= seeMoreTriggerCount) {
            setSeeMoreLink(searchUrl);
            setIsSeeMoreOpen(true);
        }
    }



    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchControlRef.current &&                      // ref is defined
                !searchControlRef.current.contains(e.target) &&  // clicked outside
                isActiveHeaderSearch
            ) {
                setActiveHeaderSearch(false);
                if (window.innerWidth <= breakpoints.lg)
                    document.body.classList.toggle("no-scroll");
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isActiveHeaderSearch]); // re-run when active state changes


    const textChanged = async (text) => {
        queryStrHandler.changePostsSearch(text);
        setActiveHeaderSearch(true);
        setIsLoaderActive(true)

        console.log(text);

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

    useEffect(() => {
        if(text !== "") textChanged(text);
    }, [debouncedText]);

    useEffect(() => {
        if(text === "") setActiveHeaderSearch(false);
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

    const onSearchToogleClick = () => {
        setActiveHeaderSearch(!setActiveHeaderSearch);
        document.body.classList.toggle("no-scroll");
    }

    const onSearchBtnClick = () => {
        if(!text) return;
        window.location.href = `/posts.html?${queryStrHandler.strQName.search}=${text}`;
    }

    const onSearchCloseClick = (e) => {
        setActiveHeaderSearch(!setActiveHeaderSearch);
        if(window.innerWidth <= breakpoints.lg)
            document.body.classList.toggle("no-scroll");
        setText("");
        setSearchPostList([]);
        removePostList();
    }

    return (
        <div className={`form-row header-search ${isActiveHeaderSearch ? "active" : ""}`} id="headerSearch">
            <div className="d-flex-center form-row search-controll" id="searchControll" ref={searchControlRef} >
                <button className="search-close"
                        id="searchClose"
                        type="button"
                        onClick={onSearchCloseClick}
                >&times;</button>
                <input className="search-input"
                       id="searchInput"
                       type="text" placeholder="Search..."
                       data-i18n-attr="placeholder:search-placeholder"
                       onChange={onInputChange}
                       onClick={() => {
                           setActiveHeaderSearch(true);
                           console.log(123);
                       }}
                />
                <button className="btn-info search-btn"
                        id="searchBtn"
                        type="button"
                        data-i18n="search-button"
                        onClick={onSearchBtnClick}
                >
                    Search
                </button>

                <button className="search-toggle"
                        id="searchToggle"
                        type="button"
                        onClick={onSearchToogleClick}
                ></button>
            </div>

            <div id="searchContent"
                 className={`search-content 
                    ${isLoaderActive || isSearchContentOpen ? "is-open" : ""} 
                 `}
                 style={{
                     height: isLoaderActive ? "300px" : "",
                 }}
            >
                <Loader isActive={isLoaderActive} />

                <div
                    className={`no-data-li ${!isNoData ? "d-none" : ""}`}
                    data-i18n="search-no-results"
                >
                    No results found
                </div>

                <ul id="searchPostList" className="search-post-list">
                    {searchPostList.map((post) => (
                        <li key={post.id}>
                            <a href={`/post.html?id=${post.id}`}>
                                <div className="post-cover d-flex-v-center">
                                    <img src={post.coverUrl} alt="Post Img"/>
                                </div>
                                <div className="post-title-wrapper">
                                  <span className="post-title">
                                    {post.title}
                                  </span>
                                </div>
                            </a>
                        </li>)
                    )}
                </ul>

                <a
                    id="searchSeeMore"
                    href={seeMoreLink}
                    className={`see-more ${!isSeeMoreOpen ? "d-none" : ""}`}
                    data-i18n="search-see-more"

                >
                    See More...
                </a>
            </div>
        </div>
    );
};

export default SearchSector;