// types.ts

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  created_at: string;
}

export interface AddUserFormProps {
  getValues: () => UserFormData;
  onSubmit: (data: UserFormData) => void;
  loading: boolean;
}