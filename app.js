/* ========================================
   AMINENT LABS — Global JavaScript
   ======================================== */

// --- Apply Saved Theme (before render to avoid flash) ---
(function() {
  var saved = localStorage.getItem('aminent_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

// --- Age Verification Gate ---
(function() {
  if (sessionStorage.getItem('aminent_age_verified')) return;

  // Create overlay
  var overlay = document.createElement('div');
  overlay.className = 'age-gate-overlay';
  overlay.innerHTML =
    '<div class="age-gate">' +
      '<div class="age-gate-logo">' +
        '<img src="newaminologo.png" alt="AMINENT LABS">' +
      '</div>' +
      '<div class="age-gate-divider"></div>' +
      '<h2>Age Verification</h2>' +
      '<p>You must be at least <strong>21 years of age</strong> to access this website. All products are intended solely for research use.</p>' +
      '<div class="age-gate-actions">' +
        '<button class="btn btn-primary" id="ageGateConfirm">Yes, I am 21+</button>' +
        '<button class="age-gate-deny" id="ageGateDeny">No, I am not</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  document.getElementById('ageGateConfirm').addEventListener('click', function() {
    sessionStorage.setItem('aminent_age_verified', 'true');
    var gate = overlay.querySelector('.age-gate');
    gate.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0, 1), opacity 0.4s ease';
    gate.style.transform = 'scale(0.92)';
    gate.style.opacity = '0';
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(function() {
      overlay.remove();
      document.body.style.overflow = '';
    }, 500);
  });

  document.getElementById('ageGateDeny').addEventListener('click', function() {
    var gate = overlay.querySelector('.age-gate');
    gate.style.animation = 'none';
    gate.offsetHeight; // trigger reflow
    gate.style.animation = 'ageGateSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    gate.innerHTML =
      '<div class="age-gate-logo">' +
        '<img src="newaminologo.png" alt="AMINENT LABS">' +
      '</div>' +
      '<div class="age-gate-divider"></div>' +
      '<div class="age-gate-denied">' +
        '<h2>Access Denied</h2>' +
        '<p>You must be 21 or older to access this website.</p>' +
      '</div>';
  });
})();

// --- Mobile Nav Toggle ---
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function() {
      links.classList.toggle('open');
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = this.parentElement;
      var isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function(i) {
        i.classList.remove('active');
      });
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Scroll Fade-In Animations ---
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Lazy Load Images ---
  document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    }
  });

  // --- Back to Top ---
  var backBtn = document.getElementById('backToTop');
  if (backBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    });
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Sticky Cart on Product Detail ---
  var stickyCart = document.getElementById('stickyCart');
  if (stickyCart) {
    var trigger = document.querySelector('.product-dosage');
    if (trigger) {
      window.addEventListener('scroll', function() {
        var rect = trigger.getBoundingClientRect();
        if (rect.bottom < 0) {
          stickyCart.classList.add('visible');
        } else {
          stickyCart.classList.remove('visible');
        }
      });
    }
  }

  // --- Product Filter/Search ---
  var searchInput = document.getElementById('productSearch');
  var filterTags = document.querySelectorAll('.filter-tag');
  var productCards = document.querySelectorAll('.product-card[data-name]');

  if (searchInput && productCards.length > 0) {
    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase().trim();
      filterTags.forEach(function(t) { t.classList.remove('active'); });
      document.querySelector('.filter-tag[data-filter="all"]')?.classList.add('active');
      filterProducts(query, 'all');
    });
  }

  if (filterTags.length > 0) {
    filterTags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        filterTags.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        var filter = this.getAttribute('data-filter');
        if (searchInput) searchInput.value = '';
        filterProducts('', filter);
      });
    });
  }

  function filterProducts(query, category) {
    productCards.forEach(function(card) {
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var cat = (card.getAttribute('data-category') || '').toLowerCase();
      var matchQuery = !query || name.includes(query);
      var matchCat = !category || category === 'all' || cat === category;
      card.style.display = (matchQuery && matchCat) ? '' : 'none';
    });
  }

  // --- Cart Drawer ---
  initCartDrawer();
  updateCartCount();

  // --- Lightbox ---
  initLightbox();

  // --- Cookie Banner ---
  initCookieBanner();

  // --- Theme Toggle ---
  initThemeToggle();

  // --- Cart Page ---
  if (document.getElementById('cartPageItems')) {
    renderCartPage();
  }

  // --- Checkout Page ---
  if (document.getElementById('checkoutForm')) {
    renderCheckoutSummary();
  }

  // --- Confirmation Page ---
  if (document.getElementById('confirmationDetails')) {
    renderConfirmation();
  }
});

