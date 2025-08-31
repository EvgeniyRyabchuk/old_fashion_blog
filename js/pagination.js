
  const postsContainer = document.getElementById("post-wrapper");
  const perPageSelect = document.getElementById("perPage");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");
  const pageNumbersContainer = document.getElementById("pageNumbers");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  // demo posts
  let posts = Array.from({length: 53}, (_, i) => `Post #${i + 1}`);
  let currentPage = 1;
  let perPage = parseInt(perPageSelect.value);
  let totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  // render visible posts for current page
  function renderPosts() {
    postsContainer.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, posts.length);
    const visiblePosts = posts.slice(start, end);

    visiblePosts.forEach(p => {
      const div = document.createElement("div");
      div.className = "post";
      div.textContent = p;
      postsContainer.appendChild(div);
    });

    totalPages = Math.max(1, Math.ceil(posts.length / perPage));
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    renderPageNumbers();
    // show Load More if there are more posts after current view
    const shownCount = (currentPage - 1) * perPage + visiblePosts.length;
    loadMoreBtn.style.display = shownCount < posts.length ? "inline-block" : "none";
  }

  // Load more: append following items after currently shown items
  function loadMore() {
    const alreadyShown = postsContainer.children.length + (currentPage - 1) * perPage;
    // if current view is page N, we compute appendStart based on actual DOM: simpler: append next `perPage` after current global shown count.
    // Better approach: compute global index of last shown item:
    let lastGlobalIndex = (currentPage - 1) * perPage + postsContainer.children.length;
    const start = lastGlobalIndex;
    const end = Math.min(start + perPage, posts.length);
    const morePosts = posts.slice(start, end);

    morePosts.forEach(p => {
      const div = document.createElement("div");
      div.className = "post";
      div.textContent = p;
      postsContainer.appendChild(div);
    });

    // if we've appended everything, hide load more
    const globalShown = start + morePosts.length;
    if (globalShown >= posts.length) loadMoreBtn.style.display = "none";
  }

  // Returns an array like [1, '...', 4,5,6, '...', 10] for display
  function getPageList(total, current) {
    const delta = 2; // neighbor range
    if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);

    const range = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push("...");
    range.push(total);

    return range;
  }

  // render page number buttons
  function renderPageNumbers() {
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
      btn.addEventListener("click", () => {
        currentPage = item;
        renderPosts();
        // scroll to top of posts container if desired:
        postsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      pageNumbersContainer.appendChild(btn);
    });
  }

  // Events
  perPageSelect.addEventListener("change", () => {
    perPage = parseInt(perPageSelect.value);
    totalPages = Math.max(1, Math.ceil(posts.length / perPage));
    currentPage = 1;
    renderPosts();
    loadMoreBtn.style.display = "inline-block";
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPosts();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPosts();
    }
  });

  loadMoreBtn.addEventListener("click", loadMore);

  // initial render
  // renderPosts();
