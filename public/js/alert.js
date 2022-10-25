const alertFunction = function (type,msg) {
    const markup = `<div class ="alert alert--${type}">${msg}</div>`;
    document.querySelector ("body").insertAdjacentHTML ("afterbegin",markup);
    
    setTimeout (()=> {
        const el = document.querySelector (".alert");
        document.querySelector ("body").removeChild (el);
    },5000);
};

export {alertFunction}