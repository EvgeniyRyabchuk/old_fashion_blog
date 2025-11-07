
function HtmlContent({ html, ...props }) {
    return <div {...props} dangerouslySetInnerHTML={{ __html: html }} />;
}

async function urlToFile(url, filename) {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
}

function toggleBodyScroll(isLoading, isLoadMore = false, isScrollUp = true) {
    if(!isScrollUp) return;

    if(!isLoadMore)
        document.querySelector("body").scrollIntoView({ behavior: "smooth", block: "start" });

    if(isLoading) {
        if(!isLoadMore)
            document.body.classList.add("no-scroll");
    } else {
        document.body.classList.remove("no-scroll");
    }
}

export {
    HtmlContent,
    toggleBodyScroll,
    urlToFile
};