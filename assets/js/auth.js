// ============================================================
//  SUPPLYNC — Auth & Role-Based Access Control
// ============================================================

const Auth = {

  // ---- Session ----
  getSession() {
    try { return JSON.parse(sessionStorage.getItem('sc_session')); }
    catch { return null; }
  },

  setSession(user) {
    sessionStorage.setItem('sc_session', JSON.stringify(user));
  },

  clearSession() {
    sessionStorage.removeItem('sc_session');
  },

  isLoggedIn() {
    return !!this.getSession();
  },

  getUser() {
    return this.getSession();
  },

  getRole() {
    const u = this.getSession();
    return u ? u.role : null;
  },

  // ---- Login ----
  login(email, password) {
    const users = DB.get('users');
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );
    if (!user) return { success: false, message: 'Invalid email or password.' };
    if (user.status === 'pending') return { success: false, message: 'Your account is pending approval by the Administrator.' };
    if (user.status === 'rejected') return { success: false, message: 'Your account application was rejected. Contact the Administrator.' };
    if (user.status === 'suspended') return { success: false, message: 'Your account has been suspended. Contact the Administrator.' };

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      facilityId: user.facilityId || null,
      districtId: user.districtId || null,
      provinceId: user.provinceId || null,
      level: user.level
    };
    this.setSession(sessionUser);
    return { success: true, user: sessionUser };
  },

  // ---- Signup ----
  signup(data) {
    const users = DB.get('users');

    // Check email not already used
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: DB.genId('usr'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      status: 'pending', // always pending until admin approves
      level: data.role,
      facilityId: data.facilityId || null,
      districtId: data.districtId || null,
      provinceId: data.provinceId || null,
      phone: data.phone || '',
      avatar: data.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString()
    };

    DB.add('users', newUser);

    // Log for admin
    DB.add('auditLog', {
      id: DB.genId('log'),
      action: 'signup',
      userId: newUser.id,
      details: `New ${data.role} signup: ${data.name} (${data.email})`,
      timestamp: new Date().toISOString()
    });

    return { success: true, message: 'Your account has been created and is awaiting approval by the Administrator.' };
  },

  // ---- Logout ----
  logout() {
    this.clearSession();
    const _p   = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const _sub = _p.length >= 2 && !['index.html','signup.html','dispense.html','notifications.html'].includes(_p[_p.length-1]);
    window.location.href = (_sub ? '../' : '') + 'index.html';
  },

  // ---- Role Checks ----
  can(permission) {
    const role = this.getRole();
    return PERMISSIONS[permission]?.includes(role) || false;
  },

  isAdmin()    { return this.getRole() === 'admin'; },
  isHQ()       { return ['hq', 'admin'].includes(this.getRole()); },
  isProvince() { return ['province', 'hq', 'admin'].includes(this.getRole()); },
  isDistrict() { return ['district', 'province', 'hq', 'admin'].includes(this.getRole()); },
  isFacility() { return this.getRole() === 'facility'; },

  // ---- Redirect if not logged in ----
  requireLogin() {
    if (!this.isLoggedIn()) {
      const _p   = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
      const _sub = _p.length >= 2 && !['index.html','signup.html','dispense.html','notifications.html'].includes(_p[_p.length-1]);
      window.location.href = (_sub ? '../' : '') + 'index.html';
      return false;
    }
    return true;
  },

  // ---- Redirect to role dashboard ----
  redirectToDashboard() {
    const role = this.getRole();
    const _p   = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const _sub = _p.length >= 2 && !['index.html','signup.html','dispense.html','notifications.html'].includes(_p[_p.length-1]);
    const pre  = _sub ? '../' : '';
    const map  = {
      admin:    pre + 'dashboards/admin.html',
      hq:       pre + 'dashboards/hq.html',
      province: pre + 'dashboards/province.html',
      district: pre + 'dashboards/district.html',
      facility: pre + 'dashboards/facility.html'
    };
    window.location.href = map[role] || (pre + 'index.html');
  },

  // ---- Get nav items based on role ----
  getNavItems(role) {
    const all = NAV_ITEMS;
    return all.filter(item => item.roles.includes(role) || item.roles.includes('all'));
  }
};

