document.addEventListener('DOMContentLoaded', () => {
  const jsonInput = document.getElementById('json-input');
  const errorMessage = document.getElementById('error-message');
  const generatedForm = document.getElementById('generated-form');

  // Populate JSON editor with the given example schema
  const exampleJSON = `{
    "formTitle": "Project Requirements Survey",
    "formDescription": "Please fill out this survey about your project needs",
    "fields": [
      {
        "id": "name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "you@example.com",
        "validation": {
          "pattern": "^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$",
          "message": "Please enter a valid email address"
        }
      },
      {
        "id": "companySize",
        "type": "select",
        "label": "Company Size",
        "required": true,
        "options": [
          { "value": "1-50", "label": "1-50 employees" },
          { "value": "51-200", "label": "51-200 employees" },
          { "value": "201-1000", "label": "201-1000 employees" },
          { "value": "1000+", "label": "1000+ employees" }
        ]
      },
      {
        "id": "industry",
        "type": "radio",
        "label": "Industry",
        "required": true,
        "options": [
          { "value": "tech", "label": "Technology" },
          { "value": "healthcare", "label": "Healthcare" },
          { "value": "finance", "label": "Finance" },
          { "value": "retail", "label": "Retail" },
          { "value": "other", "label": "Other" }
        ]
      },
      {
        "id": "timeline",
        "type": "select",
        "label": "Project Timeline",
        "required": true,
        "options": [
          { "value": "immediate", "label": "Immediate (within 1 month)" },
          { "value": "short", "label": "Short-term (1-3 months)" },
          { "value": "medium", "label": "Medium-term (3-6 months)" },
          { "value": "long", "label": "Long-term (6+ months)" }
        ]
      },
      {
        "id": "comments",
        "type": "textarea",
        "label": "Additional Comments",
        "required": false,
        "placeholder": "Any other details you'd like to share..."
      }
    ]
  }`;

  jsonInput.value = exampleJSON;

  jsonInput.addEventListener('input', () => {
    const schema = jsonInput.value;

    // Validate JSON
    try {
      const parsedSchema = JSON.parse(schema);
      errorMessage.textContent = '';
      generateForm(parsedSchema);
    } catch (error) {
      errorMessage.textContent = 'Invalid JSON: ' + error.message;
      generatedForm.innerHTML = '';
    }
  });

  function generateForm(schema) {
    generatedForm.innerHTML = '';

    // Add form title and description
    const formTitle = document.createElement('h3');
    formTitle.textContent = schema.formTitle;
    generatedForm.appendChild(formTitle);

    const formDescription = document.createElement('p');
    formDescription.textContent = schema.formDescription;
    generatedForm.appendChild(formDescription);

    schema.fields.forEach((field) => {
      const formGroup = document.createElement('div');
      formGroup.style.marginBottom = '15px';

      const label = document.createElement('label');
      label.textContent = field.label;
      label.setAttribute('for', field.id);
      formGroup.appendChild(label);

      let input;
      if (field.type === 'text' || field.type === 'email' || field.type === 'textarea') {
        input = field.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.id;
        input.placeholder = field.placeholder || '';
      } else if (field.type === 'select') {
        input = document.createElement('select');
        input.id = field.id;
        input.name = field.id;

        field.options.forEach((option) => {
          const opt = document.createElement('option');
          opt.value = option.value;
          opt.textContent = option.label;
          input.appendChild(opt);
        });
      } else if (field.type === 'radio') {
        input = document.createElement('div');
        field.options.forEach((option) => {
          const radioWrapper = document.createElement('div');
          const radioInput = document.createElement('input');
          radioInput.type = 'radio';
          radioInput.id = option.value;
          radioInput.name = field.id;
          radioInput.value = option.value;

          const radioLabel = document.createElement('label');
          radioLabel.textContent = option.label;
          radioLabel.setAttribute('for', option.value);

          radioWrapper.appendChild(radioInput);
          radioWrapper.appendChild(radioLabel);
          input.appendChild(radioWrapper);
        });
      }

      if (field.required) {
        input.required = true;
      }

      formGroup.appendChild(input);

      // Add validation message if present
      if (field.validation && field.type === 'email') {
        input.setAttribute('pattern', field.validation.pattern);
        input.setAttribute('title', field.validation.message);
      }

      generatedForm.appendChild(formGroup);
    });
  }

  // Initialize with example JSON
  generateForm(JSON.parse(exampleJSON));
});