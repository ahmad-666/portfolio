//Init Canvas----------------------------------------------------
let canvas = document.querySelector('.star-shower') ;
canvas.width = window.innerWidth-3 ;
canvas.height = window.innerHeight-3 ;
let ctx = canvas.getContext('2d') ;
//Variables----------------------------------------------------
//sky
let skyColor = '#111833' ; //for gradient
//stars
let stars = [] ;
let starsParams = {
    colors: ['white','#6CFFFF'] ,
    sizes: [.25,.5,.75,1,1.5] ,
    number: 400 ,
    shadowBlur: 15
} ;
//moon
let moonParams = {
    size: Math.min(canvas.width,canvas.height)/10 ,
    color: 'white' ,
    shadowBlur: 35 ,
    shadowOffset: 10   
};
//planet
let planetParams = {
    size : Math.min(canvas.width,canvas.height)/2.5 ,
    color : '#090D1C' ,
    shadowColor : '#1F2B5C' , 
    shadowBlur : 30 ,
    shadowSize : 25 
}
//falling star 
let fallingStars = [] ;
let fallingStarsParams = {
    sizes : [20,30,40,50] ,
    colors : ['white','#6CFFFF'] ,
    shadowBlur : 35 ,
    reductionRate : -10 , 
    vxMin : -4 ,
    vxMax : 4 ,
    vyMin : 1 ,
    vyMax : 4 ,
    generateSpeed : 200
}
fallingStarsParams.counter = fallingStarsParams.generateSpeed-1 ;
let gravity = 1 ;
let impactForce = .8 ; 
//particles
let particlesParams = {
    number : 20 ,
    sizes : [.5,1,1.5] ,
    shadowBlur : 15 ,
    fadeSpeed : -.01 ,
    vxMin : -5 ,
    vxMax : 5 ,
    vyMin : -20 ,
    vyMax : -5 
}
//Utility Functions----------------------------------------------------
let getRand = (min,max)=>Math.floor(Math.random()*(max-min+1)+min) ; 
let getRandFloat = (min,max)=>Math.random()*(max-min)+min ; 
//Sky----------------------------------------------------
function drawSky(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = skyColor ;
    ctx.fillRect(0,0,canvas.width,canvas.height) ;
    ctx.fill();
    ctx.restore();
}
//Static Stars----------------------------------------------------
function Star(x,y,r,color,shadowBlur){
    this.x = x ;
    this.y = y ;
    this.r = r ;
    this.color = color ;
    this.shadowBlur = shadowBlur ;
}
Star.prototype.draw = function(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color ;
    ctx.shadowBlur = this.shadowBlur ;
    ctx.shadowColor = this.color ;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false);
    ctx.fill();
    ctx.restore();
}
function generateStars(){
    let x,y,r,color,shadowBlur ;
    for(let i=0 ; i<starsParams.number ; i++){
        r = starsParams.sizes[getRand(0,starsParams.sizes.length-1)] ;
        x = getRand(r,canvas.width-r) ;
        y = getRand(r,canvas.height-r) ;
        color = starsParams.colors[getRand(0,starsParams.colors.length-1)] ;
        shadowBlur = starsParams.shadowBlur ;
        stars.push(new Star(x,y,r,color,shadowBlur)) ;
    }
}
function drawStars(){
    stars.forEach(star=>{
        star.draw();
    })
}
//Moon----------------------------------------------------
let moon = {
    x : canvas.width/2 ,
    y : moonParams.size*2 ,
    r : moonParams.size ,
    color : moonParams.color ,
    shadowBlur : moonParams.shadowBlur ,
    shadowOffset : moonParams.shadowOffset ,
    draw : function(){
        ctx.save() ;
        ctx.fillStyle = this.color ;
        ctx.shadowBlur = this.shadowBlur ;
        ctx.shadowColor = this.color ;
        ctx.beginPath() ;    
        ctx.shadowOffsetX = -this.shadowOffset ;
        ctx.shadowOffsetY = 0 ;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill();
        ctx.beginPath() ;    
        ctx.shadowOffsetX = this.shadowOffset ;
        ctx.shadowOffsetY = 0 ;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill();
        ctx.beginPath() ;    
        ctx.shadowOffsetX = 0 ;
        ctx.shadowOffsetY = -this.shadowOffset ;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill();
        ctx.beginPath() ;    
        ctx.shadowOffsetX = 0 ;
        ctx.shadowOffsetY = this.shadowOffset ;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill();
        ctx.restore();
    }
}
//Planet----------------------------------------------------
let planet = {
    x : canvas.width/2 ,
    y : canvas.height ,
    r : planetParams.size ,
    color : planetParams.color ,
    shadowColor : planetParams.shadowColor ,
    shadowBlur : planetParams.shadowBlur ,
    shadowSize : planetParams.shadowSize ,
    draw : function(){
        ctx.save();
        ctx.fillStyle = this.color ;
        ctx.shadowBlur = this.shadowBlur ;
        ctx.shadowColor = this.shadowColor ;
        ctx.beginPath();     
        ctx.shadowOffsetX = -this.shadowSize;
        ctx.shadowOffsetY = 0;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill() ;
        ctx.beginPath();     
        ctx.shadowOffsetX = this.shadowSize;
        ctx.shadowOffsetY = 0;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill() ;
        ctx.beginPath();     
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = -this.shadowSize;
        ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false) ;
        ctx.fill() ;
        ctx.restore();
    }
}
//Falling Stars----------------------------------------------------
function FallingStar(x,y,r,color,shadowBlur,vx,vy){
    this.x = x ;
    this.y = y ;
    this.r = r ;
    this.color = color ;
    this.shadowBlur = shadowBlur ;
    this.vx = vx ;
    this.vy = vy ;
    this.particles = [] ;
}
FallingStar.prototype.draw = function(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color ;
    ctx.shadowBlur = this.shadowBlur ;
    ctx.shadowColor = this.color ;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false);
    ctx.fill();
    ctx.restore();
}
FallingStar.prototype.move = function() {
    if(this.r>0){
        if(this.x-this.r+this.vx<0 || this.x+this.r+this.vx>=canvas.width) this.vx = -this.vx ; 
        if(this.y+this.r+this.vy>=canvas.height){//hit ground
            if(this.r+fallingStarsParams.reductionRate>=0) this.r+=fallingStarsParams.reductionRate ;
            this.vy = -this.vy ;
            this.vy*=impactForce ;
            generateParticles(this) ;
        }
        else this.vy+=gravity ;
        this.x+=this.vx ;
        this.y+=this.vy ;
        this.draw();
    }
    else {
        let allParticlesFade = this.particles.every(particle=>(particle.opacity<=.1)) ;
        if(allParticlesFade) this.remove() ;
    }
}
FallingStar.prototype.remove = function(){
    fallingStars.forEach((fallingStar,i)=>{
        if(fallingStar==this) fallingStars.splice(i,1) ;      
    })
}
function generateFallingStars(){
    let x,y,r,color,shadowBlur,vx,vy ;
    r = fallingStarsParams.sizes[getRand(0,fallingStarsParams.sizes.length-1)] ;
    x = getRand(r,canvas.width-r) ;
    y = -2*r ;
    color = fallingStarsParams.colors[getRand(0,fallingStarsParams.colors.length-1)] ;
    shadowBlur = fallingStarsParams.shadowBlur ;
    vx = getRand(fallingStarsParams.vxMin,fallingStarsParams.vxMax) ;
    vy = getRand(fallingStarsParams.vyMin,fallingStarsParams.vyMax) ;
    fallingStars.push(new FallingStar(x,y,r,color,shadowBlur,vx,vy)) ;
}
//Particles----------------------------------------------------
function Particle(x,y,r,color,shadowBlur,vx,vy,opacity){
    this.x = x ;
    this.y = y ;
    this.r = r ;
    this.color = color ;
    this.shadowBlur = shadowBlur ;
    this.vx = vx ;
    this.vy = vy ;
    this.opacity = opacity ;
}
Particle.prototype.draw = function(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color ;
    ctx.shadowBlur = this.shadowBlur ;
    ctx.shadowColor = this.color ;
    ctx.globalAlpha = this.opacity ;
    ctx.arc(this.x,this.y,this.r,0,2*Math.PI,false);
    ctx.fill();
    ctx.restore();
}
Particle.prototype.move = function(){
    if(this.x-this.r+this.vx<0 || this.x+this.r+this.vx>=canvas.width) this.vx = -this.vx ;
    if(this.y+this.r+this.vy>=canvas.height){//hit ground
        this.vy = -this.vy ;
        this.vy*=impactForce ;
    }
    else{
        this.vy+=gravity ;
    }
    this.x+=this.vx ;
    this.y+=this.vy ;
    if(this.opacity+particlesParams.fadeSpeed>=0) this.opacity+=particlesParams.fadeSpeed ;
    this.draw() ;
}
function generateParticles(fallingStar){
    let x,y,r,color,shadowBlur,vx,vy,opacity ;
    for(let i=0 ; i<particlesParams.number ; i++){
        x = fallingStar.x ;
        y = fallingStar.y ;
        r = particlesParams.sizes[getRand(0,particlesParams.sizes.length-1)] ;
        color = fallingStar.color ;
        shadowBlur = particlesParams.shadowBlur ;
        vx = getRand(particlesParams.vxMin,particlesParams.vxMax);
        vy = getRand(particlesParams.vyMin,particlesParams.vyMax);
        opacity = 1 ;
        fallingStar.particles.push(new Particle(x,y,r,color,shadowBlur,vx,vy,opacity)) ;
    }   
}
//Animation----------------------------------------------------
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height) ;
    drawSky();
    drawStars();
    moon.draw() ;
    planet.draw();
    if(++fallingStarsParams.counter%fallingStarsParams.generateSpeed==0) {
        generateFallingStars() ;
        fallingStarsParams.counter = 0 ;
    }
    fallingStars.forEach(fallingStar=>{
        fallingStar.move();
        fallingStar.particles.forEach(particle=>{
            particle.move() ;
        })
    })
    requestAnimationFrame(animate);
}
//Call functions----------------------------------------------------
generateStars();
animate();
//Make Canvas Responsive
function makeResponsive(){
    canvas.width = window.innerWidth-3 ;
    canvas.height = window.innerHeight-3 ;  
    stars = [] ;
    fallingStars = [] ;
    generateStars();
    moonParams.size = Math.min(canvas.width,canvas.height)/10 ;
    moon.x = canvas.width/2 ;
    moon.r = moonParams.size ;
    planetParams.size = Math.min(canvas.width,canvas.height)/2.5 ;
    planet.x = canvas.width/2;
    planet.y = canvas.height;
    planet.r = planetParams.size ;
}
window.addEventListener('resize',makeResponsive) ;
//visible .after-stars----------------------------
setTimeout(()=>{
    document.querySelector('.after-stars').style.display = "block" ;
},4000) ;
//Click on mouse Icon------------------------------
document.querySelector('.stars .icon').addEventListener('click',(e)=>{
    window.scrollTo({
        left: 0 ,
        top: document.querySelector('.landing').offsetTop ,
        behavior: 'smooth' 
    });
}) ;
