let pathToImgs = require('../assets/imgs/*.*') ;
let imgs = document.querySelectorAll('img.lazy') ;
imgs = [...imgs] ;
lazyLoadImg() ;
window.addEventListener('scroll',lazyLoadImg) ;
function lazyLoadImg(e){
    for(let i=0 ; i<imgs.length ; i++) if(onViewport(imgs[i])) imgs[i].setAttribute('src',pathToImgs[`proj${i+1}`].JPG) ;
}
function onViewport(elm){
    let left = (elm.getBoundingClientRect().left+elm.clientWidth>0)&&(elm.getBoundingClientRect().left<=window.innerWidth);
    let top = (elm.getBoundingClientRect().top+elm.clientHeight>0)&&(elm.getBoundingClientRect().top<=window.innerHeight);
    return (left && top) ;
}