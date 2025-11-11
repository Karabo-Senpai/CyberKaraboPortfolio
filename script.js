  // Loading Screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
            }, 3000);
        });

        // Input Sanitization & Validation
        function sanitizeInput(input) {
            // Remove HTML tags and dangerous characters
            const div = document.createElement('div');
            div.textContent = input;
            let sanitized = div.innerHTML;
            
            // Remove script tags and event handlers
            sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
            sanitized = sanitized.replace(/javascript:/gi, '');
            
            // Remove SQL injection patterns
            const sqlPatterns = [
                /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/gi,
                /(\bUNION\b|\bJOIN\b)/gi,
                /(--|;|\/\*|\*\/)/g,
                /(\bOR\b\s+\d+\s*=\s*\d+|\bAND\b\s+\d+\s*=\s*\d+)/gi
            ];
            
            sqlPatterns.forEach(pattern => {
                sanitized = sanitized.replace(pattern, '');
            });
            
            return sanitized.trim();
        }

        function validateEmail(email) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
        }

        function validateName(name) {
            const nameRegex = /^[a-zA-Z\s'-]{2,100}$/;
            return nameRegex.test(name);
        }

        function showError(inputId, errorId, message) {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            input.classList.add('error');
            error.textContent = message;
            error.classList.add('show');
        }

        function clearError(inputId, errorId) {
            const input = document.getElementById(inputId);
            const error = document.getElementById(errorId);
            input.classList.remove('error');
            error.classList.remove('show');
        }

        // Contact Form Handler with Security
      document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formStatus = document.getElementById('form-status');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'TRANSMITTING...';
  submitBtn.style.opacity = '0.6';

  const formData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim()
  };

  try {
    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
      formStatus.className = 'block text-center p-6 rounded-xl mt-6 font-bold text-xl neon-border-animated bg-green-100 text-green-600';
      formStatus.innerHTML = '> MESSAGE_QUEUED_FOR_TRANSMISSION<br/>> SECURITY_CHECK: PASSED';
      e.target.reset();
    } else {
      throw new Error(result.message || 'Transmission failed');
    }
  } catch (err) {
    formStatus.className = 'block text-center p-6 rounded-xl mt-6 font-bold text-xl neon-border-animated bg-red-100 text-red-600';
    formStatus.innerHTML = '> TRANSMISSION_ERROR<br/>> ' + err.message;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'TRANSMIT_MESSAGE';
    submitBtn.style.opacity = '1';
    setTimeout(() => (formStatus.className = 'hidden'), 5000);
  }
});


        // Real-time validation feedback
        document.getElementById('name').addEventListener('blur', function() {
            const name = sanitizeInput(this.value);
            if (name && !validateName(name)) {
                showError('name', 'name-error', 'Invalid name format');
            } else {
                clearError('name', 'name-error');
            }
        });

        document.getElementById('email').addEventListener('blur', function() {
            const email = sanitizeInput(this.value);
            if (email && !validateEmail(email)) {
                showError('email', 'email-error', 'Invalid email format');
            } else {
                clearError('email', 'email-error');
            }
        });

        // Enhanced Matrix Rain Effect with Hacker Glitch
        const canvas = document.getElementById('matrix-canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];
        const speeds = [];
        const glitchChance = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -canvas.height / fontSize;
            speeds[i] = Math.random() * 0.8 + 0.3;
            glitchChance[i] = Math.random();
        }

        let glitchActive = false;
        let glitchTimer = 0;

        function drawMatrix() {
            // Create black background with slight fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = fontSize + 'px monospace';

            // Random glitch effect
            if (Math.random() > 0.98) {
                glitchActive = true;
                glitchTimer = 10;
            }

            if (glitchActive && glitchTimer > 0) {
                ctx.save();
                ctx.translate(Math.random() * 4 - 2, 0);
                glitchTimer--;
                if (glitchTimer === 0) glitchActive = false;
            }

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;
                
                // Create gradient for each character
                const gradient = ctx.createLinearGradient(0, y - fontSize * 10, 0, y);
                gradient.addColorStop(0, 'rgba(0, 255, 0, 0)');
                gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(0, 255, 0, 1)');
                
                ctx.fillStyle = gradient;
                
                // Random brightness variation
                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 20;
                } else {
                    ctx.shadowColor = '#00ff00';
                    ctx.shadowBlur = 10;
                }
                
                ctx.fillText(char, x, y);
                
                // Random glitch on individual characters
                if (glitchActive && Math.random() > 0.9) {
                    ctx.fillStyle = '#ff00ff';
                    ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x + Math.random() * 4 - 2, y);
                }

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                    speeds[i] = Math.random() * 0.8 + 0.3;
                }
                
                drops[i] += speeds[i];
            }

            if (glitchActive) {
                ctx.restore();
            }

            ctx.shadowBlur = 0;
        }

        setInterval(drawMatrix, 33);

        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Recalculate columns
            const newColumns = canvas.width / fontSize;
            while (drops.length < newColumns) {
                drops.push(Math.random() * -canvas.height / fontSize);
                speeds.push(Math.random() * 0.8 + 0.3);
                glitchChance.push(Math.random());
            }
        });

        // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  hamburgerIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
});

// Optional: close menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    hamburgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
  });
});


        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    mobileMenu.classList.remove('active');
                }
            });
        });

        // Intersection Observer for Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            observer.observe(section);
        });

        // Active Navigation with Enhanced Effects
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('nav a').forEach(link => {
                        link.classList.remove('neon-glow-ultra');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('neon-glow-ultra');
                        }
                    });
                }
            });
        });

        // Prevent XSS attacks on dynamic content
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }



        const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Highlight active button
    filterBtns.forEach(b => b.classList.remove('bg-green-500', 'text-black'));
    btn.classList.add('bg-green-500', 'text-black');

    // Show/hide projects
    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

//Auto Date Script
const year = document.getElementById('currentYear');
year.textContent = new Date().getFullYear();