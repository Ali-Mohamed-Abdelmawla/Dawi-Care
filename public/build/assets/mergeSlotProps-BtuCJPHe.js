import{_ as o}from"./index-DF1D02Hj.js";import{c as v}from"./Typography-D94uCwLm.js";function H(e,s=166){let n;function t(...l){const i=()=>{e.apply(this,l)};clearTimeout(n),n=setTimeout(i,s)}return t.clear=()=>{clearTimeout(n)},t}function N(e){return e&&e.ownerDocument||document}function O(e){return N(e).defaultView||window}function g(e){return typeof e=="string"}function P(e,s,n){return e===void 0||g(e)?s:o({},s,{ownerState:o({},s.ownerState,n)})}function S(e,s=[]){if(e===void 0)return{};const n={};return Object.keys(e).filter(t=>t.match(/^on[A-Z]/)&&typeof e[t]=="function"&&!s.includes(t)).forEach(t=>{n[t]=e[t]}),n}function k(e,s,n){return typeof e=="function"?e(s,n):e}function y(e){if(e===void 0)return{};const s={};return Object.keys(e).filter(n=>!(n.match(/^on[A-Z]/)&&typeof e[n]=="function")).forEach(n=>{s[n]=e[n]}),s}function C(e){const{getSlotProps:s,additionalProps:n,externalSlotProps:t,externalForwardedProps:l,className:i}=e;if(!s){const f=v(n==null?void 0:n.className,i,l==null?void 0:l.className,t==null?void 0:t.className),m=o({},n==null?void 0:n.style,l==null?void 0:l.style,t==null?void 0:t.style),u=o({},n,l,t);return f.length>0&&(u.className=f),Object.keys(m).length>0&&(u.style=m),{props:u,internalRef:void 0}}const w=S(o({},l,t)),h=y(t),p=y(l),r=s(w),c=v(r==null?void 0:r.className,n==null?void 0:n.className,i,l==null?void 0:l.className,t==null?void 0:t.className),d=o({},r==null?void 0:r.style,n==null?void 0:n.style,l==null?void 0:l.style,t==null?void 0:t.style),a=o({},r,n,p,h);return c.length>0&&(a.className=c),Object.keys(d).length>0&&(a.style=d),{props:a,internalRef:r.ref}}export{P as a,O as b,H as d,S as e,g as i,C as m,N as o,k as r};