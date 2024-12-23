import React, { useState } from "react";
import {
  Typography,
  TextField,
  IconButton,
  Button,
  Box,
  Modal,
  useTheme,
  InputAdornment,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useClinicStyles } from "../useClinicStyles";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { NewClinic } from "../ClinicsInterfaces";
import sweetAlertInstance from "../../../helper/SweetAlert";


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
  onServiceEdit: (
    serviceId: number,
    clinicId: number,
    newService: { name: string; price: string }
  ) => void;
  onServiceDelete: (serviceId: number) => void;
}

const ClinicHeroSection: React.FC<ClinicHeroSectionProps> = ({
  clinic: initialClinic,
  onServiceEdit,
  onServiceDelete,
}) => {
  // Keep local state of the clinic data
  const [clinic, setClinic] = useState<NewClinic>(initialClinic);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    ProfileHeroSection,
    CreatedAtText,
    ServicesSection,
    ServicesGrid,
    ServiceCard,
    ServiceCardContent,
    ServiceIcon,
    ServicePrice,
    StyledTextField,
    StyledSearchIcon,
  } = useClinicStyles();

  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    id: number;
    name: string;
    price: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>();
  

  const handleEditClick = (service: {
    id: number;
    name: string;
    price: string;
  }) => {
    setSelectedService(service);
    setValue("name", service.name);
    setValue("price", service.price);
    setOpenModal(true);
  };

  // const handleDeleteService = (id: number) => {
  //   onServiceDelete(id);
  //   setClinic((prevClinic) => ({
  //     ...prevClinic,
  //     service: prevClinic.service?.filter((service) => service.id !== id)
  //   }));
  // };
  const handleDeleteService = async (id: number) => {
    // Show confirmation dialog
    const result = await sweetAlertInstance.fire({
      title: 'هل أنت متأكد؟',
      text: "لن تتمكن من التراجع عن هذا!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      reverseButtons: true // Since you're using Arabic, reverse buttons might look better
    });
  
    // If user confirmed
    if (result.isConfirmed) {
      try {
        await onServiceDelete(id);
        setClinic((prevClinic) => ({
          ...prevClinic,
          service: prevClinic.service?.filter((service) => service.id !== id)
        }));
  
        // Show success message
        await sweetAlertInstance.fire({
          title: 'تم الحذف!',
          text: 'تم حذف الخدمة بنجاح.',
          icon: 'success',
          timer: 1500
        });
      } catch (error) {
        // Show error message if deletion fails
        await sweetAlertInstance.fire({
          title: 'خطأ!',
          text: 'حدث خطأ أثناء حذف الخدمة.',
          icon: 'error'
        });
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };

  const onSubmit = async (data: ServiceFormData) => {
    if (selectedService) {
      const newService = { name: data.name, price: data.price };
      try {
        // Call the API to update the service
        await onServiceEdit(selectedService.id, clinic.id, newService);

        // Update the local state with the new service data
        setClinic((prevClinic) => ({
          ...prevClinic,
          service: prevClinic.service?.map((service) =>
            service.id === selectedService.id
              ? { ...service, ...newService }
              : service
          ),
        }));

        handleCloseModal();
      } catch (error) {
        console.error("Failed to update service:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const filteredServices = clinic.service?.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" gutterBottom>
            الخدمات المتوفرة
          </Typography>
          <StyledTextField
            autoFocus
            placeholder="ابحث عن خدمة..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledSearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: "400px",
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.background.paper,
                "&:hover": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            }}
          />
        </Box>

        <ServicesGrid>
          {filteredServices?.map((service) => (
            <ServiceCard key={service.id}>
              <ServiceCardContent>
                <ServiceIcon>
                  <LocalHospitalIcon />
                </ServiceIcon>
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  {service.name}
                </Typography>
                <ServicePrice>{service.price} جنيه</ServicePrice>
                <div className="flex justify-end">
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleEditClick({
                        id: service.id,
                        name: service.name,
                        price: service.price,
                      })
                    }
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteService(service.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </ServiceCardContent>
            </ServiceCard>
          ))}
        </ServicesGrid>
      </ServicesSection>

      {selectedService && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 16,
              border: `1px solid ${theme.palette.primary.dark}`,
              p: 2,
              outline: "none",
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2">
              تعديل الخدمة
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box className="space-y-4 mt-4">
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
                      sx={{ mt: 4 }}
                    />
                  )}
                />
                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "السعر مطلوب",
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
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
                      sx={{ mt: 4 }}
                    />
                  )}
                />
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button onClick={handleCloseModal} color="secondary">
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  حفظ
                </Button>
              </Box>
            </form>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ClinicHeroSection;
