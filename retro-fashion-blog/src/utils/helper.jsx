
function HtmlContent({ html }) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}


export { HtmlContent };