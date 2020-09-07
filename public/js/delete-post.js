const deleteLinks = document.querySelectorAll('.destroy');

deleteLinks.forEach((deleteLink) => {
  deleteLink.addEventListener('click', async (event) => {
    const response = await fetch(`/api/posts/${event.target.dataset.id}`, {method: 'DELETE'});
    const data = await response.json();
    if (!response.ok) {
      console.error(data);
      bulmaToast.toast({
        message: `Error: ${data.message} when attemping to delete post`,
        type: 'is-danger',
        position: 'topcenter',
        duration: 6 * 1000,
        dissmissible: true,
        animate: {in: 'fadeIn', out: 'fadeOut'},
      });
    } else {
      location.reload();
    }
  });
});
