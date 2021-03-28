


import './styles.css';
import './styles/style.css';
import apiService from './services/apiService';
import imgMarkup from './templates/imageCard.hbs';
import * as basicLightbox from 'basiclightbox';

// refs

const refs = {
    galleryRef: document.querySelector('.gallery'),
    formRef: document.querySelector('.search-form'),
    loadMoreImagesButtonRef: document.querySelector('.load'),
    modalRef: document.querySelector('.modal'),
    modalImgRef: document.querySelector('.modal_img')
}

const { galleryRef, formRef, loadMoreImagesButtonRef, modalRef, modalImgRef } = refs;

// options

const params = {
    query: '',
    page: 1
}

const observerOptions = {
    root: null,
    threshold: 0
}

const observer = new IntersectionObserver(loadMore, observerOptions);

function scrollPage() {
    const totalScrollHeight = galleryRef.clientHeight + 80
    setTimeout(() => {
        window.scrollTo({
            top: totalScrollHeight,
            behavior: 'smooth'
        })
    }, 200)
}

function getPictures(query, pageNumber, callback) {
    callback(query, pageNumber).then(({data : {hits}}) => {
        galleryRef.insertAdjacentHTML('beforeend', hits.map(obj => imgMarkup(obj)).join(''));
    })
}

formRef.addEventListener('submit', e => {
    e.preventDefault();
    if (params.query !== e.target.children[0].value) {
        params.page = 1;
        galleryRef.innerHTML = '';
        observer.unobserve(loadMoreImagesButtonRef);
    }
    params.query = e.target.children[0].value;
    getPictures(params.query, params.page, apiService)
    loadMoreImagesButtonRef.style.visibility = 'visible'
})

galleryRef.addEventListener('click', e => {
    if(e.target.localName === 'img') {
        modalRef.style.visibility = 'visible'
        modalImgRef.setAttribute('src', e.target.dataset.source)
        basicLightbox.create(`<img src=${e.target.dataset.source} width="800" height="600">`).show()
    }
})

function loadMore() {
    params.page += 1;
    getPictures(params.query, params.page, apiService);
    scrollPage()
}

loadMoreImagesButtonRef.addEventListener('click', e => {
    loadMore()
    const observer = new IntersectionObserver(loadMore, observerOptions);
    observer.observe(loadMoreImagesButtonRef)
})

modalRef.addEventListener('click', e => {
    if(e.target.localName !== 'img') {
        modalRef.style.visibility = 'hidden'
        modalImgRef.src = '#'
    }
})

window.addEventListener('keyup', e => {
    if(e.key === 'Escape') {
        modalRef.style.visibility = 'hidden'
        modalImgRef.src = '#'
    }
})