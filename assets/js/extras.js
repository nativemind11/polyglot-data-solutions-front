(function(){
  var c=window.GV_CONFIG||{};
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var q=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};

  if(c.showTestimonials){q('[data-testimonials]').forEach(function(e){e.style.display=''})}

  /* 3D tilt on cards */
  if(fine&&!reduce){
    q('.card,.gl,.post,.cert,.stat,.ach,.step').forEach(function(el){
      if(el.closest('.testis'))return;
      el.classList.add('tilt3d');
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transition='transform .08s linear';
        el.style.transform='perspective(900px) rotateX('+(-y*9).toFixed(2)+'deg) rotateY('+(x*11).toFixed(2)+'deg) translateY(-6px) scale(1.015)';
      });
      el.addEventListener('pointerleave',function(){el.style.transition='';el.style.transform=''});
    });
    /* hero parallax */
    var hero=document.querySelector('.hero'),gw=document.querySelector('.globe-wrap');
    if(hero&&gw){
      hero.addEventListener('pointermove',function(e){
        var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        gw.style.transform='perspective(1200px) rotateY('+(x*14).toFixed(2)+'deg) rotateX('+(-y*10).toFixed(2)+'deg)';
        hero.style.setProperty('--px',x.toFixed(3));hero.style.setProperty('--py',y.toFixed(3));
      });
      hero.addEventListener('pointerleave',function(){gw.style.transform='';hero.style.setProperty('--px',0);hero.style.setProperty('--py',0)});
    }
  }

  /* testimonials: 3D coverflow */
  q('.testis').forEach(function(box){
    var cards=q('.testi',box),n=cards.length;if(n<2)return;
    var a=0,timer=null,hover=false;
    box.classList.add('cover');
    var nav=document.createElement('div');nav.className='cover-nav';
    nav.innerHTML='<button type="button" aria-label="Previous testimonial">\u2039</button><span class="cv-dots"></span><button type="button" aria-label="Next testimonial">\u203A</button>';
    box.parentNode.insertBefore(nav,box.nextSibling);
    var dots=nav.querySelector('.cv-dots'),btns=q('button',nav);
    cards.forEach(function(_,i){var d=document.createElement('i');d.onclick=function(){go(i)};dots.appendChild(d)});
    function layout(){
      var mob=window.innerWidth<720;
      cards.forEach(function(el,i){
        var d=i-a;if(d>n/2)d-=n;if(d<-n/2)d+=n;var ad=Math.abs(d);
        el.style.transform='translateX(-50%) translateX('+(d*(mob?104:62))+'%) translateZ('+(-ad*160)+'px) rotateY('+(-d*(mob?18:30))+'deg) scale('+(1-ad*.05)+')';
        el.style.opacity=ad>2?0:(1-ad*.3);el.style.zIndex=10-ad;
        el.style.pointerEvents=ad>0?'none':'auto';el.setAttribute('aria-hidden',d!==0?'true':'false');
      });
      q('i',dots).forEach(function(d,i){d.classList.toggle('on',i===a)});
    }
    function go(i){a=(i+n)%n;layout()}
    btns[0].onclick=function(){go(a-1)};btns[1].onclick=function(){go(a+1)};
    box.addEventListener('pointerenter',function(){hover=true});box.addEventListener('pointerleave',function(){hover=false});
    var sx=null;
    box.addEventListener('pointerdown',function(e){sx=e.clientX});
    window.addEventListener('pointerup',function(e){if(sx===null)return;var dx=e.clientX-sx;sx=null;if(Math.abs(dx)>45)go(a+(dx<0?1:-1))});
    window.addEventListener('resize',layout);
    if(!reduce)timer=setInterval(function(){if(!hover&&box.offsetParent!==null)go(a+1)},5500);
    layout();
  });
})();
