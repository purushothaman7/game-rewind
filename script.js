const games = [
    {
        id: 1,
        title: "Elden Ring",
        platform: "ps5",
        price: 3299,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.webp",
        condition: "Like New",
        inStock: true
    },
    {
        id: 2,
        title: "God of War: Ragnarok",
        platform: "ps5",
        price: 4199,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.webp",
        condition: "New",
        inStock: true
    },
    {
        id: 3,
        title: "Horizon Forbidden West",
        platform: "ps4",
        price: 2499,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4rd0.webp",
        condition: "Good",
        inStock: false
    },
    {
        id: 4,
        title: "The Last of Us Part II",
        platform: "ps4",
        price: 2099,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2eua.webp",
        condition: "Good",
        inStock: true
    },
    {
        id: 5,
        title: "Halo Infinite",
        platform: "xbox",
        price: 2899,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4jy6.webp",
        condition: "Like New",
        inStock: true
    },
    {
        id: 6,
        title: "Forza Horizon 5",
        platform: "xbox",
        price: 3299,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.webp",
        condition: "New",
        inStock: false
    },
    {
        id: 7,
        title: "Cyberpunk 2077",
        platform: "pc",
        price: 2499,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpf.webp",
        condition: "Good",
        inStock: true
    },
    {
        id: 8,
        title: "Red Dead Redemption 2",
        platform: "pc",
        price: 2999,
        image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
        condition: "Excellent",
        inStock: false
    }
];

const gameContainer = document.getElementById('gameContainer');
const filterButtons = document.querySelectorAll('.game-filters .pixel-btn');

// Initialize the page
function init() {
    displayGames(games);
    setupEventListeners();
    addPixelArtEffect();
}

function displayGames(gamesToDisplay) {
    gameContainer.innerHTML = '';
    
    if (gamesToDisplay.length === 0) {
        gameContainer.innerHTML = '<p class="no-games">No games found. Please try a different filter.</p>';
        return;
    }

    gamesToDisplay.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card pixel-border';
        gameCard.dataset.platform = game.platform;
        
        const stockStatus = game.inStock ? 'available' : 'out-of-stock';
        const stockText = game.inStock ? 'Available' : 'Out of Stock';
        
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="game-img">
            <div class="game-info">
                <h3>${game.title}</h3>
                <div class="game-price">₹${game.price}</div>
                <div class="game-condition">Condition: ${game.condition}</div>
                <div class="game-tags">
                    <span class="game-platform platform-${game.platform}">${getPlatformName(game.platform)}</span>
                    <span class="game-stock ${stockStatus}">${stockText}</span>
                </div>
                <button class="pixel-btn inquire-btn" data-game="${game.title}" ${!game.inStock ? 'disabled' : ''}>Inquire Now</button>
            </div>
        `;
        
        gameContainer.appendChild(gameCard);
    });
}

function getPlatformName(platform) {
    const platforms = {
        'ps5': 'PS5',
        'ps4': 'PS4',
        'xbox': 'Xbox',
        'pc': 'PC'
    };
    return platforms[platform] || platform;
}

function setupEventListeners() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            filterGames(filter);
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function filterGames(platform) {
    if (platform === 'all') {
        displayGames(games);
        return;
    }
    
    const filteredGames = games.filter(game => game.platform === platform);
    displayGames(filteredGames);
}

function handleContactSubmit(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

function addPixelArtEffect() {
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('game-card')) {
            e.target.style.animation = 'pixelate 0.3s';
            setTimeout(() => {
                e.target.style.animation = '';
            }, 300);
        }
    });

    const buttons = document.querySelectorAll('.pixel-btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translate(4px, 4px)';
            this.style.boxShadow = 'none';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translate(2px, 2px)';
            this.style.boxShadow = '3px 3px 0 var(--accent)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

function addSvgFilter() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "pixelate");
    filter.setAttribute("x", "0");
    filter.setAttribute("y", "0");
    
    const feFlood = document.createElementNS("http://www.w3.org/2000/svg", "feFlood");
    feFlood.setAttribute("height", "2");
    feFlood.setAttribute("width", "2");
    feFlood.setAttribute("x", "4");
    feFlood.setAttribute("y", "4");
    
    const feComposite = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    feComposite.setAttribute("height", "10");
    feComposite.setAttribute("width", "10");
    
    const feTile = document.createElementNS("http://www.w3.org/2000/svg", "feTile");
    const feComposite2 = document.createElementNS("http://www.w3.org/2000/svg", "feComposite");
    
    const feBlend = document.createElementNS("http://www.w3.org/2000/svg", "feBlend");
    feBlend.setAttribute("in", "SourceGraphic");
    feBlend.setAttribute("in2", "overlay");
    feBlend.setAttribute("operator", "over");
    
    filter.appendChild(feFlood);
    filter.appendChild(feComposite);
    filter.appendChild(feTile);
    filter.appendChild(feComposite2);
    filter.appendChild(feBlend);
    
    svg.appendChild(filter);
    document.body.appendChild(svg);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('inquire-btn') && !e.target.disabled) {
        const gameTitle = e.target.dataset.game;
        const whatsappMessage = `Hi, I'm interested in ${gameTitle}. Is it still available?`;
        const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    }
});

document.addEventListener('DOMContentLoaded', init);
