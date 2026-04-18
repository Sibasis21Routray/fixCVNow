// lib/storage.js - Browser-based lead and resume data management
// No database - all data stored in browser sessionStorage and localStorage

export const STORAGE_KEYS = {
  LEADS: 'fixcvnow_leads',
  CURRENT_SESSION: 'fixcvnow_session',
  RESUME_DATA: 'fixcvnow_resume_'
};

// Lead management
export const leadsStorage = {
  // Add a new lead
  addLead: (lead) => {
    const leads = leadsStorage.getAllLeads();
    const newLead = {
      id: Date.now().toString(),
      ...lead,
      createdAt: new Date().toISOString(),
      sessionId: generateSessionId()
    };
    leads.push(newLead);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    }
    return newLead;
  },

  // Get all leads (for admin/export)
  getAllLeads: () => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : [];
  },

  // Get lead by ID
  getLeadById: (id) => {
    const leads = leadsStorage.getAllLeads();
    return leads.find(lead => lead.id === id);
  },

  // Get lead by session ID
  getLeadBySessionId: (sessionId) => {
    const leads = leadsStorage.getAllLeads();
    return leads.find(lead => lead.sessionId === sessionId);
  },

  // Update lead data
  updateLead: (sessionId, updatedData) => {
    const leads = leadsStorage.getAllLeads();
    const leadIndex = leads.findIndex(lead => lead.sessionId === sessionId);
    if (leadIndex !== -1) {
      leads[leadIndex] = {
        ...leads[leadIndex],
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
      }
      return leads[leadIndex];
    }
    return null;
  },

  // Export leads as CSV
  exportLeadsCSV: () => {
    const leads = leadsStorage.getAllLeads();
    if (leads.length === 0) return '';
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Created At'];
    const rows = leads.map(lead => [
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.createdAt
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }
};

// Resume data management - stored per session
export const resumeStorage = {
  // Save extracted resume data for current session
  saveResumeData: (sessionId, data) => {
    if (typeof window === 'undefined') return;
    const key = `${STORAGE_KEYS.RESUME_DATA}${sessionId}`;
    sessionStorage.setItem(key, JSON.stringify({
      data,
      extractedAt: new Date().toISOString()
    }));
    return sessionId;
  },

  // Get resume data for session
  getResumeData: (sessionId) => {
    if (typeof window === 'undefined') return null;
    const key = `${STORAGE_KEYS.RESUME_DATA}${sessionId}`;
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  },

  // Clear resume data after download or 30 min (user responsibility)
  clearResumeData: (sessionId) => {
    if (typeof window === 'undefined') return;
    const key = `${STORAGE_KEYS.RESUME_DATA}${sessionId}`;
    sessionStorage.removeItem(key);
  }
};

// Session management
export const sessionStorage_util = {
  // Get or create current session
  getCurrentSession: () => {
    if (typeof window === 'undefined') return null;
    let session = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!session) {
      session = generateSessionId();
      sessionStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, session);
    }
    return session;
  },

  // Store uploaded file in memory (using a Map since sessionStorage can't store File objects)
  _uploadedFileMap: new Map(),

  // Store uploaded file
  setUploadedFile: (file) => {
    if (typeof window === 'undefined') return;
    const session = sessionStorage_util.getCurrentSession();
    sessionStorage_util._uploadedFileMap.set(session, {
      file,
      uploadedAt: new Date().toISOString()
    });
    console.log('[v0] File stored for session:', session);
  },

  // Get uploaded file
  getUploadedFile: () => {
    if (typeof window === 'undefined') return null;
    const session = sessionStorage_util.getCurrentSession();
    const stored = sessionStorage_util._uploadedFileMap.get(session);
    return stored ? stored.file : null;
  },

  // Clear session
  clearSession: () => {
    if (typeof window === 'undefined') return;
    const session = sessionStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (session) {
      sessionStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      sessionStorage.removeItem(`${STORAGE_KEYS.CURRENT_SESSION}_file`);
      resumeStorage.clearResumeData(session);
    }
  }
};

// Helper to generate unique session IDs
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export leads as Excel-like format
export const exportLeads = () => {
  const csv = leadsStorage.exportLeadsCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
