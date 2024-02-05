import { useState } from "react"


const UserFrom = (initialObj) => {
    const [form, setForm] = useState(initialObj);
    const changed = ({ target }) => {
        const { name, value } = target;
        //añadir nuevos valores dentro del formulario con el contenido que ya tuviera el form 
        //mas clave y valor que quiero añadir
        setForm({
            ...form, [name]: value
        });
        //console.log(form);

    }

    return { form, changed }

}

export default UserFrom
