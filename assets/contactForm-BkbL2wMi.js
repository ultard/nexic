(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(o){if(o.ep)return;o.ep=!0;const s=t(o);fetch(o.href,s)}})();class c{overlay;content;closeButton;isOpen=!1;constructor(e){this.overlay=document.getElementById(e),this.content=this.overlay?.querySelector(".modalContent")||null,this.closeButton=this.overlay?.querySelector(".modalClose")||null,this.bindEvents()}bindEvents(){this.closeButton?.addEventListener("click",()=>this.close()),this.overlay?.addEventListener("click",e=>{e.target===this.overlay&&this.close()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()})}open(){this.overlay&&(this.overlay.style.display="flex",this.isOpen=!0,document.body.style.overflow="hidden",this.content?.querySelector("input, textarea, button")?.focus())}close(){this.overlay&&(this.overlay.style.display="none",this.isOpen=!1,document.body.style.overflow="")}}class d{static EMAIL_REGEX=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;static PHONE_REGEX=/^[+]?[\d\s\-()]{10,}$/;static validate(e){const t={};return e.name.trim()?e.name.trim().length<2&&(t.name="Имя должно содержать минимум 2 символа"):t.name='Поле "Имя" обязательно для заполнения',e.email.trim()?this.EMAIL_REGEX.test(e.email.trim())||(t.email="Введите корректный email адрес"):t.email='Поле "Email" обязательно для заполнения',!e.phone||!e.phone.trim()?t.phone='Поле "Телефон" обязательно для заполнения':this.PHONE_REGEX.test(e.phone.trim())||(t.phone="Введите корректный номер телефона (минимум 10 цифр)"),e.message.trim()?e.message.trim().length<10&&(t.message="Сообщение должно содержать минимум 10 символов"):t.message='Поле "Сообщение" обязательно для заполнения',e.consent!==void 0&&!e.consent&&(t.consent="Необходимо согласие на обработку персональных данных"),{isValid:Object.keys(t).length===0,errors:t}}}class a{form;submitButton=null;constructor(e){const t=document.getElementById(e);if(!t){console.warn(`Form with id "${e}" not found`);return}this.form=t,this.submitButton=t.querySelector('button[type="submit"]'),this.bindEvents()}bindEvents(){this.form.addEventListener("submit",this.handleSubmit.bind(this)),this.form.addEventListener("input",this.clearFieldError.bind(this)),this.form.addEventListener("change",this.clearFieldError.bind(this))}clearFieldError(e){const t=e.target;if(t){const n=document.getElementById(`${t.id}Error`);n&&(n.textContent="")}}getFormData(){const e=new window.FormData(this.form);return{name:e.get("name")||"",email:e.get("email")||"",phone:e.get("phone")||"",message:e.get("message")||"",subject:e.get("subject")||"",consent:e.get("consent")==="on"}}displayErrors(e){this.form.querySelectorAll(".formError").forEach(t=>{t.textContent=""}),Object.entries(e).forEach(([t,n])=>{const o=document.getElementById(`${t}Error`)||document.getElementById(`contact${t.charAt(0).toUpperCase()+t.slice(1)}Error`);o&&(o.textContent=n)})}async handleSubmit(e){e.preventDefault(),this.submitButton&&(this.submitButton.disabled=!0,this.submitButton.textContent="Отправка...");try{const t=this.getFormData(),n=d.validate(t);if(!n.isValid){this.displayErrors(n.errors);return}await this.submitForm(t),this.showSuccessMessage(),this.form.reset()}catch(t){console.error("Error submitting form:",t),this.showErrorMessage("Произошла ошибка при отправке формы. Попробуйте еще раз.")}finally{this.submitButton&&(this.submitButton.disabled=!1,this.submitButton.textContent=this.submitButton.closest("#contactModal")?"Отправить":"Отправить сообщение")}}async submitForm(e){return new Promise(t=>{setTimeout(()=>{console.log("Form submitted:",e),t()},1500)})}showSuccessMessage(){const e=document.createElement("div");e.innerHTML=`
            <div style="
                position: fixed;
                top: var(--space-4);
                right: var(--space-4);
                background: var(--color-success);
                color: white;
                padding: var(--space-3) var(--space-4);
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                z-index: 1001;
                max-width: 300px;
            ">
                <strong>Спасибо за ваше сообщение!</strong><br>
                Мы свяжемся с вами в ближайшее время.
            </div>
        `,document.body.appendChild(e),setTimeout(()=>{e.remove()},4e3)}showErrorMessage(e){const t=document.createElement("div");t.innerHTML=`
            <div style="
                position: fixed;
                top: var(--space-4);
                right: var(--space-4);
                background: var(--color-danger);
                color: white;
                padding: var(--space-3) var(--space-4);
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                z-index: 1001;
                max-width: 300px;
            ">
                <strong>Ошибка!</strong><br>
                ${e}
            </div>
        `,document.body.appendChild(t),setTimeout(()=>{t.remove()},5e3)}}document.addEventListener("DOMContentLoaded",()=>{if(document.getElementById("contactModal")){const e=new c("contactModal");document.getElementById("contactFormOpenButton")?.addEventListener("click",()=>e.open()),new a("contactForm")}new a("contactPageForm"),l()});function l(){const r="theme",e=window.matchMedia("(prefers-color-scheme: dark)").matches,t=localStorage.getItem(r);(t==="dark"||!t&&e)&&document.body.classList.add("themeDark");const o=document.createElement("button");o.className="buttonSecondary focusVisible themeToggle",o.style.cssText=`
        position: fixed;
        bottom: var(--space-4);
        right: var(--space-4);
        z-index: 999;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-lg);
        transition: var(--transition);
        box-shadow: var(--shadow);
    `;const s=()=>{o.innerHTML=document.body.classList.contains("themeDark")?"☀️":"🌙"};s(),o.title="Переключить тему",o.setAttribute("aria-label","Переключить тему"),o.addEventListener("click",()=>{const i=document.body.classList.toggle("themeDark");s(),localStorage.setItem(r,i?"dark":"light"),o.style.transform="scale(0.9)",setTimeout(()=>{o.style.transform="scale(1)"},150)}),document.body.appendChild(o),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",i=>{localStorage.getItem(r)||(i.matches?document.body.classList.add("themeDark"):document.body.classList.remove("themeDark"),s())})}
