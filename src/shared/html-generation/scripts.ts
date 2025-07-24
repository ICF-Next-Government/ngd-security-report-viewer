/**
 * JavaScript utilities for interactive functionality in static HTML reports
 * Handles view switching, search, filtering, and group interactions
 */

/**
 * Core JavaScript for view mode switching and group interactions
 */
export const CORE_SCRIPTS = `
  // Global state management
  window.ReportViewer = {
    viewMode: 'deduplicated',
    searchTerm: '',
    severityFilter: 'all',
    expandedGroups: new Set()
  };

  // Utility function to escape HTML for search highlighting
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Utility function to highlight search terms
  function highlight(text, term) {
    if (!term || term.trim() === '') return text;

    // Escape regex special characters
    const safeTerm = term.replace(/[.*+?^{}()|[\\]\\\\]/g, '\\\\$&');
    const regex = new RegExp(safeTerm, 'gi');

    return text.replace(regex, function(match) {
      return '<mark class="inline-highlight">' + escapeHtml(match) + '</mark>';
    });
  }

  // Debounce function for search input
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = function() {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
`;

/**
 * View mode switching functionality
 */
export const VIEW_MODE_SCRIPTS = `
  // View mode management
  function updateView() {
    const groupedBtn = document.getElementById('grouped-view-btn');
    const allBtn = document.getElementById('all-view-btn');
    const groupedFindings = document.getElementById('grouped-findings');
    const allFindings = document.getElementById('all-findings');

    if (!groupedBtn || !allBtn || !groupedFindings || !allFindings) {
      return;
    }

    if (window.ReportViewer.viewMode === 'deduplicated') {
      groupedBtn.classList.add('active');
      allBtn.classList.remove('active');
      groupedFindings.style.display = 'block';
      allFindings.style.display = 'none';
    } else {
      groupedBtn.classList.remove('active');
      allBtn.classList.add('active');
      groupedFindings.style.display = 'none';
      allFindings.style.display = 'block';
    }

    // Re-run filtering after view change
    filterFindings();
  }

  function initializeViewToggle() {
    const groupedBtn = document.getElementById('grouped-view-btn');
    const allBtn = document.getElementById('all-view-btn');

    if (groupedBtn) {
      groupedBtn.addEventListener('click', function() {
        window.ReportViewer.viewMode = 'deduplicated';
        updateView();
      });
    }

    if (allBtn) {
      allBtn.addEventListener('click', function() {
        window.ReportViewer.viewMode = 'all';
        updateView();
      });
    }
  }
`;

/**
 * Group expand/collapse functionality
 */
export const GROUP_INTERACTION_SCRIPTS = `
  // Group expansion/collapse management
  function toggleGroup(groupId) {
    const details = document.getElementById('group-details-' + groupId);
    const toggle = document.querySelector('[data-group-id="' + groupId + '"]');
    const chevron = toggle ? toggle.querySelector('.chevron') : null;

    if (!details) return;

    const isExpanded = details.style.display !== 'none';

    if (isExpanded) {
      details.style.display = 'none';
      if (chevron) chevron.style.transform = 'rotate(0deg)';
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      window.ReportViewer.expandedGroups.delete(groupId);
    } else {
      details.style.display = 'block';
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      if (toggle) toggle.setAttribute('aria-expanded', 'true');
      window.ReportViewer.expandedGroups.add(groupId);
    }
  }

  function initializeGroupInteractions() {
    // Handle click events for group toggles
    document.addEventListener('click', function(event) {
      const groupToggle = event.target.closest('.group-toggle');
      if (groupToggle) {
        event.preventDefault();
        const groupId = groupToggle.getAttribute('data-group-id');
        if (groupId) {
          toggleGroup(groupId);
        }
      }
    });

    // Handle keyboard events for group toggles
    document.addEventListener('keydown', function(event) {
      const groupToggle = event.target.closest('.group-toggle');
      if (groupToggle && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        const groupId = groupToggle.getAttribute('data-group-id');
        if (groupId) {
          toggleGroup(groupId);
        }
      }
    });
  }
`;

/**
 * Search and filtering functionality
 */
