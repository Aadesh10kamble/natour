// import '@babel/polyfill';
import { login ,logout, profilePasswordChange ,newPasswordChange,bookTour,signup} from "./login.js";
import {alertFunction} from "./alert.js";

const content = document.querySelector (".user-view__content");
const sideNav = document.querySelector (".side-nav");
const loginForm = document.querySelector (".form-login");
const signupForm = document.querySelector (".form-signup");
const logoutBtn = document.getElementById ("logout");
const saveProfileChangeForm = document.querySelector (".form-user-data");
const changePasswordForm = document.querySelector (".form-user-settings");
const newPasswordForm = document.querySelector (".form-newPassword");
const bookBtn = document.getElementById ("booking");

if (sideNav) {
    sideNav.addEventListener ("click", (event) => {
        event.preventDefault ();
        document.querySelectorAll (".user-view__form-container").forEach (el => el.classList.add ("container-hidden"));
        document.querySelector (".side-nav--active")?.classList.remove ("side-nav--active");

        document.getElementById (event.target.textContent).classList.remove ("container-hidden");
        event.target.classList.add ("side-nav--active");
    })
}
if (logoutBtn) logoutBtn.addEventListener ("click",(event) => {
    event.preventDefault ();
    logout ();
});

if (loginForm) {
    loginForm.addEventListener ("submit",async (event)=> {
        event.preventDefault ();
        const data = {
            email : document.getElementById ("email").value,
            password : document.getElementById ("password").value
        }
        const alertData = await login (data);
        alertFunction (...alertData);
    });
};

if (signupForm) {
    signupForm.addEventListener ("submit",async event => {
        event.preventDefault ();
        const data = {
            name : document.getElementById ("name").value,
            email : document.getElementById ("email").value,
            password : document.getElementById ("password").value,
            passwordConfirm : document.getElementById ("passwordConfirm").value,
        };
        const alertData = await signup (data);
        alertFunction (...alertData);
    })
}

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
        console.log ("1212");
        await bookTour (tour);
    })
};

