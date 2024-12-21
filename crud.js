import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase , ref , push , onValue , remove , set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
const appSettings = {
    databaseURL:"https://js-crud-57747-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const userslistinDB = ref(database , "users");


const idEl = document.querySelector('#id');
const nameEl = document.querySelector('#name');
const ageEl = document.querySelector('#age');
const cityEl = document.querySelector('#city');
const frmEl = document.querySelector('#frm');
const tblbodyEl = document.querySelector('#tablebody');



frmEl.addEventListener("submit",function(e){
    e.preventDefault();
    if (!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim() ) {
        alert("please insert all the details")
        return;
    };
    if (idEl.value) {
       set(ref(database,"users/"+idEl.value),{
            name:nameEl.value,
            age:ageEl.value,
            city:cityEl.value
       })
       cleardata();
       return; 
    };

    
    //instet

    const newuser={
        name:nameEl.value,
        age:ageEl.value,
        city:cityEl.value,
    };
    push(userslistinDB,newuser);
    cleardata();
    function cleardata() {
        nameEl.value='';
        ageEl.value='';
        cityEl.value='';
        idEl.value='';
    }
})



onValue(userslistinDB,function (snapshot) {
    if (snapshot.exists()) {
        let usersarray = Object.entries(snapshot.val());
       
        tblbodyEl.innerHTML='';
        for (let i = 0; i < usersarray.length; i++) {
            const currentuser = usersarray[i];
            const currentuserId = currentuser[0]; 
            const currentuserVal = currentuser[1];
           

            tblbodyEl.innerHTML += `
            <tr><td>${i+1}</td>
                <td>${currentuserVal.name}</td>
                <td>${currentuserVal.age}</td>
                <td>${currentuserVal.city}</td>
                <td><button class="btn-edit"  data-id = ${currentuserId}><svg xmlns="http://www.w3.org/2000/svg"  height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h405l-60 60H180v600h600v-348l60-60v408q0 24-18 42t-42 18H180Zm300-360ZM360-360v-170l382-382q9-9 20-13t22-4q11 0 22.32 4.5Q817.63-920 827-911l83 84q8.61 8.96 13.3 19.78 4.7 10.83 4.7 22.02 0 11.2-4.5 22.7T910-742L530-360H360Zm508-425-84-84 84 84ZM420-420h85l253-253-43-42-43-42-252 251v86Zm295-295-43-42 43 42 43 42-43-42Z"/></svg></button></td>
                <td><button class="btn-delete"  data-id = ${currentuserId}><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z"/></svg></button></td>
            </tr> 
            `
             
        }
        
    } else {
        tblbodyEl.innerHTML = '<tr><td colspan ="6">No record found</td></tr>';
    }

});
document.addEventListener('click', function (e) {
    //console.log(e.target); // Log the clicked element to the console
    if (e.target.classList.contains("btn-edit")) {
        const id =e.target.dataset.id;
        const tdelement = e.target.closest('tr').children;
        idEl.value = id;
        nameEl.value = tdelement[1].textContent;
        ageEl.value = tdelement[2].textContent;
        cityEl.value = tdelement[3].textContent;
        
    } else if (e.target.classList.contains("btn-delete")) {
    if (confirm("Are you sure to delete ?")) {
        const id =e.target.dataset.id;
        const data = ref(database,`users/${id}`);
        remove(data);
    }
        
    }
});