export const SEARCH_FILTER_SCRIPTS = `
  // Search and filter functionality
  function filterFindings() {
    const term = window.ReportViewer.searchTerm.toLowerCase();
    const selectedSeverity = window.ReportViewer.severityFilter;
    const noResults = document.getElementById('inline-no-results');
    let anyVisible = false;

    // Get findings based on current view mode
    const currentFindings = window.ReportViewer.viewMode === 'deduplicated'
      ? document.querySelectorAll('#grouped-findings .finding-result')
      : document.querySelectorAll('#all-findings .finding-result');

    currentFindings.forEach(function(finding) {
      // Store original content if not already stored
      if (!finding.hasAttribute('data-original-content')) {
        finding.setAttribute('data-original-content', finding.innerHTML);
      }

      // Reset to original content
      const originalContent = finding.getAttribute('data-original-content');
      finding.innerHTML = originalContent;

      // Get text content for searching
      const text = finding.textContent.toLowerCase();
      const matchesSearch = !term || text.includes(term);
      const matchesSeverity = selectedSeverity === 'all' ||
        finding.getAttribute('data-severity') === selectedSeverity;

      if (matchesSearch && matchesSeverity) {
        finding.style.display = 'block';
        anyVisible = true;

        // Apply highlighting if there's a search term
        if (term && term.trim() !== '') {
          const walker = document.createTreeWalker(
            finding,
            NodeFilter.SHOW_TEXT,
            null,
            false
          );

          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            if (node.nodeValue.trim() !== '') {
              textNodes.push(node);
            }
          }

          textNodes.forEach(function(textNode) {
            const parent = textNode.parentNode;
            if (parent && !parent.classList.contains('inline-highlight')) {
              const highlightedText = highlight(textNode.nodeValue, term);
              if (highlightedText !== textNode.nodeValue) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                parent.replaceChild(wrapper, textNode);
              }
            }
          });
        }
      } else {
        finding.style.display = 'none';
      }
    });

    // Show/hide no results message
    if (noResults) {
      noResults.style.display = anyVisible ? 'none' : 'block';
    }
  }

  function initializeSearch() {
    const searchInput = document.getElementById('inline-findings-search');
    const clearBtn = document.getElementById('inline-findings-clear');
    const severitySelect = document.getElementById('inline-severity-filter');

    if (searchInput) {
      const debouncedFilter = debounce(function() {
        window.ReportViewer.searchTerm = searchInput.value;
        filterFindings();

        // Show/hide clear button
        if (clearBtn) {
          clearBtn.style.display = searchInput.value ? 'block' : 'none';
        }
      }, 300);

      searchInput.addEventListener('input', debouncedFilter);
      searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          searchInput.value = '';
          window.ReportViewer.searchTerm = '';
          filterFindings();
          if (clearBtn) clearBtn.style.display = 'none';
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        window.ReportViewer.searchTerm = '';
        filterFindings();
        clearBtn.style.display = 'none';
      });
    }

    if (severitySelect) {
      severitySelect.addEventListener('change', function() {
        window.ReportViewer.severityFilter = severitySelect.value;
        filterFindings();
      });
    }
  }
`;

/**
 * Accessibility enhancements
 */
export const ACCESSIBILITY_SCRIPTS = `
  // Accessibility enhancements
  function initializeAccessibility() {
    // Add proper ARIA labels and roles where missing
    const groupToggles = document.querySelectorAll('.group-toggle');
    groupToggles.forEach(function(toggle) {
      if (!toggle.hasAttribute('role')) {
        toggle.setAttribute('role', 'button');
      }
      if (!toggle.hasAttribute('tabindex')) {
        toggle.setAttribute('tabindex', '0');
      }
      if (!toggle.hasAttribute('aria-expanded')) {
        toggle.setAttribute('aria-expanded', 'false');
      }

      const groupId = toggle.getAttribute('data-group-id');
      if (groupId) {
        toggle.setAttribute('aria-controls', 'group-details-' + groupId);
      }
    });

    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-navigation');
    });
  }
`;

/**
 * Performance optimizations
 */
export const PERFORMANCE_SCRIPTS = `
  // Performance optimizations
  function initializePerformanceOptimizations() {
    // Use Intersection Observer for lazy loading of group details
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const groupToggle = entry.target;
            groupToggle.classList.add('visible');
          }
        });
      }, {
        rootMargin: '50px'
      });

      document.querySelectorAll('.group-toggle').forEach(function(toggle) {
        observer.observe(toggle);
      });
    }

    // Optimize search performance for large datasets
    if (document.querySelectorAll('.finding-result').length > 100) {
      console.log('Large dataset detected, enabling performance optimizations');

      // Use requestAnimationFrame for smooth filtering
      const originalFilterFindings = window.filterFindings;
      window.filterFindings = function() {
        requestAnimationFrame(originalFilterFindings);
      };
    }
  }
`;

/**
 * Main initialization function
 */
export const INITIALIZATION_SCRIPTS = `
  // Main initialization
  function initializeReportViewer() {
    try {
      initializeViewToggle();
      initializeGroupInteractions();
      initializeSearch();
      initializeAccessibility();
      initializePerformanceOptimizations();

      // Set initial view mode
      updateView();

      console.log('Security Report Viewer initialized successfully');
    } catch (error) {
      console.error('Error initializing Security Report Viewer:', error);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeReportViewer);
  } else {
    initializeReportViewer();
  }
`;

/**
 * Generates the complete JavaScript code for the static HTML report
 */
export function generateReportScripts(enableDeduplication: boolean = true): string {
  const scripts = [
    CORE_SCRIPTS,
    VIEW_MODE_SCRIPTS,
    GROUP_INTERACTION_SCRIPTS,
    SEARCH_FILTER_SCRIPTS,
    ACCESSIBILITY_SCRIPTS,
    PERFORMANCE_SCRIPTS,
  ];

  // Set initial view mode based on enableDeduplication
  const customInitialization = `
  // Set initial view mode
  window.ReportViewer.viewMode = '${enableDeduplication ? "deduplicated" : "all"}';

  ${INITIALIZATION_SCRIPTS}
  `;

  scripts.push(customInitialization);

  return scripts.join("\n\n");
}

/**
 * Generates inline event handlers for specific elements (fallback for older browsers)
 */
export function generateInlineHandlers(): Record<string, string> {
  return {
    groupToggle: `onclick="toggleGroup(this.getAttribute('data-group-id'))"`,
    searchClear: `onclick="document.getElementById('inline-findings-search').value=''; window.ReportViewer.searchTerm=''; filterFindings(); this.style.display='none';"`,
    viewToggleGrouped: `onclick="window.ReportViewer.viewMode='deduplicated'; updateView();"`,
    viewToggleAll: `onclick="window.ReportViewer.viewMode='all'; updateView();"`,
  };
}
