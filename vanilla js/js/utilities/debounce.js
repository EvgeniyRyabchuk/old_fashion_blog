const createDebounce = (delay) => {
  let debounceTimeOutID = null;
  const set = (content, callback) => {
    if(debounceTimeOutID) 
        clearTimeout(debounceTimeOutID);
    debounceTimeOutID = setTimeout(() => {
      console.log(`${content} - approved`);
      callback(content);
    }, delay); 
  }
  return { 
    debounceTimeOutID,
    set
  }; 
}