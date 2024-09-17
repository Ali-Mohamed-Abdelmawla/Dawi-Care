// utils.ts

export const validateFileSize = (file: File | null) => {
    if (file && file.size > 2 * 1024 * 1024) {
      return "حجم الملف يجب أن يكون أقل من 2 ميجابايت";
    }
    return true;
  };
  
  export const validateFileType = (file: File | null, allowedTypes: string[]) => {
    if (file && !allowedTypes.includes(file.type)) {
      return `نوع الملف يجب أن يكون ${allowedTypes.join(" أو ")}`;
    }
    return true;
  };