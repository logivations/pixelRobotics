const createLiElement = (content, ariaAttr) => {
    const li = document.createElement('li');
    li.classList.add('page-item');
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.classList.add('page-link')
    if (ariaAttr) {
        const span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        a.setAttribute('aria-label', ariaAttr);
        span.innerHTML = content;
        a.appendChild(span);
    } else {
        a.innerHTML = content;
    }
    li.appendChild(a);
    return li;
};

const getItems = (pageNumber) => {
    return fetch(`userActivity?page=${pageNumber}`)
        .then((res) => res.text())
        .then((data) => {
            const container = document.getElementById('statistics-list');
            container.innerHTML = data;
        })
};

const clickHandler = (event) => {
    const container = document.getElementById('pagination');
    const activePage = parseInt(event.currentTarget.dataset.page);
    container.querySelector('.page-item.active-page').classList.remove('active-page');
    container.dataset.activePage = activePage.toString();
    event.currentTarget.classList.add('active-page');
    getItems(activePage);
    togglePagination(container, activePage);
};

const togglePagination = (container, activePage) => {
    const countOfElements = container.querySelectorAll("[data-page]").length;
    container.querySelectorAll("[data-page]").forEach((el) => el.style.display = "none");
    let visiblePages = [activePage - 1, activePage, activePage + 1];
    if (activePage === 1) {
        visiblePages = [1, 2, 3]
    }
    if (activePage === countOfElements) {
        visiblePages = [countOfElements - 2, countOfElements - 1, countOfElements]
    }

    visiblePages.forEach((index) => {
        const page = container.querySelector(`[data-page = '${index}']`)
        page && (page.style.display = "block");
    })
};

const arrowClickHandler = (increment) => {
    const container = document.getElementById('pagination');
    const activePage = parseInt(container.dataset.activePage);
    const nextPage = container.querySelector(`[data-page = '${activePage + increment}']`);
    nextPage && nextPage.click();

};

window.onload = () => {
    const container = document.getElementById('pagination');
    container.dataset.activePage = '1';
    const leftArrow = createLiElement('&laquo;', 'Previous');
    leftArrow.addEventListener('click', () => arrowClickHandler(-1));
    const rightArrow = createLiElement('&raquo;', 'Next');
    rightArrow.addEventListener('click', () => arrowClickHandler(+1));
    fetch('numberOfPages')
        .then((res) =>  res.json())
        .then((res) => {
            container.append(leftArrow);
            for (let i = 1; i <= res; i++) {
                const li = createLiElement(i, null);
                li.dataset.page = i.toString();
                li.addEventListener('click', clickHandler);
                i === 1 && li.classList.add('active-page');
                container.append(li);
            }
            container.append(rightArrow);
            togglePagination(container, 1);
            getItems(1);
        });
};

const showDetailedIP = (userIp, userAgent) => {
    fetch(`detailIP?userIP=${userIp}&userAgent=${userAgent}`)
        .then((res) => res.text())
        .then((data) => {
            const container = document.getElementById('exampleModal');
            container.innerHTML = data;
            const myModal = new bootstrap.Modal(container, {});
            myModal.show();
        });
};

const logout = () => {
    document.cookie = 'isLoggedIn=true; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
};

const refresh = () => {
    const container = document.getElementById('pagination');
    const firstPage = container.querySelector(`[data-page = '1']`);
    firstPage && firstPage.click();
};