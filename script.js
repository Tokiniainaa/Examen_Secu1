const form = document.getElementById('inputForm');
const output = document.getElementById('output');
let captchaResolved = true; // Captcha resolution status

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const N = parseInt(document.getElementById('numberInput').value, 10);

  if (N < 1 || N > 1000) {
    alert('Please enter a number between 1 and 1000.');
    return;
  }

  form.style.display = 'none';

  for (let i = 1; i <= N; i++) {
    if (!captchaResolved) {
      await waitForCaptcha();
    }

    try {
      const response = await fetch('https://api.prod.jcloudify.com/whoami');

      if (response.ok) {
        output.innerHTML += `<p>${i}. Forbidden</p>`;
      } else if (response.status === 403) {
        output.innerHTML += `<p>${i}. Forbidden</p>`;
      } else if (response.status === 405) {
        captchaResolved = false;
        displayCaptcha();
        await waitForCaptcha();
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
  }
});

function displayCaptcha() {
  alert('Please complete the Captcha to continue.');
  window._awsWafTokenCallback = () => {
    captchaResolved = true;
  };
}

async function waitForCaptcha() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (captchaResolved) {
        clearInterval(interval);
        resolve();
      }
    }, 500);
  });
}
