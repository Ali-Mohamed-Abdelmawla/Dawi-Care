import{_ as e,f as $,r as T,u as R,b as I,j as m}from"./index-DF1D02Hj.js";import{s as L,c as A,a as D,T as x}from"./Typography-D94uCwLm.js";import{a as w,l as C,b as N}from"./MenuItem-BDtCcL-v.js";import{L as W}from"./Menu-C7haSOWu.js";const j=["absolute","children","className","component","flexItem","light","orientation","role","textAlign","variant"],P=i=>{const{absolute:t,children:r,classes:o,flexItem:d,light:s,orientation:a,textAlign:l,variant:p}=i;return D({root:["root",t&&"absolute",p,s&&"light",a==="vertical"&&"vertical",d&&"flexItem",r&&"withChildren",r&&a==="vertical"&&"withChildrenVertical",l==="right"&&a!=="vertical"&&"textAlignRight",l==="left"&&a!=="vertical"&&"textAlignLeft"],wrapper:["wrapper",a==="vertical"&&"wrapperVertical"]},w,o)},B=L("div",{name:"MuiDivider",slot:"Root",overridesResolver:(i,t)=>{const{ownerState:r}=i;return[t.root,r.absolute&&t.absolute,t[r.variant],r.light&&t.light,r.orientation==="vertical"&&t.vertical,r.flexItem&&t.flexItem,r.children&&t.withChildren,r.children&&r.orientation==="vertical"&&t.withChildrenVertical,r.textAlign==="right"&&r.orientation!=="vertical"&&t.textAlignRight,r.textAlign==="left"&&r.orientation!=="vertical"&&t.textAlignLeft]}})(({theme:i,ownerState:t})=>e({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(i.vars||i).palette.divider,borderBottomWidth:"thin"},t.absolute&&{position:"absolute",bottom:0,left:0,width:"100%"},t.light&&{borderColor:i.vars?`rgba(${i.vars.palette.dividerChannel} / 0.08)`:$(i.palette.divider,.08)},t.variant==="inset"&&{marginLeft:72},t.variant==="middle"&&t.orientation==="horizontal"&&{marginLeft:i.spacing(2),marginRight:i.spacing(2)},t.variant==="middle"&&t.orientation==="vertical"&&{marginTop:i.spacing(1),marginBottom:i.spacing(1)},t.orientation==="vertical"&&{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"},t.flexItem&&{alignSelf:"stretch",height:"auto"}),({ownerState:i})=>e({},i.children&&{display:"flex",whiteSpace:"nowrap",textAlign:"center",border:0,"&::before, &::after":{content:'""',alignSelf:"center"}}),({theme:i,ownerState:t})=>e({},t.children&&t.orientation!=="vertical"&&{"&::before, &::after":{width:"100%",borderTop:`thin solid ${(i.vars||i).palette.divider}`}}),({theme:i,ownerState:t})=>e({},t.children&&t.orientation==="vertical"&&{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:`thin solid ${(i.vars||i).palette.divider}`}}),({ownerState:i})=>e({},i.textAlign==="right"&&i.orientation!=="vertical"&&{"&::before":{width:"90%"},"&::after":{width:"10%"}},i.textAlign==="left"&&i.orientation!=="vertical"&&{"&::before":{width:"10%"},"&::after":{width:"90%"}})),_=L("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(i,t)=>{const{ownerState:r}=i;return[t.wrapper,r.orientation==="vertical"&&t.wrapperVertical]}})(({theme:i,ownerState:t})=>e({display:"inline-block",paddingLeft:`calc(${i.spacing(1)} * 1.2)`,paddingRight:`calc(${i.spacing(1)} * 1.2)`},t.orientation==="vertical"&&{paddingTop:`calc(${i.spacing(1)} * 1.2)`,paddingBottom:`calc(${i.spacing(1)} * 1.2)`})),k=T.forwardRef(function(t,r){const o=R({props:t,name:"MuiDivider"}),{absolute:d=!1,children:s,className:a,component:l=s?"div":"hr",flexItem:p=!1,light:g=!1,orientation:u="horizontal",role:v=l!=="hr"?"separator":void 0,textAlign:y="center",variant:f="fullWidth"}=o,c=I(o,j),n=e({},o,{absolute:d,component:l,flexItem:p,light:g,orientation:u,role:v,textAlign:y,variant:f}),h=P(n);return m.jsx(B,e({as:l,className:A(h.root,a),role:v,ref:r,ownerState:n},c,{children:s?m.jsx(_,{className:h.wrapper,ownerState:n,children:s}):null}))});k.muiSkipListHighlight=!0;const M=["children","className","disableTypography","inset","primary","primaryTypographyProps","secondary","secondaryTypographyProps"],U=i=>{const{classes:t,inset:r,primary:o,secondary:d,dense:s}=i;return D({root:["root",r&&"inset",s&&"dense",o&&d&&"multiline"],primary:["primary"],secondary:["secondary"]},N,t)},V=L("div",{name:"MuiListItemText",slot:"Root",overridesResolver:(i,t)=>{const{ownerState:r}=i;return[{[`& .${C.primary}`]:t.primary},{[`& .${C.secondary}`]:t.secondary},t.root,r.inset&&t.inset,r.primary&&r.secondary&&t.multiline,r.dense&&t.dense]}})(({ownerState:i})=>e({flex:"1 1 auto",minWidth:0,marginTop:4,marginBottom:4},i.primary&&i.secondary&&{marginTop:6,marginBottom:6},i.inset&&{paddingLeft:56})),F=T.forwardRef(function(t,r){const o=R({props:t,name:"MuiListItemText"}),{children:d,className:s,disableTypography:a=!1,inset:l=!1,primary:p,primaryTypographyProps:g,secondary:u,secondaryTypographyProps:v}=o,y=I(o,M),{dense:f}=T.useContext(W);let c=p??d,n=u;const h=e({},o,{disableTypography:a,inset:l,primary:!!c,secondary:!!n,dense:f}),b=U(h);return c!=null&&c.type!==x&&!a&&(c=m.jsx(x,e({variant:f?"body2":"body1",className:b.primary,component:g!=null&&g.variant?void 0:"span",display:"block"},g,{children:c}))),n!=null&&n.type!==x&&!a&&(n=m.jsx(x,e({variant:"body2",className:b.secondary,color:"text.secondary",display:"block"},v,{children:n}))),m.jsxs(V,e({className:A(b.root,s),ownerState:h,ref:r},y,{children:[c,n]}))});export{k as D,F as L};