const lazyImages = document.querySelectorAll('img[data-src], source[data-srcset]')
//== Selection the required elements by the presence of the attributes: an array of references ==//
const loadMapBlock = document.querySelector('.page-map')
//== Selection the required element by the presence of the class name ==//
const windowHeight = document.documentElement.clientHeight
//== Getting the client browser height ==//
const loadMoreBlock = document.querySelector('.load-more')
//== Selection a block, after that we are loading an endless content ==//
let lazyImagesPositions = []
if (lazyImages.length > 0) {
    lazyImages.forEach((img) => {
        lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset)
        //== The img position on the page, regardless of the scroll position, and push this positon to the array ==//
        LazyScrollCheck()
    })
}
//== Creating an array of img height positions (lazyImagesPositions), relative to the top of the page ==//
function LazyScrollCheck() {
    let imgIndex = lazyImagesPositions.findIndex((item) => pageYOffset > item - windowHeight)
    //== If the user has screwed up to the img==//
    if (imgIndex >= 0) {
        if (lazyImages[imgIndex].dataset.src) {
            lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src
            //== Changing the data ==//
            lazyImages[imgIndex].removeAttribute('data-src')
        } else if (lazyImages[imgIndex].dataset.srcset) {
            lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset
            //== Changing the data ==//
            lazyImages[imgIndex].removeAttribute('data-srcset')
        }
        delete lazyImagesPositions[imgIndex]
    }
}
//== Image achievement check function  ==//
window.addEventListener('scroll', lazyScroll)
function lazyScroll() {
    if (document.querySelectorAll('img[data-src], source[data-srcset]').length > 0) {
        LazyScrollCheck()
    }
    if (!loadMapBlock.classList.contains('loaded')) {
        getMap()
    }
    if (!loadMoreBlock.classList.contains('loading')) {
        loadMore()
    }
}
//== Listen the scroll==//
function getMap() {
    const loadMapBlockPosition = loadMapBlock.getBoundingClientRect().top + pageYOffset
    if (pageYOffset > loadMapBlockPosition - windowHeight) {
        const loadMapUrl = loadMapBlock.dataset.map
        if (loadMapUrl) {
            loadMapBlock.insertAdjacentHTML(
                'beforeend',
                `<iframe
        src="${loadMapUrl}"
        width="600"
        height="450"
        frameborder="0"
        style="border: 0"
        class="framestyle"
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"
        loading="lazy"
    >
    </iframe>`
            )
            loadMapBlock.classList.add('loaded')
        }
    }
}

function loadMore() {
    const loadMoreBlockPos = loadMoreBlock.getBoundingClientRect().top + pageYOffset
    const loadMoreBlockHeight = loadMapBlock.offsetHeight
    if (pageYOffset > (loadMoreBlockPos + loadMoreBlockHeight) - windowHeight) {
        getContent()
    }
}
//== Check achievement loadmore's block function==//

async function getContent() {
    if (!document.querySelector('.loading-icon')) {
        loadMoreBlock.insertAdjacentHTML('beforeend', '<div class="loading-icon"></div>')
    }
    //== Insert an icon ==//
    loadMoreBlock.classList.add('loading')
    //== Insert a mark==//
    let response = await fetch('http://www.mocky.io/v2/5944e07213000038025b6f30', { method: 'GET', })
    if (response.ok) {
        let result = await response.text()
        loadMoreBlock.insertAdjacentHTML('beforeend', result)
        loadMoreBlock.classList.remove('loading')
        if (document.querySelector('.loading-icon')) {
            document.querySelector('.loading-icon').remove()
        }
    } else {
        alert('Error!' + response.status)
    }
}
//== Get additional content, handling async request ==//