// ========================================
// Cart Core
// ========================================

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('aminent_cart') || '[]');
  } catch(e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('aminent_cart', JSON.stringify(cart));
  updateCartCount();
  renderCartDrawer();
  if (document.getElementById('cartPageItems')) {
    renderCartPage();
  }
}

// ========================================
// Toast Notifications
// ========================================

function showToast(message, type) {
  type = type || 'info';

  // Create container if it doesn't exist
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }

  // Icon SVGs
  var icons = {
    success: '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    error: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  };

  // Create toast element
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML =
    '<div class="toast-icon">' + (icons[type] || icons.info) + '</div>' +
    '<span class="toast-message">' + message + '</span>' +
    '<button class="toast-close" aria-label="Close">' +
      '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>';

  container.appendChild(toast);

  // Dismiss function
  function dismiss() {
    if (toast.classList.contains('toast-dismiss')) return;
    toast.classList.add('toast-dismiss');
    setTimeout(function() {
      toast.remove();
    }, 300);
  }

  // Close button
  toast.querySelector('.toast-close').addEventListener('click', dismiss);

  // Auto-dismiss after 3 seconds
  setTimeout(dismiss, 3000);
}

function addToCart(name, price, dosage) {
  var cart = getCart();
  var existing = cart.find(function(item) { return item.name === name; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name: name, price: price, dosage: dosage, qty: 1 });
  }
  saveCart(cart);
  showToast('Added to cart!', 'success');
  openCartDrawer();

  // Visual feedback on button
  var btns = document.querySelectorAll('.btn-cart');
  btns.forEach(function(btn) {
    if (btn.getAttribute('data-name') === name) {
      var orig = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/></svg> Added';
      btn.style.background = '#2E7D32';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 1200);
    }
  });
}

function updateQty(name, delta) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.name === name; });
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(function(i) { return i.name !== name; });
    }
  }
  saveCart(cart);
}

function removeFromCart(name) {
  var cart = getCart().filter(function(i) { return i.name !== name; });
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
}

