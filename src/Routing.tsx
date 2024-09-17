import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";

// import LoginContainer from "./Login-component/LoginContainer.tsx";
const LoginContainer = lazy(
  () => import("./Login-component/LoginContainer.tsx")
);
// import SystemAdmin from "./Admin-component/index.tsx";
const SystemAdmin = lazy(() => import("./Admin-component/index.tsx"));

import sweetAlertInstance from "./helper/SweetAlert.tsx";

// import Statistics from "./Admin-component/MainPage/StatisticsPage.tsx";
const Statistics = lazy(
  () => import("./Admin-component/MainPage/Statistics-Container.tsx")
);

// import EmployeesContainer from "./Admin-component/Employees/EmployeesContainer.tsx";
const EmployeesContainer = lazy(
  () => import("./Admin-component/Employees/EmployeesContainer.tsx")
);

// import AddEmployee from "./Admin-component/Employees/AddEmployeeComponent/AddEmployee.tsx";
const AddEmployee = lazy(
  () =>
    import("./Admin-component/Employees/AddEmployeeComponent/AddEmployee.tsx")
);

// import EditEmployeeContainer from "./Admin-component/Employees/Edit-Employee/EditEmployeeContainer.tsx";
const EditEmployeeContainer = lazy(
  () =>
    import(
      "./Admin-component/Employees/Edit-Employee/EditEmployeeContainer.tsx"
    )
);

// import DoctorsContainer from "./Admin-component/Doctors/DoctorsContainer.tsx";
const DoctorsContainer = lazy(
  () => import("./Admin-component/Doctors/DoctorsContainer.tsx")
);

// import AddDoctor from "./Admin-component/Doctors/AddDoctorComponent/AddDoctor.tsx";
const AddDoctor = lazy(
  () => import("./Admin-component/Doctors/AddDoctorComponent/AddDoctor.tsx")
);

// import EditDoctorContainer from "./Admin-component/Doctors/Edit-Doctor/EditDoctorContainer.tsx";
const EditDoctorContainer = lazy(
  () => import("./Admin-component/Doctors/Edit-Doctor/EditDoctorContainer.tsx")
);

// import Schedule from "./Admin-component/Schedeule/ScheduleContainer";
const Schedule = lazy(
  () => import("./Admin-component/Schedeule/ScheduleContainer")
);

// import UsersContainer from "./Admin-component/Users/UserContainer.tsx";
const UsersContainer = lazy(
  () => import("./Admin-component/Users/UserContainer.tsx")
);

// import AddUser from "./Admin-component/Users/AddUserComponent/AddUser.tsx";
const AddUser = lazy(
  () => import("./Admin-component/Users/AddUserComponent/AddUser.tsx")
);

// import { ClinicsListContainer } from "./Admin-component/Accounts/ClinicsListContainer.tsx";
const ClinicsListContainer = lazy(
  () => import("./Admin-component/Clinics/ClinicsListContainer.tsx")
);

// import { ClinicDetailsContainer } from "./Admin-component/Accounts/ClinicDetailsContainer.tsx";
const ClinicDetailsContainer = lazy(
  () =>
    import("./Admin-component/Clinics/clinicDoctors/ClinicDetailsContainer.tsx")
);

// import AbsenceContainer from "./Admin-component/AbsenceSubmission/absenceContainer.tsx";
const AbsenceContainer = lazy(
  () => import("./Admin-component/AbsenceSubmission/absenceContainer.tsx")
);

import Loader from "./helper/loading-component/loader.tsx";
import NotFound from "./helper/notFound-component/Not-Found.tsx";

const IsAuthenticated = () => {
  const token = sessionStorage.getItem("accessToken");
  return token !== null;
};

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = IsAuthenticated();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    sweetAlertInstance
      .fire({
        icon: "error",
        title: "تسجيل الدخول مطلوب",
        text: "عذراً، يجب عليك تسجيل الدخول.",
      })
      .then(() => {
        console.log("redirect to login");
        navigate("/");
      });

    return null;
  }
  return <>{element}</>;
};

// ========================= LazyLoad helper ==================================
interface LazyLoadRouteProps {
  component: React.ComponentType;
}
const LazyLoadRoute: React.FC<LazyLoadRouteProps> = ({
  component: Component,
  ...props
}) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

const LazyLoadProtectedRoute: React.FC<LazyLoadRouteProps> = ({
  component: Component,
  ...props
}) => (
  <Suspense fallback={<Loader />}>
    <ProtectedRoute element={<Component {...props} />} />
  </Suspense>
);

// ========================= Routes =========================

function App() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <LazyLoadRoute component={LoginContainer} />,
      },
      {
        path: "/SystemAdmin",
        element: <LazyLoadProtectedRoute component={SystemAdmin} />,
        children: [
          {
            path: "",
            element: <LazyLoadRoute component={Statistics} />,
          },
          // ======================================================================
          {
            path: "Employees",
            element: <LazyLoadRoute component={EmployeesContainer} />,
          },
          {
            path: "AddEmployee",
            element: <LazyLoadRoute component={AddEmployee} />,
          },
          {
            path: "Employees/EditEmployee",
            element: <LazyLoadRoute component={EditEmployeeContainer} />,
          },
          // ======================================================================
          {
            path: "Schedule",
            element: <Schedule />,
          },
          // ======================================================================
          {
            path: "Clinics",
            element: <ClinicsListContainer />,
          },
          {
            path: "Clinics/ClinicDoctors",
            element: <ClinicDetailsContainer />,
          },
          // ======================================================================
          {
            path: "Doctors",
            element: <DoctorsContainer />,
          },
          {
            path: "AddDoctor",
            element: <AddDoctor />,
          },
          {
            path: "Doctors/EditDoctor",
            element: <EditDoctorContainer />,
          },
          // ======================================================================
          {
            path: "Users",
            element: <UsersContainer />,
          },
          {
            path: "AddUser",
            element: <AddUser />,
          },
          // {
          //   path: "/SystemAdmin/EditUser",
          //   element: <EditDoctorContainer />,
          // },

          // ======================================================================
          {
            path: "AddAbsence",
            element: <AbsenceContainer />,
          },
        ],
      },
      {
        path: "*",
        element: <LazyLoadRoute component={NotFound} />,
      },
    ],
    {
      basename: "/react-app/",
    }
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
