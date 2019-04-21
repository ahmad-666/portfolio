let assets = require('../assets/**/*.*') ;
let loader = document.querySelector('.loader') ;
let bdy = document.querySelector('.body') ;
let queue = new createjs.LoadQueue(false) ;
queue.loadFile(assets.imgs.landing.jpg) ;  
queue.loadFile(assets.fonts.AROLY.ttf) ;  
queue.loadFile(assets.fonts.azonix.otf) ;  
queue.loadFile(assets.fonts.moon.otf) ;  
queue.on('progress',(e)=>{
    let percent = Math.round(e.progress*100) ;
    loader.querySelector('.track').style.width = `${percent}%`
})
queue.on('complete',()=>{
    setTimeout(()=>{
        loader.classList.add('fade-out') ;
        setTimeout(()=>{    
            loader.style.display="none" ;
            bdy.style.display = 'block' ;
            setTimeout(()=>{
                bdy.classList.add('fade-in') ;
            },50);       
        },600);
    },600);  
}) 
