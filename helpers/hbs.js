const moment = require('moment');

module.exports = {
  truncate: function (str, len) {
      if (str.length> len && str.length>0){
          var newString = str.substr(0, len);
          newString = str.substr(0, newString.lastIndexOf(' '));
          newString = (newString.length > 0) ? newString : str.substr(0, len);
          return newString + '...';
      }
      return str;
  },
    stripTags:function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    select: function (selected, options) {
        return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
            .replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },
    editIcon: function (storyUser, loggedUser, storyID, floating = true) {
        if (storyUser == loggedUser) {
            if (floating) {
                return `<a href="/stories/edit/${storyID}"
                class="btn-floating halfway-fab red"><i class="fa
                fa-pencil"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyID}">
                <i class="fa
                fa-pencil"></i></a>`;
            }
        }else{
            return;
        }
  }

};