// ============================================================
//  PERMISSIONS MAP
// ============================================================
const PERMISSIONS = {
  submitReports:         ['facility', 'district', 'province'],
  withdrawReport:        ['facility', 'district', 'province'],
  deleteRejectedReport:  ['facility', 'district', 'province', 'admin'],
  reviewReports:         ['district', 'province', 'hq', 'admin'],
  manageReportWindow:    ['district', 'province', 'hq', 'admin'],
  requestCommodities:    ['facility', 'district', 'province', 'hq', 'admin'],
  manageWarehouse:       ['district', 'province', 'hq', 'admin'],
  addEditCommodities:    ['district', 'province', 'hq', 'admin'],
  viewFacilityStock:     ['district', 'province', 'hq', 'admin'],
  viewDistrictStock:     ['province', 'hq', 'admin'],
  viewProvinceStock:     ['hq', 'admin'],
  managerDeliverySignOff:['district', 'province', 'hq', 'admin'],
  onboardFacilities:     ['district', 'province', 'hq', 'admin'],
  manageFacilityStaff:   ['district', 'admin'],
  grantFacilityRights:   ['district', 'admin'],
  manageDistrictManagers:['province', 'hq', 'admin'],
  manageProvinceManagers:['hq', 'admin'],
  approveSignups:        ['admin'],
  systemSettings:        ['admin'],
  viewFacilityDashboard: ['facility', 'district', 'province', 'hq', 'admin'],
  viewDistrictDashboard: ['district', 'province', 'hq', 'admin'],
  viewProvinceDashboard: ['province', 'hq', 'admin'],
  viewHQDashboard:       ['hq', 'admin'],
  viewAdminDashboard:    ['admin'],
  shareCommodity:        ['facility', 'district', 'province', 'hq', 'admin'],
  approveFacilityShare:  ['district', 'province', 'hq', 'admin']
};

// ============================================================
//  NAVIGATION ITEMS
// ============================================================
const NAV_ITEMS = [
  // Dashboard
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: null, roles: ['all'], section: 'main', isDashboard: true },

  // Reports
  { id: 'submit-report',  label: 'Submit Report',   icon: '📋', href: 'reports/submit.html',         roles: ['facility', 'district', 'province'], section: 'Reports' },
  { id: 'report-history', label: 'Report History',  icon: '🗂️', href: 'reports/history.html',        roles: ['facility', 'district', 'province', 'hq', 'admin'], section: 'Reports' },
  { id: 'review-reports', label: 'Review Reports',  icon: '✅', href: 'reports/review.html',          roles: ['district', 'province', 'hq', 'admin'], section: 'Reports' },
  { id: 'report-window',  label: 'Report Window',   icon: '📅', href: 'reports/window-manager.html', roles: ['district', 'province', 'hq', 'admin'], section: 'Reports' },

  // Dispense
  { id: 'dispense', label: 'Dispense', icon: '💉', href: 'dispense.html', roles: ['facility', 'district', 'province', 'hq', 'admin'], section: 'Dispense' },

  // Stock & Commodities
  { id: 'warehouse',      label: 'My Warehouse',    icon: '🏭', href: 'stock/warehouse.html',         roles: ['district', 'province', 'hq', 'admin'], section: 'Stock' },
  { id: 'my-stock',       label: 'My Stock',        icon: '📦', href: 'stock/warehouse.html',         roles: ['facility'], section: 'Stock' },
  { id: 'facility-stock', label: 'Facility Stock',  icon: '🏥', href: 'stock/facility-stock.html',    roles: ['district', 'province', 'hq', 'admin'], section: 'Stock' },
  { id: 'commodities',    label: 'Commodities',     icon: '💊', href: 'commodities/manage.html',      roles: ['district', 'province', 'hq', 'admin'], section: 'Stock' },

  // Requisitions
  { id: 'request', label: 'Request Commodities', icon: '📤', href: 'requisitions/request.html', roles: ['facility', 'district', 'province', 'hq', 'admin'], section: 'Requisitions' },
  { id: 'track',   label: 'Track Deliveries',    icon: '🚚', href: 'requisitions/track.html',    roles: ['facility', 'district', 'province', 'hq', 'admin'], section: 'Requisitions' },

  // Users & Setup
  { id: 'users',       label: 'User Management',    icon: '👥', href: 'users/manage.html',           roles: ['district', 'province', 'hq', 'admin'], section: 'Admin' },
  { id: 'approvals',   label: 'Signup Approvals',   icon: '🔔', href: 'users/signup-approvals.html', roles: ['admin'], section: 'Admin' },
  { id: 'privileges',  label: 'User Privileges',    icon: '🔑', href: 'users/privileges.html',       roles: ['district', 'admin'], section: 'Admin' },
  { id: 'onboarding',  label: 'Setup & Onboarding', icon: '🏗️', href: 'setup/onboarding.html',       roles: ['admin'], section: 'Admin' }
];

