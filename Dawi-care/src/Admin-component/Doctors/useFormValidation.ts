// useFormValidation.ts
export const useFormValidation = () => {
    const validateNationalId = (value: string) => {
      if (!value) return 'الرقم القومي مطلوب';
      if (!/^\d{14}$/.test(value)) return 'الرقم القومي يجب أن يكون 14 رقمًا';
      return true;
    };

    const validateFileSize = (file: File | null) => {
      if (file && file.size > 2 * 1024 * 1024) {
        console.log("file size " , file.size > 2 * 1024 * 1024);
        return "حجم الملف يجب أن يكون أقل من 2 ميجابايت";
      }
      return true;
    };

    const validateFileType = (file: File | null, allowedTypes: string[]) => {
      if (file && !allowedTypes.includes(file.type)) {
        return `نوع الملف يجب أن يكون ${allowedTypes.join(" أو ")}`;
      }
      return true;
    };
  
    const validatePhoneNumber = (value: string) => {
      if (!value) return 'رقم الهاتف مطلوب';
      if (!/^\d{11,15}$/.test(value)) return 'رقم الهاتف يجب أن يكون بين 11 و 15 رقمًا';
      return true;
    };
  
    const validateSalary = (value: string) => {
      if (!value) return 'الراتب مطلوب';
      if (!/^\d+(\.\d{1,2})?$/.test(value)) return 'الراتب يجب أن يكون رقمًا صحيحًا أو عشريًا';
      return true;
    };
  
    return {
      validateNationalId,
      validatePhoneNumber,
      validateSalary,
      validateFileSize,
      validateFileType
    };
  };