const deleteUserLink = document.querySelector('#delete-user');
deleteUserLink.addEventListener('click', async () => {
  const response = await fetch(`/api/users/${deleteUserLink.dataset.id}`, {method: 'DELETE'});
  const data = await response.json();
  if (!response.ok) {
    console.error(data);
  } else {
    console.info(data);
    location.assign('/');
  }
});
