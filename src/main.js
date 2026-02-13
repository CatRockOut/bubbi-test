(() => {
	const MOUNT_SELECTOR = '.product-about__title-inner';
	const ROOT_ID = 'bubbi-social-root';
	const STYLE_ID = 'bubbi-social-style';
	const REMOUNT_CHECK_INTERVAL = 1000;
	const TOAST_DISPLAY_DURATION = 4000;
	const TOAST_STAGGER_DELAY = 1200;
	
	const messages = [
		{ title: 'Popular today', description: 'People are checking this out.' },
		{ title: 'Recently added', description: 'Customers added this to cart.' },
		{ title: 'Selling fast', description: 'Don`t miss out.' },
	];
	
	const injectStyles = () => {
		if (document.getElementById(STYLE_ID)) return;
		
		const style = document.createElement('style');
		style.id = STYLE_ID;
		style.textContent = `
          #${ROOT_ID} {
             margin: 12px 6px;
          }
          
          .bubbi-toast {
             display: flex;
             align-items: flex-start;
             gap: 10px;
             max-width: 440px;
             padding: 10px 12px;
             margin-bottom: 8px;
             font-size: 14px;
             background-color: #fff;
             border: 1px solid rgba(0, 0, 0, .1);
             border-radius: 10px;
             box-shadow: 0 6px 18px rgba(0, 0, 0, .1);
             opacity: 0;
             transform: translateY(8px);
             transition: opacity .3s ease, transform .3s ease;
          }
          
          .bubbi-toast.show {
             opacity: 1;
             transform: translateY(0);
          }
          
          .bubbi-dot {
             flex-shrink: 0;
             width: 8px;
             height: 8px;
             margin-top: 6px;
             background-color: #22c55e;
             border-radius: 50%;
          }
          
          .bubbi-content {
             display: flex;
             flex-direction: column;
          }
          
          .bubbi-title {
             font-weight: 700;
          }
          
          .bubbi-replay {
             display: inline-block;
             font-size: 18px;
             color: blue;
             text-decoration: underline;
             cursor: pointer;
          }
       `;
		
		document.head.appendChild(style);
	};
	
	const createToastHTML = ({ title, description }) => `
       <div class="bubbi-toast">
          <div class="bubbi-dot"></div>
          <div class="bubbi-content">
             <div class="bubbi-title">${title}</div>
             <div class="bubbi-text">${description}</div>
          </div>
       </div>
    `;
	
	const animateToastIn = (toast) => {
		requestAnimationFrame(() => toast.classList.add('show'));
	};
	
	const animateToastOut = (toast, onComplete) => {
		toast.classList.remove('show');
		toast.addEventListener('transitionend', onComplete, { once: true });
	};
	
	const showMessages = (root) => {
		if (root.querySelector('.bubbi-toast')) return;
		
		root.innerHTML = '';
		let visibleCount = 0;
		
		messages.forEach((message, index) => {
			setTimeout(() => {
				root.insertAdjacentHTML('beforeend', createToastHTML(message));
				const toast = root.lastElementChild;
				
				animateToastIn(toast);
				visibleCount++;
				
				setTimeout(() => {
					animateToastOut(toast, () => {
						toast.remove();
						visibleCount--;
						
						if (visibleCount === 0) {
							showReplayButton(root);
						}
					});
				}, TOAST_DISPLAY_DURATION);
				
			}, index * TOAST_STAGGER_DELAY);
		});
	};
	
	const showReplayButton = (root) => {
		const button = document.createElement('span');
		button.className = 'bubbi-replay';
		button.textContent = 'Show messages again';
		
		button.onclick = () => {
			button.remove();
			showMessages(root);
		};
		
		root.appendChild(button);
	};
	
	const ensureMounted = () => {
		injectStyles();
		
		const mountPoint = document.querySelector(MOUNT_SELECTOR);
		if (!mountPoint || document.getElementById(ROOT_ID)) return;
		
		const root = document.createElement('div');
		root.id = ROOT_ID;
		
		mountPoint.insertAdjacentElement('afterend', root);
		setTimeout(() => showMessages(root), 300);
	};
	
	ensureMounted();
	setInterval(ensureMounted, REMOUNT_CHECK_INTERVAL);
})();
