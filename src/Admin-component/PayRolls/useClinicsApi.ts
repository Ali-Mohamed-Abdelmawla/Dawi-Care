// useClinicApi.ts

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../helper/auth/axios";
import sweetAlertInstance from "../../helper/SweetAlert";
import { NewClinic, Service } from "./ClinicsInterfaces";

export const useClinicApi = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  const addClinic = async (clinicName: string, servicesString: string) => {
    axiosInstance
      .post(
        "/api/add_clinic",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            name: clinicName,
            service: servicesString,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        sweetAlertInstance
          .fire({
            icon: "success",
            title: "تمت إضافة العيادة بنجاح",
            text: `تمت إضافة عيادة "${clinicName}" بنجاح`,
          })
          .then(() => {
            navigate("/SystemAdmin/DoctorsPayroll");
          });
      })
      .catch((error) => {
        console.log(error);
        sweetAlertInstance.fire({
          icon: "error",
          title: "خطأ",
          text: "حدث خطأ أثناء إضافة العيادة",
        });
      });
  };

  const getClinicList = async (): Promise<NewClinic[]> => {
    return await axiosInstance
      .get("/api/all_clinic", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };

  const deleteClinic = async (id: number) => {
    await axiosInstance
      .post(
        `/api/delete_clinic/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editClinic = async (
    id: number,
    name: string,
    servicesString: string
  ) => {
    await axiosInstance
      .post(
        `/api/edit_clinic/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            name: name,
            service: servicesString,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editService = async (
    id: number,
    clinicId: number,
    data: { name: string; price: number }
  ) => {
    await axiosInstance
      .post(
        `/api/edit_service/${id}/${clinicId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            name: data.name,
            price: data.price,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const servicesDoneByClinic = async (id: number) => {
    try {
      const response = await axiosInstance.get(`/api/doneServiceClinic/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching done services:", error);
      return [];
    }
  };
  const addDoctorSalary = async (
    selectedAttendanceId: number,
    totalAmount: number,
    doctorId: number,
    services: Service[]
  ) => {
    try {
      // First API call to add salary
      const salaryResponse = await axiosInstance.post(
        `/api/add_salary/${selectedAttendanceId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            services: totalAmount,
          },
        }
      );

      // Format services data for the second API call
      const servicesQueryString = services
        .filter((service) => service.quantity && service.quantity > 0)
        .map(
          (service) =>
            `${service.id},${service.quantity},${
              service.quantity * parseFloat(service.price)
            }`
        )
        .join(",");

      // Second API call to record services
      if (servicesQueryString) {
        const servicesResponse = await axiosInstance.post(
          `/api/done_service/${doctorId}/${selectedAttendanceId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              services: servicesQueryString,
            },
          }
        );

        return {
          status: "success",
          data: {
            salary: salaryResponse.data,
            services: servicesResponse.data,
          },
        };
      }

      return {
        status: "success",
        data: salaryResponse.data,
      };
    } catch (error) {
      return {
        status: "error",
        data: error,
      };
    }
  };

  const addEmployeeDeduction = async (
    employeeId: number,
    deduction: number,
    customDeduction: number,
    description: string,
    date: string | null
  ) => {
    try {
      const response = await axiosInstance.post(
        `/api/add_salary_employee/${employeeId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            deduction: deduction,
            customdeduction: customDeduction,
            description: description,
            created_at: date,
          },
        }
      );
      return {
        status: "success",
        data: response.data,
      };
    } catch (error) {
      console.log(error);
      return {
        status: "failed",
        data: error,
      };
    }
  };

  return {
    addClinic,
    getClinicList,
    deleteClinic,
    editClinic,
    editService,
    servicesDoneByClinic,
    addDoctorSalary,
    addEmployeeDeduction,
  };
};
