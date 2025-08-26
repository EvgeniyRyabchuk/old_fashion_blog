

const loaderCircleGenerate = (parentContainer = document.body) => {
    
    // Create the loader wrapper
    const loaderWrapper = document.createElement('div');
    loaderWrapper.classList.add('loader-wrapper'); 
    // loaderWrapper.classList.add('full-screen');
        loaderWrapper.classList.add('full-parrent');
    // Create the loader container
    const loader = document.createElement('div');
    loader.className = 'loader';

    // Generate 6 circle wrappers and circles
    for (let i = 1; i <= 6; i++) {
        const circleWrapper = document.createElement('div');
        circleWrapper.className = `circle-wrapper-${i}`;

        const circle = document.createElement('div');
        circle.className = `circle-${i}`;

        circleWrapper.appendChild(circle);
        loader.appendChild(circleWrapper);
    }
    
    // Append loader to wrapper
    loaderWrapper.appendChild(loader);

    // Finally, add it to the body or any other container
    parentContainer.appendChild(loaderWrapper);

    return loaderWrapper; 
}


document.getElementById("auth-nav-list-wrapper").addEventListener("mouseenter", (e) => {
    const authNavList = document.getElementById("authNavList");
    authNavList.classList.remove("d-none");
    authNavList.classList.add("d-block");
    
})

document.getElementById("auth-nav-list-wrapper").addEventListener("mouseleave", (e) => {
    const authNavList = document.getElementById("authNavList");
    authNavList.classList.remove("d-block");
    authNavList.classList.add("d-none");
    
})