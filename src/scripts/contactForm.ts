// Интерфейсы для типизации
interface FormData {
    name: string;
    email: string;
    phone?: string;
    message: string;
    subject?: string;
    consent?: boolean;
}

interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Класс для работы с модальными окнами
class Modal {
    private overlay: HTMLElement | null;
    private content: HTMLElement | null;
    private closeButton: HTMLElement | null;
    private isOpen: boolean = false;

    constructor(modalId: string) {
        this.overlay = document.getElementById(modalId);
        this.content = this.overlay?.querySelector('.modalContent') || null;
        this.closeButton = this.overlay?.querySelector('.modalClose') || null;

        this.bindEvents();
    }

    private bindEvents(): void {
        // Закрытие по клику на крестик
        this.closeButton?.addEventListener('click', () => this.close());

        // Закрытие по клику на оверлей
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open(): void {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            this.isOpen = true;

            // Блокируем прокрутку страницы
            document.body.style.overflow = 'hidden';

            // Устанавливаем фокус на первый интерактивный элемент
            const firstInput = this.content?.querySelector('input, textarea, button') as HTMLElement;
            firstInput?.focus();
        }
    }

    close(): void {
        if (this.overlay) {
            this.overlay.style.display = 'none';
            this.isOpen = false;

            // Восстанавливаем прокрутку страницы
            document.body.style.overflow = '';
        }
    }
}

// Класс для валидации форм
class FormValidator {
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    private static readonly PHONE_REGEX = /^[+]?[\d\s\-()]{10,}$/;

    static validate(formData: FormData): ValidationResult {
        const errors: Record<string, string> = {};

        // Валидация имени
        if (!formData.name.trim()) {
            errors.name = 'Поле "Имя" обязательно для заполнения';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Имя должно содержать минимум 2 символа';
        }

        // Валидация email
        if (!formData.email.trim()) {
            errors.email = 'Поле "Email" обязательно для заполнения';
        } else if (!this.EMAIL_REGEX.test(formData.email.trim())) {
            errors.email = 'Введите корректный email адрес';
        }

        // Валидация телефона (ОБЯЗАТЕЛЬНОЕ поле)
        if (!formData.phone || !formData.phone.trim()) {
            errors.phone = 'Поле "Телефон" обязательно для заполнения';
        } else if (!this.PHONE_REGEX.test(formData.phone.trim())) {
            errors.phone = 'Введите корректный номер телефона (минимум 10 цифр)';
        }

        // Валидация сообщения
        if (!formData.message.trim()) {
            errors.message = 'Поле "Сообщение" обязательно для заполнения';
        } else if (formData.message.trim().length < 10) {
            errors.message = 'Сообщение должно содержать минимум 10 символов';
        }

        // Валидация согласия (если есть чекбокс)
        if (formData.consent !== undefined && !formData.consent) {
            errors.consent = 'Необходимо согласие на обработку персональных данных';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

// Класс для работы с формами
class ContactForm {
    private form!: HTMLFormElement;
    private submitButton: HTMLButtonElement | null = null;

    constructor(formId: string) {
        const form = document.getElementById(formId) as HTMLFormElement;
        if (!form) {
            console.warn(`Form with id "${formId}" not found`);
            return;
        }

        this.form = form;
        this.submitButton = form.querySelector('button[type="submit"]');

        this.bindEvents();
    }

    private bindEvents(): void {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Очистка ошибок при вводе
        this.form.addEventListener('input', this.clearFieldError.bind(this));
        this.form.addEventListener('change', this.clearFieldError.bind(this));
    }

    private clearFieldError(event: Event): void {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (target) {
            const errorElement = document.getElementById(`${target.id}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    private getFormData(): FormData {
        const formData = new window.FormData(this.form);

        return {
            name: formData.get('name') as string || '',
            email: formData.get('email') as string || '',
            phone: formData.get('phone') as string || '',
            message: formData.get('message') as string || '',
            subject: formData.get('subject') as string || '',
            consent: formData.get('consent') === 'on'
        };
    }

    private displayErrors(errors: Record<string, string>): void {
        // Очищаем все предыдущие ошибки
        this.form.querySelectorAll('.formError').forEach(el => {
            el.textContent = '';
        });

        // Отображаем новые ошибки
        Object.entries(errors).forEach(([field, message]) => {
            const errorElement = document.getElementById(`${field}Error`) ||
                                document.getElementById(`contact${field.charAt(0).toUpperCase() + field.slice(1)}Error`);
            if (errorElement) {
                errorElement.textContent = message;
            }
        });
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.textContent = 'Отправка...';
        }

        try {
            const formData = this.getFormData();
            const validation = FormValidator.validate(formData);

            if (!validation.isValid) {
                this.displayErrors(validation.errors);
                return;
            }

            // Имитация отправки данных
            await this.submitForm(formData);

            // Успешная отправка
            this.showSuccessMessage();
            this.form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showErrorMessage('Произошла ошибка при отправке формы. Попробуйте еще раз.');
        } finally {
            if (this.submitButton) {
                this.submitButton.disabled = false;
                this.submitButton.textContent = this.submitButton.closest('#contactModal') ? 'Отправить' : 'Отправить сообщение';
            }
        }
    }

    private async submitForm(formData: FormData): Promise<void> {
        // Имитация API запроса
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', formData);
                resolve();
            }, 1500);
        });
    }

    private showSuccessMessage(): void {
        // Создаем уведомление об успешной отправке
        const notification = document.createElement('div');
        notification.innerHTML = `
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
        `;

        document.body.appendChild(notification);

        // Удаляем уведомление через 4 секунды
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    private showErrorMessage(message: string): void {
        const notification = document.createElement('div');
        notification.innerHTML = `
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
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация модального окна (только на главной странице)
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        const modal = new Modal('contactModal');

        // Кнопка открытия модального окна
        const openButton = document.getElementById('contactFormOpenButton');
        openButton?.addEventListener('click', () => modal.open());

        // Инициализация формы в модальном окне
        new ContactForm('contactForm');
    }

    // Инициализация формы на странице контактов
    new ContactForm('contactPageForm');

    // Инициализация переключателя темы (опционально)
    initThemeToggle();
});

// Функция для переключения темы
function initThemeToggle(): void {
    const THEME_KEY = 'theme';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Применяем сохраненную тему или системную
    const savedTheme = localStorage.getItem(THEME_KEY);
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (shouldUseDark) {
        document.body.classList.add('themeDark');
    }

    // Создаем кнопку переключения темы
    const themeToggle = document.createElement('button');
    themeToggle.className = 'buttonSecondary focusVisible themeToggle';
    themeToggle.style.cssText = `
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
    `;

    // Функция для обновления иконки
    const updateIcon = () => {
        themeToggle.innerHTML = document.body.classList.contains('themeDark') ? '☀️' : '🌙';
    };

    updateIcon();
    themeToggle.title = 'Переключить тему';
    themeToggle.setAttribute('aria-label', 'Переключить тему');

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('themeDark');
        updateIcon();
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');

        // Добавляем небольшой эффект при переключении
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });

    document.body.appendChild(themeToggle);

    // Слушаем изменение системной темы
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(THEME_KEY)) {
            if (e.matches) {
                document.body.classList.add('themeDark');
            } else {
                document.body.classList.remove('themeDark');
            }
            updateIcon();
        }
    });
}

// Экспорт для возможного использования в других модулях
export { Modal, ContactForm, FormValidator };