// ============================================================
//  UI HELPERS — shared across all pages
// ============================================================
const UI = {

  // Render sidebar based on role
  renderSidebar(activePage) {
    const user = Auth.getUser();
    if (!user) return;

    const role = user.role;
    const navItems = Auth.getNavItems(role);

    // Compute prefix: depth=0 (root files) = '', depth=1 (subfolders) = '../'
    const _pathParts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const _depth = _pathParts.length;
    // Live Server: /supply-chain/dashboards/facility.html → depth=3 → use '../'
    // Live Server: /supply-chain/index.html → depth=2 → use ''
    // Direct file: /dashboards/facility.html → depth=2 → use '../'
    // We detect by checking if current file is in a subfolder
    const _inSubfolder = _pathParts.length >= 2 && !['index.html','signup.html','dispense.html','notifications.html'].includes(_pathParts[_pathParts.length-1]);
    const _pre = _inSubfolder ? '../' : '';

    // Group by section
    const sections = {};
    navItems.forEach(item => {
      if (item.isDashboard) return;
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });

    // Dashboard href
    const dashHref = {
      admin:    _pre + 'dashboards/admin.html',
      hq:       _pre + 'dashboards/hq.html',
      province: _pre + 'dashboards/province.html',
      district: _pre + 'dashboards/district.html',
      facility: _pre + 'dashboards/facility.html'
    }[role];

    // Pending approvals badge for admin
    const pendingCount = role === 'admin'
      ? DB.get('users').filter(u => u.status === 'pending').length
      : 0;

    // Pending requisitions for district
    const pendingReqs = ['district', 'province', 'hq'].includes(role)
      ? DB.get('requisitions').filter(r => r.status === 'pending').length
      : 0;

    let html = `
      <div class="sidebar-logo">
        <div class="logo-icon">⛓️</div>
        <div>
          <div class="logo-text">SupplyNC</div>
          <div class="logo-sub">Supply Chain</div>
        </div>
      </div>
      <div class="sidebar-user">
        <div class="user-name">${this.escHtml(user.name)}</div>
        <div class="user-role">${this.roleLabel(role)}</div>
      </div>
      <nav class="sidebar-nav">
        <a class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" href="${dashHref}">
          <span class="nav-icon">🏠</span> Dashboard
        </a>
    `;

    Object.entries(sections).forEach(([section, items]) => {
      html += `<div class="nav-section-label">${section}</div>`;
      items.forEach(item => {
        const isActive = activePage === item.id;
        const badge = (item.id === 'approvals' && pendingCount > 0)
          ? `<span class="nav-badge">${pendingCount}</span>` : '';
        const reqBadge = (item.id === 'request' && pendingReqs > 0)
          ? `<span class="nav-badge">${pendingReqs}</span>` : '';
        html += `
          <a class="nav-item ${isActive ? 'active' : ''}" href="${_pre}${item.href}" title="${this.escHtml(item.label)}">
            <span class="nav-icon">${item.icon}</span>
            <span>${this.escHtml(item.label)}</span>
            ${badge}${reqBadge}
          </a>
        `;
      });
    });

    html += `</nav>
      <div class="sidebar-footer">
        <button class="btn-logout" onclick="Auth.logout()">
          <span>🚪</span> Sign out
        </button>
      </div>
    `;

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.innerHTML = html;

  },

  roleLabel(role) {
    return { admin: 'Administrator', hq: 'HQ Management', province: 'Province Manager', district: 'District Manager', facility: 'Facility Staff' }[role] || role;
  },

  roleBadgeClass(role) {
    return { admin: 'badge-red', hq: 'badge-blue', province: 'badge-teal', district: 'badge-amber', facility: 'badge-green' }[role] || 'badge-slate';
  },

  statusBadge(status) {
    const map = {
      pending: '<span class="badge badge-amber">⏳ Pending</span>',
      approved: '<span class="badge badge-green">✅ Approved</span>',
      rejected: '<span class="badge badge-red">❌ Rejected</span>',
      active: '<span class="badge badge-green">● Active</span>',
      suspended: '<span class="badge badge-red">● Suspended</span>',
      delivered: '<span class="badge badge-teal">📦 Delivered</span>',
      dispatched: '<span class="badge badge-blue">🚚 Dispatched</span>',
      draft: '<span class="badge badge-slate">✏️ Draft</span>',
      withdrawn: '<span class="badge badge-slate">↩️ Withdrawn</span>',
      accepted: '<span class="badge badge-green">✓ Accepted</span>',
      completed: '<span class="badge badge-teal">✅ Completed</span>'
    };
    return map[status] || `<span class="badge badge-slate">${status}</span>`;
  },

  toast(msg, type = 'default', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', warning: '⚠️', default: 'ℹ️' };
    t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> ${this.escHtml(msg)}`;
    container.appendChild(t);
    setTimeout(() => t.remove(), duration);
  },

  openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('open');
  },

  closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('open');
  },

  confirm(msg, onConfirm) {
    if (window.confirm(msg)) onConfirm();
  },

  escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatDateTime(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  // Stock bar HTML
  stockBar(balance, minThreshold) {
    const pct = minThreshold ? Math.min(100, Math.round((balance / (minThreshold * 3)) * 100)) : 100;
    const cls = pct < 20 ? 'low' : pct < 50 ? 'medium' : '';
    return `
      <div class="stock-bar-wrap">
        <div class="stock-bar"><div class="stock-bar-fill ${cls}" style="width:${pct}%"></div></div>
        <span class="stock-pct">${balance.toLocaleString()}</span>
      </div>
    `;
  },

  // Tabs
  initTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = container.querySelector('#' + btn.dataset.tab);
        if (panel) panel.classList.add('active');
      });
    });
  },

  // Count unread notifications for bell badge
  countUnreadNotifs() {
    const user = Auth.getUser();
    if (!user) return 0;
    try {
      const readList = JSON.parse(localStorage.getItem('sc_read_notifs_'+user.id)||'[]');
      // Rough count: pending reports + pending signups + inbound reqs
      let count = 0;
      const role = user.role;
      if (role === 'admin') count += DB.get('users').filter(u=>u.status==='pending').length;
      if (['district','province','hq','admin'].includes(role)) {
        count += DB.get('reports').filter(r=>r.status==='pending').length;
        count += DB.get('requisitions').filter(r=>r.status==='pending').length;
      }
      return count;
    } catch(e){ return 0; }
  },

  // Page shell — full layout with collapsible sidebar, back button, notification bell
  shell(title, activePage, bodyHtml) {
    const user      = Auth.getUser();
    const collapsed = localStorage.getItem('sc_sidebar_collapsed') === '1';
    const notifCount= this.countUnreadNotifs();
    const isDashboard = activePage === 'dashboard';
    const _sfParts = window.location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
    const _sfInSub = _sfParts.length >= 2 && !['index.html','signup.html','dispense.html','notifications.html'].includes(_sfParts[_sfParts.length-1]);
    const _sfPre = _sfInSub ? '../' : '';
    const notifPath = _sfPre + 'notifications.html';

    document.title = title + ' — SupplyNC';
    document.body.innerHTML = `
      <div id="sidebar-overlay" class="sidebar-overlay"></div>
      <div class="app-shell ${collapsed?'sidebar-collapsed':''}">
        <aside class="sidebar ${collapsed?'collapsed':''}" id="sidebar"></aside>
        <div class="main-content">
          <header class="topbar">
            <!-- Hamburger / collapse toggle -->
            <button class="hamburger" id="hamburger" title="Toggle menu" onclick="UI.toggleSidebar()">☰</button>

            <!-- Back button (hidden on dashboard) -->
            ${!isDashboard ? `<button class="btn btn-ghost btn-sm topbar-back" onclick="history.back()" title="Go back" style="display:flex;align-items:center;gap:5px;color:var(--slate-500);padding:6px 10px;border-radius:var(--radius-sm)">
              <span style="font-size:1rem">←</span><span class="text-sm">Back</span>
            </button>` : ''}

            <div style="flex:1;min-width:0">
              <div class="topbar-title" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</div>
            </div>

            <div class="topbar-actions">
              <!-- Notification bell -->
              <a href="${notifPath}" style="position:relative;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:var(--slate-100);color:var(--slate-600);text-decoration:none;transition:background .15s" title="Notifications">
                🔔
                ${notifCount > 0 ? `<span style="position:absolute;top:2px;right:2px;background:var(--red-600);color:white;font-size:.6rem;font-weight:700;min-width:16px;height:16px;border-radius:99px;display:flex;align-items:center;justify-content:center;padding:0 3px">${notifCount}</span>` : ''}
              </a>
              <span class="badge ${this.roleBadgeClass(user?.role)}">${this.roleLabel(user?.role)}</span>
            </div>
          </header>
          <main class="page-body" id="page-body">
            ${bodyHtml}
          </main>
        </div>
      </div>
      <div id="toast-container"></div>
    `;
    this.renderSidebar(activePage);
    this._initSidebarToggle();
  },

  toggleSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const shell    = document.querySelector('.app-shell');
    const overlay  = document.getElementById('sidebar-overlay');
    const isMobile = window.innerWidth <= 900;

    if (isMobile) {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    } else {
      const nowCollapsed = sidebar.classList.toggle('collapsed');
      shell.classList.toggle('sidebar-collapsed', nowCollapsed);
      localStorage.setItem('sc_sidebar_collapsed', nowCollapsed ? '1' : '0');
    }
  },

  _initSidebarToggle() {
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.remove('open');
        overlay.classList.remove('open');
      });
    }
  }
};