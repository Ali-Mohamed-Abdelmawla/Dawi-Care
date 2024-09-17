// userUtils.ts
  
 export const roles = {
  Admin: "مسؤول",
  User: "مستخدم"
}
  
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };