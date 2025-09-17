
// firebase pagination only 
const createCursorHandler  = (colName) => {
  let lastDocCache = {};
  
  const cursorName = `lastDocCache_${colName}`;  
  // made cursor save system to firebase pagination work via cursor base aproach 
  const restoreLastDocCache = async () => {
    const raw = localStorage.getItem(cursorName);
    if (!raw) {
      currentPage = 1;
      return {}
    };
    
    const cache = JSON.parse(raw);
    const rebuilt = {};

    for (const [page, docId] of Object.entries(cache)) {
      const snap = await db.collection(colName).doc(docId).get();
      if (snap.exists) {
        rebuilt[page] = snap; // snapshot, not just id/ref
      }
    }
    lastDocCache = rebuilt; 
    return rebuilt;
  };

  const saveCursor = (lastDoc, page) => {
     lastDocCache[page] = lastDoc; // keep in memory 
    // persist only the ID 
    const cacheToSave = JSON.parse(localStorage.getItem(cursorName) || "{}");
    cacheToSave[page] = lastDoc.id; 
    localStorage.setItem(cursorName, JSON.stringify(cacheToSave));
    return cacheToSave; 
  }
  
  const deleteCursor = () => {
    lastDocCache = {}; 
    localStorage.removeItem(cursorName); 
  }
  
  return {
    get lastDocCache() {
      return lastDocCache;
    },
    cursorName,
    saveCursor,
    restoreLastDocCache,
    deleteCursor
  }
}

const createPaginator = ({
  colName, // collection name in firebase, like "posts"
  container, // where items must be render 
  perPageSelect,
  prevBtn,
  nextBtn, 
  pageInfo,
  pageNumbersContainer,
  loadMoreBtn,
  fetchData,   // async function (page, perPage) => { items, totalCount }
  renderItem,  // function(item) => HTMLElement,
  loader
}) => {

  let params = Object.fromEntries(new URLSearchParams(window.location.search));
  // TODO: strQName 
  let currentPage = parseInt(params.page ?? 1); 
  let perPage = null; 
  if(params.perPage) {
    perPage = parseInt(params.perPage); 
    perPageSelect.value = perPage; 
  } else {
    perPage = parseInt(perPageSelect.value);
  }

  let totalPages = 1; 
  let totalCount = 0;

  let isFirstLoad = true;
  const cursorHandler = createCursorHandler(colName); 

  const renderPosts = async () => {
    // firebase pagination only 
    if (isFirstLoad) {
      await cursorHandler.restoreLastDocCache(); 
      if(Object.keys(cursorHandler.lastDocCache).length === 0) 
         currentPage = 1;
      isFirstLoad = false;
    }
    
    container.innerHTML = ""; 
    queryStrHandler.changeCurrentPage(currentPage, perPage);  
    const { items, totalCount: newTotal } = 
      await fetchData({page: currentPage, perPage, cursorHandler}); 

    totalCount = newTotal; 
    totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    
    items.forEach(item => {
      container.appendChild(renderItem(item));
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    renderPageNumbers();
    
    // "Load more" means: request next page and append
    loadMoreBtn.style.display = currentPage < totalPages ? "inline-block" : "none";
  };


  const loadMore = async () => {
    if (currentPage >= totalPages) return;

    loader.style.display = "flex"; 
    loader.style.top = "auto";

    currentPage++; 
    queryStrHandler.changeCurrentPage(currentPage, perPage);  
     
    const fetchArgs = { 
      page: currentPage, perPage, 
      cursorHandler,
      options: { isLoadMore: true } 
    }; 
    const { items } = await fetchData(fetchArgs); 

    items.forEach(item => {
      container.appendChild(renderItem(item));
    });

    loader.style.top = "0";
    loader.style.display = "none";
   
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    renderPageNumbers();

    if (currentPage >= totalPages) loadMoreBtn.style.display = "none";
  };

  const getPageList = (total, current) => {
    const delta = 2;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const range = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push("...");
    range.push(total);

    return range;
  };

  const renderPageNumbers = () => {
    pageNumbersContainer.innerHTML = "";
    const list = getPageList(totalPages, currentPage);

    list.forEach(item => {
      if (item === "...") {
        const el = document.createElement("span");
        el.className = "page-ellipsis";
        el.textContent = "...";
        pageNumbersContainer.appendChild(el);
        return;
      }

      const btn = document.createElement("button");
      btn.className = "page-num";
      btn.type = "button";
      btn.textContent = String(item);
      if (item === currentPage) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "page");
      }
      btn.addEventListener("click", async () => {
        currentPage = item;
        await renderPosts();
        // container.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      if(btn.classList.contains("active")) // firebase pagination only 
        pageNumbersContainer.appendChild(btn);
    });
  };

  // Events
  perPageSelect.addEventListener("change", async () => {
    perPage = parseInt(perPageSelect.value);
    currentPage = 1; 
    cursorHandler.deleteCursor(); 
    await renderPosts();
  });

  prevBtn.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      await renderPosts();
    }
  });

  nextBtn.addEventListener("click", async () => {
    if (currentPage < totalPages) {
      currentPage++;
      await renderPosts();
    }
  });

  loadMoreBtn.addEventListener("click", loadMore);

  // Initial render
  renderPosts();
  
  return {
    reload: renderPosts,
    setPage: async (p) => {
      currentPage = p;
      await renderPosts();
    },
    getCurrentPage: () => currentPage,
    getTotalPages: () => totalPages
  };
};

