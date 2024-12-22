import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import EditClinicPresentation from "./EditClinic";
import { NewClinic, InternalFormData } from "../ClinicsInterfaces";
import { useClinicApi } from "../useClinicsApi";
import { useLocation, useNavigate } from "react-router-dom";
import sweetAlertInstance from "../../../helper/SweetAlert";



const EditClinicContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { editClinic } = useClinicApi();
  const [clinic, setClinic] = useState<NewClinic>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { control, register, handleSubmit, reset } = useForm<InternalFormData>({
    defaultValues: {
      clinicName: "",
      service: [{ name: "", price: "", isNew: true }]
    },
  });

  useEffect(() => {
    const clinicData = location.state?.clinic as NewClinic;
    if (clinicData) {
      setClinic(clinicData);

      // Map the clinic data to the form format
      const formattedServices = clinicData.service.map((service) => ({
        name: service.name,
        price: service.price,
        isNew: false // Existing services are not new
      }));

      // Reset form with existing clinic data
      reset({
        clinicName: clinicData.name,
        service: formattedServices.length > 0 ? formattedServices : [{ name: "", price: "", isNew: true }]
      });
    }
  }, [location.state, reset]);

  const onSubmit: SubmitHandler<InternalFormData> = async (data) => {
    try {
      setLoading(true);
      if (!clinic?.id) {
        throw new Error("Clinic ID not found");
      }

      // Format service data - include both existing and new services
      const servicesString = data.service
        .filter(service => service.name && service.price && service.isNew === true) // Remove empty services
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