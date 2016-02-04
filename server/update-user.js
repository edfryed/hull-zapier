import _ from 'lodash';
import humanize from './lib/humanize'
import { resolve, reduce } from './lib/enrichers';
import f from './lib/formatters';
import restler from 'restler';

const parse = function(hull, user, segments){
  user.segments = _.map(segments, (s)=>{ return s.name });
  const { formatters, formatGroup } = f;
  const groups = reduce(user, formatters);
  const promises = resolve(groups, hull, formatGroup, formatters);
  return Promise.all(promises);
}

export default function(notification={}, context={}){
  const { hull, ship } = context;
  const { user, segments } = notification.message;

  if(!user || !user.id || !ship || !ship.settings){ return false; }

  return parse(hull, user, segments).then((groups)=>{
    const data = _.reduce(groups, (m, o)=>{
      m[o.name] = {...m[o.name], ...o.fields}
      return m;
    }, {});
    return restler.post(ship.settings.zap_url, {data});

  }, (err)=>{
    console.log(err)
  }).catch((err)=>{
    console.log(err)
  });
}
