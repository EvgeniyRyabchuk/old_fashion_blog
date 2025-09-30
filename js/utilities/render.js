
const getDateTimeFormat = (str) => {
  const date = str.toDate();
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

// =========================================== search posts 
function renderPostsForSearch(posts) { 
  const container = document.getElementById("searchPostList");
  container.innerHTML = ""; // clear previous results
  if (!posts.length) {
    // container.innerHTML = "<li>No results found</li>";
    return;
  }
  posts.forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="/post.html?id=${post.id}">
        <div class="post-cover d-flex-v-center">
          <img src="${post.coverUrl || './images/default.jpg'}" alt="Post Img">
        </div>
        <div class="post-title-wrapper">
          <span class="post-title">
            ${post.title || "Untitled post"}
          </span>
        </div>
      </a>
    `;
    container.appendChild(li);
  });
}


// =========================================== posts grid or table 

const renderPostsForTable = (post) => {
 // создаём строку
    const tr = document.createElement("tr");
    const tdId = document.createElement("td");
    const tdTitle = document.createElement("td");
    const tdContent = document.createElement("td");
    const contentWrapper = document.createElement("div");
    const tdImage = document.createElement("td");
    const tdCategory = document.createElement("td");
    const tdDateRange = document.createElement("td");
    const tdUserId = document.createElement("td");
    const tdUserCreatedAt = document.createElement("td");
    const tdTags = document.createElement("td");
    
    const actionWrapper = document.createElement("div");
    const tdAction = document.createElement("td");
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    // добавляем колонки

    tr.dataset.postId = post.id; 
    tdId.innerHTML = post.id || "Untitled";
    tdTitle.innerHTML = post.title || "Untitled";
    
    tdTags.innerHTML = post.tags.map(tag => tag.name).join(', '); 
    tdTags.style.whiteSpace = "nowrap"; 
    tdTags.style.maxWidth = "160px"; 
    tdTags.style.maxHeight = "100px"; 

    const documentHtml = document.createElement('div');
    documentHtml.innerHTML = getPostContentPreview(post.content, 400);

    documentHtml.querySelectorAll('img').forEach(img => {
      img.width = 100;
      img.height = 100;
    });

    // create new page with this content 
    contentWrapper.innerHTML = documentHtml.innerHTML || "";
    contentWrapper.classList.add("td-content");
    tdContent.appendChild(contentWrapper);  

    if (post.coverUrl) {
      tdImage.innerHTML = `<img src="${post.coverUrl}" width="100" height="100">`;
    }

    tdCategory.innerHTML = post.category?.name || 'null';
    // tdImageCategoryID.id = "categorySelect";
    tdDateRange.innerHTML = `${post.date_range_start}-${post.date_range_end}`;
    tdUserId.innerHTML = post.userId;
    tdUserCreatedAt.innerHTML = post.createdAt.toDate().toLocaleDateString(); 
    tdUserCreatedAt.classList.add("td-date"); 
    
    editButton.innerText = 'Edit';
    editButton.type = 'button';
    editButton.onclick = onUpdatePostClick; 
    
    deleteButton.innerHTML = 'Remove';
    deleteButton.type = "button"; 

    deleteButton.onclick = () => onDeletePostClick(post.id); 
   
    actionWrapper.style.display = 'flex';    
    actionWrapper.appendChild(editButton);
    actionWrapper.appendChild(deleteButton);
    tdAction.appendChild(actionWrapper);

    // добавляем колонки в строку
    tr.appendChild(tdId);
    tr.appendChild(tdTitle);
    tr.appendChild(tdContent);
    tr.appendChild(tdImage);
    tr.appendChild(tdCategory);
    tr.appendChild(tdDateRange);
    tr.appendChild(tdUserId);
    tr.appendChild(tdUserCreatedAt);
    tr.appendChild(tdTags);
    tr.appendChild(tdAction);
    
    return tr;
}
const renderPostsForGrid = (post) => {
  // { href, imgSrc, imgAlt, title, content } 
  const imgAlt = "Post Image";
    //TODO: fix - adding post id 
  const queryStr = `?id=${post.id}`;
  const href = `/post.html${queryStr}`; 
  const article = document.createElement("article");
  article.className = "post-card";

  const link = document.createElement("a");

  link.href = href;

  // cover image
  const coverDiv = document.createElement("div");
  coverDiv.className = "post-cover";
  const img = document.createElement("img");
  img.src = post.coverUrl;
  img.alt = imgAlt || "Post Image";
  coverDiv.appendChild(img);

  // title
  const titleWrapper = document.createElement("div");
  titleWrapper.className = "post-title-wrapper";
  const spanTitle = document.createElement("span");
  spanTitle.className = "post-title";
  spanTitle.textContent = post.title;
  titleWrapper.appendChild(spanTitle);

  // short content
  const shortContent = document.createElement("div");
  shortContent.className = "post-short-content";
  shortContent.innerHTML = getPostContentPreview(post.content, 400);

  // assemble inside link
  link.appendChild(coverDiv);
  link.appendChild(titleWrapper);
  link.appendChild(shortContent);

  // more wrapper
  const moreWrapper = document.createElement("div");
  moreWrapper.className = "more-wrapper";
  const readMore = document.createElement("a");
  readMore.href = href;
  readMore.className = "read-more";
  readMore.textContent = "Read More >>";
  moreWrapper.appendChild(readMore);

  // build article
  article.appendChild(link);
  article.appendChild(moreWrapper);

  return article;
}


// =========================================== tags
function renderTags() {
  tagsContainer.innerHTML = "";
  tags.forEach((tag, index) => {
    const tagEl = document.createElement("div");
    tagEl.classList.add("tag");
    tagEl.innerHTML = `${tag} <span onclick="removeTag(${index})">×</span>`;
    tagsContainer.appendChild(tagEl); 
  });
}

function renderMostPopularTags(tagsContainer, tags) {
  tags.forEach((tag, index) => {
    const a = document.createElement("a");
    a.href = `/posts.html?tags=${tag.id}`;
    a.className = "tag";
    a.textContent = `${tag.name} (${tag.count})`;
    tagsContainer.appendChild(a);
  })

}


// =========================================== comments



const renderComments = (comment, additionUserInfo, isCreatedNew = false) => { 
    const li = document.createElement("li");
    li.dataset.commentId = comment.id; 
    li.dataset.userId = comment.userId; 
    // Create user card
    const userCard = document.createElement("div");
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.innerText = "Remove";
    removeBtn.classList.add("btn-danger");  
    if(isCreatedNew) {
      removeBtn.style = `display: block; margin-left: auto`;  
    } else {
      removeBtn.classList.add("switchable");   
      removeBtn.style = `margin-left: auto`; 
    }
    
  
    removeBtn.onclick = async (e) => {
        const commentId = e.target.closest("li").dataset.commentId;
        await deleteComment(commentId); 
        e.target.closest("li").remove(); 
    }
    
    userCard.className = "user-card-small";

    const avatar = document.createElement("img");
   
    avatar.src = additionUserInfo ? additionUserInfo.avatar : '/images/no-image.png';
    
    avatar.width = 45; 
    avatar.height = 45;
    avatar.alt = "User Avatar";

    const userName = document.createElement("div");
    userName.className = "user-name";
    userName.textContent = additionUserInfo ? additionUserInfo.name : "Not Found"; 
    
    const createdAt = document.createElement("div");
    createdAt.className = "created-at"; 
    createdAt.textContent = getDateTimeFormat(comment.createdAt);

    userCard.appendChild(avatar);
    userCard.appendChild(userName);
    userCard.appendChild(createdAt);
    
    // Create comment content
    const commentRow = document.createElement("div");
    commentRow.className = "comment-row";
    commentRow.textContent = comment.content || "";
    
    // Create separator
    const hr = document.createElement("hr");

    // Assemble list item
    li.dataset.commentId = comment.id; 
    li.appendChild(userCard);
    li.appendChild(commentRow); 
    li.appendChild(removeBtn); 
    li.appendChild(hr);
    
    if(isCreatedNew) {
      if (listCommentContainer.firstChild) {
        listCommentContainer.insertBefore(li, listCommentContainer.firstChild); 
      } else {
        listCommentContainer.appendChild(li); // if empty
      }
    } else {
      listCommentContainer.appendChild(li);
    }
}


// =========================================== filter 

const renderCheckboxes = (value, name, container, datasetType) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = value; 
    input.dataset.type = datasetType; 
    
    label.appendChild(input); 
    label.append(" " + name);
    addEventListenerToInput(input);
    
    container.appendChild(label);
}

function createChip(label, value, type) {
  // avoid duplicates
  if (selectedList.querySelector(`[data-value="${value}"][data-type="${type}"]`)) return;

  const chip = document.createElement("div");
  chip.classList.add("filter-chip");
  chip.dataset.value = value;
  chip.dataset.type = type;

  // Add # for tags, From/To for dates
  if (type === "tag") {
    chip.innerHTML = `#${label} <span class="remove">&times;</span>`;
  } else if (type === "date-start") {
    chip.innerHTML = `From: ${label} <span class="remove">&times;</span>`;
  } else if (type === "date-end") {
    chip.innerHTML = `To: ${label} <span class="remove">&times;</span>`;
  } else {
    chip.innerHTML = `${label} <span class="remove">&times;</span>`;
  }

  // --- DELETE chip and uncheck/reset input ---
  chip.querySelector(".remove").addEventListener("click", () => {
    let input;

    if (type.startsWith("date")) {
      // date fields don’t have [value] in HTML → match only by type
      input = document.querySelector(`.filter-drawer input[data-type="${type}"]`); 
    } else {
      // for checkboxes match by both type + value
      input = document.querySelector(`.filter-drawer input[data-type="${type}"][value="${value}"]`);
    }

    if (input) {
      if (input.type === "checkbox") {
        input.checked = false; // uncheck
      }
      if (input.type === "date") {
        if (input.dataset.type === "date-range-start") input.value = queryStrHandler.defaultStartDate; 
        if (input.dataset.type === "date-range-end") input.value = queryStrHandler.defaultEndDate;
      }
    }

    chip.remove();
  });

  selectedList.appendChild(chip);
}



