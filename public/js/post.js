const post = document.querySelector('#post');
const titleEl = document.querySelector('#title');
const bodyEl = document.querySelector('#body');
post.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = titleEl.value.trim();
  const body = bodyEl.value;
  const response = await fetch(`/api/posts/${post.dataset.parent}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({title, body}),
  });
  const data = await response.json();
  if (!response.ok) {
    console.error(data);
  } else {
    console.info(data);
    if (!post.dataset.parent) location.assign('/');
    else location.reload();
  }
});
