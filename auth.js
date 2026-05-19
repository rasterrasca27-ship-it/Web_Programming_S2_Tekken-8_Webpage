document.addEventListener('DOMContentLoaded', () => {
    const authToggleButtons = document.querySelectorAll('.auth-toggle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authStatus = document.getElementById('auth-status');
    let isLoggedIn = false;

    if (!authStatus || !loginForm || !signupForm) return;

    function showAuthMessage(message, success = true) {
        authStatus.textContent = message;
        authStatus.classList.toggle('auth-success', success);
        authStatus.classList.toggle('auth-error', !success);
    }

    function switchAuthForm(formName) {
        authToggleButtons.forEach((button) => {
            const active = button.dataset.form === formName;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', active.toString());
        });

        loginForm.classList.toggle('hidden', formName !== 'login');
        signupForm.classList.toggle('hidden', formName !== 'signup');

        if (isLoggedIn) {
            showAuthMessage('u already login', true);
        } else {
            showAuthMessage(
                formName === 'login'
                    ? 'Enter your login details to sign in.'
                    : 'Create an account and then log in.',
                true
            );
        }
    }

    function validateEmail(email) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

    authToggleButtons.forEach((button) => {
        button.addEventListener('click', () => switchAuthForm(button.dataset.form));
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = loginForm.querySelector('#login-email').value.trim();
        const password = loginForm.querySelector('#login-password').value.trim();

        if (!validateEmail(email) || password.length < 6) {
            showAuthMessage('Please enter a valid email and password of at least 6 characters.', false);
            return;
        }

        isLoggedIn = true;
        showAuthMessage('u already login', true);
        loginForm.reset();
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = signupForm.querySelector('#signup-name').value.trim();
        const email = signupForm.querySelector('#signup-email').value.trim();
        const password = signupForm.querySelector('#signup-password').value.trim();
        const confirm = signupForm.querySelector('#signup-confirm').value.trim();

        if (!username || !validateEmail(email) || password.length < 6 || password !== confirm) {
            showAuthMessage('Complete all fields correctly and ensure passwords match.', false);
            return;
        }

        isLoggedIn = true;
        showAuthMessage('u already login', true);
        signupForm.reset();
        switchAuthForm('login');
    });

    switchAuthForm('login');
});
