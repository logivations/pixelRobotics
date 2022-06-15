
function isAdditionalRequiredFieldsAreFilled() {
  const requiredFields = [...document.getElementsByClassName('required')].reduce((acc, mainRequiredFields) => {
    const fieldName = mainRequiredFields.name.split('-')[0];
    if (acc.hasOwnProperty(fieldName)) {
      acc[fieldName].push(mainRequiredFields)
    } else {
      acc[fieldName] = [mainRequiredFields]
    }
    return acc;
  }, {});
  return Object.keys(requiredFields).every((key) => {
    const arr = requiredFields[key];
    const isValid = arr.some((node) => node.checked !== undefined ? node.checked : !!node.value);
    if (!isValid) {
      const nodeElement = document.querySelector(`[name=${key}]`) || document.querySelector(`[name=${key}-1]`);
      nodeElement.scrollIntoView({block: "center", inline: "nearest"});
    }
    return isValid;
  })
}

function combineData(data) {
  return Object.keys(data).reduce((acc, key) => {
    const splitKey = key.split('-')[0];
    const field = data[key];
    if (field) {
      if (acc.hasOwnProperty(splitKey)) {
        acc[splitKey] = Array.isArray(acc[splitKey]) ? [...acc[splitKey], field] : [field];
        return acc;
      }
      return {...acc, [splitKey]: [field]};
    }
    return acc;
  }, {});
}

$(document).ready(async function() {
  document.querySelector('.btn-close').addEventListener('click', () => {
    $('#feedback').hide();
  });
  document.querySelector('.btn-ok').addEventListener('click', () => {
    $('#feedback').hide();
  });

  await fetch(`common/template?eventId=${eventId}`, {
    method: 'GET',
  })
    .then((res) => res.text())
    .then(async (contentTemplate) => {
      const domParser = new DOMParser();
      const detailBox = document.getElementById('event-details');
      const doc = await domParser.parseFromString(contentTemplate, 'text/html');
      [...doc.body.children].forEach((node) => detailBox.appendChild(node));
    }).then(() => {
      const subscribeForm = document.getElementById('subscribe-form');
      subscribeForm && subscribeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (subscribeForm.checkValidity() && isAdditionalRequiredFieldsAreFilled()) {
          const data = new FormData(event.target);
          const body = {
            mailData: combineData(Object.fromEntries(data)),
            sendMailDetail: {
              mailTo: mailTo,
              subject: subject,
              emailTemplate: emailTemplate,
            }
          };

          fetch('api/mail/subscribeEvent', { method: 'POST', body: JSON.stringify(body) })
            .then(() => {
              subscribeForm.reset();
              $('#feedback').toggle();
              document.getElementById('specific-cases-form').setAttribute('hidden', true);
              document.getElementById('specific-cases-form').removeAttribute('required');
            });
        }
      }, false);
    });
});
