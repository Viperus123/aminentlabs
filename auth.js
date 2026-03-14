/* ========================================
   AMINENT LABS — Authentication System
   ======================================== */

// ========================================
// Session Management
// ========================================

async function getSession() {
  var { data } = await supabase.auth.getSession();
  return data.session;
}

async function getUser() {
  var { data } = await supabase.auth.getUser();
  return data.user;
}

// ========================================
// Auth Actions
// ========================================

async function signUp(email, password, fullName) {
  var { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { full_name: fullName }
    }
  });
  return { data: data, error: error };
}

async function signIn(email, password) {
  var { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
  return { data: data, error: error };
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

async function resetPassword(email) {
  var { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/account.html'
  });
  return { data: data, error: error };
}

// ========================================
// Nav Auth State
// ========================================

async function updateAuthNav() {
  var session = await getSession();
  var accountLinks = document.querySelectorAll('.nav-account-link');

  accountLinks.forEach(function(link) {
    if (session) {
      link.href = 'account.html';
      link.title = 'My Account';
      link.innerHTML = '<svg style="width:20px;height:20px;stroke:currentColor;stroke-width:1.5;fill:none;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    } else {
      link.href = 'login.html';
      link.title = 'Sign In';
      link.innerHTML = '<svg style="width:20px;height:20px;stroke:currentColor;stroke-width:1.5;fill:none;" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    }
  });
}


// ========================================
// Account Dashboard Functions
// ========================================

async function loadOrderHistory() {
  var container = document.getElementById('orderHistory');
  if (!container) return;

  var user = await getUser();
  if (!user) return;

  var { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !orders || orders.length === 0) {
    container.innerHTML = '<div class="account-empty">' +
      '<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>' +
      '<p>No orders yet</p>' +
      '<a href="products.html" class="btn btn-primary btn-sm">Browse Peptides</a></div>';
    return;
  }

  var html = '<div class="orders-list">';
  orders.forEach(function(order) {
    var date = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    var statusClass = 'status-' + (order.status || 'processing').toLowerCase();

    html += '<div class="order-card">' +
      '<div class="order-card-header">' +
        '<div><span class="order-id">' + order.order_id + '</span><span class="order-date">' + date + '</span></div>' +
        '<span class="order-status ' + statusClass + '">' + (order.status || 'Processing') + '</span>' +
      '</div>' +
      '<div class="order-card-body">';

    if (order.items && order.items.length) {
      order.items.forEach(function(item) {
        html += '<div class="order-item"><span>' + item.name + ' x' + item.qty + '</span><span>$' + (item.price * item.qty).toFixed(2) + '</span></div>';
      });
    }

    html += '</div>' +
      '<div class="order-card-footer">' +
        '<span>Total: <strong>$' + (order.total || 0).toFixed(2) + '</strong></span>' +
        (order.tracking_number ? '<a href="#" class="order-track-link" onclick="showTracking(\'' + order.order_id + '\')">Track Order</a>' : '') +
      '</div></div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

async function loadAddresses() {
  var container = document.getElementById('addressBook');
  if (!container) return;

  var user = await getUser();
  if (!user) return;

  var { data: addresses, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false });

  if (error || !addresses || addresses.length === 0) {
    container.innerHTML = '<div class="account-empty">' +
      '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
      '<p>No saved addresses</p>' +
      '<button class="btn btn-primary btn-sm" onclick="showAddressForm()">Add Address</button></div>';
    return;
  }

  var html = '<div class="address-grid">';
  addresses.forEach(function(addr) {
    html += '<div class="address-card' + (addr.is_default ? ' default' : '') + '">' +
      (addr.is_default ? '<span class="address-default-badge">Default</span>' : '') +
      '<div class="address-card-body">' +
        '<strong>' + addr.full_name + '</strong>' +
        (addr.company ? '<br>' + addr.company : '') +
        '<br>' + addr.address_line1 +
        (addr.address_line2 ? '<br>' + addr.address_line2 : '') +
        '<br>' + addr.city + ', ' + addr.state + ' ' + addr.zip +
      '</div>' +
      '<div class="address-card-actions">' +
        (!addr.is_default ? '<button class="btn-text" onclick="setDefaultAddress(\'' + addr.id + '\')">Set Default</button>' : '') +
        '<button class="btn-text" onclick="editAddress(\'' + addr.id + '\')">Edit</button>' +
        '<button class="btn-text btn-text-danger" onclick="deleteAddress(\'' + addr.id + '\')">Delete</button>' +
      '</div></div>';
  });
  html += '<div class="address-card address-card-add" onclick="showAddressForm()">' +
    '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
    '<span>Add New Address</span></div></div>';
  container.innerHTML = html;
}

async function loadTracking() {
  var container = document.getElementById('shipmentTracking');
  if (!container) return;

  var user = await getUser();
  if (!user) return;

  var { data: shipments, error } = await supabase
    .from('orders')
    .select('order_id, tracking_number, tracking_carrier, status, created_at')
    .eq('user_id', user.id)
    .not('tracking_number', 'is', null)
    .order('created_at', { ascending: false });

  if (error || !shipments || shipments.length === 0) {
    container.innerHTML = '<div class="account-empty">' +
      '<svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>' +
      '<p>No shipments to track</p>' +
      '<span class="account-empty-sub">Tracking info appears here once your order ships</span></div>';
    return;
  }

  var html = '<div class="tracking-list">';
  shipments.forEach(function(s) {
    var date = new Date(s.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    html += '<div class="tracking-card">' +
      '<div class="tracking-card-header">' +
        '<span class="order-id">' + s.order_id + '</span>' +
        '<span class="order-status status-' + (s.status || 'shipped').toLowerCase() + '">' + (s.status || 'Shipped') + '</span>' +
      '</div>' +
      '<div class="tracking-card-body">' +
        '<div class="tracking-detail"><span>Carrier</span><span>' + (s.tracking_carrier || 'USPS') + '</span></div>' +
        '<div class="tracking-detail"><span>Tracking #</span><span class="tracking-number">' + s.tracking_number + '</span></div>' +
        '<div class="tracking-detail"><span>Order Date</span><span>' + date + '</span></div>' +
      '</div></div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

// ========================================
// Address CRUD
// ========================================

function showAddressForm(existingAddr) {
  var modal = document.getElementById('addressModal');
  if (!modal) return;

  var form = document.getElementById('addressForm');
  if (existingAddr) {
    form.addrId.value = existingAddr.id || '';
    form.addrName.value = existingAddr.full_name || '';
    form.addrCompany.value = existingAddr.company || '';
    form.addrLine1.value = existingAddr.address_line1 || '';
    form.addrLine2.value = existingAddr.address_line2 || '';
    form.addrCity.value = existingAddr.city || '';
    form.addrState.value = existingAddr.state || '';
    form.addrZip.value = existingAddr.zip || '';
    form.addrDefault.checked = existingAddr.is_default || false;
  } else {
    form.reset();
    form.addrId.value = '';
  }

  modal.classList.add('open');
}

function closeAddressModal() {
  var modal = document.getElementById('addressModal');
  if (modal) modal.classList.remove('open');
}

async function saveAddress(e) {
  e.preventDefault();
  var form = e.target;
  var user = await getUser();
  if (!user) return;

  var addrData = {
    user_id: user.id,
    full_name: form.addrName.value,
    company: form.addrCompany.value,
    address_line1: form.addrLine1.value,
    address_line2: form.addrLine2.value,
    city: form.addrCity.value,
    state: form.addrState.value,
    zip: form.addrZip.value,
    is_default: form.addrDefault.checked
  };

  // If setting as default, unset other defaults first
  if (addrData.is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  var id = form.addrId.value;
  if (id) {
    await supabase.from('addresses').update(addrData).eq('id', id);
  } else {
    await supabase.from('addresses').insert(addrData);
  }

  closeAddressModal();
  loadAddresses();
}

async function editAddress(id) {
  var user = await getUser();
  var { data } = await supabase.from('addresses').select('*').eq('id', id).single();
  if (data) showAddressForm(data);
}

async function deleteAddress(id) {
  if (!confirm('Delete this address?')) return;
  await supabase.from('addresses').delete().eq('id', id);
  loadAddresses();
}

async function setDefaultAddress(id) {
  var user = await getUser();
  if (!user) return;
  await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
  await supabase.from('addresses').update({ is_default: true }).eq('id', id);
  loadAddresses();
}

// ========================================
// Account Page Init
// ========================================

async function initAccountPage() {
  var session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  var user = await getUser();

  // Set user info
  var nameEl = document.getElementById('accountName');
  var emailEl = document.getElementById('accountEmail');
  var memberSinceEl = document.getElementById('memberSince');

  if (nameEl) nameEl.textContent = user.user_metadata?.full_name || user.email.split('@')[0];
  if (emailEl) emailEl.textContent = user.email;
  if (memberSinceEl) {
    var joined = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    memberSinceEl.textContent = 'Member since ' + joined;
  }

  // Load tab content
  loadOrderHistory();
  loadAddresses();
  loadTracking();

  // Tab switching
  document.querySelectorAll('.account-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.account-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.account-panel').forEach(function(p) { p.classList.remove('active'); });
      this.classList.add('active');
      var panel = document.getElementById(this.getAttribute('data-tab'));
      if (panel) panel.classList.add('active');
    });
  });
}

// ========================================
// Email Notifications
// ========================================

function sendOrderConfirmation(order) {
  var subject = 'Order Confirmed — ' + order.id;
  var body = 'Hi ' + order.name + ',\n\n' +
    'Thank you for your order!\n\n' +
    'Order ID: ' + order.id + '\n' +
    'Total: $' + order.total.toFixed(2) + '\n\n' +
    'Items:\n';

  order.items.forEach(function(item) {
    body += '  - ' + item.name + ' (' + item.dosage + ') x' + item.qty + ' — $' + (item.price * item.qty).toFixed(2) + '\n';
  });

  body += '\nShipping to: ' + order.address + ', ' + order.city + ', ' + order.state + ' ' + order.zip + '\n\n' +
    'We will send you tracking information once your order ships.\n\n' +
    'For Research Use Only.\n' +
    '— AMINENT LABS';

  // Send to customer
  sendEmail(order.email, subject, body);

  // Notify admin
  sendEmail('support@aminentlabs.com', 'New Order: ' + order.id + ' ($' + order.total.toFixed(2) + ')',
    'New order from ' + order.name + ' (' + order.email + ')\n\n' + body);
}

function sendShippingNotification(email, orderId, trackingNumber, carrier) {
  var subject = 'Your Order Has Shipped — ' + orderId;
  var body = 'Great news! Your order ' + orderId + ' has shipped.\n\n' +
    'Carrier: ' + carrier + '\n' +
    'Tracking Number: ' + trackingNumber + '\n\n' +
    'For Research Use Only.\n' +
    '— AMINENT LABS';

  sendEmail(email, subject, body);
}

function sendEmail(to, subject, body) {
  // Uses Formsubmit.co for email delivery (same as contact form)
  var formData = new FormData();
  formData.append('email', to);
  formData.append('_subject', subject);
  formData.append('message', body);
  formData.append('_template', 'box');

  fetch('https://formsubmit.co/ajax/' + to, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData
  }).catch(function(err) {
    console.log('Email send failed:', err);
  });
}

// ========================================
// Init on every page
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  updateAuthNav();
});
