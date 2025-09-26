// function BlockSwitcher (defaultState = false) {
//     this.switchState = defaultState; 
    
//     // const mobileProfileMenuOpen: false,
//     // const asideMenuOpen: false 

//     this.openCloseSwitcher = (arr, toogleVar) => {    
//         for(let item of arr) {
//             const changebleTarget = document.querySelector(item.changebleSel);
//             changebleTarget.classList.remove(this.switchState ? item.state1 : item.state2 );
//             changebleTarget.classList.add(this.switchState ?  item.state2 : item.state1);
//         }
//         this.switchState = !this.switchState;
//     }
// }


      // const {
      //   isChanged: isFiltersChanged,
      //   currentParams: currentFiltersFromParams
      // } = queryStrHandler.checkIfParamsIsChanged(params)
      // // if query params is changed then reset page to 1 
      // if (isFiltersChanged) {
      //   params = queryStrHandler.getCurrentParams();
      // }

    // saveLastDocCache(updatedLastDocCache);



const CreateBlockSwitcher = (arr, defaultState = false) => {
    let state = defaultState; 
    const switchSate = () => {    
        for(let item of arr) {
            const changebleTarget = document.querySelector(item.changebleSel);
            changebleTarget.classList.remove(state ? item.state1 : item.state2 );
            changebleTarget.classList.add(state ?  item.state2 : item.state1);
        }
        state = !state; 
    }

    return {
        state,
        switchSate
    }
}

const profileBtnSwitcher = CreateBlockSwitcher([{changebleSel: "#profileBtnWrapper > .authNavList",
     state1: "d-block", state2: "d-none" }]);
const asideSwitcher = CreateBlockSwitcher([
     {changebleSel: "#sideMenu", state1: "w-auto", state2: "w-0" },
     {changebleSel: "#burgerMenuBtn", state1: "close-aside-btn", state2: "open-aside-btn"},
     {changebleSel: "#side-menu-wrapper", state1: "d-block", state2: "d-none"}
]); 

const asideProfileBtn = CreateBlockSwitcher([
    {changebleSel: "#profileBtnWrapper > .authNavList",
    state1: "h-max-1000", state2: "h-0" } 
]);



/*

 <ul id="guest-nav-list">
               <li><a href="./posts.html" class="dropdown-item">Home</a></li>
               <li class="dropdown root"> 
                  <a href="./index.html" class="dropdown-toggle">All posts</a> 
                  <ul class="dropdown-menu">
                     <li class="dropdown"> 
                        <a href="#" class="dropdown-toggle">Item 1</a>
                        <ul class="dropdown-menu">
                           <li class="dropdown"> 
                              <a href="#" class="dropdown-item">Item 1.1</a>
                              <ul class="dropdown-menu">
                                 <li>
                                    <a href="#" class="dropdown-item">Item 1.1.1</a>
                                 </li>
                                 <li><a href="#" class="dropdown-item">Item 1.1.2</a></li>
                                 <li><a href="#" class="dropdown-item">Item 1.1.3</a></li>
                              </ul>
                           </li>
                           <li><a href="#" class="dropdown-item">Item 1.2</a></li> 
                           <li><a href="#" class="dropdown-item">Item 1.3</a></li> 
                        </ul> 
                     </li>
                     <li class="dropdown">
                        <a href="#" class="dropdown-item">Item 2</a>
                          <ul class="dropdown-menu">
                           <li class="dropdown"> 
                              <a href="#" class="dropdown-item">Item 2.1</a>
                              <ul class="dropdown-menu">
                                 <li>
                                    <a href="#" class="dropdown-item">Item 2.1.1</a>
                                 </li>
                                 <li><a href="#" class="dropdown-item">Item 2.1.2</a></li>
                                 <li><a href="#" class="dropdown-item">Item 2.1.3</a></li>
                              </ul>
                           </li>
                           <li><a href="#" class="dropdown-item">Item 2.2</a></li>
                           <li><a href="#" class="dropdown-item">Item 2.3</a></li>
                        </ul>
                     </li>
                     <li><a href="#" class="dropdown-item">Item 3</a></li>
                  </ul>
               </li>
        
               <li><a href="./news.html" class="dropdown-item">News</a></li>
            </ul>


*/













/*
async function concatTagsToPosts(term, posts) {
  const postsRef = db.collection("posts");
  const tagsRef = db.collection("tags");
  const postTagRef = db.collection("post_tag");
  const tagsSnap = await tagsRef
    .orderBy("name")
    .startAt(term)
    .endAt(term + "\uf8ff")
    .get();

  const tagIds = tagsSnap.docs.map(doc => doc.id);

  if (tagIds.length > 0) {
    // 3. Find posts related to those tags
    const postTagSnap = await postTagRef
      .where("tagId", "in", tagIds.slice(0, 10)) // Firestore allows max 10 values in "in"
      .get();

    const postIds = [...new Set(postTagSnap.docs.map(doc => doc.data().postId))];

    if (postIds.length > 0) {
      // 4. Fetch posts by IDs
      const postSnaps = await Promise.all(
        postIds.map(id => postsRef.doc(id).get())
      );

      const postsByTags = postSnaps
        // .filter(snap => snap.exists)
        .map(snap => ({
          id: snap.id,
          ...snap.data()
        }));
      // 5. Merge results (title + tag matches)
      posts = [...posts, ...postsByTags];

      console.log(`postsByTags = ${postsByTags.map(pbt => pbt.title).join(", ")}`);
    }
  }
*/


/*
  
  // Remove duplicates
  const unique = {};
  posts.forEach(p => (unique[p.id] = p));
  const res = Object.values(unique).slice(0, 10); // enforce limit
  console.log(res)
  return res;
}



/*
async function fetchPostsBySearch(term) {
  
  if(term === "" || !term) {
    console.log("No term → return all posts or skip");
    return []; 
  }
  const postsRef = db.collection("posts");
  // 1. Search posts by title
  const postsByTitleSnap = await postsRef
    .orderBy("title")
    .startAt(term) 
    .endAt(term + "\uf8ff")
    .limit(10)
    .get();

  let posts = postsByTitleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log(`posts by title = ${posts.map(p => p.title).join(", ")}`);

  // 2. Search tags by name
  const res = await concatTagsToPosts(term, posts); 
  renderPostsForSearch(res);
  return res;
}
  */