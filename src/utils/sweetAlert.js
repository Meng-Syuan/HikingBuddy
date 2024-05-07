import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export default {
  confirm(title, text, icon, showConfirmButton, showDenyButton) {
    return Swal.fire({
      title,
      text,
      icon,
      showConfirmButton,
      showDenyButton,
      confirmButtonText: showConfirmButton,
      confirmButtonColor: '#FB8152',
      denyButtonText: showDenyButton,
      denyButtonColor: '#417000',
    });
  },
};
