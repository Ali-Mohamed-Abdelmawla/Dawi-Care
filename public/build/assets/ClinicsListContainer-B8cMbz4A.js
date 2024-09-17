import{j as D,d as m,r}from"./index-DF1D02Hj.js";import{S as u,a as d,b as B,c as v,d as h,e as y,f as L}from"./StyledClinicsComponents-B05oX19X.js";import{u as b}from"./Paper-C9iPag-B.js";import{I as f}from"./InputAdornment-DbWrX7NJ.js";import{G as p}from"./TextField-BCa7AWxh.js";import{T as x}from"./Typography-D94uCwLm.js";import{u as U}from"./useDoctorApi-BGMsDjy1.js";import"./createSvgIcon-QGnDfLuw.js";import"./isMuiElement-DtCTRzqF.js";import"./mergeSlotProps-BtuCJPHe.js";import"./OutlinedInput-BKrgIPXM.js";import"./CardContent-Be-YTDra.js";import"./Menu-C7haSOWu.js";import"./useSlotProps-C21nwL-b.js";import"./TableCell-CbZ5-y0A.js";import"./axios-CyFV80k_.js";const S=({clinics:o,doctors:i,searchTerm:a,setSearchTerm:c,onClinicClick:l})=>{const n=b(),C=i.filter(e=>e.name.toLowerCase().includes(a.toLowerCase())),A=o.filter(e=>e.label.toLowerCase().includes(a.toLowerCase())||C.some(t=>t.specialty===e.value));return D.jsxs(D.Fragment,{children:[D.jsx(u,{fullWidth:!0,variant:"outlined",placeholder:"ابحث عن طبيب أو عيادة...",value:a,onChange:e=>c(e.target.value),margin:"normal",InputProps:{startAdornment:D.jsx(f,{position:"start",children:D.jsx(d,{})})}}),D.jsx(p,{container:!0,spacing:3,justifyContent:"center",children:A.map(e=>D.jsx(p,{item:!0,xs:12,sm:6,md:4,lg:3,children:D.jsx(B,{onClick:()=>l(e,a),theme:n,children:D.jsxs(v,{children:[D.jsx(h,{children:D.jsx(y,{src:e.imageUrl,alt:e.label,loading:"lazy",onError:t=>{console.error(`Failed to load image for clinic: ${e.value}`),console.log("Image src:",t.target.src)}})}),D.jsx(L,{children:D.jsx(x,{variant:"h6",component:"div",align:"center",children:e.label})})]})})},e.value))})]})},j="/react-app/assets/%D8%A7%D9%84%D8%A7%D8%B3%D9%86%D8%A7%D9%86-CPqHyR7x.svg",F="/react-app/assets/%D8%A8%D8%A7%D8%B7%D9%86%D9%87-%D8%BA%D8%AF%D8%AF-%D8%B5%D9%85%D8%A7%D8%A1-%D9%88-%D9%83%D9%84%D9%8A-%D9%88-%D8%B3%D9%83%D8%B1-DnpzyUyX.svg",w="/react-app/assets/%D8%A8%D8%A7%D8%B7%D9%86%D9%87-%D8%A7%D9%84%D8%AC%D9%87%D8%A7%D8%B2-%D8%A7%D9%84%D9%87%D8%B6%D9%85%D9%8A-%D9%88-%D8%A7%D9%84%D9%83%D8%A8%D8%AF-BbH0vhOt.svg",H="/react-app/assets/%D8%A8%D8%A7%D8%B7%D9%86%D9%87-%D8%A7%D9%85%D8%B1%D8%A7%D8%B6-%D8%AF%D9%85-%D9%88-%D9%85%D9%86%D8%A7%D8%B9%D9%87-aOLtxg6b.svg",M="/react-app/assets/%D8%A7%D9%84%D9%82%D9%84%D8%A8-C-3G6Q9O.svg",Z="/react-app/assets/%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D9%84%D9%83-%D8%A7%D9%84%D8%A8%D9%88%D9%84%D9%8A%D9%87-fITqDnTg.svg",V="/react-app/assets/%D8%A7%D9%84%D8%B5%D8%AF%D8%B1-DdFXxXze.svg",T="/react-app/assets/%D8%A7%D9%84%D8%AC%D9%84%D8%AF%D9%8A%D9%87-GTxiRlb7.svg",I="/react-app/assets/%D8%A7%D9%84%D8%A7%D9%88%D8%B9%D9%8A%D9%87-%D8%A7%D9%84%D8%AF%D9%85%D9%88%D9%8A%D9%87-DAdKCWiP.svg",E="data:image/svg+xml,%3csvg%20width='50'%20height='62'%20viewBox='0%200%2050%2062'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M23.1999%2060H21.6999L19.9999%2050.8C19.8999%2050.3%2019.4999%2050%2018.9999%2050H12.9999C11.4999%2050%2010.1999%2048.9%209.99995%2047.3L8.99995%2040.8C8.89995%2040.3%208.49995%2040%207.99995%2040H2.89995C2.09995%2040%201.89995%2039.1%202.09995%2038.6L6.89995%2028.8C7.09995%2028.5%207.09995%2028.1%207.09995%2027.7L6.69995%2025C6.19995%2019%208.19995%2013%2012.1999%208.6C16.1999%204.4%2021.4999%202%2027.2999%202C38.6999%202%2047.9999%2011.6%2047.9999%2023.3C47.9999%2023.9%2048.3999%2024.3%2048.9999%2024.3C49.5999%2024.3%2049.9999%2023.9%2049.9999%2023.3C49.9999%2010.5%2039.7999%200%2027.2999%200C20.9999%200%2015.0999%202.6%2010.7999%207.3C6.39995%2012.1%204.19995%2018.6%204.69995%2025.2L5.09995%2027.9L0.399949%2037.7C-0.200052%2038.7%20-5.17964e-05%2040%200.699948%2040.9C1.29995%2041.6%202.19995%2042%203.09995%2042H7.19995L8.09995%2047.6C8.49995%2050.1%2010.5999%2052%2013.0999%2052H18.2999L19.9999%2061.2C20.0999%2061.7%2020.4999%2062%2020.9999%2062H23.2999C23.8999%2062%2024.2999%2061.6%2024.2999%2061C24.2999%2060.4%2023.7999%2060%2023.1999%2060Z'%20fill='%231B4965'/%3e%3cpath%20d='M48.2%2031.9999C47.6%2031.8999%2047.2%2032.2999%2047.1%2032.8999L44.1%2059.9999H26.9C26.3%2059.9999%2025.9%2060.3999%2025.9%2060.9999C25.9%2061.5999%2026.3%2061.9999%2026.9%2061.9999H45C45.5%2061.9999%2045.9%2061.5999%2046%2061.0999L49.1%2033.0999C49.1%2032.5999%2048.8%2032.0999%2048.2%2031.9999Z'%20fill='%231B4965'/%3e%3cpath%20d='M48.9%2025.9001C48.3%2025.8001%2047.9%2026.2001%2047.8%2026.8001L47.6%2028.9001C47.5%2029.4001%2047.9%2029.9001%2048.5%2030.0001C48.5%2030.0001%2049.5%2030.0001%2049.6%2029.1001L49.8%2027.0001C49.8%2026.4001%2049.4%2025.9001%2048.9%2025.9001Z'%20fill='%231B4965'/%3e%3cpath%20d='M39.9%2012.2C40.1%2012.5%2040.6%2012.9001%2041.3%2012.5001C41.8%2012.2001%2041.9%2011.6001%2041.6%2011.1001C41.1%2010.3001%2040.4%209.60005%2039.5%208.80005C39.1%208.40005%2038.5%208.50005%2038.1%208.90005C37.7%209.30005%2037.8%2010.0001%2038.2%2010.3001C38.9%2011.0001%2039.5%2011.6%2039.9%2012.2Z'%20fill='%231B4965'/%3e%3cpath%20d='M21.7%206.9001C23.3%206.3001%2025.1%206.0001%2027.1%206.0001C29.6%206.0001%2032.1%206.6001%2034.5%207.8001C34.6%207.9001%2035.5%208.1001%2035.8%207.4001C36%206.9001%2035.8001%206.3001%2035.4001%206.1001C32.7001%204.8001%2030%204.1001%2027.2%204.1001C24.9%204.1001%2022.9%204.5001%2021%205.2001C20.5%205.4001%2020.2%206.0001%2020.4%206.5001C20.6%206.9001%2021.1%207.1001%2021.7%206.9001Z'%20fill='%231B4965'/%3e%3cpath%20d='M38%2031V29.2C38%2028.2%2038.6%2027.3%2039.5%2026.9C41.1%2026.1%2042%2024.5%2042%2022.8V21C42%2018.2%2039.8%2016%2037%2016C34.2%2016%2032%2018.2%2032%2021V23C32%2023.6%2032.4%2024%2033%2024C33.6%2024%2034%2023.6%2034%2023V21C34%2019.3%2035.3%2018%2037%2018C38.7%2018%2040%2019.3%2040%2021V22.8C40%2023.8%2039.4%2024.7%2038.6%2025.1C37%2025.9%2036%2027.5%2036%2029.2V31C36%2031.6%2035.6%2032%2035%2032C34.4%2032%2034%2031.6%2034%2031V29C34%2028.4%2033.6%2028%2033%2028C32.4%2028%2032%2028.4%2032%2029V31C32%2032.7%2033.3%2034%2035%2034C36.7%2034%2038%2032.7%2038%2031Z'%20fill='%231B4965'/%3e%3cpath%20d='M28%2057.2C28.1%2057.7%2028.7%2058.1%2029.2%2058C29.7%2057.9%2030.1%2057.4%2030%2056.8L29%2051C28.3%2046.9%2024.9%2044%2020.7%2044H13C12.4%2044%2012%2044.4%2012%2045C12%2045.6%2012.4%2046%2013%2046H20.8C23.9%2046%2026.6%2048.2%2027.1%2051.3L28%2057.2Z'%20fill='%231B4965'/%3e%3cpath%20d='M9.2%2029.9999C8.7%2029.8999%208.1%2030.1999%208%2030.6999C7.9%2031.1999%208.19999%2031.7999%208.69999%2031.8999L16.7%2033.8999C16.8%2033.8999%2017.3%2033.9999%2017.6%2033.5999L22.8%2028.3999C24.4%2026.7999%2026.6%2025.8999%2028.9%2025.8999C29.5%2025.8999%2029.9%2025.4999%2029.9%2024.8999C29.9%2024.2999%2029.5%2023.8999%2028.9%2023.8999C26.1%2023.8999%2023.3%2024.9999%2021.4%2026.9999L16.6%2031.7999L9.2%2029.9999Z'%20fill='%231B4965'/%3e%3cpath%20d='M27%2038.5001C30.4%2040.7001%2032.6%2044.2001%2033.1%2048.3001L34.1%2057.2001C34.2%2057.7001%2034.7%2058.1001%2035.2%2058.1001C35.7%2058.0001%2036.1%2057.5001%2036.1%2057.0001L35%2048.0001C34.5%2043.4001%2031.9%2039.3001%2028%2036.8001C27.5%2036.5001%2026.9%2036.6001%2026.6%2037.1001C26.4%2037.5001%2026.5%2038.2001%2027%2038.5001Z'%20fill='%231B4965'/%3e%3cpath%20d='M29%2030C29.6%2030%2030%2029.6%2030%2029C30%2028.4%2029.6%2028%2029%2028C27.5%2028%2026%2028.6%2024.9%2029.7L20.3%2034.3C20.1%2034.5%2019.6%2035.5%2020.7%2036L24%2037C24.1%2037%2025%2037.2%2025.3%2036.4C25.5%2035.9%2025.2%2035.3%2024.7%2035.1L23%2034.5L26.4001%2031.1C27.0001%2030.4%2028%2030%2029%2030Z'%20fill='%231B4965'/%3e%3c/svg%3e",G="/react-app/assets/%D8%A7%D9%84%D8%B1%D9%85%D8%AF-Bsk28d2L.svg",k="/react-app/assets/%D8%A7%D9%84%D9%86%D8%B3%D8%A7%D8%A1-%D9%88-%D8%A7%D9%84%D8%AA%D9%88%D9%84%D9%8A%D8%AF-DBSZnyZN.svg",z="/react-app/assets/%D8%A7%D9%84%D9%85%D8%AE-%D9%88-%D8%A7%D9%84%D8%A7%D8%B9%D8%B5%D8%A7%D8%A8-DGL4ELbh.svg",P="/react-app/assets/%D8%A7%D9%84%D8%A7%D8%B7%D9%81%D8%A7%D9%84-CwupBb5a.svg",X="/react-app/assets/%D8%A7%D9%84%D8%AA%D8%AC%D9%85%D9%8A%D9%84-B2jiAj5F.svg",N="/react-app/assets/%D8%B1%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D8%B2%D9%85-CLY-m4Yu.svg",R="/react-app/assets/%D8%B9%D8%B8%D8%A7%D9%85-%D9%88-%D9%83%D8%B3%D9%88%D8%B1-%D9%88-%D8%A7%D8%B5%D8%A7%D8%A8%D8%A7%D8%AA-%D9%85%D9%84%D8%A7%D8%B9%D8%A8-DoTRCpmZ.svg",O="/react-app/assets/%D8%B9%D8%B8%D8%A7%D9%85-%D9%88-%D8%B9%D9%85%D9%88%D8%AF-%D9%81%D9%82%D8%B1%D9%89-CcervTNo.svg",W="/react-app/assets/%D8%A7%D9%85%D8%B1%D8%A7%D8%B6-%D8%A7%D9%84%D8%B9%D8%B8%D8%A7%D9%85-%D9%88-%D8%A7%D9%84%D9%85%D9%81%D8%A7%D8%B5%D9%84-CVd5p-hV.svg",q="/react-app/assets/%D8%AC%D8%B1%D8%A7%D8%AD%D9%87-%D8%A7%D9%84%D8%A7%D8%B7%D9%81%D8%A7%D9%84-D_Lk0PzL.svg",Q="/react-app/assets/%D8%AC%D8%B1%D8%A7%D8%AD%D9%87-%D8%A7%D9%84%D9%8A%D8%AF-tyDT6_hu.svg",Y="/react-app/assets/%D8%AC%D8%B1%D8%A7%D8%AD%D9%87-%D8%B9%D8%A7%D9%85%D9%87-DCxwpzsF.svg",_="/react-app/assets/%D8%B3%D9%88%D9%86%D8%A7%D8%B1-Cy1X4XV3.svg",J="/react-app/assets/%D8%AA%D8%BA%D8%B0%D9%8A%D9%87-iVfaMuQs.svg",K=[{value:"الاسنان",label:"الاسنان",imageUrl:j},{value:"باطنه غدد صماء و كلي و سكر",label:"باطنه غدد صماء و كلي و سكر",imageUrl:F},{value:"باطنه الجهاز الهضمي و الكبد",label:"باطنه الجهاز الهضمي و الكبد",imageUrl:w},{value:"باطنه امراض دم و مناعه",label:"باطنه امراض دم و مناعه",imageUrl:H},{value:"القلب",label:"القلب",imageUrl:M},{value:"المسالك البوليه",label:"المسالك البوليه",imageUrl:Z},{value:"الصدر",label:"الصدر",imageUrl:V},{value:"الجلديه",label:"الجلديه",imageUrl:T},{value:"اوعيه دمويه",label:"اوعيه دمويه",imageUrl:I},{value:"انف و اذن",label:"انف و اذن",imageUrl:E},{value:"الرمد",label:"الرمد",imageUrl:G},{value:"النساء و التوليد",label:"النساء و التوليد",imageUrl:k},{value:"المخ و الاعصاب",label:"المخ و الاعصاب",imageUrl:z},{value:"الاطفال",label:"الاطفال",imageUrl:P},{value:"التجميل",label:"التجميل",imageUrl:X},{value:"روماتيزم",label:"روماتيزم",imageUrl:N},{value:"عظام و كسور و اصابات ملاعب",label:"عظام و كسور و اصابات ملاعب",imageUrl:R},{value:"عظام و عمود فقرى",label:"عظام و عمود فقرى",imageUrl:O},{value:"امراض العظام و المفاصل",label:"امراض العظام و المفاصل",imageUrl:W},{value:"جراحه الاطفال",label:"جراحه الاطفال",imageUrl:q},{value:"جراحه اليد",label:"جراحه اليد",imageUrl:Q},{value:"جراحه عامه",label:"جراحه عامه",imageUrl:Y},{value:"سونار",label:"سونار",imageUrl:_},{value:"تغذيه",label:"تغذيه",imageUrl:J}],m2=()=>{const o=m(),{getAllDoctors:i}=U(),[a,c]=r.useState([]),[l,n]=r.useState([]),[C,A]=r.useState("");r.useEffect(()=>{e(),c(K)},[]);const e=async()=>{try{const s=await i();n(s)}catch(s){console.error("Error fetching doctors:",s)}},t=(s,g)=>{console.log("تم النقر على العيادة:",s),o("/SystemAdmin/Clinics/ClinicDoctors",{state:{clinic:s,doctors:l,searchedTerm:g}})};return D.jsx(S,{clinics:a,doctors:l,searchTerm:C,setSearchTerm:A,onClinicClick:t})};export{m2 as default};
