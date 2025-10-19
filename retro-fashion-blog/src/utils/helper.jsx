
function HtmlContent({ html }) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function toggleBodyScroll(isLoading, isLoadMore = false) {
    if(!isLoadMore)
        document.querySelector("body").scrollIntoView({ behavior: "smooth", block: "start" });

    if(isLoading) {
        // if(!isLoadMore)
        // document.body.classList.add("no-scroll");
    } else {
        // document.body.classList.remove("no-scroll");
    }
}

export { HtmlContent, toggleBodyScroll };