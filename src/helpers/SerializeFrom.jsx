
export const SerializeFrom = (form) => {
  /*recorren todos los from*/
  const formData = new FormData(form);
  const completeObj = {};
  //obtener los name y los value con for of: clave, valo
  for (let [name, value] of formData) {
    console.log(name, value);
    completeObj[name] = value;
  }
  //tener todos los datos del formularioen un bojeto

  return completeObj;
}

