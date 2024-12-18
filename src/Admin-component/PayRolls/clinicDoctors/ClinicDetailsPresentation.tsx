// ClinicDetailsPresentation.tsx
// import React from "react";
// import {
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   InputAdornment,
// } from "@mui/material";
// import { LocalHospital } from "@mui/icons-material";
// import { ClinicDetailsPresentationProps } from "../ClinicsInterfaces";
// import { useClinicStyles } from "../useClinicStyles";

// const getServiceIcon = () => {
//   return <LocalHospital sx={{ fontSize: 32 }} />;
// };

// export const ClinicDetailsPresentation: React.FC<
//   ClinicDetailsPresentationProps
// > = ({ clinic, doctors, onDoctorSelect, searchTerm, setSearchTerm, doneServices  }) => {
//   const {
//     ProfileHeroSection,
//     ServicesSection,
//     ServicesGrid,
//     ServiceCard,
//     ServiceCardContent,
//     ServiceIcon,
//     ServicePrice,
//     CreatedAtText,
//     StyledTablePaper,
//     StyledTableCell,
//     StyledTextField,
//     StyledSearchIcon,
//   } = useClinicStyles();

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("ar-EG", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <>
//       <ProfileHeroSection>
//         <Typography variant="h3" gutterBottom>
//           {clinic.name}
//         </Typography>
//         <CreatedAtText>
//           تم الإنشاء في {formatDate(clinic.created_at)}
//         </CreatedAtText>
//       </ProfileHeroSection>

//       <ServicesSection>
//         <Typography variant="h5" gutterBottom>
//           الخدمات المتوفرة
//         </Typography>
//         <ServicesGrid>
//           {clinic.service?.map((service) => (
//                     console.log(clinic.service),

//             <ServiceCard key={service.name}>
//               <ServiceCardContent>
//                 <ServiceIcon>{getServiceIcon()}</ServiceIcon>
//                 <Typography variant="h6">{service.name}</Typography>
//                 <ServicePrice>{service.price} جنيه</ServicePrice>
//               </ServiceCardContent>
//             </ServiceCard>
//           ))}
//         </ServicesGrid>
//       </ServicesSection>

//       <StyledTablePaper elevation={3}>
//         <Typography variant="h5" gutterBottom>
//           الأطباء
//         </Typography>

//         <StyledTextField
//           autoFocus
//           fullWidth
//           variant="outlined"
//           placeholder="ابحث عن طبيب..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           margin="normal"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <StyledSearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />

//         {doctors.length > 0 && (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <StyledTableCell>اسم الطبيب</StyledTableCell>
//                   <StyledTableCell align="left">الراتب الأساسي</StyledTableCell>
//                   <StyledTableCell align="left">نسبة الطبيب</StyledTableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {doctors.map((doctor) => (
//                   <TableRow
//                     hover
//                     key={doctor.id}
//                     onClick={() => onDoctorSelect(doctor)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <TableCell>{doctor.name}</TableCell>
//                     <TableCell align="left">{doctor.fixed_salary}</TableCell>
//                     <TableCell align="left">{doctor.doctor_share}%</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//         {searchTerm && doctors.length === 0 && (
//           <Typography variant="h6" gutterBottom>
//             عذرا، "{searchTerm}" غير مسجل كطبيب في هذه العيادة. يمكنك تصفح جميع
//             الأطباء أو تجربة مصطلح بحث آخر.
//           </Typography>
//         )}
//         {!searchTerm && doctors.length === 0 && (
//           <Typography variant="h6" gutterBottom>
//             لم يتم تعيين أي أطباء في هذه العيادة بعد.{" "}
//           </Typography>
//         )}
//       </StyledTablePaper>
//       <StyledTablePaper elevation={3}>
//         <Typography variant="h5" gutterBottom>
//           الخدمات المنجزة
//         </Typography>

//         {doneServices.length > 0 ? (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <StyledTableCell>تاريخ الخدمة</StyledTableCell>
//                   <StyledTableCell align="left">رقم الخدمة</StyledTableCell>
//                   <StyledTableCell align="left">العدد</StyledTableCell>
//                   <StyledTableCell align="left">التكلفة الإجمالية</StyledTableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {doneServices.map((service) => (
//                   <TableRow key={service.id}>
//                     <TableCell>{formatDate(service.created_at)}</TableCell>
//                     <TableCell align="left">{service.service_id}</TableCell>
//                     <TableCell align="left">{service.count}</TableCell>
//                     <TableCell align="left">{service.total_cost} جنيه</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         ) : (
//           <Typography variant="h6" gutterBottom>
//             لم يتم تنفيذ أي خدمات في هذه العيادة حتى الآن.
//           </Typography>
//         )}
//       </StyledTablePaper>
//     </>
//   );
// };

// export default ClinicDetailsPresentation;