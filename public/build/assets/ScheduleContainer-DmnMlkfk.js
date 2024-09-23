import{r as m,j as e}from"./index-DF1D02Hj.js";import{s as d}from"./styled-CPBbA9UG.js";import{T as g}from"./TableCell-CbZ5-y0A.js";import{C as j}from"./Chip-BCCKjiS7.js";import{u as T,P as k}from"./Paper-C9iPag-B.js";import{T as C,a as w,b as A,c as h,d as S}from"./TableRow-Ce_QXQAA.js";import{T as u}from"./Typography-D94uCwLm.js";import{B as v}from"./Box-D4cKv5_V.js";import{s as E}from"./doctorUtils-DbQ9xYY5.js";import{a as R}from"./axios-CyFV80k_.js";import"./createStyled-93osxTnM.js";const b=d(g)(({theme:t})=>({backgroundColor:t.palette.primary.main,color:t.palette.common.white,border:"1px solid #00000024",fontWeight:"bold"})),f=d(g)(({theme:t})=>({border:"1px solid #00000020",backgroundColor:t.palette.schedeuleTableCell.main})),$=d(j)(({theme:t})=>({backgroundColor:t.palette.secondary.main,color:t.palette.common.white,borderColor:t.palette.secondary.dark,borderRadius:"5px",fontWeight:"bold",margin:"5px 0px"})),x=["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],B=({specialtyOptions:t,appointments:i})=>{const o=T();return m.useEffect(()=>{console.log(o)},[o]),e.jsx(C,{component:k,sx:{maxHeight:"88vh","&::-webkit-scrollbar":{width:"10px",height:"10px"},"&::-webkit-scrollbar-track":{background:"#f1f1f1"},"&::-webkit-scrollbar-thumb":{background:o.palette.primary.light,borderTopRightRadius:"4px",borderBottomRightRadius:"4px","&:hover":{background:"#555"}},"&::-webkit-scrollbar-corner":{background:"#f1f1f1"}},children:e.jsxs(w,{stickyHeader:!0,sx:{minWidth:650},"aria-label":"جدول المواعيد",children:[e.jsx(A,{children:e.jsxs(h,{children:[e.jsx(b,{align:"left",theme:o,children:"التخصص"}),x.map(s=>e.jsx(b,{align:"left",theme:o,children:s},s))]})}),e.jsx(S,{children:t.map(s=>e.jsxs(h,{children:[e.jsx(f,{component:"th",scope:"row",align:"left",sx:{backgroundColor:o.palette.primary.main,color:o.palette.common.white,border:"1px solid #00000024",minwidth:163},theme:o,children:e.jsx(u,{variant:"subtitle1",fontWeight:"bold",children:s.label})}),x.map(p=>{var n,l;return e.jsx(f,{align:"left",theme:o,children:e.jsx(v,{display:"flex",flexWrap:"wrap",justifyContent:"flex-start",flexDirection:"column",children:(l=(n=i[s.value])==null?void 0:n[p])!=null&&l.length?i[s.value][p].map((r,a)=>e.jsx($,{label:`د/ ${r.doctorName} ${r.time}`,color:"primary",variant:"outlined",theme:o},a)):e.jsx(u,{variant:"caption",color:"textSecondary",children:"لا توجد مواعيد"})})},p)})]},s.value))})]})})},H=()=>{const[t,i]=m.useState({}),o=sessionStorage.getItem("accessToken"),s=n=>{const[l,r]=n.split(":").slice(0,2).map(Number),a=l>=12?"م":"ص",c=l%12||12,y=r.toString().padStart(2,"0");return`${c}:${y} ${a}`};return{appointments:t,getAllAppointments:async()=>{try{const l=(await R.get("/api/All_doctors",{headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"}})).data,r={};l.forEach(a=>{r[a.specialty]||(r[a.specialty]={}),a.week_days.forEach(c=>{r[a.specialty][c.day]||(r[a.specialty][c.day]=[]),r[a.specialty][c.day].push({doctorName:a.name,time:s(c.date)})})}),i(r)}catch(n){console.error("Error fetching appointments:",n)}}}},J=()=>{const{appointments:t,getAllAppointments:i}=H();return m.useEffect(()=>{i()},[]),e.jsx(B,{specialtyOptions:E,appointments:t})};export{J as default};