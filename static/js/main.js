// Main JavaScript file for the chatbot application

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle functionality
    initSidebarToggle();
    
    // Initialize responsive behavior
    initResponsiveBehavior();
    
    // Initialize tooltips
    initTooltips();
});

function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if (!sidebarToggle || !sidebar) return;
    
    // Ensure sidebar starts in correct state
    if (window.innerWidth > 768) {
        sidebar.classList.remove('show', 'collapsed');
        removeMobileBackdrop();
    }
    
    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
            // Mobile: show/hide sidebar
            sidebar.classList.toggle('show');
            
            // Add backdrop for mobile
            if (sidebar.classList.contains('show')) {
                addMobileBackdrop();
            } else {
                removeMobileBackdrop();
            }
        } else {
            // Desktop: collapse/expand sidebar
            sidebar.classList.toggle('collapsed');
        }
    });
    
    // Auto-expand sidebar on hover (desktop only)
    if (sidebar) {
        let hoverTimeout;
        
        sidebar.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768 && sidebar.classList.contains('collapsed')) {
                clearTimeout(hoverTimeout);
                sidebar.classList.add('hover-expanded');
            }
        });
        
        sidebar.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768 && sidebar.classList.contains('collapsed')) {
                hoverTimeout = setTimeout(() => {
                    sidebar.classList.remove('hover-expanded');
                }, 300);
            }
        });
    }
}

function initResponsiveBehavior() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    // Set initial state based on screen size
    function setInitialState() {
        if (window.innerWidth > 768) {
            // Desktop: ensure sidebar is visible and not collapsed by default
            if (sidebar) {
                sidebar.classList.remove('show', 'collapsed', 'hover-expanded');
            }
            removeMobileBackdrop();
        } else {
            // Mobile: hide sidebar by default
            if (sidebar) {
                sidebar.classList.remove('collapsed', 'hover-expanded');
                sidebar.classList.remove('show');
            }
            removeMobileBackdrop();
        }
    }
    
    // Set initial state
    setInitialState();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        setInitialState();
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && !document.getElementById('sidebarToggle').contains(e.target)) {
                sidebar.classList.remove('show');
                removeMobileBackdrop();
            }
        }
    });
}

function addMobileBackdrop() {
    // Remove existing backdrop
    removeMobileBackdrop();
    
    const backdrop = document.createElement('div');
    backdrop.className = 'mobile-backdrop';
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 1040;
        display: block;
    `;
    
    document.body.appendChild(backdrop);
    
    // Close sidebar when clicking backdrop
    backdrop.addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('show');
        }
        removeMobileBackdrop();
    });
}

function removeMobileBackdrop() {
    const backdrop = document.querySelector('.mobile-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

function initTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show notification`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function formatTime(date) {
    return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions for use in other scripts
window.chatbotUtils = {
    showNotification,
    formatTime,
    escapeHtml,
    addMobileBackdrop,
    removeMobileBackdrop
};
