// Mobile menu functionality
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    const isExpanded = navMenu.classList.toggle('active');
    btn.setAttribute('aria-expanded', isExpanded);
}

function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    const btn = document.querySelector('.mobile-menu-btn');
    navMenu.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Three.js 3D Background - Floating Embers/Particles
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create particles (embers)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 800;
const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);

for (let i = 0; i < particlesCount * 3; i += 3) {
    posArray[i]     = (Math.random() - 0.5) * 50;
    posArray[i + 1] = (Math.random() - 0.5) * 50;
    posArray[i + 2] = (Math.random() - 0.5) * 50;
    scaleArray[i / 3] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

// Shader material for glowing red embers
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xe60012,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 30;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Mouse interaction with easing
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    // Float particles up
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 1; i < particlesCount * 3; i += 3) {
        positions[i] += 0.02;
        if (positions[i] > 25) {
            positions[i] = -25;
        }
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

// Cover video audio behavior
const coverVideo = document.getElementById('cover-video');
const coverPage = document.getElementById('cover-page');

if (coverVideo) {
    coverVideo.volume = 0.8;
    coverVideo.muted = true;
}

const backgroundAudio = document.getElementById('background-audio');

function updateCoverAudio() {
    if (!coverVideo || !coverPage) return;

    const coverBounds = coverPage.getBoundingClientRect();
    const isCoverVisible = coverBounds.bottom > 0 && coverBounds.top < window.innerHeight;
    const shouldPlaySound = isCoverVisible && window.scrollY < coverPage.offsetHeight;

    coverVideo.muted = !shouldPlaySound;
}

function updateBackgroundAudio() {
    if (!backgroundAudio || !coverPage) return;

    const shouldPlayBackground = window.scrollY >= coverPage.offsetHeight;

    if (shouldPlayBackground) {
        backgroundAudio.play().catch(() => {
            /* play may still fail without user gesture */
        });
    } else {
        backgroundAudio.pause();
        backgroundAudio.currentTime = 0;
    }
}

window.addEventListener('scroll', () => {
    updateCoverAudio();
    updateBackgroundAudio();
});
window.addEventListener('resize', () => {
    updateCoverAudio();
    updateBackgroundAudio();
});
window.addEventListener('load', () => {
    if (backgroundAudio) {
        backgroundAudio.volume = 0.45;
    }

    updateCoverAudio();
    updateBackgroundAudio();

    document.body.addEventListener('click', () => {
        if (!coverVideo || !coverPage) return;
        if (window.scrollY < coverPage.offsetHeight) {
            coverVideo.muted = false;
            coverVideo.play().catch(() => {
                /* play may still fail without user gesture */
            });
        }

        if (backgroundAudio && window.scrollY >= coverPage.offsetHeight) {
            backgroundAudio.play().catch(() => {
                /* play may still fail without user gesture */
            });
        }
    }, { once: true });
});

// Login / Sign Up interaction
(function initAuthSection() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    const authToggleButtons = authSection.querySelectorAll('.auth-toggle');
    const loginForm = authSection.querySelector('#login-form');
    const signupForm = authSection.querySelector('#signup-form');
    const authStatus = authSection.querySelector('#auth-status');

    function showAuthMessage(message, success = true) {
        authStatus.textContent = message;
        authStatus.classList.toggle('auth-success', success);
        authStatus.classList.toggle('auth-error', !success);
    }

    let isLoggedIn = false;

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
})();