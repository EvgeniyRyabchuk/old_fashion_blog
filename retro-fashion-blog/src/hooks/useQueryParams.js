
import {useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {db} from "@/firebase/config";
import queryStrHandler from "@utils/query-string-handler";
import firebase from "firebase";
import {defaultEndDate, defaultStartDate} from "@/constants/default";


const useQueryParams = (deps) => {

    const [searchParams, setSearchParams] = useSearchParams();

    // 1. Read parameters (similar to your initial logic)
    // We use useMemo to calculate these only when the searchParams change.
    const params = useMemo(() => {
        const page = parseInt(searchParams.get('page') ?? '1', 10);
        const perPage = searchParams.get('perPage') ?? '5';
        return {page, perPage};
    }, [searchParams]);

    const updateSearchParams = useCallback((updates, isReset = false) => {
        // 1. Get the base parameters. If isReset is true, start with an empty object.
        //    Otherwise, get the current parameters from the URL.
        const currentParams = isReset
            ? {}
            : Object.fromEntries(searchParams.entries());

        // 2. Merge existing params with new updates
        const mergedParams = {
            ...currentParams,
            ...updates,
        };

        // 3. Filter out parameters that have empty string, null, or undefined values.
        const finalParams = Object.keys(mergedParams).reduce((acc, key) => {
            const value = mergedParams[key];

            // Exclude parameters if the value is null, undefined, or an empty string.
            // Also ensure the value isn't an empty array if you handle array parameters.
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        // 4. Update the URL with the clean set of parameters
        setSearchParams(finalParams);

    }, [setSearchParams, searchParams]);

    // const updateSearchParams = useCallback((updates, isReset = false) => {
    //     console.log(params)
    //     // 1. Get current params as a plain object
    //     const currentParams = !isReset ? Object.fromEntries(searchParams.entries()) : [];
    //
    //     // 2. Merge existing params with new updates
    //     const newParams = {
    //         ...currentParams,
    //         ...updates,
    //     };
    //
    //     // 3. Update the URL
    //     setSearchParams(newParams);
    // }, [setSearchParams, searchParams]);



    const postFilterQueryCreator = useCallback(async () => {
        let categories = [...document.querySelectorAll('input[data-type="category"]:checked')].map(el => el.value);
        let tags = [...document.querySelectorAll('input[data-type="tag"]:checked')].map(el => el.value);
        const startDate = document.querySelector('input[data-type="date-range-start"]').value;
        const endDate = document.querySelector('input[data-type="date-range-end"]').value;
        const sort = document.getElementById("sort").value;

        const params = {
            categories,
            tags,
            sort
        }

        let query = db.collection("posts");

        // because of inequalities trouble
        if (startDate && startDate !== defaultStartDate) {
            params.startDate = startDate;
            query = query.where("date_range_start", ">=", new Date(startDate).getFullYear());
            return query;
        }
        if (endDate && endDate !== defaultEndDate) {
            params.endDate = endDate;
            query = query.where("date_range_end", "<=",  new Date(endDate).getFullYear());
            return query;
        }

        if (categories.length > 0) {
            query = query.where("categoryId", "in", categories);
        }

        if (tags.length > 0) {
            const snap = await db.collection("post_tag")
                .where("tagId", "in", tags.slice(0, 10))
                .get();

            const postIds = snap.docs.map(d => d.data().postId);
            if (postIds.length === 0) {
                // impossible expression to returning empty array
                return db.collection("posts").where("userId", "==", "__impossible__");
            }

            query = query.where(firebase.firestore.FieldPath.documentId(), "in", postIds.slice(0, 10));

        }

        if (sort === "newest") {
            query = query.orderBy("createdAt", "desc");
        } else if (sort === "oldest") {
            query = query.orderBy("createdAt", "asc");
        } else if (sort === "popular") {
            query = query.orderBy("views", "desc");
        }

        return query;
    }, []);


    return {
        searchParams,
        setSearchParams,
        params,
        updateSearchParams,


        postFilterQueryCreator
    };
}

export default useQueryParams;