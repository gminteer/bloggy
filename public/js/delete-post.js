const deleteLinks = document.querySelectorAll('.destroy');
deleteLinks.forEach((deleteLink) => {
  deleteLink.addEventListener('click', async (event) => {
    const response = await fetch(`/api/posts/${event.target.dataset.id}`, {method: 'DELETE'});
    const data = await response.json();
    if (!response.ok) {
      console.error(data);
    } else {
      console.info(data);
      location.reload();
    }
  });
});
