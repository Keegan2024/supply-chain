// ============================================================
//  SUPPLYNC — Mock Data Store (simulates backend)
//  All data is stored in localStorage for persistence across pages
// ============================================================

const DB = {

  // ---- INIT: seed default data if localStorage is empty ----
  init() {
    if (!localStorage.getItem('sc_initialized')) {
      this.seed();
      localStorage.setItem('sc_initialized', '1');
    }
  },

  seed() {
    // --- ADMIN (preloaded, no signup needed) ---
    const users = [
      {
        id: 'usr_admin_01',
        name: 'System Administrator',
        email: 'admin@supplync.org',
        password: 'Admin@2024',
        role: 'admin',
        status: 'active',
        level: 'admin',
        assignedTo: null,
        createdAt: '2024-01-01T00:00:00Z',
        phone: '+260 97 000 0001',
        avatar: 'SA'
      },
      // District Manager
      {
        id: 'usr_dm_01',
        name: 'Daniel Mwale',
        email: 'daniel.mwale@supplync.org',
        password: 'District@2024',
        role: 'district',
        status: 'active',
        level: 'district',
        districtId: 'dist_01',
        createdAt: '2024-01-05T08:00:00Z',
        phone: '+260 97 111 2222',
        avatar: 'DM'
      },
      // Province Manager
      {
        id: 'usr_pm_01',
        name: 'Patricia Banda',
        email: 'patricia.banda@supplync.org',
        password: 'Province@2024',
        role: 'province',
        status: 'active',
        level: 'province',
        provinceId: 'prov_01',
        createdAt: '2024-01-03T08:00:00Z',
        phone: '+260 97 333 4444',
        avatar: 'PB'
      },
      // HQ Manager
      {
        id: 'usr_hq_01',
        name: 'George Tembo',
        email: 'george.tembo@supplync.org',
        password: 'HQ@2024secure',
        role: 'hq',
        status: 'active',
        level: 'hq',
        createdAt: '2024-01-02T08:00:00Z',
        phone: '+260 97 555 6666',
        avatar: 'GT'
      },
      // Facility Staff
      {
        id: 'usr_fs_01',
        name: 'Alice Phiri',
        email: 'alice.phiri@supplync.org',
        password: 'Facility@2024',
        role: 'facility',
        status: 'active',
        level: 'facility',
        facilityId: 'fac_01',
        districtId: 'dist_01',
        createdAt: '2024-01-10T08:00:00Z',
        phone: '+260 97 777 8888',
        avatar: 'AP'
      },
      // Pending signup
      {
        id: 'usr_fs_02',
        name: 'Brian Mulenga',
        email: 'brian.mulenga@supplync.org',
        password: 'Brian@2024',
        role: 'facility',
        status: 'pending',
        level: 'facility',
        facilityId: 'fac_02',
        districtId: 'dist_01',
        createdAt: '2024-07-28T10:30:00Z',
        phone: '+260 97 000 1111',
        avatar: 'BM'
      }
    ];

    const provinces = [
      { id: 'prov_01', name: 'Lusaka Province', code: 'LSK', managerId: 'usr_pm_01', createdAt: '2024-01-01' },
      { id: 'prov_02', name: 'Copperbelt Province', code: 'CB', managerId: null, createdAt: '2024-01-01' }
    ];

    const districts = [
      { id: 'dist_01', name: 'Lusaka District', code: 'LD', provinceId: 'prov_01', managerId: 'usr_dm_01', createdAt: '2024-01-01' },
      { id: 'dist_02', name: 'Kafue District', code: 'KF', provinceId: 'prov_01', managerId: null, createdAt: '2024-01-01' }
    ];

    const facilities = [
      {
        id: 'fac_01',
        name: 'Matero Level 1 Hospital',
        code: 'MLH-01',
        type: 'Hospital',
        districtId: 'dist_01',
        provinceId: 'prov_01',
        address: 'Matero, Lusaka',
        phone: '+260 211 111 001',
        createdAt: '2024-01-05'
      },
      {
        id: 'fac_02',
        name: 'Kabwata Health Centre',
        code: 'KHC-02',
        type: 'Health Centre',
        districtId: 'dist_01',
        provinceId: 'prov_01',
        address: 'Kabwata, Lusaka',
        phone: '+260 211 111 002',
        createdAt: '2024-01-05'
      },
      {
        id: 'fac_03',
        name: 'Chilenje Clinic',
        code: 'CC-03',
        type: 'Clinic',
        districtId: 'dist_01',
        provinceId: 'prov_01',
        address: 'Chilenje, Lusaka',
        phone: '+260 211 111 003',
        createdAt: '2024-01-08'
      }
    ];

    const commodities = [
      { id: 'com_01', name: 'Amoxicillin 500mg Capsules', category: 'Medical', unit: 'Capsules', minThreshold: 500, description: 'Broad-spectrum antibiotic' },
      { id: 'com_02', name: 'Paracetamol 500mg Tablets', category: 'Medical', unit: 'Tablets', minThreshold: 1000, description: 'Analgesic and antipyretic' },
      { id: 'com_03', name: 'ORS Sachets', category: 'Medical', unit: 'Sachets', minThreshold: 200, description: 'Oral Rehydration Salts' },
      { id: 'com_04', name: 'Surgical Gloves (Large)', category: 'Medical', unit: 'Pairs', minThreshold: 100, description: 'Latex surgical gloves' },
      { id: 'com_05', name: 'Cotrimoxazole 480mg Tablets', category: 'Medical', unit: 'Tablets', minThreshold: 500, description: 'Antibiotic combination' },
      { id: 'com_06', name: 'Printing Paper A4 (Ream)', category: 'Non-Medical', unit: 'Reams', minThreshold: 10, description: 'Office paper 80gsm' },
      { id: 'com_07', name: 'Hand Sanitizer 500ml', category: 'Non-Medical', unit: 'Bottles', minThreshold: 20, description: '70% alcohol based' },
      { id: 'com_08', name: 'N95 Respirator Masks', category: 'Medical', unit: 'Pieces', minThreshold: 50, description: 'FFP2 respirator masks' }
    ];

    // Warehouse stock: district, province, hq
    const warehouseStock = [
      // District warehouse
      { id: 'ws_01', warehouseType: 'district', warehouseId: 'dist_01', commodityId: 'com_01', batchNo: 'BT-2024-001', quantity: 5000, expiryDate: '2026-06-30', addedBy: 'usr_dm_01', addedAt: '2024-03-01' },
      { id: 'ws_02', warehouseType: 'district', warehouseId: 'dist_01', commodityId: 'com_02', batchNo: 'BT-2024-002', quantity: 12000, expiryDate: '2026-12-31', addedBy: 'usr_dm_01', addedAt: '2024-03-01' },
      { id: 'ws_03', warehouseType: 'district', warehouseId: 'dist_01', commodityId: 'com_03', batchNo: 'BT-2024-003', quantity: 3000, expiryDate: '2025-09-30', addedBy: 'usr_dm_01', addedAt: '2024-03-01' },
      { id: 'ws_04', warehouseType: 'district', warehouseId: 'dist_01', commodityId: 'com_04', batchNo: 'BT-2024-004', quantity: 800, expiryDate: '2027-01-31', addedBy: 'usr_dm_01', addedAt: '2024-03-01' },
      { id: 'ws_05', warehouseType: 'district', warehouseId: 'dist_01', commodityId: 'com_06', batchNo: 'N/A', quantity: 150, expiryDate: null, addedBy: 'usr_dm_01', addedAt: '2024-03-01' },
      { id: 'ws_06', warehouseType: 'district', warehouseId: 'dist_01', commodityId: 'com_07', batchNo: 'BT-2024-007', quantity: 500, expiryDate: '2025-12-31', addedBy: 'usr_dm_01', addedAt: '2024-03-01' },
      // Province warehouse
      { id: 'ws_07', warehouseType: 'province', warehouseId: 'prov_01', commodityId: 'com_01', batchNo: 'PV-2024-001', quantity: 20000, expiryDate: '2026-06-30', addedBy: 'usr_pm_01', addedAt: '2024-02-01' },
      { id: 'ws_08', warehouseType: 'province', warehouseId: 'prov_01', commodityId: 'com_02', batchNo: 'PV-2024-002', quantity: 50000, expiryDate: '2026-12-31', addedBy: 'usr_pm_01', addedAt: '2024-02-01' },
      { id: 'ws_09', warehouseType: 'province', warehouseId: 'prov_01', commodityId: 'com_05', batchNo: 'PV-2024-005', quantity: 15000, expiryDate: '2026-03-31', addedBy: 'usr_pm_01', addedAt: '2024-02-01' },
      // HQ warehouse
      { id: 'ws_10', warehouseType: 'hq', warehouseId: 'hq_main', commodityId: 'com_01', batchNo: 'HQ-2024-001', quantity: 100000, expiryDate: '2026-06-30', addedBy: 'usr_hq_01', addedAt: '2024-01-15' },
      { id: 'ws_11', warehouseType: 'hq', warehouseId: 'hq_main', commodityId: 'com_08', batchNo: 'HQ-2024-008', quantity: 5000, expiryDate: '2027-06-30', addedBy: 'usr_hq_01', addedAt: '2024-01-15' }
    ];

    // Facility stock ledger
    const facilityStock = [
      { id: 'fs_01', facilityId: 'fac_01', commodityId: 'com_01', batchNo: 'BT-2024-001', openingBalance: 0, received: 500, consumed: 120, givenAway: 0, expired: 0, damagedLost: 0, closingBalance: 380, expiryDate: '2026-06-30', lastUpdated: '2024-07-01' },
      { id: 'fs_02', facilityId: 'fac_01', commodityId: 'com_02', batchNo: 'BT-2024-002', openingBalance: 0, received: 2000, consumed: 650, givenAway: 0, expired: 0, damagedLost: 0, closingBalance: 1350, expiryDate: '2026-12-31', lastUpdated: '2024-07-01' },
      { id: 'fs_03', facilityId: 'fac_01', commodityId: 'com_03', batchNo: 'BT-2024-003', openingBalance: 0, received: 300, consumed: 80, givenAway: 50, expired: 0, damagedLost: 0, closingBalance: 170, expiryDate: '2025-09-30', lastUpdated: '2024-07-01' },
      { id: 'fs_04', facilityId: 'fac_02', commodityId: 'com_01', batchNo: 'BT-2024-001', openingBalance: 0, received: 200, consumed: 180, givenAway: 0, expired: 0, damagedLost: 0, closingBalance: 20, expiryDate: '2026-06-30', lastUpdated: '2024-07-01' },
      { id: 'fs_05', facilityId: 'fac_02', commodityId: 'com_04', batchNo: 'BT-2024-004', openingBalance: 0, received: 100, consumed: 60, givenAway: 0, expired: 0, damagedLost: 5, closingBalance: 35, expiryDate: '2027-01-31', lastUpdated: '2024-07-01' }
    ];

    // Stock movement ledger
    const stockMovements = [
      { id: 'mv_01', type: 'received', fromType: 'district', fromId: 'dist_01', toType: 'facility', toId: 'fac_01', commodityId: 'com_01', quantity: 500, batchNo: 'BT-2024-001', date: '2024-03-15', doneBy: 'usr_fs_01', note: 'Initial allocation', requisitionId: 'req_01' },
      { id: 'mv_02', type: 'consumed', fromType: null, fromId: null, toType: 'facility', toId: 'fac_01', commodityId: 'com_01', quantity: -120, batchNo: 'BT-2024-001', date: '2024-07-10', doneBy: 'usr_fs_01', note: 'Monthly consumption', requisitionId: null },
      { id: 'mv_03', type: 'given_away', fromType: 'facility', fromId: 'fac_01', toType: 'facility', toId: 'fac_02', commodityId: 'com_03', quantity: -50, batchNo: 'BT-2024-003', date: '2024-07-12', doneBy: 'usr_fs_01', note: 'Emergency share to Kabwata HC', requisitionId: null }
    ];

    // Reports
    const reports = [
      {
        id: 'rpt_01',
        submittedBy: 'usr_fs_01',
        facilityId: 'fac_01',
        districtId: 'dist_01',
        period: 'July 2024',
        status: 'pending',
        submittedAt: '2024-07-05T09:30:00Z',
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
        items: [
          { commodityId: 'com_01', openingBalance: 500, received: 0, consumed: 120, givenAway: 0, expired: 0, damagedLost: 0, closingBalance: 380 },
          { commodityId: 'com_02', openingBalance: 2000, received: 0, consumed: 650, givenAway: 0, expired: 0, damagedLost: 0, closingBalance: 1350 }
        ]
      },
      {
        id: 'rpt_02',
        submittedBy: 'usr_fs_01',
        facilityId: 'fac_01',
        districtId: 'dist_01',
        period: 'June 2024',
        status: 'approved',
        submittedAt: '2024-06-05T10:00:00Z',
        reviewedBy: 'usr_dm_01',
        reviewedAt: '2024-06-06T14:00:00Z',
        rejectionReason: null,
        items: [
          { commodityId: 'com_01', openingBalance: 0, received: 500, consumed: 0, givenAway: 0, expired: 0, damagedLost: 0, closingBalance: 500 }
        ]
      }
    ];

    // Requisitions
    const requisitions = [
      {
        id: 'req_01',
        requestedBy: 'usr_fs_01',
        fromLevel: 'facility',
        fromId: 'fac_01',
        toLevel: 'district',
        toId: 'dist_01',
        status: 'delivered',
        requestedAt: '2024-03-10T08:00:00Z',
        items: [
          { commodityId: 'com_01', requestedQty: 500, approvedQty: 500, unit: 'Capsules' }
        ],
        note: 'Initial stock request',
        transporterId: null,
        transporterEmail: null,
        transporterName: 'John Banda',
        dispatchedAt: '2024-03-14T09:00:00Z',
        receivedAt: '2024-03-15T14:00:00Z',
        senderConfirmed: true,
        transporterConfirmed: true,
        receiverConfirmed: true,
        managerSignOff: true
      },
      {
        id: 'req_02',
        requestedBy: 'usr_fs_01',
        fromLevel: 'facility',
        fromId: 'fac_01',
        toLevel: 'district',
        toId: 'dist_01',
        status: 'pending',
        requestedAt: '2024-07-20T11:00:00Z',
        items: [
          { commodityId: 'com_03', requestedQty: 200, approvedQty: null, unit: 'Sachets' },
          { commodityId: 'com_04', requestedQty: 50, approvedQty: null, unit: 'Pairs' }
        ],
        note: 'Running low on ORS and gloves',
        transporterId: null,
        transporterEmail: null,
        transporterName: null,
        dispatchedAt: null,
        receivedAt: null,
        senderConfirmed: false,
        transporterConfirmed: false,
        receiverConfirmed: false,
        managerSignOff: false
      }
    ];

    // Report windows
    const reportWindows = [
      {
        id: 'rw_auto',
        type: 'auto',
        opensDay: 30,
        closesDay: 7,
        isOpen: true,
        reopenedBy: null,
        reopenedFor: null,
        reopenCloseDate: null,
        note: 'Automatic monthly window'
      }
    ];

    // Facility shares
    const facilityShares = [
      {
        id: 'share_01',
        fromFacilityId: 'fac_01',
        toFacilityId: 'fac_02',
        commodityId: 'com_03',
        quantity: 50,
        batchNo: 'BT-2024-003',
        status: 'completed',
        requestedBy: 'usr_fs_01',
        approvedBy: 'usr_dm_01',
        requestedAt: '2024-07-11T10:00:00Z',
        completedAt: '2024-07-12T14:00:00Z',
        note: 'Emergency share'
      }
    ];

    // Pending admin actions log
    const auditLog = [];
    const dispenses = [];
    const archivedStock = [];
    const archivedReports = [];

    // Save all to localStorage
    this.save('users', users);
    this.save('provinces', provinces);
    this.save('districts', districts);
    this.save('facilities', facilities);
    this.save('commodities', commodities);
    this.save('warehouseStock', warehouseStock);
    this.save('facilityStock', facilityStock);
    this.save('stockMovements', stockMovements);
    this.save('reports', reports);
    this.save('requisitions', requisitions);
    this.save('reportWindows', reportWindows);
    this.save('facilityShares', facilityShares);
    this.save('auditLog', auditLog);
    this.save('dispenses', dispenses);
    this.save('archivedStock', archivedStock);
    this.save('archivedReports', archivedReports);
    this.save('comments', comments);
    this.save('warehouseBaselines', warehouseBaselines);
  },

  // ---- CRUD Helpers ----
  get(key) {
    try { return JSON.parse(localStorage.getItem('sc_' + key)) || []; }
    catch { return []; }
  },

  save(key, data) {
    localStorage.setItem('sc_' + key, JSON.stringify(data));
  },

  getOne(key, id) {
    return this.get(key).find(x => x.id === id) || null;
  },

  add(key, item) {
    const arr = this.get(key);
    arr.push(item);
    this.save(key, arr);
    return item;
  },

  update(key, id, updates) {
    const arr = this.get(key);
    const idx = arr.findIndex(x => x.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...updates };
    this.save(key, arr);
    return arr[idx];
  },

  remove(key, id) {
    const arr = this.get(key).filter(x => x.id !== id);
    this.save(key, arr);
  },

  // ---- ID Generator ----
  genId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  },

  // ---- Helpers ----
  getCommodityName(id) {
    const c = this.getOne('commodities', id);
    return c ? c.name : 'Unknown';
  },

  getFacilityName(id) {
    const f = this.getOne('facilities', id);
    return f ? f.name : 'Unknown';
  },

  getDistrictName(id) {
    const d = this.getOne('districts', id);
    return d ? d.name : 'Unknown';
  },

  getProvinceName(id) {
    const p = this.getOne('provinces', id);
    return p ? p.name : 'Unknown';
  },

  getUserName(id) {
    const u = this.getOne('users', id);
    return u ? u.name : 'Unknown';
  },

  // Is the report window open right now?
  isReportWindowOpen(userId) {
    const windows = this.get('reportWindows');
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    // Check auto window: opens on 30th of prev month, closes 7th of current
    // We'll simulate: if day >= 30 OR day <= 7, auto window is open
    const autoOpen = day >= 30 || day <= 7;

    // Check if there's a custom reopened window for this user
    const customWindow = windows.find(w =>
      w.type === 'custom' &&
      (w.reopenedFor === userId || w.reopenedFor === 'all') &&
      w.isOpen &&
      new Date(w.reopenCloseDate) >= now
    );

    return autoOpen || !!customWindow;
  },

  // Calculate facility stock balance for a commodity
  getFacilityStockBalance(facilityId, commodityId) {
    const stock = this.get('facilityStock').find(
      s => s.facilityId === facilityId && s.commodityId === commodityId
    );
    return stock ? stock.closingBalance : 0;
  },

  // Get total facility stock for display
  getFacilityStockSummary(facilityId) {
    return this.get('facilityStock')
      .filter(s => s.facilityId === facilityId)
      .map(s => {
        const commodity = this.getOne('commodities', s.commodityId);
        return { ...s, commodity };
      });
  },

  // Check if consuming/giving more than available
  validateStockMovement(facilityId, commodityId, quantity) {
    const balance = this.getFacilityStockBalance(facilityId, commodityId);
    return { valid: quantity <= balance, balance, requested: quantity };
  },

  // Add a comment to a requisition or report
  addComment(refType, refId, text, userId) {
    return this.add('comments', {
      id: this.genId('cmt'),
      refType, refId, text,
      userId, userName: this.getUserName(userId),
      createdAt: new Date().toISOString()
    });
  },

  // Get comments for a ref
  getComments(refType, refId) {
    return this.get('comments').filter(c => c.refType === refType && c.refId === refId)
      .sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  // Tiered signup: get next approver level
  getSignupApproverRole(applicantRole) {
    const chain = { facility: 'district', district: 'province', province: 'hq', hq: 'admin', admin: 'admin' };
    return chain[applicantRole] || 'admin';
  }
};

// Auto-initialize on load
DB.init();