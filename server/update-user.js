import _ from 'lodash';
import restler from 'restler';

function error(code='error', err){
  console.log(`Bad/invalid request - ${code} - Zapier error, or failed request`, err);
}

export default function({ message={} }, { ship={}, hull={} }){
  const { user, segments, changes={} } = message;
  const { settings={}, private_settings={} } = ship;
  const { synchronized_segments=[], synchronized_properties=[] } = private_settings;
  const { zap_url='' } = settings;

  const log = hull.utils.log;
  log(changes);

  if(!user || !user.id || !ship || !zap_url || !synchronized_segments){
    return false;
  }

  //pluck
  const segmentArray = _.map(segments, 'name');
  const segmentIds   = _.map(segments, 'id');

  if ( synchronized_segments.length > 0 && !_.intersection(segmentIds, synchronized_segments).length){
    log(`Skipping user update for ${user.id} because not matching any segment`);
    return false;
  }
  if (synchronized_properties.length>0 && !_.intersection(_.keys(changes.user||{}), synchronized_properties).length){
    log(`Skipping user update for ${user.id} because we're filtering changed properties`);
    return false;
  }

  const data = { ...user,  segments: segmentArray }

  return restler.post(zap_url, {data})
    .on('success', function(data={}, response){
      log('Zap Sent', data, response)
    })
    .on('error', error.bind(undefined, 'error'))
    .on('fail', error.bind(undefined, 'failure'))
    .on('abort', error.bind(undefined,'abort'));
}
