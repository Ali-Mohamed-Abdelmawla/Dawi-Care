import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  SystemAdmin: "لوحة التحكم",
  Users: "المستخدمون",
  Doctors: "الأطباء",
  Employees: "الموظفون",
  DoctorsPayroll: "رواتب الأطباء",
  EmployeesDeduction: "خصومات الموظفين",
  AddUser: "إضافة مستخدم",
  AddDoctor: "إضافة طبيب",
  AddEmployee: "إضافة موظف",
  AddAbsence: "تسجيل الغياب",
  Schedule: "جدول المواعيد",
  EditEmployee: "تعديل الموظف",
  EditDoctor: "تعديل الطبيب",
  ClinicDoctors: "عيادات الاطباء",
  AddClinic: "إضافة عيادة",
  EditClinic: "تعديل العيادة",
  DoctorSalaryCalculator: "حساب راتب الطبيب",
  EmployeeSalaryCalculator: "تسجيل خصم للموظف"
};

const BreadcrumbsComponent = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{ mb: 2}}
      separator="/"
    >
      <Link component={RouterLink} to="/SystemAdmin">
        {breadcrumbNameMap["SystemAdmin"]}
      </Link>
      {pathnames.slice(1).map((value, index) => {
        const last = index === pathnames.length - 2;
        const to = `/${pathnames.slice(0, index + 2).join("/")}`;

        return last ? (
          <Typography color="text.primary" key={to}>
            {breadcrumbNameMap[value as keyof typeof breadcrumbNameMap] ||
              value}
          </Typography>
        ) : (
          <Link component={RouterLink} to={to} key={to}>
            {breadcrumbNameMap[value as keyof typeof breadcrumbNameMap] ||
              value}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsComponent;
