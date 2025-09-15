const createPaginator = ({
  colName,
  container,
  perPageSelect,
  prevBtn,
  nextBtn, 
  pageInfo,
  pageNumbersContainer,
  loadMoreBtn,
  fetchData,   // async function (page, perPage) => { items, totalCount }
  renderItem,  // function(item) => HTMLElement
  loader
}) => {

  const params = Object.fromEntries(new URLSearchParams(window.location.search));
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
  let lastDocCache = {};
  let isFirstLoad = false;
  

  // made cursor save system to firebase pagination work via cursor base aproach 
  const restoreLastDocCache = async (colName) => {
    const raw = localStorage.getItem("lastDocCache");
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
    return rebuilt;
  };

  
  const renderPosts = async () => {
    if (!isFirstLoad) {
      lastDocCache = await restoreLastDocCache(colName); 
      isFirstLoad = true;
    }
    
    container.innerHTML = ""; 
    queryStrHandler.changePostsCurrentPage(currentPage, perPage);  
    const { items, totalCount: newTotal, lastDocCache: updatedLastDocCache } = await fetchData(currentPage, perPage, lastDocCache);
    
    // saveLastDocCache(updatedLastDocCache);

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
    
    // loader.remove(); 
   
  };

  const loadMore = async () => {
    if (currentPage >= totalPages) return;

    currentPage++;
    const { items } = await fetchData(currentPage, perPage);

    items.forEach(item => {
      container.appendChild(renderItem(item));
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
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
      pageNumbersContainer.appendChild(btn);
    });
  };

  // Events
  perPageSelect.addEventListener("change", async () => {
    perPage = parseInt(perPageSelect.value);
    currentPage = 1;
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

