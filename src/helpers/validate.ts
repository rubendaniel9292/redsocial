import validator from 'validator';
const validate = (params: any, options: number) => {

    let name = !validator.isEmpty(params.name) &&//valida que no sea vacio
        validator.isLength(params.name, { min: 2, max: undefined }) &&//limite minimo y maximo
        validator.isAlpha(params.name, 'es-ES');//que sea letras

    let surname = !validator.isEmpty(params.surname) &&//valida que no sea vacio
        validator.isLength(params.surname, { min: 2, max: undefined }) &&//limite minimo y maximo
        validator.isAlpha(params.surname, 'es-ES');//que sea letras

    let nick = !validator.isEmpty(params.nick) &&//valida que no sea vacio
        validator.isLength(params.nick, { min: 2, max: undefined });

    let email = !validator.isEmpty(params.email) &&
        validator.isLength(params.email, { min: 2, max: undefined }) &&//limite minimo y maximo
        validator.isEmail(params.email);

    if (options === 1) {
        let password = !validator.isEmpty(params.password);

        if (!name || !surname || !nick || !email || !password) {
            throw new Error('No se ha completado la validacion correctamente');
        } else {
            console.log('valicacion superada');
        }
    }
 
    if (params.bio) {
        let bio = validator.isLength(params.bio, { min: undefined, max: 255 });
        if (!bio) {
            throw new Error('No se ha completado la validacion correctamente');
        } else {
            console.log('valicacion superada');
        }
    }
}
export default validate;