function updateCartCount() {
  var cart = getCart();
  var total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  var badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(function(badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ========================================
// Cart Drawer
// ========================================

function initCartDrawer() {
  // Create drawer HTML
  var overlay = document.createElement('div');
  overlay.className = 'cart-drawer-overlay';
  overlay.addEventListener('click', closeCartDrawer);

  var drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.id = 'cartDrawer';
  drawer.innerHTML = '<div class="cart-drawer-header">' +
    '<h3>Your Cart</h3>' +
    '<button class="cart-drawer-close" onclick="closeCartDrawer()">' +
    '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button></div>' +
    '<div class="cart-drawer-items" id="cartDrawerItems"></div>' +
    '<div class="cart-drawer-footer" id="cartDrawerFooter"></div>';

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  // Hook up cart badge clicks to open drawer
  document.querySelectorAll('.cart-badge').forEach(function(badge) {
    badge.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
  });

  renderCartDrawer();
}

function openCartDrawer() {
  document.querySelector('.cart-drawer-overlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  document.querySelector('.cart-drawer-overlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  var itemsEl = document.getElementById('cartDrawerItems');
  var footerEl = document.getElementById('cartDrawerFooter');
  if (!itemsEl || !footerEl) return;

  var cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-drawer-empty">' +
      '<svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>' +
      '<p>Your cart is empty</p>' +
      '<a href="products.html" class="btn btn-primary btn-sm">Browse Peptides</a></div>';
    footerEl.style.display = 'none';
    return;
  }

  footerEl.style.display = '';

  var productImages = {
    'GLP-3 RT': 'vialpics/transGLP3RT.png',
    'BPC-157': 'vialpics/transBPC.png',
    'GHK-Cu': 'vialpics/transGHKCU.png'
  };

  var html = '';
  cart.forEach(function(item) {
    var lineTotal = (item.price * item.qty).toFixed(2);
    var imgSrc = productImages[item.name];
    var imgHtml = imgSrc
      ? '<img src="' + imgSrc + '" alt="' + item.name + '">'
      : '<svg viewBox="0 0 60 140" fill="none" style="width:28px;height:auto;"><rect x="15" y="0" width="30" height="8" rx="2" fill="#C8CED6"/><rect x="12" y="8" width="36" height="6" rx="1" fill="#B0B8C1"/><rect x="18" y="14" width="24" height="110" rx="4" fill="#E8EDF2" stroke="#C8CED6" stroke-width="1"/></svg>';

    html += '<div class="cart-item">' +
      '<div class="cart-item-img">' + imgHtml + '</div>' +
      '<div class="cart-item-info">' +
      '<div class="cart-item-name">' + item.name + '</div>' +
      '<div class="cart-item-dosage">' + item.dosage + '</div>' +
      '<div class="cart-item-controls">' +
      '<button class="cart-qty-btn" onclick="updateQty(\'' + item.name + '\', -1)">−</button>' +
      '<span class="cart-item-qty">' + item.qty + '</span>' +
      '<button class="cart-qty-btn" onclick="updateQty(\'' + item.name + '\', 1)">+</button>' +
      '</div>' +
      '</div>' +
      '<div class="cart-item-end">' +
      '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.name + '\')" title="Remove">' +
      '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>' +
      '</button>' +
      '<div class="cart-item-price">$' + lineTotal + '</div>' +
      '</div>' +
      '</div>';
  });
  itemsEl.innerHTML = html;

  var total = getCartTotal().toFixed(2);
  footerEl.innerHTML = '<div class="cart-subtotal">' +
    '<span class="cart-subtotal-label">Subtotal</span>' +
    '<span class="cart-subtotal-value">$' + total + '</span></div>' +
    '<a href="cart.html" class="btn btn-primary" style="display:block;text-align:center;">View Cart & Checkout</a>' +
    '<button class="cart-continue" onclick="closeCartDrawer()">Continue Shopping</button>';
}

// ========================================
// Cart Page
// ========================================

function renderCartPage() {
  var itemsEl = document.getElementById('cartPageItems');
  var summaryEl = document.getElementById('cartPageSummary');
  var emptyEl = document.getElementById('cartEmptyState');
  var gridEl = document.getElementById('cartPageGrid');
  var headingEl = document.getElementById('cartHeading');
  if (!itemsEl) return;

  var cart = getCart();

  // Update heading with item count
  if (headingEl) {
    var totalItems = cart.reduce(function(sum, i) { return sum + i.qty; }, 0);
    headingEl.textContent = cart.length === 0 ? 'Your Cart' : 'Your Cart (' + totalItems + (totalItems === 1 ? ' item' : ' items') + ')';
  }

  if (cart.length === 0) {
    itemsEl.style.display = 'none';
    if (gridEl) gridEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (gridEl) gridEl.style.display = '';
  itemsEl.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  // Product data map
  var productData = {
    'GLP-3 RT': { link: 'product-glp3rt.html', img: 'vialpics/transGLP3RT.png' },
    'BPC-157': { link: 'product-bpc157.html', img: 'vialpics/transBPC.png' },
    'GHK-Cu': { link: 'product-ghkcu.html', img: 'vialpics/transGHKCU.png' },
  };

  var html = '';
  cart.forEach(function(item) {
    var lineTotal = (item.price * item.qty).toFixed(2);
    var data = productData[item.name] || { link: 'products.html', img: '' };
    var imgHtml = data.img
      ? '<img src="' + data.img + '" alt="' + item.name + '">'
      : '<svg viewBox="0 0 60 140" fill="none" style="width:40px;height:auto;"><rect x="15" y="0" width="30" height="8" rx="2" fill="#C8CED6"/><rect x="12" y="8" width="36" height="6" rx="1" fill="#B0B8C1"/><rect x="18" y="14" width="24" height="110" rx="4" fill="#E8EDF2" stroke="#C8CED6" stroke-width="1"/></svg>';

    html += '<div class="cart-page-item">' +
      '<div class="cart-page-item-img"><a href="' + data.link + '">' + imgHtml + '</a></div>' +
      '<div class="cart-page-item-info">' +
      '<div class="cart-page-item-name"><a href="' + data.link + '">' + item.name + '</a></div>' +
      '<div class="cart-page-item-dosage">' + item.dosage + ' &middot; $' + item.price.toFixed(2) + ' each</div>' +
      '</div>' +
      '<div class="cart-page-controls">' +
      '<button class="cart-qty-btn" onclick="updateQty(\'' + item.name + '\', -1)">−</button>' +
      '<span class="cart-item-qty">' + item.qty + '</span>' +
      '<button class="cart-qty-btn" onclick="updateQty(\'' + item.name + '\', 1)">+</button>' +
      '</div>' +
      '<div class="cart-page-end">' +
      '<div class="cart-page-price">$' + lineTotal + '</div>' +
      '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.name + '\')" title="Remove">' +
      '<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>' +
      '</button>' +
      '</div>' +
      '</div>';
  });
  itemsEl.innerHTML = html;

  if (summaryEl) {
    var subtotal = getCartTotal();
    var shipping = subtotal >= 150 ? 0 : 9.95;
    var total = subtotal + shipping;
    summaryEl.innerHTML = '<h4>Order Summary</h4>' +
      '<div class="cart-summary-row">' +
      '<span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>' +
      '<div class="cart-summary-row">' +
      '<span>Shipping</span><span>' + (shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)) + '</span></div>' +
      (shipping > 0 ? '<div class="cart-summary-row" style="font-size:0.8rem;color:var(--text-light);padding-top:0;"><span>Free shipping on orders over $150</span></div>' : '') +
      '<div class="cart-summary-row total">' +
      '<span>Total</span><span>$' + total.toFixed(2) + '</span></div>' +
      '<a href="checkout.html" class="btn btn-primary" style="display:block;text-align:center;">Proceed to Checkout</a>' +
      '<div class="cart-trust-signals">' +
      '<div class="cart-trust-item"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Secure & encrypted checkout</span></div>' +
      '<div class="cart-trust-item"><svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><span>Free shipping on orders over $150</span></div>' +
      '<div class="cart-trust-item"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>COA included with every order</span></div>' +
      '<div class="cart-trust-item"><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg><span>For Research Use Only</span></div>' +
      '</div>';
  }
}

function clearCart() {
  localStorage.removeItem('aminent_cart');
  updateCartCount();
  renderCartDrawer();
  if (document.getElementById('cartPageItems')) {
    renderCartPage();
  }
}

// ========================================
// Checkout Page
// ========================================

function renderCheckoutSummary() {
  var cart = getCart();
  var summaryEl = document.getElementById('checkoutSummary');
  var gridEl = document.getElementById('checkoutGrid');
  var emptyEl = document.getElementById('checkoutEmpty');

  if (cart.length === 0) {
    if (gridEl) gridEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (gridEl) gridEl.style.display = '';
  if (emptyEl) emptyEl.style.display = 'none';

  if (!summaryEl) return;

  var subtotal = getCartTotal();
  var shipping = subtotal >= 150 ? 0 : 9.95;
  var total = subtotal + shipping;

  var itemsHtml = '<h4>Order Summary</h4>';
  cart.forEach(function(item) {
    itemsHtml += '<div class="checkout-summary-item">' +
      '<div class="checkout-summary-item-name">' +
      '<span>' + item.name + '</span>' +
      '<span class="checkout-summary-item-qty">x' + item.qty + '</span>' +
      '</div>' +
      '<span>$' + (item.price * item.qty).toFixed(2) + '</span></div>';
  });

  itemsHtml += '<div style="border-top:1px solid var(--border);margin-top:0.75rem;padding-top:0.75rem;">' +
    '<div class="cart-summary-row"><span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>' +
    '<div class="cart-summary-row"><span>Shipping</span><span>' + (shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)) + '</span></div>' +
    '<div class="cart-summary-row total"><span>Total</span><span>$' + total.toFixed(2) + '</span></div></div>' +
    '<div class="cart-trust-signals">' +
    '<div class="cart-trust-item"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Secure & encrypted</span></div>' +
    '<div class="cart-trust-item"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg><span>COA included</span></div>' +
    '</div>';

  summaryEl.innerHTML = itemsHtml;
}

async function submitOrder(e) {
  e.preventDefault();
  var form = e.target;
  var btn = document.getElementById('checkoutSubmit');

  // Disable button
  btn.disabled = true;
  btn.textContent = 'Placing Order...';

  // Gather order data
  var cart = getCart();
  var subtotal = getCartTotal();
  var shipping = subtotal >= 150 ? 0 : 9.95;

  var order = {
    id: 'AMN-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    email: form.email.value,
    name: form.firstName.value + ' ' + form.lastName.value,
    company: form.company.value || '',
    address: form.address.value + (form.address2.value ? ', ' + form.address2.value : ''),
    city: form.city.value,
    state: form.state.value,
    zip: form.zip.value,
    items: cart,
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping
  };

  // Save order to localStorage
  localStorage.setItem('aminent_last_order', JSON.stringify(order));

  // Save to Supabase if logged in
  try {
    var session = typeof getSession === 'function' ? await getSession() : null;
    if (session && typeof supabase !== 'undefined') {
      var user = session.user;
      await supabase.from('orders').insert({
        user_id: user.id,
        order_id: order.id,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        status: 'Processing',
        email: order.email,
        shipping_address: {
          name: order.name,
          company: order.company,
          address: order.address,
          city: order.city,
          state: order.state,
          zip: order.zip
        }
      });

      // Send order confirmation email
      if (typeof sendOrderConfirmation === 'function') {
        sendOrderConfirmation(order);
      }
    }
  } catch (err) {
    console.log('Order saved locally, Supabase sync skipped:', err);
  }

  // Process
  setTimeout(function() {
    clearCart();
    window.location.href = 'confirmation.html';
  }, 1000);
}

// ========================================
// Confirmation Page
// ========================================

function renderConfirmation() {
  var detailsEl = document.getElementById('confirmationDetails');
  if (!detailsEl) return;

  var order;
  try {
    order = JSON.parse(localStorage.getItem('aminent_last_order'));
  } catch(e) {
    order = null;
  }

  if (!order) {
    detailsEl.innerHTML = '<p style="color:var(--text-secondary);">No order details found.</p>';
    return;
  }

  var html = '<div class="confirmation-detail-row"><span>Order ID</span><span><strong>' + order.id + '</strong></span></div>' +
    '<div class="confirmation-detail-row"><span>Date</span><span>' + order.date + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Email</span><span>' + order.email + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Ship to</span><span>' + order.name + ', ' + order.city + ', ' + order.state + ' ' + order.zip + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Subtotal</span><span>$' + order.subtotal.toFixed(2) + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Shipping</span><span>' + (order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)) + '</span></div>' +
    '<div class="confirmation-detail-row total"><span>Total</span><span>$' + order.total.toFixed(2) + '</span></div>';

  if (order.items && order.items.length) {
    html += '<div class="confirmation-items-list"><h4>Items</h4><ul>';
    order.items.forEach(function(item) {
      html += '<li><span>' + item.name + ' (' + item.dosage + ') x' + item.qty + '</span><span>$' + (item.price * item.qty).toFixed(2) + '</span></li>';
    });
    html += '</ul></div>';
  }

  detailsEl.innerHTML = html;
}

// Newsletter form
function handleNewsletter(e) {
  e.preventDefault();
  var input = e.target.querySelector('input');
  if (input && input.value) {
    var btn = e.target.querySelector('button');
    btn.textContent = 'Subscribed!';
    input.value = '';
    setTimeout(function() { btn.textContent = 'Subscribe'; }, 2000);
  }
}

// ========================================
// Contact Form
// ========================================

// ========================================
// Image Lightbox
// ========================================

function initLightbox() {
  var imgs = document.querySelectorAll('.product-detail-img img');
  imgs.forEach(function(img) {
    img.addEventListener('click', function() {
      var overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML =
        '<button class="lightbox-close"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>' +
        '<img src="' + this.src + '" alt="' + (this.alt || '') + '">';
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      function closeLightbox() {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
          overlay.remove();
          document.body.style.overflow = '';
        }, 300);
      }

      overlay.addEventListener('click', function(e) {
        if (e.target === overlay || e.target.closest('.lightbox-close')) {
          closeLightbox();
        }
      });

      document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', handler);
        }
      });
    });
  });
}

