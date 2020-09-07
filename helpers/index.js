const {DateTime} = require('luxon');

module.exports = {
  pluralize(string, val) {
    return val === 1 ? string : `${string}s`;
  },

  date(timeStamp) {
    return timeStamp.toLocaleDateString('en-US', {dateStyle: 'short'});
  },

  hide_default_comment_title(post) {
    return post.parent_id && post.title === 'comment' ? '' : post.title;
  },

  relative_time(timeStamp) {
    const diff = DateTime.fromJSDate(timeStamp)
      .diffNow(['months', 'weeks', 'days', 'hours', 'minutes'])
      .negate()
      .toObject();
    let formattedString = '';
    for (const [unit, value] of Object.entries(diff)) {
      if (value)
        formattedString += `${Math.floor(value)} ${value === 1 ? unit.slice(0, -1) : unit} `;
    }
    return formattedString;
  },

  is_login(loginType) {
    return loginType === 'login';
  },

  owns_post(user, post) {
    return user && user.id === post.user.id;
  },
};
