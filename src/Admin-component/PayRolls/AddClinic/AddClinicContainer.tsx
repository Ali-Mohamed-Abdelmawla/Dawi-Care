import {useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import AddClinicPresentation from "./AddClinic";
import { AddClinicFormData } from "../ClinicsInterfaces";
import { useClinicApi } from "../useClinicsApi";

const AddClinicContainer: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { addClinic } = useClinicApi();

  const { control, register, handleSubmit } = useForm<AddClinicFormData>({
    defaultValues: {
      clinicName: "",
      service: [{ name: "", cost: "" }],
    },
  });

  const onSubmit: SubmitHandler<AddClinicFormData> = async (data) => {
    console.log(data);
    setLoading(true);
    const servicesString = data.service
      .map((service) => `${service.name},${service.cost}`)
      .join(",");

    addClinic(data.clinicName, servicesString)
  };

  return (
    <AddClinicPresentation
      loading={loading}
      control={control}
      register={register}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default AddClinicContainer;
