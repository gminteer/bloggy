const login = document.querySelector('#login');
const usernameEl = document.querySelector('#username');
const passwordEl = document.querySelector('#password');
login.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameEl.value.trim();
  const password = passwordEl.value;
  const endpoint = login.dataset.loginType === 'login' ? '/api/users/login' : '/api/users';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({username, password}),
  });
  const data = await response.json();
  if (!response.ok) {
    // TODO: better response handling
    console.error(data);
  } else {
    console.info(data);
    location.assign(`/users/${data.user.id}`);
  }
});
