
(function(){
  'use strict';

  function srcsetUrls(srcset){
    if(!srcset) return [];
    // Jimdo CDN transformation URLs contain commas internally, so normal split(',') is unsafe.
    var matches = srcset.match(/https:\/\/storage\.e\.jimdo\.com\/\S+?\s+\d+w(?=,\s*https:\/\/|$)/g) || [];
    return matches.map(function(s){ return s.replace(/\s+\d+w$/, ''); });
  }

  function ensureImages(root){
    (root || document).querySelectorAll('img').forEach(function(img){
      var list = srcsetUrls(img.getAttribute('srcset'));
      if(!img.getAttribute('src') && list.length){ img.setAttribute('src', list[0]); }
      img.loading = 'eager';
      img.decoding = 'async';
      if(list.length > 1){
        var idx = Math.max(0, list.indexOf(img.getAttribute('src')));
        img.addEventListener('error', function retry(){
          idx += 1;
          if(idx < list.length){ img.src=list[idx]; }
          else { img.removeEventListener('error', retry); }
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    ensureImages(document);
    var mobileQuery = window.matchMedia('(max-width: 800px)');

    // Mark original Jimdo mobile panel as the static panel.
    var panel = document.querySelector('.G4Yk_');
    if(panel) panel.classList.add('static-mobile-menu');

    // Build a real hamburger button without removing any original content.
    var header = document.querySelector('.DyyGf');
    var toggle = document.querySelector('.static-mobile-menu-toggle');
    if(header && panel && !toggle){
      toggle = document.createElement('button');
      toggle.type='button';
      toggle.className='static-mobile-menu-toggle';
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Menü öffnen');
      toggle.innerHTML='<span class="static-menu-lines" aria-hidden="true"></span>';
      header.appendChild(toggle);
    }

    // Add practical actions at bottom of mobile menu by cloning original header links.
    if(panel && !panel.querySelector('.static-mobile-actions')){
      var actions=document.createElement('div');
      actions.className='static-mobile-actions';
      var booking=document.querySelector('.nENnt a[href]');
      if(booking){
        var ba=document.createElement('a');
        ba.className='static-mobile-booking';
        ba.href=booking.getAttribute('href');
        ba.textContent='Termin online buchen';
        actions.appendChild(ba);
      }
      var socialLinks=document.querySelectorAll('.IS6uY a[href]');
      if(socialLinks.length){
        var socials=document.createElement('div'); socials.className='static-mobile-socials';
        socialLinks.forEach(function(a){ var c=a.cloneNode(true); socials.appendChild(c); });
        actions.appendChild(socials);
      }
      panel.appendChild(actions);
    }

    // ---------- Desktop dropdowns ----------
    document.querySelectorAll('.DjAD4 > li.Ptk8T').forEach(function (item) {
      var submenu = item.querySelector(':scope > nav > ul.ACV1J');
      var arrow = item.querySelector(':scope > a .Kuirh');
      if (!submenu || !arrow) return;
      arrow.style.cursor='pointer';
      arrow.setAttribute('role','button'); arrow.setAttribute('tabindex','0');
      arrow.setAttribute('aria-label','Untermenü öffnen'); arrow.setAttribute('aria-expanded','false');
      function flip(e){ if(mobileQuery.matches) return; e.preventDefault(); e.stopPropagation(); var open=item.classList.toggle('static-dropdown-open'); arrow.setAttribute('aria-expanded',open?'true':'false'); }
      arrow.addEventListener('click',flip);
      arrow.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' ') flip(e); });
      var timer;
      function open(){ if(mobileQuery.matches)return; clearTimeout(timer); item.classList.add('static-dropdown-open'); }
      function close(){ if(mobileQuery.matches)return; clearTimeout(timer); timer=setTimeout(function(){ if(!item.matches(':hover')&&!item.contains(document.activeElement)) item.classList.remove('static-dropdown-open'); },350); }
      item.addEventListener('mouseenter',open); item.addEventListener('mouseleave',close);
      var nav=item.querySelector(':scope > nav'); if(nav){nav.addEventListener('mouseenter',open);nav.addEventListener('mouseleave',close);}
    });

    function setMobileMenu(open){
      if(!toggle||!panel)return;
      panel.classList.toggle('static-mobile-menu-open',open);
      toggle.setAttribute('aria-expanded',open?'true':'false');
      toggle.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
      document.documentElement.classList.toggle('static-menu-open',open);
      document.body.classList.toggle('static-menu-open',open);
    }
    if(toggle&&panel){
      toggle.addEventListener('click',function(){setMobileMenu(toggle.getAttribute('aria-expanded')!=='true');});
      panel.querySelectorAll('a[href]').forEach(function(link){link.addEventListener('click',function(){setMobileMenu(false);});});
      document.addEventListener('keydown',function(e){if(e.key==='Escape')setMobileMenu(false);});
    }

    // ---------- Mobile submenus ----------
    document.querySelectorAll('.h29F6 > li').forEach(function(item){
      var arrow=item.querySelector(':scope > .ZuOGq > .RkeXe');
      var wrap=item.querySelector(':scope > ._E6P6');
      if(!arrow||!wrap||!wrap.querySelector('ul li')) return;
      arrow.setAttribute('role','button'); arrow.setAttribute('tabindex','0'); arrow.setAttribute('aria-expanded','false');
      function toggleSub(e){ if(e){e.preventDefault();e.stopPropagation();} var open=!wrap.classList.contains('static-mobile-open');
        document.querySelectorAll('.h29F6 ._E6P6.static-mobile-open').forEach(function(o){if(o!==wrap){o.classList.remove('static-mobile-open');var a=o.closest('li').querySelector(':scope > .ZuOGq > .RkeXe');if(a){a.classList.remove('static-arrow-open');a.setAttribute('aria-expanded','false');}}});
        wrap.classList.toggle('static-mobile-open',open); arrow.classList.toggle('static-arrow-open',open); arrow.setAttribute('aria-expanded',open?'true':'false');
      }
      arrow.addEventListener('click',toggleSub); arrow.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')toggleSub(e);});
    });

    if(mobileQuery.addEventListener) mobileQuery.addEventListener('change',function(e){if(!e.matches)setMobileMenu(false);});

    // ---------- Content accordions ----------
    var accs=[];
    document.querySelectorAll('.T5XiN').forEach(function(item,index){
      var heads=item.querySelectorAll(':scope > .aEvO4');
      if(heads.length<2) return;
      var header=heads[0], panelAcc=null;
      for(var i=1;i<heads.length;i++){ if(heads[i].classList.contains('kp6k7')) {panelAcc=heads[i];break;} }
      if(!panelAcc) return;
      var trigger=header.querySelector('.kP1NS')||header;
      var icon=header.querySelector('.QbVKh');
      var id=panelAcc.id||('static-accordion-panel-'+index); panelAcc.id=id;
      trigger.classList.add('static-content-accordion-trigger'); panelAcc.classList.add('static-content-accordion-panel'); if(icon)icon.classList.add('static-content-accordion-icon');
      trigger.setAttribute('role','button'); trigger.setAttribute('tabindex','0'); trigger.setAttribute('aria-controls',id); trigger.setAttribute('aria-expanded','false');
      panelAcc.setAttribute('aria-hidden','true'); panelAcc.setAttribute('inert',''); panelAcc.style.maxHeight='0px'; panelAcc.style.overflow='hidden';
      function setOpen(open){
        item.classList.toggle('static-content-accordion-open',open); trigger.setAttribute('aria-expanded',open?'true':'false'); panelAcc.setAttribute('aria-hidden',open?'false':'true');
        if(open){ panelAcc.removeAttribute('inert'); ensureImages(panelAcc); panelAcc.style.maxHeight=panelAcc.scrollHeight+'px'; requestAnimationFrame(function(){panelAcc.style.maxHeight=panelAcc.scrollHeight+'px';}); setTimeout(function(){panelAcc.style.maxHeight=panelAcc.scrollHeight+'px';},100); }
        else { panelAcc.style.maxHeight=panelAcc.scrollHeight+'px'; requestAnimationFrame(function(){panelAcc.style.maxHeight='0px';}); setTimeout(function(){if(!item.classList.contains('static-content-accordion-open')) panelAcc.setAttribute('inert','');},330); }
      }
      function tog(e){if(e){e.preventDefault();e.stopPropagation();}setOpen(!item.classList.contains('static-content-accordion-open'));}
      trigger.addEventListener('click',tog); trigger.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')tog(e);});
      accs.push({item:item,panel:panelAcc});
    });
    // ---------- Jimdo FAQ accordions (Hypnose page) ----------
    document.querySelectorAll('.nNOvF > button.vKFKO').forEach(function(trigger,index){
      var item=trigger.parentElement;
      var faqPanel=item ? item.querySelector(':scope > .kp6k7.ioiWE') : null;
      if(!item || !faqPanel) return;

      var panelId=faqPanel.id || trigger.getAttribute('aria-controls') || ('static-faq-panel-'+index);
      faqPanel.id=panelId;
      trigger.setAttribute('aria-controls',panelId);
      trigger.setAttribute('aria-expanded','false');
      faqPanel.setAttribute('aria-hidden','true');
      faqPanel.setAttribute('inert','');
      faqPanel.style.maxHeight='0px';
      faqPanel.style.overflow='hidden';

      function setFaqOpen(open){
        item.classList.toggle('static-faq-open',open);
        trigger.setAttribute('aria-expanded',open?'true':'false');
        faqPanel.setAttribute('aria-hidden',open?'false':'true');
        if(open){
          faqPanel.removeAttribute('inert');
          ensureImages(faqPanel);
          faqPanel.style.maxHeight=faqPanel.scrollHeight+'px';
          requestAnimationFrame(function(){faqPanel.style.maxHeight=faqPanel.scrollHeight+'px';});
          setTimeout(function(){if(item.classList.contains('static-faq-open')) faqPanel.style.maxHeight=faqPanel.scrollHeight+'px';},120);
        } else {
          faqPanel.style.maxHeight=faqPanel.scrollHeight+'px';
          requestAnimationFrame(function(){faqPanel.style.maxHeight='0px';});
          setTimeout(function(){if(!item.classList.contains('static-faq-open')) faqPanel.setAttribute('inert','');},230);
        }
      }

      trigger.addEventListener('click',function(){setFaqOpen(!item.classList.contains('static-faq-open'));});
      accs.push({item:item,panel:faqPanel,openClass:'static-faq-open'});
    });

    function refresh(){accs.forEach(function(a){var cls=a.openClass||'static-content-accordion-open';if(a.item.classList.contains(cls))a.panel.style.maxHeight=a.panel.scrollHeight+'px';});}
    window.addEventListener('resize',refresh); window.addEventListener('load',refresh); document.querySelectorAll('img').forEach(function(i){i.addEventListener('load',refresh);});
  });
})();
