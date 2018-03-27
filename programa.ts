interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person){
    return "Hola, " + person;
}

let user = { firstName: "Francisco", lastName: "Flores"};

document.body.innerHTML = greeter(user);