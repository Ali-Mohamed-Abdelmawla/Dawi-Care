// doctorUtils.ts
export const specialtyOptions = [
    { value: 'الاسنان', label: 'الاسنان' },
    { value: 'باطنه غدد صماء و كلي و سكر', label: 'باطنه غدد صماء و كلي و سكر' },
    { value: 'باطنه الجهاز الهضمي و الكبد', label: 'باطنه الجهاز الهضمي و الكبد' },
    { value: 'باطنه امراض دم و مناعه', label: 'باطنه امراض دم و مناعه' },
    { value: 'القلب', label: 'القلب' },
    { value: 'المسالك البوليه', label: 'المسالك البوليه' },
    { value: 'الصدر', label: 'الصدر' },
    { value: 'الجلديه', label: 'الجلديه' },
    { value: 'اوعيه دمويه', label: 'اوعيه دمويه' },
    { value: 'انف و اذن', label: 'انف و اذن' },
    { value: 'الرمد', label: 'الرمد' },
    { value: 'النساء و التوليد', label: 'النساء و التوليد' },
    { value: 'المخ و الاعصاب', label: 'المخ و الاعصاب' },
    { value: 'الاطفال', label: 'الاطفال' },
    { value: 'التجميل', label: 'التجميل' },
    { value: 'روماتيزم', label: 'روماتيزم' },
    { value: 'عظام و كسور و اصابات ملاعب', label: 'عظام و كسور و اصابات ملاعب' },
    { value: 'عظام و عمود فقرى', label: 'عظام و عمود فقرى' },
    { value: 'امراض العظام و المفاصل', label: 'امراض العظام و المفاصل' },
    { value: 'جراحه الاطفال', label: 'جراحه الاطفال' },
    { value: 'جراحه اليد', label: 'جراحه اليد' },
    { value: 'جراحه عامه', label: 'جراحه عامه' },
    { value: 'سونار', label: 'سونار' },
    { value: 'تغذيه', label: 'تغذيه' },
  ];
  
  export const workingDaysOptions = [
    { value: 'الأحد', label: 'الأحد' },
    { value: 'الاثنين', label: 'الاثنين' },
    { value: 'الثلاثاء', label: 'الثلاثاء' },
    { value: 'الأربعاء', label: 'الأربعاء' },
    { value: 'الخميس', label: 'الخميس' },
    { value: 'الجمعة', label: 'الجمعة' },
    { value: 'السبت', label: 'السبت' },
  ];
  
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ar-EG');
  };