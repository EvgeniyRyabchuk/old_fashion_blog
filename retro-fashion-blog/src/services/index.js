
import {fetchPostsByIds, fetchLastPosts} from './posts'
import {db} from "@/firebase/config";
import {toggleBodyScroll} from "@utils/helper";

const fetchDataFirestore = async (
    colName,
    page,
    perPage,
    cursorHandler,
    options
) => {


    const sort = options.sort || "createdAt";

    // ref for filtered query
    let ref = null;

    if(options.filterHandler) {
        ref = await options.filterHandler();
    } else {
        ref = db.collection(colName).orderBy("createdAt", "desc");
    }
    console.log('====================================')
    if (sort === "newest") {
        ref = ref.orderBy("createdAt", "desc");
    } else if (sort === "oldest") {
        ref = ref.orderBy("createdAt", "asc");
    } else if (sort === "popular") {
        ref = ref.orderBy("views", "desc");
    }

    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const search = params.search;

    if (search) {
        const filterSortSection = document.getElementById("filterSortSection");
        filterSortSection.style.display = "none";
        document.getElementById("mainContentTitle").innerText
            = `${options.t("search_posts_by")} "${search}"`;


        // search only works if you order by the field you want to search on
        ref = db.collection(colName)
            .orderBy("searchIndex")
            .orderBy("createdAt", "desc")
            .startAt(search.toLowerCase())
            .endAt(search.toLowerCase() + "\uf8ff")
    }

    // ref for get total page for pagination
    let paginatedRef = ref.limit(perPage);

    const lastDocCache = cursorHandler.lastDocCache;
    // if not the first page, continue after last doc of previous page
    if (page > 1 && lastDocCache[page - 1]) {
        paginatedRef = paginatedRef
            .startAfter(lastDocCache[page - 1])
    }

    const snap = await paginatedRef.get();
    let posts = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
    }));

    // save cursor
    if (snap.docs.length > 0) {
        const lastDoc = snap.docs[snap.docs.length - 1];
        cursorHandler.saveCursor(lastDoc, page);
    }

    const totalCountSnap = await ref.get();
    const totalCount = totalCountSnap.size;
    console.log(`total ${totalCount}`);



    return {
        items: posts,
        totalCount,
    };
};


export {
    fetchPostsByIds,
    fetchLastPosts,
    fetchDataFirestore
}