const deleteUserLink = document.querySelector('#delete-user');
deleteUserLink.addEventListener('click', async () => {
  const response = await fetch(`/api/users/${deleteUserLink.dataset.id}`, {method: 'DELETE'});
  const data = await response.json();
  if (!response.ok) {
    console.error(data);
    bulmaToast.toast({
      message: `Error: ${data.message} when attemping to delete user`,
      type: 'is-danger',
      position: 'topcenter',
      duration: 6 * 1000,
      dissmissible: true,
      animate: {in: 'fadeIn', out: 'fadeOut'},
    });
  } else {
    console.info(data);
    location.assign('/');
  }
});
