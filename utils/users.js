const users = [];

//Ingreso de usuarios a chatealo
function userJoin(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

//Obteniendo usuarios
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

//Usuarios que salen del chat
function userLeave(id){
    const index= users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

//Obtener la sala
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};