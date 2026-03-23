/* ========================================
   AMINENT LABS — Global JavaScript
   ======================================== */

// --- Cookie Utilities ---
function setCookie(name, value, days) {
  var d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
}
function getCookie(name) {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
function deleteCookie(name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';
}

// --- Apply Saved Theme (before render to avoid flash) ---
(function() {
  var saved = getCookie('aminent_theme') || localStorage.getItem('aminent_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

// --- Google Analytics 4 (consent-aware) ---
var GA_ID = 'G-H9R8S3JHS9';
function loadGA() {
  if (window._gaLoaded) return;
  window._gaLoaded = true;
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

// Only load GA if user has accepted cookies
(function() {
  var consent = getCookie('aminent_cookie_consent');
  if (consent === 'all' || consent === 'analytics') {
    loadGA();
  }
})();

// --- Cookie Consent Banner ---
(function() {
  if (getCookie('aminent_cookie_consent')) return;

  var banner = document.createElement('div');
  banner.id = 'cookieConsent';
  banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:10000;background:var(--bg-alt,#1a1a2e);border-top:1px solid var(--border,rgba(255,255,255,0.1));padding:1rem 1.5rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:0.875rem;color:var(--text,#e0e0e0);box-shadow:0 -4px 20px rgba(0,0,0,0.15);';
  banner.innerHTML =
    '<div style="flex:1;min-width:250px;">' +
      '<strong>We value your privacy</strong>' +
      '<p style="margin:0.25rem 0 0;opacity:0.8;font-size:0.8rem;">We use cookies for analytics, preferences, and site functionality. You can choose which cookies to accept.</p>' +
    '</div>' +
    '<div style="display:flex;gap:0.5rem;flex-shrink:0;flex-wrap:wrap;">' +
      '<button id="cookieAcceptAll" style="padding:0.5rem 1.25rem;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:0.82rem;font-weight:500;cursor:pointer;">Accept All</button>' +
      '<button id="cookieEssential" style="padding:0.5rem 1.25rem;background:transparent;color:var(--text,#e0e0e0);border:1px solid var(--border,rgba(255,255,255,0.2));border-radius:8px;font-size:0.82rem;font-weight:500;cursor:pointer;">Essential Only</button>' +
      '<button id="cookieSettings" style="padding:0.5rem 1.25rem;background:transparent;color:var(--text-light,#999);border:none;border-radius:8px;font-size:0.82rem;cursor:pointer;text-decoration:underline;">Customize</button>' +
    '</div>';

  document.body.appendChild(banner);

  document.getElementById('cookieAcceptAll').addEventListener('click', function() {
    setCookie('aminent_cookie_consent', 'all', 365);
    loadGA();
    banner.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity = '0';
    setTimeout(function() { banner.remove(); }, 400);
  });

  document.getElementById('cookieEssential').addEventListener('click', function() {
    setCookie('aminent_cookie_consent', 'essential', 365);
    banner.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity = '0';
    setTimeout(function() { banner.remove(); }, 400);
  });

  document.getElementById('cookieSettings').addEventListener('click', function() {
    showCookieSettings();
  });
})();

function showCookieSettings() {
  var existing = document.getElementById('cookieSettingsModal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'cookieSettingsModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:10001;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML =
    '<div style="background:var(--bg,#0f0f23);border:1px solid var(--border,rgba(255,255,255,0.1));border-radius:16px;padding:2rem;max-width:450px;width:100%;color:var(--text,#e0e0e0);">' +
      '<h3 style="margin:0 0 1rem;font-size:1.1rem;">Cookie Preferences</h3>' +
      '<div style="margin-bottom:1rem;">' +
        '<label style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid var(--border,rgba(255,255,255,0.1));">' +
          '<div><strong>Essential</strong><br><span style="font-size:0.78rem;opacity:0.7;">Required for site functionality</span></div>' +
          '<input type="checkbox" checked disabled style="width:18px;height:18px;">' +
        '</label>' +
        '<label style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid var(--border,rgba(255,255,255,0.1));cursor:pointer;">' +
          '<div><strong>Analytics</strong><br><span style="font-size:0.78rem;opacity:0.7;">Google Analytics — helps us improve the site</span></div>' +
          '<input type="checkbox" id="cookiePrefAnalytics" checked style="width:18px;height:18px;cursor:pointer;">' +
        '</label>' +
        '<label style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;cursor:pointer;">' +
          '<div><strong>Preferences</strong><br><span style="font-size:0.78rem;opacity:0.7;">Theme, age verification memory</span></div>' +
          '<input type="checkbox" id="cookiePrefFunctional" checked style="width:18px;height:18px;cursor:pointer;">' +
        '</label>' +
      '</div>' +
      '<div style="display:flex;gap:0.5rem;">' +
        '<button id="cookieSavePrefs" style="flex:1;padding:0.6rem;background:#2563eb;color:#fff;border:none;border-radius:8px;font-size:0.875rem;font-weight:500;cursor:pointer;">Save Preferences</button>' +
        '<button id="cookieCancelPrefs" style="padding:0.6rem 1rem;background:transparent;color:var(--text,#e0e0e0);border:1px solid var(--border,rgba(255,255,255,0.2));border-radius:8px;font-size:0.875rem;cursor:pointer;">Cancel</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);

  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.remove();
  });

  document.getElementById('cookieCancelPrefs').addEventListener('click', function() {
    modal.remove();
  });

  document.getElementById('cookieSavePrefs').addEventListener('click', function() {
    var analytics = document.getElementById('cookiePrefAnalytics').checked;
    var functional = document.getElementById('cookiePrefFunctional').checked;
    var value = 'essential';
    if (analytics && functional) value = 'all';
    else if (analytics) value = 'analytics';
    else if (functional) value = 'functional';

    setCookie('aminent_cookie_consent', value, 365);
    if (analytics) loadGA();
    modal.remove();

    var banner = document.getElementById('cookieConsent');
    if (banner) {
      banner.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      banner.style.transform = 'translateY(100%)';
      banner.style.opacity = '0';
      setTimeout(function() { banner.remove(); }, 400);
    }
  });
}

// --- Age Verification Gate ---
(function() {
  if (getCookie('aminent_age_verified') || sessionStorage.getItem('aminent_age_verified')) return;

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
    setCookie('aminent_age_verified', 'true', 1);
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
    // Close menu when a nav link is tapped (mobile)
    links.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        links.classList.remove('open');
      });
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
  loadCartFromSupabase();

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

  // --- Live Form Validation ---
  addLiveValidation(document.getElementById('checkoutForm'));
  addLiveValidation(document.getElementById('contactForm'));
  addLiveValidation(document.getElementById('partnerForm'));
  addLiveValidation(document.getElementById('signupForm'));
  addLiveValidation(document.getElementById('loginForm'));

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
  // Sync to Supabase if user is logged in
  syncCartToSupabase(cart);
}

async function syncCartToSupabase(cart) {
  try {
    if (typeof supabase === 'undefined' || typeof getSession !== 'function') return;
    var session = await getSession();
    if (!session) return;
    await supabase.from('carts').upsert({
      user_id: session.user.id,
      items: cart,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
  } catch(e) {
    // Fail silently — cart is always saved to localStorage
  }
}

async function loadCartFromSupabase() {
  try {
    if (typeof supabase === 'undefined' || typeof getSession !== 'function') return;
    var session = await getSession();
    if (!session) return;
    var { data } = await supabase
      .from('carts')
      .select('items')
      .eq('user_id', session.user.id)
      .single();
    if (data && data.items && data.items.length > 0) {
      // Merge: remote cart wins for items not in local cart
      var local = getCart();
      var merged = data.items.slice();
      local.forEach(function(localItem) {
        var exists = merged.find(function(r) { return r.name === localItem.name; });
        if (!exists) merged.push(localItem);
      });
      localStorage.setItem('aminent_cart', JSON.stringify(merged));
      updateCartCount();
      renderCartDrawer();
    }
  } catch(e) {
    // Fail silently
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

function addToCart(name, price, dosage, image, slug) {
  var cart = getCart();
  var existing = cart.find(function(item) { return item.name === name; });
  if (existing) {
    existing.qty += 1;
    if (image && !existing.image) existing.image = image;
    if (slug && !existing.slug) existing.slug = slug;
  } else {
    cart.push({ name: name, price: price, dosage: dosage, qty: 1, image: image || '', slug: slug || '' });
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

function getCartTotalQty() {
  return getCart().reduce(function(sum, item) { return sum + item.qty; }, 0);
}

function getBulkDiscount(totalQty) {
  if (totalQty >= 10) return { percent: 20, label: '20% Bulk Discount (10+ vials)' };
  if (totalQty >= 6) return { percent: 15, label: '15% Bulk Discount (6+ vials)' };
  if (totalQty >= 3) return { percent: 10, label: '10% Bulk Discount (3+ vials)' };
  return { percent: 0, label: '' };
}

function getNextDiscountTier(totalQty) {
  if (totalQty >= 10) return null;
  if (totalQty >= 6) return { needed: 10 - totalQty, percent: 20 };
  if (totalQty >= 3) return { needed: 6 - totalQty, percent: 15 };
  return { needed: 3 - totalQty, percent: 10 };
}

function getCartTotal() {
  var subtotal = getCart().reduce(function(sum, item) { return sum + (item.price * item.qty); }, 0);
  return subtotal;
}

function getCartTotalWithDiscount() {
  var subtotal = getCartTotal();
  var totalQty = getCartTotalQty();
  var discount = getBulkDiscount(totalQty);
  var discountAmount = subtotal * (discount.percent / 100);
  return { subtotal: subtotal, discount: discount, discountAmount: discountAmount, total: subtotal - discountAmount };
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

  var fallbackImages = {
    'GLP-3 RT': 'vialpics/transGLP3RT.png',
    'BPC-157': 'vialpics/transBPC.png',
    'GHK-Cu': 'vialpics/transGHKCU.png'
  };

  var html = '';
  cart.forEach(function(item) {
    var lineTotal = (item.price * item.qty).toFixed(2);
    var imgSrc = item.image ? 'vialpics/' + item.image : fallbackImages[item.name];
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

  var cartData = getCartTotalWithDiscount();
  var nextTier = getNextDiscountTier(getCartTotalQty());
  var discountHtml = '';
  if (cartData.discount.percent > 0) {
    discountHtml = '<div class="cart-subtotal" style="color:#22c55e;">' +
      '<span class="cart-subtotal-label">' + cartData.discount.label + '</span>' +
      '<span class="cart-subtotal-value">-$' + cartData.discountAmount.toFixed(2) + '</span></div>';
  }
  var tierHtml = '';
  if (nextTier) {
    tierHtml = '<div style="font-size:0.75rem;color:var(--accent);text-align:center;padding:0.5rem 0;">Add ' + nextTier.needed + ' more vial' + (nextTier.needed > 1 ? 's' : '') + ' for ' + nextTier.percent + '% off!</div>';
  }
  footerEl.innerHTML = '<div class="cart-subtotal">' +
    '<span class="cart-subtotal-label">Subtotal</span>' +
    '<span class="cart-subtotal-value">$' + cartData.subtotal.toFixed(2) + '</span></div>' +
    discountHtml +
    '<div class="cart-subtotal" style="font-weight:600;">' +
    '<span class="cart-subtotal-label">Total</span>' +
    '<span class="cart-subtotal-value">$' + cartData.total.toFixed(2) + '</span></div>' +
    tierHtml +
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

  // Fallback product data for old cart items without slug/image
  var fallbackData = {
    'GLP-3 RT': { link: 'product.html?slug=glp3rt', img: 'vialpics/transGLP3RT.png' },
    'BPC-157': { link: 'product.html?slug=bpc157', img: 'vialpics/transBPC.png' },
    'GHK-Cu': { link: 'product.html?slug=ghkcu', img: 'vialpics/transGHKCU.png' },
  };

  var html = '';
  cart.forEach(function(item) {
    var lineTotal = (item.price * item.qty).toFixed(2);
    var fallback = fallbackData[item.name] || { link: 'products.html', img: '' };
    var data = {
      link: item.slug ? 'product.html?slug=' + item.slug : fallback.link,
      img: item.image ? 'vialpics/' + item.image : fallback.img
    };
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
    var cartData = getCartTotalWithDiscount();
    var subtotal = cartData.subtotal;
    var discountedTotal = cartData.total;
    var shipping = discountedTotal >= 150 ? 0 : 9.95;
    var total = discountedTotal + shipping;
    var nextTier = getNextDiscountTier(getCartTotalQty());
    var discountRow = '';
    if (cartData.discount.percent > 0) {
      discountRow = '<div class="cart-summary-row" style="color:#22c55e;">' +
        '<span>' + cartData.discount.label + '</span><span>-$' + cartData.discountAmount.toFixed(2) + '</span></div>';
    }
    var tierRow = '';
    if (nextTier) {
      tierRow = '<div class="cart-summary-row" style="font-size:0.8rem;color:var(--accent);padding-top:0;"><span>Add ' + nextTier.needed + ' more vial' + (nextTier.needed > 1 ? 's' : '') + ' for ' + nextTier.percent + '% off</span></div>';
    }
    summaryEl.innerHTML = '<h4>Order Summary</h4>' +
      '<div class="cart-summary-row">' +
      '<span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>' +
      discountRow + tierRow +
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
    window.location.href = 'confirmation.html?order=' + encodeURIComponent(order.id);
  }, 1000);
}

// ========================================
// Confirmation Page
// ========================================

async function showTracking(orderId) {
  if (typeof supabase === 'undefined') return;
  var { data } = await supabase.from('orders').select('tracking_number, tracking_carrier').eq('order_id', orderId).single();
  if (!data || !data.tracking_number) return;

  var urls = {
    'USPS': 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
    'UPS': 'https://www.ups.com/track?tracknum=',
    'FedEx': 'https://www.fedex.com/fedextrack/?trknbr=',
    'DHL': 'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id='
  };
  var base = urls[data.tracking_carrier] || urls['USPS'];
  window.open(base + encodeURIComponent(data.tracking_number), '_blank', 'noopener');
}

function buildConfirmationHTML(order) {
  var addr = order.shipping_address || {};
  var name = order.name || addr.name || '';
  var city = order.city || addr.city || '';
  var state = order.state || addr.state || '';
  var zip = order.zip || addr.zip || '';
  var subtotal = parseFloat(order.subtotal) || 0;
  var shipping = parseFloat(order.shipping) || 0;
  var total = parseFloat(order.total) || 0;
  var date = order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString() : '');

  var html = '<div class="confirmation-detail-row"><span>Order ID</span><span><strong>' + (order.id || order.order_id) + '</strong></span></div>' +
    '<div class="confirmation-detail-row"><span>Date</span><span>' + date + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Email</span><span>' + (order.email || '') + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Ship to</span><span>' + name + ', ' + city + ', ' + state + ' ' + zip + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>' +
    '<div class="confirmation-detail-row"><span>Shipping</span><span>' + (shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)) + '</span></div>' +
    '<div class="confirmation-detail-row total"><span>Total</span><span>$' + total.toFixed(2) + '</span></div>';

  var items = order.items || [];
  if (items.length) {
    html += '<div class="confirmation-items-list"><h4>Items</h4><ul>';
    items.forEach(function(item) {
      html += '<li><span>' + item.name + (item.dosage ? ' (' + item.dosage + ')' : '') + ' x' + item.qty + '</span><span>$' + (item.price * item.qty).toFixed(2) + '</span></li>';
    });
    html += '</ul></div>';
  }
  return html;
}

async function renderConfirmation() {
  var detailsEl = document.getElementById('confirmationDetails');
  if (!detailsEl) return;

  detailsEl.innerHTML = '<p style="color:var(--text-secondary);">Loading order details...</p>';

  // Try localStorage first (fastest, works for guest orders too)
  var order = null;
  try { order = JSON.parse(localStorage.getItem('aminent_last_order')); } catch(e) {}

  if (order) {
    detailsEl.innerHTML = buildConfirmationHTML(order);
    return;
  }

  // Fall back to Supabase using order ID from URL
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order');
  if (orderId && typeof supabase !== 'undefined') {
    try {
      var { data, error } = await supabase.from('orders').select('*').eq('order_id', orderId).single();
      if (data && !error) {
        detailsEl.innerHTML = buildConfirmationHTML(data);
        return;
      }
    } catch(e) {}
  }

  detailsEl.innerHTML = '<p style="color:var(--text-secondary);">Order details unavailable. Check your email for confirmation.</p>';
}

// ========================================
// Form Validation Helpers
// ========================================

function setFieldError(input, message) {
  input.classList.add('field-error');
  input.classList.remove('field-success');
  var existing = input.parentElement.querySelector('.field-error-msg');
  if (existing) existing.remove();
  var msg = document.createElement('span');
  msg.className = 'field-error-msg';
  msg.textContent = message;
  input.parentElement.appendChild(msg);
}

function clearFieldError(input) {
  input.classList.remove('field-error');
  input.classList.add('field-success');
  var existing = input.parentElement.querySelector('.field-error-msg');
  if (existing) existing.remove();
}

function addLiveValidation(form) {
  if (!form) return;
  form.querySelectorAll('input[required], textarea[required], select[required]').forEach(function(field) {
    field.addEventListener('blur', function() {
      if (!this.value.trim()) {
        setFieldError(this, 'This field is required.');
      } else if (this.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
        setFieldError(this, 'Please enter a valid email address.');
      } else {
        clearFieldError(this);
      }
    });
    field.addEventListener('input', function() {
      if (this.classList.contains('field-error') && this.value.trim()) {
        clearFieldError(this);
      }
    });
  });
}

// Newsletter form
function handleNewsletter(e) {
  e.preventDefault();
  var input = e.target.querySelector('input');
  var btn = e.target.querySelector('button');
  var email = input && input.value;
  if (!email) return;
  btn.disabled = true;
  btn.textContent = 'Subscribing...';
  supabase.from('newsletter_subscribers').insert([{ email: email }])
    .then(function(res) {
      if (res.error && res.error.code === '23505') {
        // Already subscribed — still show success
      } else if (res.error) {
        throw res.error;
      }
      btn.textContent = 'Subscribed!';
      input.value = '';
      setTimeout(function() { btn.textContent = 'Subscribe'; btn.disabled = false; }, 2000);
    })
    .catch(function() {
      btn.textContent = 'Try again';
      btn.disabled = false;
    });
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

function addToCartWithQty(name, price, dosage, image, slug) {
  var qty = getQty();
  var cart = getCart();
  var existing = cart.find(function(item) { return item.name === name; });
  if (existing) {
    existing.qty += qty;
    if (image && !existing.image) existing.image = image;
    if (slug && !existing.slug) existing.slug = slug;
  } else {
    cart.push({ name: name, price: price, dosage: dosage, qty: qty, image: image || '', slug: slug || '' });
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
      setCookie('aminent_theme', next, 365);
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
  var data = {
    name: formData.get('name'),
    email: formData.get('email'),
    organization: formData.get('organization') || null,
    subject: formData.get('subject') || null,
    message: formData.get('message')
  };

  // Submit to Supabase
  supabase.from('contact_submissions').insert([data])
    .then(function(res) {
      if (res.error) throw res.error;
      successEl.style.display = 'block';
      form.reset();
    })
    .catch(function() {
      errorEl.style.display = 'block';
    })
    .finally(function() {
      btn.disabled = false;
      btn.innerHTML = 'Send Message ';
    });
}

// ========================================
// Enhanced Visual/Interactive Features
// ========================================
(function() {
  'use strict';

  // --- 1. Animated Stat Counters ---
  function initStatCounters() {
    var statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCounter(el) {
      var text = el.textContent.trim();
      var duration = 2000;

      // Determine if numeric or text
      if (text === '98%+') {
        var start = performance.now();
        el.textContent = '0%+';
        (function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = easeOutExpo(progress);
          var val = Math.round(eased * 98);
          el.textContent = val + '%+';
          if (progress < 1) requestAnimationFrame(step);
        })(start);
      } else if (text === '3') {
        var start2 = performance.now();
        el.textContent = '0';
        (function step2(now) {
          var progress = Math.min((now - start2) / duration, 1);
          var eased = easeOutExpo(progress);
          var val = Math.round(eased * 3);
          el.textContent = val;
          if (progress < 1) requestAnimationFrame(step2);
        })(start2);
      } else {
        // Text values like "COA", "HPLC" — fade in
        el.style.opacity = '0';
        el.style.transition = 'opacity 1s ease';
        // Force reflow then fade in
        void el.offsetWidth;
        el.style.opacity = '1';
      }
    }

    var statObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(function(el) {
      statObserver.observe(el);
    });
  }

  // --- 2. Nav Scroll Effect ---
  function initNavScrollEffect() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 50) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Apply immediately in case already scrolled
    if (window.scrollY > 50) nav.classList.add('scrolled');
  }

  // --- 4. Parallax-lite on Hero Image ---
  function initParallax() {
    var heroImg = document.querySelector('.hero-vial-img');
    if (!heroImg) return;
    if (window.innerWidth <= 768) return;

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.innerWidth > 768) {
            var scrolled = window.scrollY;
            var offset = Math.min(scrolled * 0.08, 30);
            heroImg.style.transform = 'translateY(-' + offset + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // --- 5. Magnetic Button Effect ---
  function initMagneticButtons() {
    var buttons = document.querySelectorAll('.btn-primary, .btn-cart');
    if (!buttons.length) return;

    buttons.forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var maxMove = 4;
        var moveX = (x / (rect.width / 2)) * maxMove;
        var moveY = (y / (rect.height / 2)) * maxMove;
        btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
        btn.style.transition = 'transform 0.15s ease';
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }

  // --- 6. Tilt Effect on Product Cards ---
  function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;

    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var maxDeg = 3;
        var rotateY = ((x - centerX) / centerX) * maxDeg;
        var rotateX = ((centerY - y) / centerY) * maxDeg;
        card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }

  // Initialize all features on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initStatCounters();
      initNavScrollEffect();

      initParallax();
      initMagneticButtons();
      initCardTilt();
    });
  } else {
    // DOM already ready
    initStatCounters();
    initNavScrollEffect();
    initMarquee();
    initParallax();
    initMagneticButtons();
    initCardTilt();
  }
})();
