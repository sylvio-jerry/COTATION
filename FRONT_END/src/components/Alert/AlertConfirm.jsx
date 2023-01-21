import Swal from 'sweetalert2'

const AlertConfirm = async(icon,title,text="Voulez vous vraiment effectuer cette opération")=>{
    return await Swal.fire({
        icon,
        title,
        text,
        showDenyButton:true,
        confirmButtonColor: '#d33',
        denyButtonColor: '#7fb6b9',
        confirmButtonText: 'OUI',
        denyButtonText: 'NON',
        reverseButtons: true,
        focusConfirm: false
    })
}

export default AlertConfirm;