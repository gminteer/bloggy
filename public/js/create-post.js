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
    bulmaToast.toast({
      message: `Error: ${data.message} when attemping to create post`,
      type: 'is-danger',
      position: 'topcenter',
      duration: 6 * 1000,
      dissmissible: true,
      animate: {in: 'fadeIn', out: 'fadeOut'},
    });
  } else {
    if (!post.dataset.parent) location.assign('/');
    else location.reload();
  }
});
