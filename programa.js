function greeter(person) {
    return "Hola, " + person;
}
var user = { firstName: "Francisco", lastName: "Flores" };
document.body.innerHTML = greeter(user);
