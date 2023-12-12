//funciones para operaciones crud
const urlApiUser = "http://localhost:8080/users";//colocar la url con el puerto
const headersUser= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listar(){
    validaToken();
    var settings={
        method: 'GET',
        headers: headersUser,
    }
    fetch(urlApiUser, settings)
    .then(response => response.json())
    .then(function(users){
        
            var usuarios = '';
            for(const usuario of users){
                usuarios += `
                <tr>
                    <th scope="row">${usuario.id}</th>
                    <td>${usuario.firstName}</td>
                    <td>${usuario.lastName}</td>
                    <td>${usuario.email}</td>
                    <td>
                    <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#" onclick="eliminarUsuario('${usuario.id}')" class="btn btn-outline-danger">
                        <i class="fa-solid fa-trash"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listar").innerHTML = usuarios;
    })
}

function verModificarUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersUser,
    }
    fetch(urlApiUser+"/"+id, settings)
    .then(usuario => usuario.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modify User</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="firstName" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="firstName" id="firstName" required value="${usuario.firstName}"> <br>
                    <label for="lastName"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="lastName" id="lastName" required value="${usuario.lastName}"> <br>
                    <label for="document"  class="form-label">Document id</label>
                    <input type="text" class="form-control" name="document" id="document" required value="${usuario.document}"> <br>
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" name="email" id="email" required value="${usuario.email}"> <br>
                    <!--<label for="password" class="form-label">Password</label>-->
                    <input type="hidden" class="form-control" id="password" name="password" value="12345678"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarUsuario(id){
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiUser+"/"+id, {
        method: 'PUT',
        headers:headersUser,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("The user has been modified successfully!",1)
        listar();
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
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersUser,
    }
    fetch(urlApiUser+"/"+id, settings)
    .then(usuario => usuario.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Nombre: ${usuario.firstName}</li>
                    <li class="list-group-item">Apellido: ${usuario.lastName}</li>
                    <li class="list-group-item">Correo: ${usuario.email}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function createUser(){
    var myForm = document.getElementById("registerForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiAuth+"/register", {
        method: 'POST',
        headers:headersAuth,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("User created", 1);
        listar();
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
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function createUserForm(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>User Register</h1>
            </div>
              
            <form action="" method="post" id="registerForm">
                <input type="hidden" name="id" id="id">

                <label for="firstName" class="form-label">First Name</label>
                <input type="text" class="form-control" name="firstName" id="firstName" required> <br>

                <label for="lastName"  class="form-label">Last Name</label>
                <input type="text" class="form-control" name="lastName" id="lastName" required> <br>

                <label for="document"  class="form-label">Document id</label>
                <input type="text" class="form-control" name="document" id="document" required> <br>

                <label for="phone" class="form-label">Phone number</label>
                <input type="text" class="form-control" name="phone" id="phone"> <br>

                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" name="email" id="email" required> <br>
                
                <label for="password" class="form-label">Password</label>

                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="createUser()">Register</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}


function eliminarUsuario(id){
    validaToken();
    var settings={
        method: 'DELETE',
        headers:headersUser,
    }
    fetch(urlApiUser+"/"+id,settings)
    .then(response => response.json())
    .then(function(data){
        listar();
        alertas("The user has been deleted successfully!",2)
    })
}