import React, { useState } from "react";
import { Typography, TextField, IconButton, Button } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useClinicStyles } from "../useClinicStyles";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { NewClinic } from "../ClinicsInterfaces";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface ServiceFormData {
  name: string;
  price: string;
}

interface ClinicHeroSectionProps {
  clinic: NewClinic;
}

const ClinicHeroSection: React.FC<ClinicHeroSectionProps> = ({ clinic }) => {
  const {
    ProfileHeroSection,
    CreatedAtText,
    ServicesSection,
    ServicesGrid,
    ServiceCard,
    ServiceCardContent,
    ServiceIcon,
    ServicePrice,
  } = useClinicStyles();

  const [editingService, setEditingService] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>();

  const handleEditClick = (serviceId: number, service: ServiceFormData) => {
    setEditingService(serviceId);
    setValue("name", service.name);
    setValue("price", service.price);
  };

  const handleCancel = () => {
    setEditingService(null);
  };

  const onSubmit = (data: ServiceFormData) => {
    console.log("Edited Data:", {
      clinicId: clinic.id,
      serviceId: editingService,
      ...data,
    });
    setEditingService(null);
  };

  return (
    <>
      <ProfileHeroSection>
        <Typography variant="h3" gutterBottom sx={{ color: "white" }}>
          {clinic.name}
        </Typography>
        <CreatedAtText>
          تم الإنشاء في {formatDate(clinic.created_at)}
        </CreatedAtText>
      </ProfileHeroSection>

      <ServicesSection>
        <Typography variant="h5" gutterBottom>
          الخدمات المتوفرة
        </Typography>
        <ServicesGrid>
          {clinic.service?.map((service) => (
            <ServiceCard key={service.id}>
              <ServiceCardContent>
                <ServiceIcon>
                  <LocalHospitalIcon />
                </ServiceIcon>
                {editingService === service.id ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "اسم الخدمة مطلوب" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="اسم الخدمة"
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                          />
                        )}
                      />
                      <Controller
                        name="price"
                        control={control}
                        rules={{
                          required: "السعر مطلوب",
                          pattern: {
                            value: /^\d+$/,
                            message: "يجب أن يكون السعر رقماً",
                          },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="السعر"
                            variant="outlined"
                            error={!!errors.price}
                            helperText={errors.price?.message}
                            fullWidth
                          />
                        )}
                      />
                    </div>
                    <div className="flex justify-end mt-2 space-x-2">
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        startIcon={<SaveIcon />}
                      >
                        حفظ
                      </Button>
                      <Button
                        onClick={handleCancel}
                        color="secondary"
                        startIcon={<CancelIcon />}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <Typography variant="h6" sx={{ textAlign: "center" }}>
                      {service.name}
                    </Typography>
                    <ServicePrice>{service.price} جنيه</ServicePrice>
                    <div className="flex justify-end">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleEditClick(service.id, {
                            name: service.name,
                            price: service.price,
                          })
                        }
                        className="text-gray-500 hover:text-primary-600"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </>
                )}
              </ServiceCardContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>
    </>
  );
};

export default ClinicHeroSection;
