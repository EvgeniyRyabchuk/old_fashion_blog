import React, {useEffect, useRef, useState} from 'react';
import createScrollRow from "@utils/scroll-roll";
import {useFetching} from "@/hooks/useFetching";

const ScrollableRow = ({ callback, Card, Placeholder, cardProps }) => {
    
    const [items, setItems] = useState([]);
    const [itemsRow, setItemsRow] = useState(null);

    const section = useRef(null);
    const leftBtn = useRef(null);
    const rightBtn = useRef(null);

    const [fetch, isLoading, error] = useFetching(async () => {
        const items = await callback();
        setItems(items);
        console.log(items);
    });

    useEffect(() => {
        if(section.current &&
            leftBtn.current &&
            rightBtn.current) {
            const row = createScrollRow(
                300,
                section.current,
                leftBtn.current,
                rightBtn.current,)
            setItemsRow(row);

            fetch();
        }
    }, []);

    useEffect(() => {
        items.length > 0 && section &&
        itemsRow.toggleScrollButtons()
    }, [items, itemsRow]);

    return (
        <section className="content-section">
            <h3 className="main-content-title" data-i18n="section-last-posts">Last Posts</h3>
            <div className="post-row-h-scrollable" id="lastPostsSection" ref={section}>
                <button id="lastPostsLeftBtn" className="left-btn" ref={leftBtn}>◀</button>
                <button id="lastPostsRightBtn" className="right-btn" ref={rightBtn}>▶</button>
                {isLoading && new Array(5).fill(<Placeholder />)}
                {items.map((post) => (
                    <Card key={post.id} post={post} {...cardProps} />
                ))}
            </div>
        </section>
    );
};

export default ScrollableRow;