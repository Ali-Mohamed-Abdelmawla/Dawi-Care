import{b as F,_ as n,c as W,P as I,Q}from"./index-DF1D02Hj.js";import{w as $,x as q}from"./Typography-D94uCwLm.js";const z=["ownerState"],B=["variants"],G=["name","slot","skipVariantsResolver","skipSx","overridesResolver"];function H(e){return Object.keys(e).length===0}function J(e){return typeof e=="string"&&e.charCodeAt(0)>96}function A(e){return e!=="ownerState"&&e!=="theme"&&e!=="sx"&&e!=="as"}const K=W(),U=e=>e&&e.charAt(0).toLowerCase()+e.slice(1);function _({defaultTheme:e,theme:s,themeId:t}){return H(s)?e:s[t]||s}function X(e){return e?(s,t)=>t[e]:null}function x(e,s){let{ownerState:t}=s,p=F(s,z);const l=typeof e=="function"?e(n({ownerState:t},p)):e;if(Array.isArray(l))return l.flatMap(h=>x(h,n({ownerState:t},p)));if(l&&typeof l=="object"&&Array.isArray(l.variants)){const{variants:h=[]}=l;let m=F(l,B);return h.forEach(o=>{let i=!0;typeof o.props=="function"?i=o.props(n({ownerState:t},p,t)):Object.keys(o.props).forEach(d=>{(t==null?void 0:t[d])!==o.props[d]&&p[d]!==o.props[d]&&(i=!1)}),i&&(Array.isArray(m)||(m=[m]),m.push(typeof o.style=="function"?o.style(n({ownerState:t},p,t)):o.style))}),m}return l}function g(e={}){const{themeId:s,defaultTheme:t=K,rootShouldForwardProp:p=A,slotShouldForwardProp:l=A}=e,h=c=>I(n({},c,{theme:_(n({},c,{defaultTheme:t,themeId:s}))}));return h.__mui_systemSx=!0,(c,m={})=>{$(c,r=>r.filter(a=>!(a!=null&&a.__mui_systemSx)));const{name:o,slot:i,skipVariantsResolver:d,skipSx:T,overridesResolver:P=X(U(i))}=m,V=F(m,G),E=d!==void 0?d:i&&i!=="Root"&&i!=="root"||!1,N=T||!1;let L,v=A;i==="Root"||i==="root"?v=p:i?v=l:J(c)&&(v=void 0);const R=q(c,n({shouldForwardProp:v,label:L},V)),k=r=>typeof r=="function"&&r.__emotion_real!==r||Q(r)?a=>x(r,n({},a,{theme:_({theme:a.theme,defaultTheme:t,themeId:s})})):r,C=(r,...a)=>{let O=k(r);const y=a?a.map(k):[];o&&P&&y.push(f=>{const u=_(n({},f,{defaultTheme:t,themeId:s}));if(!u.components||!u.components[o]||!u.components[o].styleOverrides)return null;const S=u.components[o].styleOverrides,w={};return Object.entries(S).forEach(([D,M])=>{w[D]=x(M,n({},f,{theme:u}))}),P(f,w)}),o&&!E&&y.push(f=>{var u;const S=_(n({},f,{defaultTheme:t,themeId:s})),w=S==null||(u=S.components)==null||(u=u[o])==null?void 0:u.variants;return x({variants:w},n({},f,{theme:S}))}),N||y.push(h);const b=y.length-a.length;if(Array.isArray(r)&&b>0){const f=new Array(b).fill("");O=[...r,...f],O.raw=[...r.raw,...f]}const j=R(O,...y);return c.muiName&&(j.muiName=c.muiName),j};return R.withConfig&&(C.withConfig=R.withConfig),C}}export{g as c,A as s};