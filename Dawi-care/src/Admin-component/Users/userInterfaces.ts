// interfaces.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  password: string;
  confirm_password: string;
}

export interface UserFormData
  extends User {

}

export interface UsersTableProps {
  users: User[];
  handleEditClick: (user: User) => void;
  handleDeleteClick: (userId: number) => void;
}

export interface UserIdCardProps {
  user: User;
}

export interface EditUserFormProps {
  user: User;
  onSubmit: (data: UserFormData) => void;
  onBack: () => void;
}
