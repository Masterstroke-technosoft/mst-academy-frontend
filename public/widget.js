"use strict";(()=>{var H=Object.defineProperty,z=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,R=Object.prototype.propertyIsEnumerable;var h=(t,e,o)=>e in t?H(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,b=(t,e)=>{for(var o in e||(e={}))D.call(e,o)&&h(t,o,e[o]);if(f)for(var o of f(e))R.call(e,o)&&h(t,o,e[o]);return t},y=(t,e)=>z(t,I(e));async function x(t,e,o){let n=new URL(e,t.apiBase);Object.entries(o).forEach(([r,d])=>{d&&n.searchParams.set(r,d)}),t.preview&&n.searchParams.set("preview","true"),t.previewToken&&n.searchParams.set("token",t.previewToken);let s=await fetch(n.toString(),{headers:{"x-site-token":t.token}});if(!s.ok)throw new Error(`Connector API request failed (${s.status})`);return s.json()}async function c(t,e){let o=await x(t,"/api/v1/connector/posts",e);return t.limit?o.slice(0,t.limit):o}async function w(t,e){return x(t,`/api/v1/connector/posts/${encodeURIComponent(e)}`,{})}function u(t){var e,o;return typeof t.author=="string"?t.author:(o=(e=t.author)==null?void 0:e.name)!=null?o:""}function $(t){var e,o;return typeof t.author=="string"?"":(o=(e=t.author)==null?void 0:e.avatar)!=null?o:""}function P(t){if(!t)return"";let e=new Date(t);return Number.isNaN(e.getTime())?"":e.toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"})}function C(t,e){let o=document.head.querySelector(`meta[name="${t}"]`);o||(o=document.createElement("meta"),o.setAttribute("name",t),document.head.appendChild(o)),o.setAttribute("content",e)}function U(t){let e=t.metaTitle||t.heading;e&&(document.title=e);let o=t.metaDescription||t.subHeading;o&&C("description",o),t.metaKeywords&&t.metaKeywords.length&&C("keywords",t.metaKeywords.join(", "))}function v(t,e){U(e),t.textContent="";let o=document.createElement("article");o.className="mst-post";let n=document.createElement("h1");if(n.className="mst-post-heading",n.textContent=e.heading,o.appendChild(n),e.subHeading){let i=document.createElement("p");i.className="mst-post-subheading",i.textContent=e.subHeading,o.appendChild(i)}let s=u(e),r=P(e.publishedAt);if(s||r||e.category){let i=document.createElement("div");if(i.className="mst-post-meta",s){let m=document.createElement("span");m.className="mst-post-author";let p=$(e);if(p){let g=document.createElement("img");g.className="mst-post-avatar",g.src=p,g.alt=s,m.appendChild(g)}let a=document.createElement("span");a.textContent=s,m.appendChild(a),i.appendChild(m)}if(r){let m=document.createElement("span");m.textContent=`Published At - ${r}`,i.appendChild(m)}if(e.category){let m=document.createElement("span");m.className="mst-post-category",m.textContent=e.category,i.appendChild(m)}o.appendChild(i)}if(e.cardImage){let i=document.createElement("img");i.className="mst-post-image",i.src=e.cardImage,i.alt=e.heading||"",o.appendChild(i)}let d=document.createElement("div");d.className="mst-post-body",d.innerHTML=e.body||"",o.appendChild(d),t.appendChild(o)}function l(t,e,o,n){if(t.textContent="",!e.length){let r=document.createElement("p");r.className="mst-empty",r.textContent=n,t.appendChild(r);return}let s=document.createElement("div");s.className="mst-list";e.forEach(r=>{let d=document.createElement(o.linkBase?"a":"div");if(d.className="mst-card",o.linkBase&&d instanceof HTMLAnchorElement&&(d.href=`${o.linkBase.replace(/\/$/,"")}/${r.slug}`),r.cardImage){let a=document.createElement("img");a.className="mst-card-image",a.src=r.cardImage,a.alt=r.heading||"",a.loading="lazy",d.appendChild(a)}let i=document.createElement("div");if(i.className="mst-card-body",r.category){let a=document.createElement("span");a.className="mst-card-category",a.textContent=r.category,i.appendChild(a)}let m=document.createElement("h3");if(m.className="mst-card-heading",m.textContent=r.heading,i.appendChild(m),r.subHeading){let a=document.createElement("p");a.className="mst-card-subheading",a.textContent=r.subHeading,i.appendChild(a)}let p=[u(r),P(r.publishedAt)].filter(Boolean);if(p.length){let a=document.createElement("div");a.className="mst-card-meta",a.textContent=p.join(" \xB7 "),i.appendChild(a)}d.appendChild(i),s.appendChild(d)}),t.appendChild(s)}function E(t){return u(t)}async function k(t,e){let o=await c(t,{});l(e,o,t,"No posts published yet.")}async function L(t,e){let o=await c(t,{featured:"true"});l(e,o,t,"No featured posts yet.")}async function T(t,e){if(!t.author){e.textContent="Missing data-author attribute.";return}let n=(await c(y(b({},t),{limit:0}),{})).filter(s=>E(s).toLowerCase()===t.author.toLowerCase()).slice(0,t.limit);l(e,n,t,`No posts found for "${t.author}".`)}async function N(t,e){if(!t.category){e.textContent="Missing data-category attribute.";return}let o=await c(t,{category:t.category});l(e,o,t,`No posts found in "${t.category}".`)}async function A(t,e){if(e.textContent="",!t.dashboardUrl){e.textContent="Missing data-dashboard-url attribute.";return}let o=t.dashboardUrl.replace(/\/$/,""),n=t.siteId||"default-site",s=`${o}/sites/${encodeURIComponent(n)}/posts`,r=document.createElement("a");r.className="mst-editor-btn",r.href=s,r.target="_blank",r.rel="noopener noreferrer",r.textContent=t.label||"Manage Blog Posts",e.appendChild(r)}async function M(t,e){if(!t.slug){e.textContent="Missing data-slug attribute (or a ?slug= query param) \u2014 nothing to load.";return}let o=await w(t,t.slug);v(e,o)}var S=`:host,
.mst-widget {
  all: initial;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
`;var F=window.CMS_URL||(()=>{let t=document.currentScript;try{return t!=null&&t.src?new URL(t.src).origin:window.location.origin}catch(e){return window.location.origin}})();var q=5,K={"latest-posts":k,featured:L,author:T,category:N,editor:A,post:M},W=new WeakSet;function O(t){let e=t.getAttribute("data-widget");if(!e)return console.error("[masterstroke-widget] element is missing data-widget",t),null;let o=t.getAttribute("data-token");if(e!=="editor"&&!o)return console.error("[masterstroke-widget] element is missing data-token",t),null;let n=parseInt(t.getAttribute("data-limit")||"",10);return{token:o||"",widgetType:e,apiBase:t.getAttribute("data-api-base")||F,limit:Number.isFinite(n)&&n>0?n:q,category:t.getAttribute("data-category")||void 0,author:t.getAttribute("data-author")||void 0,linkBase:t.getAttribute("data-link-base")||void 0,preview:t.getAttribute("data-preview")==="true",previewToken:t.getAttribute("data-preview-token")||void 0,dashboardUrl:t.getAttribute("data-dashboard-url")||void 0,siteId:t.getAttribute("data-site-id")||void 0,label:t.getAttribute("data-label")||void 0,slug:t.getAttribute("data-slug")||new URLSearchParams(window.location.search).get("slug")||void 0}}async function _(t){if(W.has(t))return;W.add(t);let e=O(t);if(!e)return;let o=K[e.widgetType];if(!o){console.error(`[masterstroke-widget] unsupported data-widget type "${e.widgetType}"`);return}let n=t.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=S,n.appendChild(s);let r=document.createElement("div");r.className="mst-widget",r.setAttribute("aria-busy","true"),r.textContent="Loading...";n.appendChild(r);try{await o(e,r)}catch(d){console.error("[masterstroke-widget] failed to render widget",d),r.textContent="Unable to load content."}finally{r.removeAttribute("aria-busy")}}function B(){document.querySelectorAll("[data-widget]").forEach(t=>{_(t)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B):B();window.initializeMSTWidgets = B;})();
