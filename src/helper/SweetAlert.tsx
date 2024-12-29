import Swal from 'sweetalert2';
import "../Admin-component/Styles/main.css";


const sweetAlertInstance = Swal.mixin({
  confirmButtonColor: 'var(--special-color1)',
  confirmButtonText: 'موافق',
  cancelButtonColor: '#d33',
  color: "var(--font-color)",
  background: "var(--color-background)",
  iconColor: "var(--special-color1)",
  // timer: 3000,
  // timerProgressBar: true,
});

export default sweetAlertInstance;