// ========================================
// Quantity Selector
// ========================================

function changeQty(delta) {
  var input = document.getElementById('qtyInput');
  if (!input) return;
  var val = parseInt(input.value) || 1;
  val = Math.max(1, Math.min(99, val + delta));
  input.value = val;
}

function getQty() {
  var input = document.getElementById('qtyInput');
  return input ? Math.max(1, parseInt(input.value) || 1) : 1;
}

function addToCartWithQty(name, price, dosage) {
  var qty = getQty();
  var cart = getCart();
  var existing = cart.find(function(item) { return item.name === name; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ name: name, price: price, dosage: dosage, qty: qty });
  }
  saveCart(cart);
  showToast('Added to cart!', 'success');
  openCartDrawer();

  var btns = document.querySelectorAll('.btn-cart');
  btns.forEach(function(btn) {
    if (btn.getAttribute('data-name') === name) {
      var orig = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/></svg> Added';
      btn.style.background = '#2E7D32';
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.style.background = '';
      }, 1200);
    }
  });
}

// ========================================
// Cookie Consent
// ========================================

function initCookieBanner() {
  if (localStorage.getItem('aminent_cookies')) return;

  var banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML =
    '<div class="cookie-inner">' +
      '<p>We use cookies to improve your experience and analyze site traffic. By continuing, you agree to our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions">' +
        '<button class="cookie-accept">Accept</button>' +
        '<button class="cookie-decline">Decline</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(banner);

  setTimeout(function() { banner.classList.add('visible'); }, 500);

  banner.querySelector('.cookie-accept').addEventListener('click', function() {
    localStorage.setItem('aminent_cookies', 'accepted');
    banner.classList.remove('visible');
    setTimeout(function() { banner.remove(); }, 400);
  });

  banner.querySelector('.cookie-decline').addEventListener('click', function() {
    localStorage.setItem('aminent_cookies', 'declined');
    banner.classList.remove('visible');
    setTimeout(function() { banner.remove(); }, 400);
  });
}

// ========================================
// Dark / Light Mode
// ========================================

function initThemeToggle() {
  // Load saved theme
  var saved = localStorage.getItem('aminent_theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  // Bind all toggle buttons
  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('aminent_theme', next);
    });
  });
}

// ========================================
// Contact Form
// ========================================

function submitContactForm(e) {
  e.preventDefault();
  var form = e.target;
  var btn = document.getElementById('contactSubmitBtn');
  var successEl = document.getElementById('contactSuccess');
  var errorEl = document.getElementById('contactError');

  // Hide previous messages
  successEl.style.display = 'none';
  errorEl.style.display = 'none';

  // Disable button
  btn.disabled = true;
  btn.textContent = 'Sending...';

  // Collect form data
  var formData = new FormData(form);

  // Submit to Formsubmit.co (free email forwarding service)
  fetch('https://formsubmit.co/ajax/support@aminentlabs.com', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  })
  .then(function(response) {
    if (response.ok) {
      successEl.style.display = 'block';
      form.reset();
    } else {
      errorEl.style.display = 'block';
    }
  })
  .catch(function() {
    errorEl.style.display = 'block';
  })
  .finally(function() {
    btn.disabled = false;
    btn.innerHTML = 'Send Message ';
  });
}
