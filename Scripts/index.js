//FAKE API

let users = [
    {
        id: 1,
        name: "William",
        lastName: "Turner",
        email: "turner@test.com"
    },
    {
        id: 2,
        name: "Khal",
        lastName: 'Drogho',
        email: "drogho@test.com"
    }
]


// USEFUL VARIABLES
const d = document,
    ls = localStorage,
    $submitButton = d.getElementById("submit-form-button"),
    $emailInput = d.getElementById('email-input'),
    $passwordInput = d.getElementById('password-input'),
    $loginSection = d.getElementById('login-section'),
    $bienvenida = d.querySelector('.bienvenida'),
    $crud = d.querySelector('.crud'),
    $table = d.querySelector('.crud-table'),
    $form = d.querySelector('.crud-form'),
    $title = d.querySelector('.crud-title'),
    $template = d.getElementById('crud-template').content,
    $fragment = d.createDocumentFragment(),
    $formName = d.getElementById('form-name'),
    $formLastname = d.getElementById('form-lastname'),
    $formEmail = d.getElementById('form-email');

//STATE

let state = {
    credentials: {
        email: undefined,
        password: undefined
    },
    logged: false,
    signedUp: false,
}

//Local Storage

d.addEventListener("DOMContentLoaded", e => {
    if(ls.getItem('email') === null){
        return;
    }
    
    if(ls.getItem('email') !== null){
        state = 
        {
            credentials:{ 
                email: ls.getItem("email"),
                password: ls.getItem("password")
            },
        signedUp: ls.getItem('signedUp'),
        logged: ls.getItem('logged')
        }
    }

    if(ls.getItem('users'))
    {
        let jsoned = ls.getItem('users');
        let parsed = JSON.parse(jsoned);
        users = [
            ...parsed
        ]
    }
    console.log(users)
})

//Template UI

const loginTemplate = () => {
    if(state.credentials.email === undefined){
        return `<p class="main-form-text">Whooops! parece que aun no has accedido a una cuenta. Necesitas crear una cuenta antes de poder acceder al CRUD y guardar tu informacion!</p>`
    } else if(state.credentials.email !== undefined){
        return `<p class="main-form-text">Parece que ya tienes una cuenta!(: Inicia sesion para acceder al CRUD</p>`
    }
}

//Render UI

const render = () => {
    const $loginText = d.getElementById("login-text");
    $loginText.innerHTML = loginTemplate();
}

d.addEventListener("DOMContentLoaded", render);

// LISTENER FOR SUBMIT BUTTON (LOGIN)

$submitButton.addEventListener("click", (e)=>{
   if(state.signedUp === false){
       updateState();
   } else if(state.signedUp === "true"){
       loginState();
   }
});

const updateState = () => {
    state = {
        credentials: {
            email: $emailInput.value,
            password: $passwordInput.value
        },
    }
    if(ls.getItem('email') === null){
        ls.setItem('email', state.credentials.email);
        ls.setItem('password', state.credentials.password);
        ls.setItem('signedUp', true);
    }  
}

const loginState = () => {
    if($emailInput.value === state.credentials.email && $passwordInput.value === state.credentials.password){
        ls.setItem('logged', true)
    } else {
        window.alert('Las credenciales son incorrectas! intenta nuevamente')
    }
}

// CONDITIONAL RENDERS

d.addEventListener('DOMContentLoaded', e => {
    if(state.logged === 'true'){
        $loginSection.classList.add('hidden')
        const $welcome = d.createElement('h3')
        const $welcomeText = document.createTextNode('Has iniciado sesion con exito. Ahora puedes leer, crear, modificar y eliminar los registros.') 
        $welcome.appendChild($welcomeText);
        $bienvenida.appendChild($welcome);
    }
})

d.addEventListener('DOMContentLoaded', e=>{
    if(state.logged === false || state.logged === null){
        $crud.classList.add("hidden")
    }
});

//////// CRUD LOGIC


    //GET LOGIC
const getAll = () => {
    users.forEach(item => {
        $template.querySelector(".name").textContent = item.name;
        $template.querySelector(".last-name").textContent = item.lastName;
        $template.querySelector(".email").textContent = item.email;
        $template.querySelector(".edit").dataset.id = item.id;
        $template.querySelector('.edit').dataset.name = item.name;
        $template.querySelector('.edit').dataset.lastName = item.lastName;
        $template.querySelector('.edit').dataset.email = item.email;
        $template.querySelector('.delete').dataset.id = item.id;

        let $clone = d.importNode($template, true);
        $fragment.appendChild($clone);
    });
    $table.querySelector('tbody').appendChild($fragment);
}

d.addEventListener("DOMContentLoaded", getAll)
d.addEventListener('submit', e => {
    if(e.target === $form){
        e.preventDefault();
         // PUT LOGIC

        let existentUser = users.some(item => item.id == $form.id.value)
        if(existentUser === true){
            console.log('si esta entrando en esta condicion')
            let newUsers = users.map(item => item.id == $form.id.value ? {...item, name: $formName.value, lastName: $formLastname.value, email: $formEmail.value } : item);
            ls.setItem('users', JSON.stringify(newUsers));
        
        //POST LOGIC

        } else if (!e.target.id.value){
            users.push({
                id: Math.round(Math.random()*10000),
                name: $formName.value,
                lastName: $formLastname.value,
                email:  $formEmail.value,
            });
            ls.setItem('users', JSON.stringify(users));
        }
    }
    location.reload();
})

d.addEventListener('click', e => {
    if(e.target.matches(".edit")){
        $title.textContent = "Editar registro";
        $form.nombre.value = e.target.dataset.name;
        $form.apellidos.value = e.target.dataset.lastName;
        $form.correo.value = e.target.dataset.email;
        $form.id.value = e.target.dataset.id;

        console.log($form.id.value)
        console.log($form.nombre.value)
        console.log($form.apellidos.value)
        console.log($form.correo.value)

    }

    //DELETE LOGIC

    if(e.target.matches('.delete')){
        let idToDelete = e.target.dataset.id;
        deleteItem(idToDelete);
    }
})

    // CALLBACK FOR DELETING
const deleteItem = (idToDelete) => {
    let newUsers = users.filter(item => item.id != idToDelete);
    console.log(idToDelete);
    console.log(newUsers)
    ls.setItem('users', JSON.stringify(newUsers));
    location.reload();
}