document.querySelector('.landing .infos span:nth-child(1)').addEventListener('click',e=>{
    window.scrollTo({
        left: 0 ,
        top: document.querySelector('.contact').offsetTop ,
        behavior: 'smooth'
    }) ;
});
document.querySelector('.landing .infos span:nth-child(2)').addEventListener('click',e=>{
    window.scrollTo({
        left: 0 ,
        top: document.querySelector('.perspective').offsetTop ,
        behavior: 'smooth'
    }) ;
});
