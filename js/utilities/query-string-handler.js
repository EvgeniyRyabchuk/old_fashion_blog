const QueryStringHandler = () => {
  const strQName = Object.freeze({
    search: "search",
    sort: "sort", 
    categories: "categories",
    tags: "tags",
    startDate: "startDate",
    endDate: "endDate",
    page: "page",
    perPage: "perPage"
  });
  
  const defaultStartDate = "1800-09-04";
  const defaultEndDate = "2025-09-04";

  const addOrDeleteParams = (array) => {
    const params = new URLSearchParams(window.location.search);
    for (let param of array) {
      if (param.name === strQName.startDate && param.value === defaultStartDate 
         || param.name === strQName.endDate && param.value === defaultEndDate) {
         params.delete(param.name); // remove when empty
      } else { 
        if (param.value) {
          params.set(param.name, param.value); // set query
        } else {
          params.delete(param.name); // remove when empty
        }
      }
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  // what kind of params must be skipped during checking 
  const stripIgnored = (obj, ignoreKeys = ["page", "perPage"]) => {
    const copy = {
      ...obj
    };
    ignoreKeys.forEach(k => delete copy[k]);
    return copy;
  };

  const getCurrentParams = () => {
    return Object.fromEntries(new URLSearchParams(window.location.search));
  }

  const checkIfParamsIsChanged = (oldParam) => {
    const currentParams = getCurrentParams(); 
    const prevFilters = stripIgnored(oldParam); 
    const nowFilters = stripIgnored(currentParams);
    return {
      isChanged: JSON.stringify(prevFilters) !== JSON.stringify(nowFilters),
      currentParams
    }
  }

  //TODO: check and get if exist 
  
  const changePostsSearch = async (text) => {
    console.log(`sended - ${text}`); 
    addOrDeleteParams([{name: strQName.search, value: text}]); 
  }

  const changePostsFilter = ({ cIds, tIds, startDate, endDate }) => {
      addOrDeleteParams([
        {name: strQName.categories, value: cIds.join(",")},
        {name: strQName.tags, value: tIds.join(",")},
        {name: strQName.startDate, value: startDate}, 
        {name: strQName.endDate, value: endDate}
      ]); 
  }
  
  const changeSort = (sortValue) => { 
    addOrDeleteParams([{name: strQName.sort, value: sortValue}]); 
  }
  
  const changeCurrentPage = (currentPage, perPage) => { 
    addOrDeleteParams([
      {name: strQName.page, value: currentPage},
      {name: strQName.perPage, value: perPage} 
    ]); 
  }

  return {
    strQName, 
    defaultStartDate,
    defaultEndDate, 
    changePostsSearch,
    changePostsFilter,
    changeSort,
    changeCurrentPage,
    checkIfParamsIsChanged,
    stripIgnored
  }
}