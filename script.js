document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    const registrationForm = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = nameInput.value.trim();
        const email = emailInput.value.trim();

        // Basic validation
        if (!username || !email) {
            showNotification('يرجى ملء جميع الحقول', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>جاري التسجيل...</span>';

        try {
            const response = await fetch('https://fahad-back.vercel.app/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('تم تسجيل المستخدم بنجاح!', 'success');

                // Clear form
                nameInput.value = '';
                emailInput.value = '';

                // Focus on first field
                nameInput.focus();

                // Optional: Auto redirect after success
                setTimeout(() => {
                    if (confirm('هل تريد عرض البيانات المسجلة؟')) {
                        window.location.href = '/data.html';
                    }
                }, 2000);

            } else {
                showNotification(data.message || 'خطأ في تسجيل المستخدم', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('خطأ في الاتصال بالخادم', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>تسجيل المستخدم</span>';
        }
    });

    // Navigation handlers
    document.getElementById('displayData').addEventListener('click', () => {
        window.location.href = '/data.html';
    });


    // Input validation and enhancement
    nameInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, ''); // Allow Arabic and English letters only
    });

    emailInput.addEventListener('input', function() {
        // Basic email validation feedback
        const isValid = isValidEmail(this.value);
        this.style.borderColor = isValid || this.value === '' ? '#e0e0e0' : '#dc3545';
    });

    // Enter key support
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && document.activeElement !== submitBtn) {
            registrationForm.dispatchEvent(new Event('submit'));
        }
    });

    // Auto-focus on first input
    nameInput.focus();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');

    // Clear any existing timeout
    if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
    }

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    // Auto hide with longer duration for errors
    const duration = type === 'error' ? 5000 : 4000;
    notification.timeoutId = setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Loading state management
function setLoading(button, loading = true) {
    button.disabled = loading;
    if (loading) {
        button.innerHTML = '<span>جاري التحميل...</span>';
    } else {
        button.innerHTML = '<span>تحميل البيانات</span>';
    }
}

// Error handling
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('حدث خطأ غير متوقع', 'error');
});

window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showNotification('حدث خطأ في التطبيق', 'error');
});
