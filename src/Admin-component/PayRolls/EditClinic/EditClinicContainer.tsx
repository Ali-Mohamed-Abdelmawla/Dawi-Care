import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import EditClinicPresentation from "./EditClinic";
import { EditClinicFormData, NewClinic } from "../ClinicsInterfaces";
import { useClinicApi } from "../useClinicsApi";
import { useLocation, useNavigate } from "react-router-dom";
import sweetAlertInstance from "../../../helper/SweetAlert";

const EditClinicContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { editClinic } = useClinicApi();
  const [clinic, setClinic] = useState<NewClinic>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { control, register, handleSubmit, reset } = useForm<EditClinicFormData>({
    defaultValues: {
      clinicName: "",
      service: [{ name: "", price: "" }]
    },
  });

  useEffect(() => {
    const clinicData = location.state?.clinic as NewClinic;
    if (clinicData) {
      setClinic(clinicData);

      // Map the clinic data to the form format
      const formattedServices = clinicData.service.map((service) => ({
        name: service.name,
        price: service.price // Note: Converting from price to price
      }));

      // Reset form with existing clinic data
      reset({
        clinicName: clinicData.name,
        service: formattedServices.length > 0 ? formattedServices : [{ name: "", price: "" }]
      });
    }
  }, [location.state, reset]);

  const onSubmit: SubmitHandler<EditClinicFormData> = async (data) => {
    try {
      // console.log("data: ", data);
      // console.log("clinic: ", clinic);
      setLoading(true);
      console.log("edited clinic: ",data);
      if (!clinic?.id) {
        throw new Error("Clinic ID not found");
      }

      // Format service data
      const servicesString = data.service
        .filter(service => service.name && service.price) // Remove empty service
        .map((service) => `${service.name},${service.price}`)
        .join(",");
      
      await editClinic(
        
        clinic.id,
          data.clinicName,
          servicesString,
        
      );

      sweetAlertInstance.fire({
        icon: 'success',
        title: 'تم التحديث بنجاح',
        text: 'تم تحديث بيانات العيادة بنجاح'
      });

      navigate('/SystemAdmin/DoctorsPayroll');
    } catch (error) {
      console.error('Error updating clinic:', error);
      sweetAlertInstance.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء تحديث بيانات العيادة'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditClinicPresentation
      loading={loading}
      control={control}
      register={register}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default EditClinicContainer;