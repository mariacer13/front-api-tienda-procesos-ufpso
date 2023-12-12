//funciones para operaciones crud
const urlApiCategory = "http://localhost:8080/categorias";//colocar la url con el puerto
const headersCategory= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listarCategory(){
    validaToken();
    var settings={
        method: 'GET',
        headers: headersCategory,
    }
    fetch(urlApiCategory, settings)
    .then(response => response.json())
    .then(function(categories){
        
            var categorias = '';
            for(const categoria of categories){
                categorias += `
                <tr>
                    <th scope="row">${categoria.idCategory}</th>
                    <td>${categoria.nameCategory}</td>
                    
                    <td>
                    <a href="#" onclick="verModificarCategory('${categoria.idCategory}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verCategory('${categoria.idCategory}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#" onclick="eliminarCategory('${categoria.idCategory}')" class="btn btn-outline-danger">
                        <i class="fa-solid fa-trash"></i> 
                    </a>

                    </td>
                </tr>`;
                
            }
            document.getElementById("listarCategory").innerHTML = categorias;
    })
}

function verModificarCategory(idCategory){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersCategory,
    }
    fetch(urlApiCategory+"/"+idCategory, settings)
    .then(categoria => categoria.json())
    .then(function(categoria){
            var cadena='';
            if(categoria){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-6"><i class="fa-solid fa-user-pen"></i> Modificar Categoria</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${categoria.idCategory}">

                    <label for="nameCategory" class="form-label">Nombre Categoria</label>
                    <input type="text" class="form-control" name="nameCategory" id="nameCategory" required value="${categoria.nameCategory}"> <br>
                    
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCategory('${categoria.idCategory}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModalCategory").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategoria'))
            myModal.toggle();
    })
}

async function modificarCategory(idCategory){
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiCategory+"/"+idCategory, {
        method: 'PUT',
        headers:headersCategory,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("¡Categoria Modificada!",1)
        await Promise.all([listarCategory(), listarArticle()]);
    }
    else{
        const data = await request.json(); 
        console.log(data); 
        const dataArray = Object.values(data);
        console.log(dataArray); 
        var dataResponse='';
        for(var v of dataArray){
            dataResponse += "<li>"+v+"</li>";
        }

        alertas("Error: <br>"+dataResponse, 2)
    }
    document.getElementById("contentModalCategory").innerHTML = '';
    var myModalEl = document.getElementById('modalCategoria')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verCategory(idCategory){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersCategory,
    }
    fetch(urlApiCategory+"/"+idCategory, settings)
    .then(categoria => categoria.json())
    .then(function(categoria){
            var cadena='';
            if(categoria){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-6"><i class="fa-solid fa-user-pen"></i> Ver Categoria</h1>
                </div>
                <ul class="list-group">
                <li class="list-group-item">Nombre: <span style="color: green;">${categoria.nameCategory}</span></li>
                </ul>`;
              
            }
            document.getElementById("contentModalCategory").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategoria'))
            myModal.toggle();
    })
}

async function createCategory(){
    var myForm = document.getElementById("categoryForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiCategory, {
        method: 'POST',
        headers:headersCategory,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("Categoria creada", 1);
        listarCategory();
    }
    else{
        const data = await request.json(); // Espera a que la promesa se resuelva
        console.log(data); // Aquí puedes manejar la data de la respuesta
        const dataArray = Object.values(data);
        console.log(dataArray); // Aquí puedes manejar la data de la respuesta
        var dataResponse='';
        for(var v of dataArray){
            dataResponse += "<li>"+v+"</li>";
        }

        alertas("Error: <br>"+dataResponse, 2)
    }
    document.getElementById("contentModalCategory").innerHTML = '';
    var myModalEl = document.getElementById('modalCategoria')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function createCategoryForm(){
    var cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
            <h1 class="display-6"><i class="fa-solid fa-user-pen"></i> Crear Categoria</h1>
            </div>
              
            <form action="" method="post" id="categoryForm">
                <input type="hidden" name="id" id="idCategory">

                <label for="nameCategory" class="form-label">Nombre categoria</label>
                <input type="text" class="form-control" name="nameCategory" id="nameCategory" required> <br>
                
                <button type="button" class="btn btn-outline-info" onclick="createCategory()">Crear</button>
            </form>`;
            document.getElementById("contentModalCategory").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategoria'))
            myModal.toggle();
}

function eliminarCategory(idCategory) {
    validaToken();

    // Muestra el modal de confirmación
    var confirmacionModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    confirmacionModal.show();

    // Configura el evento para el botón de confirmar dentro del modal
    document.getElementById("confirmarEliminar").addEventListener("click", function () {
        var settings = {
            method: 'DELETE',
            headers: headersCategory,
        };

        fetch(urlApiCategory + "/" + idCategory, settings)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error al intentar eliminar la categoría. Código de estado: ${response.status}`);
                }
                return response.text().then(text => text ? JSON.parse(text) : {});
            })
            .then(function (data) {
                listarCategory();
                alertas("Categoría eliminada!", 2);
                confirmacionModal.hide(); // Oculta el modal después de la eliminación
            })
            .catch(function (error) {
                console.error('Error al intentar eliminar la categoría:', error);
                confirmacionModal.hide(); // También cerramos el modal en caso de error
            });
    });
}


