class ImageSlider {
    constructor(containerId, images) {
        this.container = document.getElementById(containerId);
        this.images = images.filter(img => img && img.html && img.html.includes('imgDescription'));
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error(`Элемент с id "${this.containerId}" не найден`);
            return;
        }
        
        if (this.images.length === 0) {
            this.container.innerHTML = '<p class="no-images">Нет изображений для отображения</p>';
            return;
        }
        
        this.render();
        this.addEventListeners();
    }
    
    render() {
        const imagesHTML = this.images.map((img, index) => {
            return `
                <div class="gallery-item" data-index="${index}" style="${index !== 0 ? 'display: none;' : ''}">
                    <div class="image-wrapper">
                        ${img.html}
                        ${img.title ? `<p class="image-title">${img.title}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        this.container.innerHTML = `
            <div class="slider-wrapper">
                <div class="slider-images">
                    ${imagesHTML}
                </div>
                
                ${this.images.length > 1 ? `
                    <button class="slider-btn prev" data-action="prev">❮</button>
                    <button class="slider-btn next" data-action="next">❯</button>
                    
                    <div class="slider-dots">
                        ${this.images.map((_, index) => `
                            <span class="dot ${index === 0 ? 'active' : ''}" 
                                  data-index="${index}"></span>
                        `).join('')}
                    </div>
                    
                    <div class="slider-counter">
                        <span class="current-slide">1</span> / <span class="total-slides">${this.images.length}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    addEventListeners() {
        if (this.images.length <= 1) return;
        
        // Кнопки навигации
        const prevBtn = this.container.querySelector('[data-action="prev"]');
        const nextBtn = this.container.querySelector('[data-action="next"]');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changeSlide(-1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changeSlide(1));
        }
        
        // Dots
        const dots = this.container.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });
        
        // Клавиатура
        document.addEventListener('keydown', (e) => {
            // Проверяем, что слайдер видим на экране
            const rect = this.container.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.changeSlide(-1);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.changeSlide(1);
                }
            }
        });
    }
    
    changeSlide(direction) {
        const items = this.container.querySelectorAll('.gallery-item');
        const dots = this.container.querySelectorAll('.dot');
        const currentSpan = this.container.querySelector('.current-slide');
        
        if (!items.length) return;
        
        // Скрываем текущее изображение
        items[this.currentIndex].style.display = 'none';
        
        // Обновляем индекс
        this.currentIndex = (this.currentIndex + direction + items.length) % items.length;
        
        // Показываем новое изображение
        items[this.currentIndex].style.display = 'block';
        
        // Обновляем dots
        if (dots.length) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
        
        // Обновляем счетчик
        if (currentSpan) {
            currentSpan.textContent = this.currentIndex + 1;
        }
    }
    
    goToSlide(index) {
        const items = this.container.querySelectorAll('.gallery-item');
        const dots = this.container.querySelectorAll('.dot');
        const currentSpan = this.container.querySelector('.current-slide');
        
        if (!items.length) return;
        
        // Скрываем текущее изображение
        items[this.currentIndex].style.display = 'none';
        
        // Обновляем индекс
        this.currentIndex = index;
        
        // Показываем новое изображение
        items[this.currentIndex].style.display = 'block';
        
        // Обновляем dots
        if (dots.length) {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === this.currentIndex);
            });
        }
        
        // Обновляем счетчик
        if (currentSpan) {
            currentSpan.textContent = this.currentIndex + 1;
        }
    }
    
    // Метод для обновления изображений
    updateImages(newImages) {
        this.images = newImages.filter(img => img && img.html && img.html.includes('imgDescription'));
        this.currentIndex = 0;
        this.render();
        this.addEventListeners();
    }
    
    // Метод для уничтожения слайдера и очистки
    destroy() {
        this.container.innerHTML = '';
        // Здесь можно добавить удаление обработчиков событий
    }
}

/*
// Использование:
try {
    const slider = new ImageSlider('imageOut', this.images);
    
    // Если нужно обновить изображения позже:
    // slider.updateImages(newImages);
    
} catch (error) {
    console.log("Ошибка загрузки изображения:", error);
    const imageOut = document.getElementById("imageOut");
    if (imageOut) {
        imageOut.innerHTML = '<p class="error">Произошла ошибка при загрузке изображений</p>';
    }
}
    */