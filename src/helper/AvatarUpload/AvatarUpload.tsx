import React, { useRef, useState } from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Typography,
  useTheme,
  Modal,
  Backdrop,
  Fade,
} from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Control, Controller, FieldValues, Path, PathValue } from 'react-hook-form';

interface AvatarUploadProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  currentImageUrl: string | null;
  rules?: object;
  onFileChange: (file: File) => void;
}

const AvatarUpload = <T extends FieldValues>({
  name,
  control,
  currentImageUrl,
  rules = {},
  onFileChange,
}: AvatarUploadProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    onChange: (value: PathValue<T, Path<T>>) => void,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if(!file){
        return;
    }
    onChange(file as PathValue<T, Path<T>>);
    onFileChange(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => handleFileChange(onChange, e)}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                width: 'fit-content',
                cursor: previewUrl ? 'pointer' : 'default',
              }}
            >
              <Avatar
                src={previewUrl || ''}
                sx={{
                  width: 120,
                  height: 120,
                  border: error 
                    ? `2px solid ${theme.palette.error.main}`
                    : `2px solid ${theme.palette.primary.main}`,
                }}
              >
                {!previewUrl && <AddAPhotoIcon sx={{ width: 40, height: 40 }} />}
              </Avatar>
              
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  borderRadius: '50%',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                onClick={handleEditClick}
              >
                <IconButton
                  sx={{
                    color: 'white',
                  }}
                >
                  {previewUrl ? <EditIcon /> : <AddAPhotoIcon />}
                </IconButton>
              </Box>
            </Box>
            
            {error && (
              <Typography 
                color="error" 
                variant="caption" 
                sx={{ mt: 1 }}
              >
                {error.message}
              </Typography>
            )}
            
            {previewUrl && (
              <>
                <Typography 
                  variant="caption" 
                  sx={{ mt: 1, color: 'text.secondary' }}
                >
                  انقر للتكبير أو انقر على أيقونة التعديل للتغيير
                </Typography>
                <IconButton
                  onClick={handleOpenModal}
                  sx={{
                    mt: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </>
            )}
          </Box>

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={openModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 15,
                  p: 4,
                }}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Profile Image"
                    style={{ maxWidth: "100%", maxHeight: "80vh" }}
                  />
                )}
              </Box>
            </Fade>
          </Modal>
        </Box>
      )}
    />
  );
};

export default AvatarUpload;