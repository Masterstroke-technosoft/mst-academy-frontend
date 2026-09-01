"use strict";(()=>{var Y=Object.defineProperty,X=Object.defineProperties;var Z=Object.getOwnPropertyDescriptors;var P=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var $=(e,t,o)=>t in e?Y(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,L=(e,t)=>{for(var o in t||(t={}))J.call(t,o)&&$(e,o,t[o]);if(P)for(var o of P(t))Q.call(t,o)&&$(e,o,t[o]);return e},T=(e,t)=>X(e,Z(t));async function h(e,t,o){let s=new URL(t,e.apiBase);Object.entries(o).forEach(([r,a])=>{a&&s.searchParams.set(r,a)}),e.preview&&s.searchParams.set("preview","true"),e.previewToken&&s.searchParams.set("token",e.previewToken);let d=await fetch(s.toString(),{headers:{"x-site-token":e.token}});if(!d.ok)throw new Error(`Connector API request failed (${d.status})`);return d.json()}async function g(e,t){let o=await h(e,"/api/v1/connector/posts",t);return e.limit?o.slice(0,e.limit):o}async function z(e,t){return h(e,`/api/v1/connector/posts/${encodeURIComponent(t)}`,{})}async function b(e,t){let o=await h(e,"/api/v1/connector/events",t);return e.limit?o.slice(0,e.limit):o}async function x(e,t){return h(e,`/api/v1/connector/events/${encodeURIComponent(t)}`,{})}async function v(e,t){return h(e,"/api/v1/connector/events-page-config",{category:t})}function E(e){var t,o;return typeof e.author=="string"?e.author:(o=(t=e.author)==null?void 0:t.name)!=null?o:""}function ee(e){var t,o;return typeof e.author=="string"?"":(o=(t=e.author)==null?void 0:t.avatar)!=null?o:""}function y(e){if(!e)return"";let t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"})}function M(e,t){let o=document.head.querySelector(`meta[name="${e}"]`);o||(o=document.createElement("meta"),o.setAttribute("name",e),document.head.appendChild(o)),o.setAttribute("content",t)}function te(e){let t=e.metaTitle||e.heading;t&&(document.title=t);let o=e.metaDescription||e.subHeading;o&&M("description",o),e.metaKeywords&&e.metaKeywords.length&&M("keywords",e.metaKeywords.join(", "))}function H(e,t){te(t),e.textContent="";let o=document.createElement("article");o.className="mst-post";let s=document.createElement("h1");if(s.className="mst-post-heading",s.textContent=t.heading,s.style.textAlign=t.headingAlign||"center",o.appendChild(s),t.subHeading){let n=document.createElement("p");n.className="mst-post-subheading",n.textContent=t.subHeading,n.style.textAlign=t.subHeadingAlign||"center",o.appendChild(n)}let d=E(t),r=y(t.publishedAt);if(d||r||t.category){let n=document.createElement("div");if(n.className="mst-post-meta",d){let l=document.createElement("span");l.className="mst-post-author";let m=ee(t);if(m){let c=document.createElement("img");c.className="mst-post-avatar",c.src=m,c.alt=d,l.appendChild(c)}let i=document.createElement("span");i.textContent=d,l.appendChild(i),n.appendChild(l)}if(r){let l=document.createElement("span");l.textContent=`Published At - ${r}`,n.appendChild(l)}if(t.category){let l=document.createElement("span");l.className="mst-post-category",l.textContent=t.category,n.appendChild(l)}o.appendChild(n)}if(t.cardImage){let n=document.createElement("img");n.className="mst-post-image",n.src=t.cardImage,n.alt=t.heading||"",o.appendChild(n)}let a=document.createElement("div");a.className="mst-post-body",a.innerHTML=t.body||"",o.appendChild(a),e.appendChild(o)}function f(e,t,o,s){if(e.textContent="",!t.length){let r=document.createElement("p");r.className="mst-empty",r.textContent=s,e.appendChild(r);return}let d=document.createElement("div");d.className="mst-list",t.forEach(r=>{let a=document.createElement(o.linkBase?"a":"div");if(a.className="mst-card",o.linkBase&&a instanceof HTMLAnchorElement&&(a.href=`${o.linkBase.replace(/\/$/,"")}/${r.slug}`),r.cardImage){let i=document.createElement("img");i.className="mst-card-image",i.src=r.cardImage,i.alt=r.heading||"",i.loading="lazy",a.appendChild(i)}let n=document.createElement("div");if(n.className="mst-card-body",r.category){let i=document.createElement("span");i.className="mst-card-category",i.textContent=r.category,n.appendChild(i)}let l=document.createElement("h3");if(l.className="mst-card-heading",l.textContent=r.heading,n.appendChild(l),r.subHeading){let i=document.createElement("p");i.className="mst-card-subheading",i.textContent=r.subHeading,n.appendChild(i)}let m=[E(r),y(r.publishedAt)].filter(Boolean);if(m.length){let i=document.createElement("div");i.className="mst-card-meta",i.textContent=m.join(" \xB7 "),n.appendChild(i)}a.appendChild(n),d.appendChild(a)}),e.appendChild(d)}function B(e){return E(e)}function w(e,t){t.accentColor&&e.style.setProperty("--mst-accent-override",t.accentColor),t.themeMode==="dark"?(e.style.setProperty("--mst-bg-override","#0f172a"),e.style.setProperty("--mst-text-override","#f8fafc"),e.style.setProperty("--mst-card-bg-override","#1e293b"),e.style.setProperty("--mst-border-override","#334155"),e.classList.add("mst-dark-theme")):(e.style.setProperty("--mst-bg-override","#ffffff"),e.style.setProperty("--mst-text-override","#1f2937"),e.style.setProperty("--mst-card-bg-override","#ffffff"),e.style.setProperty("--mst-border-override","#e5e7eb"),e.classList.remove("mst-dark-theme")),t.headingSize&&e.style.setProperty("--mst-heading-size",`${t.headingSize}px`),t.subheadingSize&&e.style.setProperty("--mst-subheading-size",`${t.subheadingSize}px`),t.badgeTagBg&&e.style.setProperty("--mst-badge-tag-bg",t.badgeTagBg),t.badgeTagText&&e.style.setProperty("--mst-badge-tag-text",t.badgeTagText),t.badgeUpcomingColor&&e.style.setProperty("--mst-badge-upcoming",t.badgeUpcomingColor),t.badgePastColor&&e.style.setProperty("--mst-badge-past",t.badgePastColor),t.backButtonBg&&e.style.setProperty("--mst-back-btn-bg",t.backButtonBg),t.backButtonText&&e.style.setProperty("--mst-back-btn-text",t.backButtonText),t.ctaHoverColor&&e.style.setProperty("--mst-cta-hover",t.ctaHoverColor),t.descriptionColor&&e.style.setProperty("--mst-description-color",t.descriptionColor),t.descriptionSize&&e.style.setProperty("--mst-description-size",`${t.descriptionSize}px`),t.dotColor&&e.style.setProperty("--mst-dot-color",t.dotColor)}function k(e,t,o,s){if(e.textContent="",!t.length){let r=document.createElement("p");r.className="mst-empty",r.textContent=s,e.appendChild(r);return}let d=document.createElement("div");d.className="mst-list",t.forEach(r=>{let a=document.createElement(o.linkBase?"a":"div");if(a.className="mst-card",o.linkBase&&a instanceof HTMLAnchorElement&&(a.href=`${o.linkBase.replace(/\/$/,"")}/${r.slug}`),r.cardImage){let i=document.createElement("img");i.className="mst-card-image",i.src=r.cardImage,i.alt=r.heading||"",i.loading="lazy",a.appendChild(i)}let n=document.createElement("div");if(n.className="mst-card-body",r.category){let i=document.createElement("span");i.className="mst-card-category",i.textContent=r.category,n.appendChild(i)}let l=document.createElement("h3");if(l.className="mst-card-heading",l.textContent=r.heading,n.appendChild(l),r.subHeading){let i=document.createElement("p");i.className="mst-card-subheading",i.textContent=r.subHeading,n.appendChild(i)}let m=[y(r.eventDate),r.venue].filter(Boolean);if(m.length){let i=document.createElement("div");i.className="mst-card-meta",i.textContent=m.join(" \xB7 "),n.appendChild(i)}a.appendChild(n),d.appendChild(a)}),e.appendChild(d)}function S(e,t){e.textContent="";let o=document.createElement("article");o.className="mst-post mst-event";let s=document.createElement("h1");if(s.className="mst-post-heading",s.textContent=t.heading,s.style.textAlign=t.headingAlign||"center",t.headingSize&&(s.style.fontSize=`${t.headingSize}px`),t.headingColor&&(s.style.color=t.headingColor),o.appendChild(s),t.subHeading){let a=document.createElement("p");a.className="mst-post-subheading",a.textContent=t.subHeading,a.style.textAlign=t.subHeadingAlign||"center",t.subHeadingSize&&(a.style.fontSize=`${t.subHeadingSize}px`),t.subHeadingColor&&(a.style.color=t.subHeadingColor),o.appendChild(a)}let d=document.createElement("div");d.className="mst-post-meta mst-event-meta";let r=y(t.eventDate);if(r){let a=document.createElement("span");a.textContent=`${r} \xB7 ${t.phase==="upcoming"?"Upcoming":"Past"}`,d.appendChild(a)}if(t.venue){let a=document.createElement("span");a.textContent=t.venue,d.appendChild(a)}if(t.category){let a=document.createElement("span");a.className="mst-post-category",a.textContent=t.category,d.appendChild(a)}if((t.tags||[]).forEach(a=>{let n=document.createElement("span");n.className="mst-event-tag",n.textContent=a,d.appendChild(n)}),d.childNodes.length&&o.appendChild(d),t.bookingLink){let a=document.createElement("a");a.className="mst-editor-btn mst-event-booking-btn",a.href=t.bookingLink,a.target="_blank",a.rel="noopener noreferrer",a.textContent="Register / Book Now",o.appendChild(a)}if(t.cardImage){let a=document.createElement("img");a.className="mst-post-image",a.src=t.cardImage,a.alt=t.heading||"",o.appendChild(a)}if(t.description){let a=document.createElement("p");a.className="mst-event-description",a.textContent=t.description,o.appendChild(a)}if(t.media&&t.media.length){let a=document.createElement("div");a.className="mst-event-media",t.media.forEach(n=>{if(n.type==="video"){let l=document.createElement("a");l.className="mst-event-video-tile",l.href=n.url,l.target="_blank",l.rel="noopener noreferrer",l.textContent="Watch video",a.appendChild(l)}else{let l=document.createElement("img");l.className="mst-event-media-image",l.src=n.url,l.alt=t.heading||"",l.loading="lazy",a.appendChild(l)}}),o.appendChild(a)}if(t.keyTopics&&t.keyTopics.length){let a=document.createElement("div");a.className="mst-event-topics";let n=document.createElement("h2");n.textContent="Key Topics & Outcomes",a.appendChild(n),t.keyTopics.forEach(l=>{let m=document.createElement("div");m.className="mst-event-topic";let i=document.createElement("h3");if(i.textContent=l.heading,l.headingSize&&(i.style.fontSize=`${l.headingSize}px`),l.headingColor&&(i.style.color=l.headingColor),m.appendChild(i),l.description){let c=document.createElement("p");c.textContent=l.description,m.appendChild(c)}a.appendChild(m)}),o.appendChild(a)}e.appendChild(o)}async function N(e,t){let o=await g(e,{});f(t,o,e,"No posts published yet.")}async function A(e,t){let o=await g(e,{featured:"true"});f(t,o,e,"No featured posts yet.")}async function I(e,t){if(!e.author){t.textContent="Missing data-author attribute.";return}let s=(await g(T(L({},e),{limit:0}),{})).filter(d=>B(d).toLowerCase()===e.author.toLowerCase()).slice(0,e.limit);f(t,s,e,`No posts found for "${e.author}".`)}async function D(e,t){if(!e.category){t.textContent="Missing data-category attribute.";return}let o=await g(e,{category:e.category});f(t,o,e,`No posts found in "${e.category}".`)}async function W(e,t){if(t.textContent="",!e.dashboardUrl){t.textContent="Missing data-dashboard-url attribute.";return}let o=e.dashboardUrl.replace(/\/$/,""),s=e.siteId||"default-site",d=`${o}/sites/${encodeURIComponent(s)}/posts`,r=document.createElement("a");r.className="mst-editor-btn",r.href=d,r.target="_blank",r.rel="noopener noreferrer",r.textContent=e.label||"Manage Blog Posts",t.appendChild(r)}async function j(e,t){if(!e.slug){t.textContent="Missing data-slug attribute (or a ?slug= query param) \u2014 nothing to load.";return}let o=await z(e,e.slug);H(t,o)}async function U(e,t){let o=await b(e,{when:"upcoming",category:e.category});k(t,o,e,"No upcoming events right now.")}async function R(e,t){let o=await b(e,{when:"past",category:e.category});k(t,o,e,"No past events yet.")}async function q(e,t){if(!e.slug){t.textContent="Missing data-slug attribute (or a ?slug= query param) \u2014 nothing to load.";return}let o=await x(e,e.slug);S(t,o)}async function V(e,t){let o=e.category;if(!o){t.innerHTML='<div class="mst-empty">Error: Missing category attribute (e.g., data-category="corporate").</div>';return}t.textContent="Loading events...";try{let[s,d]=await Promise.all([v(e,o),b(e,{category:o})]);if(w(t,s),!d||d.length===0){t.innerHTML=`
        <div class="mst-events-container">
          <header class="mst-events-header">
            <h1 class="mst-bungee-title">${O(s.heading||"Events",s.headingColor,s.accentColor)}</h1>
            <p>${s.subheading||""}</p>
            <div class="mst-header-bar"></div>
          </header>
          <div class="mst-empty">No events found in this category.</div>
        </div>
      `;return}let r=new Date,a=d.filter(i=>new Date(i.eventDate)>r),n=d.filter(i=>new Date(i.eventDate)<=r);t.innerHTML=`
      <div class="mst-events-container">
        <header class="mst-events-header">
          <h1 class="mst-bungee-title">${O(s.heading||"Events")}</h1>
          <p>${s.subheading||""}</p>
          <div class="mst-header-bar"></div>
        </header>

        <div class="mst-tabs-container">
          <div class="mst-tabs" role="tablist">
            <button class="mst-tab active" data-tab="all" role="tab" aria-selected="true">
              All <span class="mst-tab-count">${d.length}</span>
            </button>
            <button class="mst-tab" data-tab="upcoming" role="tab" aria-selected="false">
              Upcoming <span class="mst-tab-count">${a.length}</span>
            </button>
            <button class="mst-tab" data-tab="past" role="tab" aria-selected="false">
              Past <span class="mst-tab-count">${n.length}</span>
            </button>
          </div>
        </div>

        <div class="mst-events-grid">
          ${d.map(i=>oe(i,e,r)).join("")}
        </div>
      </div>
    `;let l=t.querySelectorAll(".mst-tab"),m=t.querySelectorAll(".mst-event-card-wrapper");l.forEach(i=>{i.addEventListener("click",()=>{l.forEach(p=>{p.classList.remove("active"),p.setAttribute("aria-selected","false")}),i.classList.add("active"),i.setAttribute("aria-selected","true");let c=i.getAttribute("data-tab");m.forEach(p=>{let u=p,C=u.classList.contains("phase-upcoming");c==="all"?u.style.display="flex":c==="upcoming"?u.style.display=C?"flex":"none":c==="past"&&(u.style.display=C?"none":"flex")})})})}catch(s){console.error("[masterstroke-widget] failed to load events-listing",s),t.innerHTML='<div class="mst-empty">Unable to load events listing. Please try again later.</div>'}}function O(e,t,o){let s=t?` style="color:${t}"`:"",d=o?` style="color:${o}"`:"",r=e.trim().split(/\s+/);if(r.length<=1)return`<span${s}>${e}</span>`;let a=r[0],n=r.slice(1).join(" ");return`<span class="mst-header-first"${s}>${a}</span> <span class="mst-header-rest"${d}>${n}</span>`}function oe(e,t,o){let s=new Date(e.eventDate),d=s>o,r=d?"phase-upcoming":"phase-past",a=s.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}),n=e.description&&e.description.length>100?e.description.slice(0,100)+"...":e.description||"",m=`${t.linkBase||`/${t.category}-events`}/${e.slug}`;return`
    <div class="mst-event-card-wrapper ${r}">
      <a href="${m}" class="mst-event-card">
        <div class="mst-card-media-container">
          ${e.cardImage?`
            <img class="mst-card-thumbnail" src="${e.cardImage}" alt="${e.heading}" loading="lazy" />
          `:`
            <div class="mst-card-thumbnail-placeholder"></div>
          `}
          
          ${e.tag?`
            <span class="mst-badge-tag">${e.tag}</span>
          `:""}
          
          <span class="mst-badge-status ${d?"status-upcoming":"status-past"}">
            ${d?"Upcoming":"Past"}
          </span>
        </div>

        <div class="mst-card-details">
          <div class="mst-card-meta-info">
            <span class="mst-meta-item meta-date">
              <svg class="mst-icon red-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              ${a}
            </span>
            ${e.venue?`
              <span class="mst-meta-item meta-location">
                <svg class="mst-icon red-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ${e.venue}
              </span>
            `:""}
          </div>

          <h3 class="mst-card-title">${e.heading}</h3>
          <p class="mst-card-desc">${n}</p>
          
          <div class="mst-card-footer">
            <div class="mst-card-action-link">
              <span class="mst-action-text">${d?"EXPLORE EVENT":"VIEW GALLERY"}</span>
              <span class="mst-action-badge">
                <svg class="mst-icon arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `}async function K(e,t){let o=e.slug,s=e.category;if(!o){t.innerHTML='<div class="mst-empty">Error: Missing event slug parameter.</div>';return}if(!s){t.innerHTML='<div class="mst-empty">Error: Missing category parameter.</div>';return}t.textContent="Loading event details...";try{let[d,r]=await Promise.all([v(e,s),x(e,o)]);if(!r){t.innerHTML='<div class="mst-empty">Event not found.</div>';return}w(t,d);let a=new Date,n=new Date(r.eventDate)>a,l=new Date(r.eventDate),m=l.toLocaleDateString("en-US",{timeZone:"UTC",weekday:"long",month:"long",day:"numeric",year:"numeric"})+(r.eventTimeSet?`, ${l.toLocaleTimeString("en-US",{timeZone:"UTC",hour:"numeric",minute:"2-digit",hour12:!0})}`:""),i=s.charAt(0).toUpperCase()+s.slice(1),c=e.backLink||`/${s}-events`;t.innerHTML=`
      <div class="mst-event-detail-container">
        <!-- Navigation Back Header + Badges, one row -->
        <div class="mst-detail-nav">
          <a href="${c}" class="mst-back-link">
            <svg class="mst-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to ${i} Events
          </a>

          <div class="mst-detail-badges">
            ${r.tag?`<span class="mst-badge-tag">${r.tag}</span>`:""}
            <span class="mst-badge-status ${n?"status-upcoming":"status-past"}">
              ${n?"Upcoming":"Past"}
            </span>
          </div>
        </div>

        <!-- Title & Meta -->
        <div class="mst-detail-header">
          <h1 class="mst-detail-title">${re(r.subHeading?`${r.heading} : ${r.subHeading}`:r.heading)}</h1>

          <div class="mst-detail-meta">
            <div class="mst-meta-item">
              <svg class="mst-icon red-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>${m}</span>
            </div>
            ${r.venue?`
              <div class="mst-meta-item">
                <svg class="mst-icon red-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>${r.venue}</span>
              </div>
            `:""}
          </div>
        </div>

        <!-- Conditional Layout: Carousel (Past) or Hero Image (Upcoming) -->
        ${n?ae(r):se(r.media,r.heading)}

        <!-- Main Body Description -->
        <div class="mst-detail-content">
          <h2 class="mst-content-section-title">About the Event</h2>
          <p class="mst-detail-description">${r.description||"No description provided."}</p>
        </div>

        <!-- Key Topics & Outcomes Grid (Only for Past Events) -->
        ${n?"":ie(r.keyTopics)}

        <!-- Dynamic Bottom Back/CTA Button -->
        <div class="mst-detail-footer-nav">
          ${n?`
              <a href="${r.ctaLink||r.bookingLink||"#"}" target="_blank" rel="noopener noreferrer" class="mst-explore-btn upcoming-cta-large">
                ${r.ctaLabel||"Register Now"}
              </a>
            `:`
              <a href="${c}" class="mst-explore-btn">
                <svg class="mst-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" stroke-width="2" /><path stroke-linecap="round" stroke-width="2" d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>
                Explore More ${i} Events
              </a>
            `}
        </div>
      </div>
    `,n||ne(t)}catch(d){console.error("[masterstroke-widget] failed to load events-detail",d),t.innerHTML='<div class="mst-empty">Unable to load event details. Please verify the URL or try again later.</div>'}}function re(e){let t=e.indexOf(":");if(t!==-1&&t<e.length-1){let o=e.slice(0,t+1),s=e.slice(t+1).trim();return`<span class="mst-detail-title-first">${o}</span> <span class="mst-detail-title-rest">${s}</span>`}return`<span class="mst-detail-title-first">${e}</span>`}function ae(e){return e.cardImage?`
    <div class="mst-upcoming-hero-container">
      <img class="mst-upcoming-hero-img" src="${e.cardImage}" alt="${e.heading}" loading="lazy" />
    </div>
  `:""}function se(e,t){return!e||e.length===0?"":`
    <div class="mst-carousel-container" aria-label="${t} media gallery">
      <div class="mst-carousel-track">
        ${e.map((o,s)=>`
          <div class="mst-carousel-slide ${s===0?"active":""}" data-index="${s}">
            ${o.type==="video"?`
              <video class="mst-carousel-video" src="${o.url}" controls preload="metadata" playsinline></video>
            `:`
              <img class="mst-carousel-img" src="${o.url}" alt="${t} slide ${s+1}" loading="lazy" />
            `}
          </div>
        `).join("")}
      </div>

      ${e.length>1?`
        <!-- Carousel Arrows -->
        <button class="mst-carousel-btn btn-prev" aria-label="Previous slide">
          <svg class="mst-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button class="mst-carousel-btn btn-next" aria-label="Next slide">
          <svg class="mst-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>

        <!-- Carousel Dots -->
        <div class="mst-carousel-dots" role="tablist">
          ${e.map((o,s)=>`
            <button class="mst-carousel-dot ${s===0?"active":""}" data-index="${s}" role="tab" aria-selected="${s===0?"true":"false"}" aria-label="Go to slide ${s+1}"></button>
          `).join("")}
        </div>
      `:""}
    </div>
  `}function ie(e){return!e||e.length===0?"":`
    <div class="mst-detail-topics-section border-t dark:border-slate-800 border-gray-200 pt-8 mt-8">
      <h2 class="mst-content-section-title">Key Topics & Outcomes</h2>
      <div class="mst-topics-grid">
        ${e.map(t=>`
          <div class="mst-topic-card">
            <div class="mst-topic-header">
              <span class="mst-check-icon-wrapper">
                <svg class="mst-icon check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m9 11 3 3L22 4" /></svg>
              </span>
              <h3 class="mst-topic-title">${t.heading}</h3>
            </div>
            ${t.description?`<p class="mst-topic-desc">${t.description}</p>`:""}
          </div>
        `).join("")}
      </div>
    </div>
  `}function ne(e){let t=e.querySelectorAll(".mst-carousel-slide"),o=e.querySelectorAll(".mst-carousel-dot"),s=e.querySelector(".mst-carousel-btn.btn-prev"),d=e.querySelector(".mst-carousel-btn.btn-next");if(t.length<=1)return;let r=0,a=null;function n(){a&&(clearInterval(a),a=null)}function l(){n(),a=setInterval(()=>m(r+1),4e3)}function m(i){r=(i+t.length)%t.length,t.forEach((c,p)=>{if(p===r)c.classList.add("active");else{c.classList.remove("active");let u=c.querySelector("video");u&&u.pause()}}),o.forEach((c,p)=>{p===r?(c.classList.add("active"),c.setAttribute("aria-selected","true")):(c.classList.remove("active"),c.setAttribute("aria-selected","false"))})}s&&s.addEventListener("click",()=>{m(r-1),l()}),d&&d.addEventListener("click",()=>{m(r+1),l()}),o.forEach((i,c)=>{i.addEventListener("click",()=>{m(c),l()})}),l()}var _=`@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Poppins:wght@300;400;550;600;700&display=swap');

:host,
.mst-widget {
  all: initial;
  display: block;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
  box-sizing: border-box;
}

.mst-widget *,
.mst-widget *::before,
.mst-widget *::after {
  box-sizing: border-box;
}

.mst-empty {
  margin: 0;
  padding: 12px 0;
  font-size: 14px;
  color: #6b7280;
}

.mst-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.mst-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  transition: box-shadow 0.15s ease;
}

a.mst-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.mst-card-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
  background: #f3f4f6;
}

.mst-card-body {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mst-card-category {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #2563eb;
}

.mst-card-heading {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: #111827;
}

.mst-card-subheading {
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: #4b5563;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mst-card-meta {
  font-size: 12px;
  color: #9ca3af;
}

.mst-editor-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  background: #2563eb;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.mst-editor-btn:hover {
  background: #1d4ed8;
}

.mst-editor-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* Mirrors the CMS's own /preview page (app/preview/[siteId]/[slug]/page.tsx
   + the .preview-light rules in cms-frontend/app/globals.css) \u2014 keep both
   in sync when either one changes. */
.mst-post {
  max-width: 896px;
  margin: 0 auto;
  text-align: center;
}

.mst-post-heading {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: #111827;
}

@media (min-width: 640px) {
  .mst-post-heading {
    font-size: 48px;
  }
}

.mst-post-subheading {
  margin: 0 auto 16px;
  max-width: 42rem;
  font-size: 18px;
  line-height: 1.625;
  color: #6b7280;
}

.mst-post-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
  padding: 16px 0;
  margin-bottom: 32px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.mst-post-category {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 9999px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  color: #4f46e5;
}

.mst-post-author {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1f2937;
}

.mst-post-avatar {
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  display: block;
}

.mst-post-image {
  width: 100%;
  max-height: 384px;
  object-fit: cover;
  border-radius: 16px;
  display: block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
}

.mst-post-body {
  text-align: left;
  font-size: 16px;
  line-height: 1.625;
  color: #1f2937;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.mst-post-body h1,
.mst-post-body h2,
.mst-post-body h3,
.mst-post-body h4,
.mst-post-body h5,
.mst-post-body h6 {
  color: #111827;
  font-weight: 700;
  margin: 1.5em 0 0.5em;
}

.mst-post-body p {
  margin: 0 0 1em;
  color: #374151;
  line-height: 1.75;
}

.mst-post-body a {
  color: #4f46e5;
  text-decoration: underline;
}

.mst-post-body a:hover {
  color: #4338ca;
}

.mst-post-body img {
  max-width: 100%;
  height: auto;
  border-radius: 0.75rem;
  margin: 1.5rem 0;
}

.mst-post-body blockquote {
  border-left: 4px solid #6366f1;
  padding-left: 1rem;
  color: #6b7280;
  font-style: italic;
  margin: 1.5rem 0;
}

.mst-post-body ul,
.mst-post-body ol {
  padding-left: 1.5rem;
  color: #374151;
  margin: 0 0 1em;
}

.mst-post-body li {
  margin: 0.25rem 0;
}

.mst-post-body code {
  background: #f3f4f6;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #4f46e5;
}

.mst-post-body pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.mst-post-body pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

.mst-post-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.mst-post-body th,
.mst-post-body td {
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.mst-post-body th {
  background: #f9fafb;
  font-weight: 600;
}

.mst-post-body figure {
  margin: 1.5rem 0;
}

.mst-post-body figcaption {
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.mst-post-body hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 2rem 0;
}

/* Events \u2014 mirrors the CMS's own /preview/events page, keep both in sync. */
.mst-event-meta {
  flex-wrap: wrap;
  row-gap: 8px;
}

.mst-event-tag {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 9999px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.mst-event-booking-btn {
  display: flex;
  width: fit-content;
  margin: 0 auto 32px;
}

.mst-event-description {
  text-align: center;
  max-width: 42rem;
  margin: 0 auto 32px;
  font-size: 16px;
  line-height: 1.625;
  color: #374151;
}

.mst-event-media {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 32px;
}

.mst-event-media-image {
  width: 100%;
  height: 128px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
}

.mst-event-video-tile {
  height: 128px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #4f46e5;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  transition: background 0.15s ease;
}

.mst-event-video-tile:hover {
  background: #eef2ff;
}

.mst-event-topics {
  text-align: left;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.mst-event-topics h2 {
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.mst-event-topic {
  margin-bottom: 20px;
}

.mst-event-topic h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.mst-event-topic p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #374151;
}

/* ==========================================
   Global Helper Icons & Layouts
   ========================================== */
.mst-icon {
  width: 16px !important;
  height: 16px !important;
  display: inline-block;
  vertical-align: middle;
  stroke-width: 2;
  flex-shrink: 0;
}

.mst-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

/* ==========================================
   Configurable CSS Themes & Dynamic Variables
   ========================================== */
.mst-widget {
  --mst-accent: var(--mst-accent-override, #dc2626); /* Default Crimson Red */
  --mst-bg: var(--mst-bg-override, transparent); /* Inherits site background color by default */
  --mst-text: var(--mst-text-override, inherit); /* Inherits site font color by default */
  --mst-card-bg: var(--mst-card-bg-override, #ffffff);
  --mst-border: var(--mst-border-override, #e5e7eb);
  --mst-heading: var(--mst-text);
  --mst-subheading: #6b7280;
  
  background-color: var(--mst-bg);
  color: var(--mst-text);
  padding: 16px 0;
  border-radius: 12px;
  transition: all 0.25s ease;
}

.mst-dark-theme {
  --mst-subheading: #9ca3af;
  --mst-card-bg-override: #1e293b;
  --mst-border-override: #334155;
}

/* ==========================================
   Events Listing Widget Styles
   ========================================== */
.mst-events-container {
  max-width: 1200px;
  margin: 60px auto 0; /* Pushes list view below fixed header */
  padding: 0 16px;
}

.mst-events-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.mst-bungee-title {
  margin: 0;
  font-family: 'Bungee', sans-serif;
  font-weight: normal;
  font-size: var(--mst-heading-size, 32px);
  letter-spacing: -0.01em;
  line-height: 1.25;
  text-transform: uppercase;
}

.mst-header-first {
  color: var(--mst-text);
}

.mst-header-rest {
  color: var(--mst-accent);
}

.mst-header-bar {
  width: 64px;
  height: 6px;
  background-color: var(--mst-accent);
  border-radius: 999px;
  margin: 16px auto 0;
}

.mst-events-header p {
  margin: 12px 0 0;
  font-size: var(--mst-subheading-size, 16px);
  line-height: 1.5;
  color: var(--mst-subheading);
  font-family: 'Poppins', sans-serif;
}

.mst-tabs-container {
  border-bottom: 1px solid var(--mst-border);
  margin-bottom: 32px;
  padding-bottom: 16px;
  display: flex;
  justify-content: center;
}

.mst-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.mst-tab {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 8px 20px;
  border-radius: 9999px; /* Pill button */
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  outline: none;
}

.mst-tab:hover {
  transform: translateY(-1px);
  background-color: #e5e7eb;
}

.mst-tab.active {
  background-color: var(--mst-accent);
  border-color: var(--mst-accent);
  color: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.25);
}

.mst-tab-count {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.08);
  color: inherit;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 700;
  transition: all 0.15s ease;
}

.mst-tab.active .mst-tab-count {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.mst-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px; /* gap-8 */
}

.mst-event-card-wrapper {
  display: flex;
  flex-direction: column;
}

.mst-event-card {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: var(--mst-card-bg);
  border: 1px solid rgba(229, 231, 235, 0.7); /* border-gray-200/70 */
  border-radius: 16px; /* rounded-2xl */
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.mst-event-card:hover {
  transform: translateY(-6px); /* lifts up by 6px */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08); /* deep soft shadow */
  border-color: rgba(229, 231, 235, 0.9);
}

.mst-card-media-container {
  position: relative;
  width: 100%;
  height: 190px;
  background: var(--mst-border);
  overflow: hidden;
}

/* Bottom-to-top dark gradient overlay */
.mst-card-media-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 100%);
  pointer-events: none;
  z-index: 5;
}

.mst-card-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.mst-event-card:hover .mst-card-thumbnail {
  transform: scale(1.05); /* Zoom in slightly */
}

.mst-card-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--mst-accent) 0%, #1e1b4b 100%);
  opacity: 0.15;
}

.mst-badge-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--mst-badge-tag-bg, #fee2e2);
  backdrop-filter: blur(4px);
  color: var(--mst-badge-tag-text, #b91c1c);
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  z-index: 10;
}

.mst-badge-status {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 10;
  color: #ffffff;
}

.status-upcoming {
  background-color: var(--mst-badge-upcoming, #059669); /* Emerald green */
}

.status-past {
  background-color: var(--mst-badge-past, #4b5563); /* Medium gray */
}

.mst-card-details {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.mst-card-meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 12px;
  color: var(--mst-subheading);
  margin-bottom: 12px;
}

.mst-card-meta-info .red-icon {
  stroke: var(--mst-accent);
}

.mst-card-title {
  margin: 0 0 10px;
  font-family: 'Bungee', sans-serif;
  font-weight: normal;
  font-size: 18px;
  line-height: 1.35;
  color: var(--mst-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.mst-event-card:hover .mst-card-title {
  color: var(--mst-accent); /* Header turns red on hover */
}

.mst-card-desc {
  margin: 0 0 24px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--mst-subheading);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mst-card-footer {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--mst-border);
}

.mst-card-action-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mst-action-text {
  font-size: 11px;
  font-weight: 800;
  color: var(--mst-accent);
  letter-spacing: 0.05em;
}

.mst-action-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #fee2e2; /* secondary light red tint */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.mst-action-badge .arrow-icon {
  width: 14px;
  height: 14px;
  stroke: var(--mst-accent);
  transition: transform 0.2s ease;
}

.mst-event-card:hover .mst-action-badge {
  background-color: var(--mst-accent);
}

.mst-event-card:hover .mst-action-badge .arrow-icon {
  stroke: #ffffff;
  transform: translateX(2px); /* arrow slides slightly right */
}

/* ==========================================
   Events Detail Widget Styles
   ========================================== */
.mst-event-detail-container {
  max-width: 800px;
  margin: 60px auto 0; /* Pushes detail view below fixed header */
  padding: 0 16px;
}

.mst-detail-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.mst-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--mst-back-btn-text, #1f2937);
  background-color: var(--mst-back-btn-bg, #f3f4f6);
  padding: 8px 16px;
  border-radius: 9999px;
  text-decoration: none;
  transition: filter 0.15s ease;
}

.mst-back-link:hover {
  filter: brightness(0.95);
}

.mst-detail-header {
  margin-bottom: 32px;
}

.mst-detail-badges {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.mst-detail-badges .mst-badge-tag,
.mst-detail-badges .mst-badge-status {
  position: static;
  display: inline-block;
  box-shadow: none;
}

.mst-detail-badges .mst-badge-tag {
  backdrop-filter: none; /* colors already come from the base .mst-badge-tag rule */
}

.mst-detail-title {
  margin: 0 0 12px;
  font-family: 'Bungee', sans-serif;
  font-weight: normal;
  font-size: 32px;
  letter-spacing: -0.01em;
  line-height: 1.15;
}

.mst-detail-title-first {
  color: var(--mst-text);
}

.mst-detail-title-rest {
  color: var(--mst-accent);
  text-transform: uppercase;
}

.mst-detail-subtitle {
  font-size: 18px;
  line-height: 1.4;
  color: var(--mst-subheading);
  margin: 0 0 16px;
}

.mst-detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: var(--mst-subheading);
  padding: 16px 0;
  border-top: 1px solid var(--mst-border);
  border-bottom: 1px solid var(--mst-border);
}

.mst-detail-meta .mst-meta-item {
  gap: 6px;
}

.mst-detail-meta .red-icon {
  stroke: var(--mst-accent);
}

/* Upcoming Hero Static Image */
.mst-upcoming-hero-container {
  width: 100%;
  aspect-ratio: 16/10;
  max-height: 480px;
  border-radius: 1.5rem; /* rounded-3xl */
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  border: 1px solid var(--mst-border);
  background: var(--mst-border);
}

.mst-upcoming-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Dynamic Ordered Media Carousel (Images/Videos) */
.mst-carousel-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  max-height: 480px;
  background-color: #000000;
  border-radius: 1.5rem; /* rounded-3xl */
  overflow: visible; /* so buttons can sit outside */
  margin: 0 auto 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
}

@media (max-width: 640px) {
  .mst-carousel-container {
    aspect-ratio: 4/3;
    overflow: hidden; /* Hide arrows on very small mobile viewport */
  }
}

.mst-carousel-track {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  overflow: hidden;
}

.mst-carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  transition: opacity 0.35s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.mst-carousel-slide.active {
  opacity: 1;
  z-index: 2;
  pointer-events: auto;
}

.mst-carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mst-carousel-video {
  width: 100%;
  height: 100%;
  background: #000;
  object-fit: contain;
}

.mst-carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #f3f4f6; /* gray-100 */
  border: 1px solid #e5e7eb;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  outline: none;
}

.mst-carousel-btn:hover {
  background-color: var(--mst-accent);
  color: #ffffff;
  border-color: var(--mst-accent);
}

.btn-prev {
  left: -22px; /* positioned outside */
}

.btn-next {
  right: -22px; /* positioned outside */
}

@media (max-width: 900px) {
  .btn-prev {
    left: 8px; /* pull inside if screen gets smaller */
  }
  .btn-next {
    right: 8px;
  }
}

.mst-carousel-dots {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.mst-carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--mst-dot-color, #ffffff);
  opacity: 0.4; /* dimmed by default \u2014 visible against the black carousel bg without needing an alpha color */
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.mst-carousel-dot:hover {
  opacity: 0.6;
}

.mst-carousel-dot.active {
  width: 32px; /* w-8 wide pill dot */
  border-radius: 4px;
  background-color: var(--mst-accent);
  opacity: 1;
}

.mst-detail-content {
  margin-bottom: 32px;
  margin-top: 40px;
}

.mst-content-section-title {
  font-family: 'Bungee', sans-serif;
  font-weight: normal;
  font-size: 20px;
  color: var(--mst-text);
  margin: 0 0 16px;
  border-bottom: 2px solid var(--mst-border);
  padding-bottom: 8px;
}

.mst-detail-description {
  font-size: var(--mst-description-size, 18px);
  line-height: 2; /* double line spacing */
  color: var(--mst-description-color, #4b5563);
  margin: 0;
  white-space: pre-line;
}

/* Key Topics Grid (2-column outcomes list) */
.mst-topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .mst-topics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.mst-topic-card {
  padding: 24px; /* 1.5rem padding */
  background-color: #f9fafb; /* bg-gray-50/50 */
  border: 1px solid rgba(229, 231, 235, 0.5); /* border-gray-200/50 */
  border-radius: 16px; /* rounded-2xl */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
}

.mst-topic-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.mst-check-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #fee2e2; /* bg-red-100 soft red */
  border-radius: 8px; /* rounded-xl */
  flex-shrink: 0;
}

.mst-check-icon-wrapper .check-icon {
  width: 18px;
  height: 18px;
  stroke: var(--mst-accent);
}

.mst-topic-title {
  margin: 0;
  font-family: 'Bungee', sans-serif;
  font-weight: normal;
  font-size: 15px;
  color: var(--mst-text);
  line-height: 1.35;
  text-transform: uppercase;
}

.mst-topic-desc {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: var(--mst-subheading);
}

.mst-detail-footer-nav {
  display: flex;
  justify-content: center;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--mst-border);
}

.mst-explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 14px 32px;
  background-color: var(--mst-accent);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  border-radius: 9999px; /* full pill */
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
}

.mst-explore-btn:hover {
  background-color: var(--mst-cta-hover, #b91c1c);
  transform: scale(1.05);
}

/* Upcoming large center CTA override styles */
.upcoming-cta-large {
  font-family: 'Bungee', sans-serif !important;
  font-size: 16px !important;
  font-weight: normal !important;
  padding: 16px 36px !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3) !important;
}


`;var le=(()=>{let e=document.currentScript;try{return e!=null&&e.src?new URL(e.src).origin:window.location.origin}catch(t){return window.location.origin}})(),ce=5,me={"latest-posts":N,featured:A,author:I,category:D,editor:W,post:j,"upcoming-events":U,"past-events":R,event:q,"events-listing":V,"events-detail":K},F=new WeakSet;function pe(e){let t=e.getAttribute("data-widget");if(!t)return console.error("[masterstroke-widget] element is missing data-widget",e),null;let o=e.getAttribute("data-token");if(t!=="editor"&&!o)return console.error("[masterstroke-widget] element is missing data-token",e),null;let s=parseInt(e.getAttribute("data-limit")||"",10);return{token:o||"",widgetType:t,apiBase:e.getAttribute("data-api-base")||le,limit:Number.isFinite(s)&&s>0?s:ce,category:e.getAttribute("data-category")||void 0,author:e.getAttribute("data-author")||void 0,linkBase:e.getAttribute("data-link-base")||void 0,backLink:e.getAttribute("data-back-link")||void 0,preview:e.getAttribute("data-preview")==="true",previewToken:e.getAttribute("data-preview-token")||void 0,dashboardUrl:e.getAttribute("data-dashboard-url")||void 0,siteId:e.getAttribute("data-site-id")||void 0,label:e.getAttribute("data-label")||void 0,slug:e.getAttribute("data-slug")||new URLSearchParams(window.location.search).get("slug")||void 0}}async function ge(e){if(F.has(e))return;F.add(e);let t=pe(e);if(!t)return;let o=me[t.widgetType];if(!o){console.error(`[masterstroke-widget] unsupported data-widget type "${t.widgetType}"`);return}let s=e.attachShadow({mode:"open"}),d=document.createElement("style");d.textContent=_,s.appendChild(d);let r=document.createElement("div");r.className="mst-widget",r.setAttribute("aria-busy","true"),r.textContent="Loading\u2026",s.appendChild(r);try{await o(t,r)}catch(a){console.error("[masterstroke-widget] failed to render widget",a),r.textContent="Unable to load content."}finally{r.removeAttribute("aria-busy")}}function G(){document.querySelectorAll("[data-widget]").forEach(e=>{ge(e)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",G):G();})();
