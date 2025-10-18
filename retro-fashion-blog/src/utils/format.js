
const getDateRangeWitToORFrom = (input) => input.type == "date-range-start" ? `from ${input.value}` : `to ${input.value}`;

function getPostContentPreview(html, maxLength = 150) {
    // Remove all HTML tags
    const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

    // Cut to desired length
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + "...";
    }
    return text;
}

export {
    getDateRangeWitToORFrom,
    getPostContentPreview
}

