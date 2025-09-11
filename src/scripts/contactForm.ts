const openBtn = document.getElementById('contactFormOpenButton') as HTMLButtonElement;
const dialog = document.getElementById('contactForm') as HTMLDialogElement;
const closeBtn = document.getElementById('modalClose') as HTMLButtonElement;
const form = document.getElementById('requestForm') as HTMLFormElement;
const errorSpans = form.querySelectorAll('.contactFormError');

openBtn.addEventListener('click', () => {
    dialog.showModal();
});

closeBtn.addEventListener('click', () => {
    dialog.close();
    clearForm();
});

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
        dialog.close();
        clearForm();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim();
    let valid = true;

    if (!name) {
        setError(0, 'Введите имя');
        valid = false;
    }
    if (!email) {
        setError(1, 'Введите email');
        valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError(1, 'Некорректный email');
        valid = false;
    }
    if (!phone) {
        setError(2, 'Введите номер телефона');
        valid = false;
    } else if (!/^\+?\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
        setError(2, 'Некорректный номер телефона');
        valid = false;
    }
    if (!message) {
        setError(3, 'Введите сообщение');
        valid = false;
    }

    if (!valid) return;

    // @ts-ignore
    form.querySelector('button[type="submit"]').textContent = 'Отправка...';
    setTimeout(() => {
        // @ts-ignore
        form.querySelector('button[type="submit"]').textContent = 'Отправить';
        clearForm();
        dialog.close();
        alert('Спасибо! Ваша заявка отправлена.');
    }, 1200);
});

function setError(index: number, message: string) {
    errorSpans[index].textContent = message;
}

function clearErrors() {
    errorSpans.forEach(span => span.textContent = '');
}

function clearForm() {
    form.reset();
    clearErrors();
}
