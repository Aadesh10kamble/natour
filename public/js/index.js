
import { login ,logout, profilePasswordChange ,newPasswordChange,bookTour} from "./login.js";
import {alertFunction} from "./alert.js";

const loginForm = document.querySelector (".form-login");
const logoutBtn = document.getElementById ("logout");
const saveProfileChangeForm = document.querySelector (".form-user-data");
const changePasswordForm = document.querySelector (".form-user-settings");
const newPasswordForm = document.querySelector (".form-newPassword");
const bookBtn = document.getElementById ("booking");

if (logoutBtn) logoutBtn.addEventListener ("click",(event) => {
    event.preventDefault ();
    logout ();
});

if (loginForm) {
    loginForm.addEventListener ("submit",async (event)=> {
        event.preventDefault ();
        
        const email = document.getElementById ("email").value;
        const password = document.getElementById ("password").value;

        const alertData = await login (email,password);
        alertFunction (...alertData);
    });
};

// if (saveProfileChangeForm) {
//     saveProfileChangeForm.addEventListener ("submit",async (event) => {
//         event.preventDefault ();
//         const form = new FormData ();
//         form.append ("name",document.getElementById ("name").value);
//         form.append ("email",document.getElementById ("email").value);
//         form.append ("photo",document.getElementById ("photo").files);
//         const alertData = await profilePasswordChange ("profile",form);
//         alertFunction (...alertData);
//     })
// };

if (changePasswordForm) {
    changePasswordForm.addEventListener ("submit", async (event) => {
        event.preventDefault ();

        const currentPassword = document.getElementById ("password-current").value;
        const newPassword = document.getElementById ("password").value;
        const newPasswordConfirm = document.getElementById ("password-confirm").value;

        const alertData = await  profilePasswordChange ("password",{
            currentPassword : currentPassword,
            newPassword : newPassword,
            newPasswordConfirm : newPasswordConfirm
        });

        logout ();
        alertFunction (...alertData);
    })
};

if (newPasswordForm) {
    newPasswordForm.addEventListener ("submit",async (event) => {
        event.preventDefault ();
        const token = location.pathname.split ("/").at (-1);
        const data = {
            "newPassword" : document.getElementById ("newPassword").value,
            "newPasswordConfirm" : document.getElementById ("confirmNew").value
        };
        await newPasswordChange (data,token);
    })
}


if (bookBtn) {
    bookBtn.addEventListener ("click",async (event) => {
        event.preventDefault ();
        const tour = event.target.getAttribute ("data");
        console.log (tour);
        await bookTour (tour);
    })
};
