var countNodos = 0, porcentaje = 0, nodosTotales = 0;

function concat(grafo, aristas){
    for(var i=0; i<aristas.length; i++){
        grafo.push(aristas[i]);
    }
}

function getRandom(limite){
    return Math.floor(Math.random() * limite);
}

function updateProgress(progreso){
    $("#barra")
    .css("width", progreso + "%")
    .attr("aria-valuenow", progreso)
    .text(progreso + "% Completo");
}

/*MÉTODO QUE CREA LAS NUEVAS COMBINACIONES DE NODOS PARA
CREAR NUEVAS ARISTAS DENTRO DEL GRAFO*/
/**PARAMETROS
 * arreglo = los nodos que vamos a agregar
 * tabu = la tabla hash que guarda las combinaciones prohibidas
 * change4 = una bandera para seleccionar si queremos 4 aristas o 3
 */
function makeCombination(arreglo, tabu, change4){
    /*Creamos un arreglo vacion que gauradara los resultados*/
    var combinaciones = [];
    /*Creamos todas las combinaciones posibles de 2 nodos con los nodos entrantes*/
    for(var i=0; i<arreglo.length-1; i++){
        for(var j=i+1; j<arreglo.length; j++){
            /*preguntamos si la combinación nueva no está dentro de la lista prohibida
            si no es así entonces la agregamos a las combinaciones*/
            if(tabu[arreglo[i]+"_"+arreglo[j]] == undefined)
                combinaciones.push(arreglo[i]+"_"+arreglo[j]);
        }
    }
    /*Preguntamos si queremos quitar la segunda o la primera arista creada*/
    if(change4){
        /*quitamos la segunda arista y la agregamos a las prohibidas*/
        tabu[combinaciones.splice(1, 1)[0]] = true;
        /*generamos un booleano aleatorio, si es verdadero quitamos la 4ta arista*/
        if(Math.floor(Math.random() * 2) == 0){
            tabu[combinaciones.splice(3,1)[0]] = true;
        }
    }
    else{
        /*quitamos la primera arista y la agregamos a las prohibidas*/
        tabu[combinaciones.splice(0, 1)[0]] = true;
        if(Math.random()>0.5){
            /*generamos un booleano aleatorio, si es verdadero quitamos la 2da arista*/
            tabu[combinaciones.splice(1, 1)[0]] = true;
        }
    }
    
    return combinaciones;
}

function saluda(){
    alert("hola");
    console.log("hola");
}

/*******ESTE ES EL ALGORITMO PRINCIPAL*******/
function makeGrafo(){
    /*Limpiamos el conteo en nodos en 0*/
    countNodos = 0;
    /*Creamos todos los arreglos necesarios para el algoritmo */
    var newAristas = [], grafo = [], nodos = [], tabu = {}, no_repetidas = [], repetidas = [];
    /*En la primera ejecución vamos a crear 4 nodos*/
    var nodosToCreate = 4, limite, multiple, newNodos;
    /*limite le asignamos el conteo de nodos actual*/
    limite = countNodos;
    /*agregamos los 4 nodos nuevos a la lista de nodos*/
    for(countNodos = countNodos; countNodos < limite + nodosToCreate; countNodos++){
        nodos.push(countNodos+1);
    }
    /*creamos la primera combinación, ver el metodo make combination más arriba*/
    grafo = makeCombination(nodos, tabu, true);
    countNodos++;
    while(countNodos < nodosTotales){
        newNodos = [];
        nodosToCreate = getRandom(5) + 3;
        limite = countNodos;
        for(countNodos = countNodos; countNodos < limite + nodosToCreate; countNodos++){
            newNodos.push(countNodos);
        }
        if(nodosToCreate == 3){
            newNodos.splice(0,0,nodos[getRandom(nodos.length)]);
            //espera perro
            newAristas = makeCombination(newNodos, tabu, true);
            concat(grafo, newAristas); 
        }
        else if(nodosToCreate == 4){
            newAristas = makeCombination(newNodos, tabu, true);
            var nodosAux = newNodos.slice();
            nodosAux.splice(0,1,nodos[getRandom(nodos.length)]);
            var aristasAux = makeCombination(nodosAux, tabu, false);
            var no_rep = aristasAux.filter((valor) => newAristas.indexOf(valor) == -1);
            repetidas.push(aristasAux.filter((valor) => newAristas.indexOf(valor) != -1));
            no_repetidas.push(no_rep);
            concat(grafo,no_rep);
            concat(grafo,newAristas);
        }
        else{
            var nodosAux = newNodos.slice();
            if(getRandom(2) > -1){
                var viejo = nodos[getRandom(nodos.length)];
                nodosAux.splice(0,0,viejo);
                for(var i=0; i<nodosAux.length-1; i++){
                    grafo.push(nodosAux[i] + "_"+nodosAux[i+1]);
                }
            }
            else{
                /*esta parte puede causar problemas*/
                // var arista_vieja = grafo[getRandom(grafo.length)];
                // var viejos = arista_vieja.split("_");
                // viejos.forEach((valor, index) => viejos[index] = parseInt(valor));
                // nodosAux = viejos.concat(nodosAux);
                // for(var i=1; i<nodosAux.length-1; i++){
                //     grafo.push(nodosAux[i] + "_"+nodosAux[i+1]);
                // }
            }
            grafo.push(nodosAux[0]+"_"+nodosAux[nodosAux.length-1]);
        }
        concat(nodos, newNodos);
        updateProgress(countNodos*100/nodosTotales);
    }
    return { Grafo: grafo, Tabu: tabu, Norep: no_repetidas, Rep: repetidas, Nodos: nodos.length, Aristas: grafo.length};
}

function guardar(){
    var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "hello world.txt");
}


function principal(){
    var t_inicio;
    var t_final;
    
    ini_mseg= new Date();
    var arreglo = makeGrafo();
    fin_mseg= new Date();
    t_inicio=ini_mseg.getTime();
    t_final=fin_mseg.getTime()
    
    console.log(t_final-t_inicio);
    console.log(arreglo.Grafo);
    console.log(arreglo.Tabu);
    console.log(arreglo.Norep);
    console.log(arreglo.Rep);
    return arreglo;
}

$(document).ready(function(){
    $("#boton").click(function(){
        nodosTotales = parseInt($("#entrada").val());
        //invoca a la funcion de grafo
        //alert(nodosTotales);
        var datos = principal();
        var texto = "", convertida;
        $("#nodos").text(datos.Nodos);
        $("#aristas").text(datos.Aristas);
        datos.Grafo.forEach((cadena) => {
            convertida = cadena.split("_");
            texto += convertida[0] + " " + convertida[1] + "\n";
        });
        var blob = new Blob([texto], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "grafo_outterplanar.txt");
    });
});
