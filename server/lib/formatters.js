import _ from 'lodash';
import moment from 'moment';
import humanize from './humanize';

const formatters = {
  hide: /(id)|.*(_id)$/,
  group: [
    { prefix: 'traits',         name:'Traits'},
    { prefix: 'segments',       name:'Segments'},
    { prefix: 'facebook',       name:'Facebook'},
    { prefix: 'actions',        hide: true },
    { prefix: 'form',           hide: true },
    { prefix: 'first_session',  hide: true },
    { prefix: 'latest_session', hide: true },
    { prefix: 'signup_session', hide: true }
  ],
  rename: {
    'signup_session_initial_url': 'signup_url'
  },
  format:[
    {
      pattern: /_at$/,
      format(val){ return moment(val).format('dd, MM, Do, YYYY, HH:mm');; }
    }
  ]
}

function displayPlatformName(name=''){
  return name.replace(/platforms\//,'');
}

module.exports = {
  formatters: formatters,
  formatGroup(fields, name, section){
    name = section ? displayPlatformName(section.type) : name;
    return { name, fields }
  }
}
