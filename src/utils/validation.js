function isValidEmail(email) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
}

function isValidName(name) {
  return typeof name === 'string' && name.length >= 3;
}

function isUniqueNumericId(id, users, userId) {
  if(userId){
    return typeof id ==="number"
  }else{
    return typeof id === 'number' && !users.some(user => user.id === id);
  }
}

function validateUser(user, users, idUser) {
  const { name, email, id } = user;
  if (!isValidName(name)) {
    return {
      isValid: false,
      nombreIngresado: name,
      error: 'El nombre debe tener al menos 3 caracteres.'
    };
  }
  if (!isValidEmail(email)) {
    return { 
      isValid: false, 
      emailIngresado: email,
      error: 'El correo electronico no es valido.' };
  }
  if (!isUniqueNumericId(id, users, idUser)) {
    return { 
      isValid: false, 
      idRegresado: idUser,
      error: 'El ID debe ser numerico y unico.' };
  }
  return { isValid: true };
}

module.exports = {
  isValidEmail,
  isValidName,
  isUniqueNumericId,
  validateUser
};