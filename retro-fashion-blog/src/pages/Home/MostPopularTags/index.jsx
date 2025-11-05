import React, {useEffect, useState} from 'react';
import './index.scss';
import {useFetching} from "@/hooks/useFetching";
import {fetchMostPopularTags} from "@/services/tags";
import PATHS from "@/constants/paths";
import {useLang} from "@/context/LangContext";

const MostPopularTags = () => {
    const { t } = useLang();
    console.log(123)
    const [tags, setTags] = useState([]);
    const [fetch, isLoading, error, ] = useFetching(async () => {
        const loadedTags = await fetchMostPopularTags();
        setTags(loadedTags);
    })

    useEffect(() => {
        fetch();
    }, []);

    return (
        <section className="content-section tags-section" style={{ padding: '20px' }}>
            <h3 className="main-content-title">
                {t("section-most-popular-tags")}
            </h3>

            <div id="tagsRow" className="tags-row">
                {tags.map((tag) => (
                    <a key={tag.id} href={PATHS.POSTS_BY_TAG(tag.id)}
                       className="tag">
                        {tag.name}
                    </a>
                ))}
            </div>
        </section>
    );
};

export default MostPopularTags;