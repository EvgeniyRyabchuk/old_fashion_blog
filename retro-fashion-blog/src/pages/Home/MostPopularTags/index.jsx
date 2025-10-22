import React, {useEffect, useState} from 'react';
import './index.scss';
import {useFetching} from "@/hooks/useFetching";
import {fetchMostPopularTags} from "@/services/tags";
import PATHS from "@/constants/paths";

const MostPopularTags = () => {

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
            <h3 className="main-content-title" data-i18n="section-most-popular-tags">Most Popular Tags</h3>
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