(function() {
  'use strict';

  var MAILTO_ADDRESS = 'gdslocal-info@dsit.gov.uk';
  var SURVEY_URL = 'https://forms.office.com/e/PLACEHOLDER';
  var MAX_BODY_CHARS = 1500;

  // --- Modal shapes ---

  var shapes = {
    usage: {
      title: 'Tell us how you use the LGAM',
      fields: [
        { id: 'feedback-interest', type: 'textarea', label: 'What is your interest in the Local Government Architecture Model?', hint: 'e.g. exploring for a future project, aligning technology decisions, benchmarking across councils' },
        { type: 'row', fields: [
          { id: 'feedback-role', type: 'select', label: 'What\'s your role?', options: [
            'Enterprise / solution architect',
            'IT / digital leader',
            'Service / delivery manager',
            'Developer / technical lead',
            'Procurement / commissioning',
            'Supplier / vendor',
            'Other'
          ]},
          { id: 'feedback-useful', type: 'select', label: 'Is the LGAM meeting your needs?', options: [
            'Yes',
            'Partly',
            'Not yet',
            'Not sure'
          ]}
        ]},
        { id: 'feedback-aspects', type: 'textarea', label: 'What aspects have you found useful, if any?', hint: '' },
        { id: 'feedback-changes', type: 'textarea', label: 'Is there anything you\'d like to see added or changed?', hint: '' }
      ]
    },
    page: {
      title: 'Suggest a change',
      fields: [
        { id: 'feedback-category', type: 'radios', label: 'What\'s your feedback about?', options: [
          'Content — something is wrong or missing',
          'Structure — hard to find or navigate',
          'Suggestion — something new',
          'Other'
        ]},
        { id: 'feedback-detail', type: 'textarea', label: 'Your feedback', hint: 'Tell us what you\'d change.' }
      ]
    },
    node: {
      title: 'Feedback on this page',
      fields: [
        { id: 'feedback-accuracy', type: 'radios', label: 'Is this correctly described?', options: [
          'Yes',
          'Partly — some things need changing',
          'No — this is significantly wrong'
        ]},
        { id: 'feedback-missing', type: 'textarea', label: 'Is anything missing?', hint: 'e.g. missing capabilities, wrong relationships, absent sub-areas' }
      ]
    }
  };

  // --- Render form fields ---

  function renderField(field) {
    var html = '<div class="govuk-form-group" style="margin-bottom:20px;">';
    html += '<label class="govuk-label govuk-!-font-weight-bold" for="' + field.id + '">' + field.label + '</label>';

    if (field.type === 'select') {
      html += '<select class="govuk-select" id="' + field.id + '" name="' + field.id + '">';
      html += '<option value="">Select an option</option>';
      field.options.forEach(function(opt) {
        html += '<option value="' + opt + '">' + opt + '</option>';
      });
      html += '</select>';
    } else if (field.type === 'radios') {
      html = '<fieldset class="govuk-fieldset" style="margin-bottom:20px;">';
      html += '<legend class="govuk-fieldset__legend govuk-!-font-weight-bold">' + field.label + '</legend>';
      html += '<div class="govuk-radios govuk-radios--small" data-field-id="' + field.id + '">';
      field.options.forEach(function(opt, i) {
        var inputId = field.id + '-' + i;
        html += '<div class="govuk-radios__item">';
        html += '<input class="govuk-radios__input" id="' + inputId + '" name="' + field.id + '" type="radio" value="' + opt + '">';
        html += '<label class="govuk-label govuk-radios__label" for="' + inputId + '">' + opt + '</label>';
        html += '</div>';
      });
      html += '</div>';
      html += '</fieldset>';
      return html;
    } else if (field.type === 'textarea') {
      if (field.hint) {
        html += '<div class="govuk-hint">' + field.hint + '</div>';
      }
      html += '<textarea class="govuk-textarea" id="' + field.id + '" name="' + field.id + '" rows="3"></textarea>';
    }

    html += '</div>';
    return html;
  }

  // --- Build and open modal ---

  function openModal(shape, pageTitle) {
    var config = shapes[shape];
    if (!config) return;

    var dialog = document.getElementById('lgam-feedback-dialog');
    if (!dialog) return;

    var titleEl = document.getElementById('feedback-modal-title');
    var bodyEl = document.getElementById('feedback-modal-body');

    var displayTitle = config.title;
    if (pageTitle && (shape === 'page' || shape === 'node')) {
      displayTitle += ': ' + pageTitle;
    }
    titleEl.textContent = displayTitle;

    var fieldsHtml = '';
    config.fields.forEach(function(field) {
      if (field.type === 'row') {
        fieldsHtml += '<div class="feedback-row">';
        field.fields.forEach(function(subfield) {
          fieldsHtml += '<div class="feedback-row__col">' + renderField(subfield) + '</div>';
        });
        fieldsHtml += '</div>';
      } else {
        fieldsHtml += renderField(field);
      }
    });
    bodyEl.innerHTML = fieldsHtml;

    // Store shape and page context
    dialog.setAttribute('data-shape', shape);
    dialog.setAttribute('data-page-title', pageTitle || '');

    // Attach aggregate character counter
    bodyEl.querySelectorAll('textarea').forEach(function(ta) {
      ta.addEventListener('input', updateAggregateCount);
    });

    // Reset counter
    updateAggregateCount();

    // Open dialog
    dialog.showModal();
    document.body.classList.add('feedback-modal-open');

    // Focus first interactive element
    var firstInput = bodyEl.querySelector('select, input, textarea');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    var dialog = document.getElementById('lgam-feedback-dialog');
    if (dialog && dialog.open) {
      dialog.close();
      document.body.classList.remove('feedback-modal-open');
    }
  }

  // --- Aggregate character counter ---

  function getTotalChars() {
    var total = 0;
    var bodyEl = document.getElementById('feedback-modal-body');
    if (!bodyEl) return 0;
    bodyEl.querySelectorAll('textarea').forEach(function(ta) {
      total += ta.value.length;
    });
    return total;
  }

  function updateAggregateCount() {
    var countEl = document.getElementById('feedback-aggregate-count');
    if (!countEl) return;
    var total = getTotalChars();
    var remaining = MAX_BODY_CHARS - total;
    if (remaining < 300) {
      countEl.innerHTML = total + ' / ' + MAX_BODY_CHARS + ' characters — <a href="' + SURVEY_URL + '" class="govuk-link" target="_blank" rel="noopener">use our survey</a> for longer feedback';
      countEl.className = 'feedback-aggregate-count feedback-aggregate-count--warning';
    } else {
      countEl.textContent = total + ' / ' + MAX_BODY_CHARS + ' characters';
      countEl.className = 'feedback-aggregate-count';
    }
  }

  // --- Submit: build mailto ---

  function submitFeedback() {
    var dialog = document.getElementById('lgam-feedback-dialog');
    var shape = dialog.getAttribute('data-shape');
    var pageTitle = dialog.getAttribute('data-page-title');
    var config = shapes[shape];
    if (!config) return;

    var subject = 'LGAM feedback';
    if (pageTitle) {
      subject += ' — ' + pageTitle;
    }

    var bodyParts = [];
    if (pageTitle) bodyParts.push('Page: ' + pageTitle);
    bodyParts.push('Type: ' + config.title);
    bodyParts.push('Date: ' + new Date().toISOString().slice(0, 10));
    bodyParts.push('');

    function collectField(field) {
      if (field.type === 'row') {
        field.fields.forEach(collectField);
        return;
      }
      if (field.type === 'select') {
        var sel = document.getElementById(field.id);
        if (sel && sel.value) {
          bodyParts.push(field.label + ' ' + sel.value);
          bodyParts.push('');
        }
      } else if (field.type === 'radios') {
        var checked = dialog.querySelector('input[name="' + field.id + '"]:checked');
        if (checked) {
          bodyParts.push(field.label + ' ' + checked.value);
          bodyParts.push('');
        }
      } else if (field.type === 'textarea') {
        var ta = document.getElementById(field.id);
        if (ta && ta.value.trim()) {
          bodyParts.push(field.label + ':');
          bodyParts.push(ta.value.trim());
          bodyParts.push('');
        }
      }
    }
    config.fields.forEach(collectField);

    var body = bodyParts.join('\n');

    if (body.length > MAX_BODY_CHARS) {
      body = body.slice(0, MAX_BODY_CHARS) + '\n\n[Truncated — please reply with additional detail]';
    }

    var mailto = 'mailto:' + MAILTO_ADDRESS +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
    closeModal();
  }

  // --- Progressive enhancement: intercept links ---

  function init() {
    document.querySelectorAll('[data-feedback-trigger]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var shape = link.getAttribute('data-feedback-trigger');
        var pageTitle = link.getAttribute('data-feedback-page') || document.title.replace(/ - Local Government Architecture Model/i, '').replace(/ - GOV\.UK/i, '');
        openModal(shape, pageTitle);
      });
    });

    var closeBtn = document.getElementById('feedback-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var cancelBtn = document.getElementById('feedback-modal-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    var submitBtn = document.getElementById('feedback-modal-submit');
    if (submitBtn) submitBtn.addEventListener('click', submitFeedback);

    var dialog = document.getElementById('lgam-feedback-dialog');
    if (dialog) {
      dialog.addEventListener('close', function() {
        document.body.classList.remove('feedback-modal-open');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
