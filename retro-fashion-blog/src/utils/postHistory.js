

const historyLimit = 10;
const addPostToHistory = (postId) => {
    const historyStr = localStorage.getItem("postHistory");
    let history = historyStr ? historyStr.split(",") : [];

    history.unshift(postId);
    history = Array.from(new Set(history));

    if(history.length >= historyLimit) {
        history.pop();
    }
    localStorage.setItem("postHistory", history.join(","));
}


export default addPostToHistory;