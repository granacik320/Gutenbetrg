const themeBtn = document.querySelector('.theme-btn');
const html = document.querySelector('html');

if(localStorage.getItem('theme') === 'white'){
    themeBtn.classList.add('active')
    html.classList.add('white-theme')
}

function theme(){
    themeBtn.classList.toggle('active')
    html.classList.toggle('white-theme')
    if(localStorage.getItem('theme') === 'black'){
        localStorage.setItem('theme', 'white')
    }else{
        localStorage.setItem('theme', 'black')
    }
}