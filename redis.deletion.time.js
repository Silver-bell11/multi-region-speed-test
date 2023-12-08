const redis = require("redis")

const start = async() => {
  const client = await redis.createClient({url: 'redis://127.0.0.1:6379'})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();
try {
  for (let i = 1; i <= 10000; i++) {
    const key = `key${i}`;
    const value = `value${i} : { site_id:3278, name:DS office,user_id:4015,dealer_id:4907,partner_id:2,division_id:106,account_number:TP0021,prefix_account_number:1TP0021,account_reference_id:0091,dealer_station_id:3366,prefix:1,receiver_line_prefix:1,partition_number:0,address1:xebx8cx80xedx95x9cxebxafxbcxeaxb5xad xecx84x9cxecx9axb8xedx8axb9xebxb3x84xecx8bx9c xeaxb0x95xecx84x9cxeaxb5xac xebxa7x88xeaxb3xa1xebx8fx99,address2:717xedx98xb8,zipcode:,lat:null,lng:null,virtual_zone:900,timezone:America/Chicago,timezone_offset:null,invitation_status:1,invitation_time:2021-11-29T06:00:16.000Z,device_count:12,blueprint_url:https://chektdev-service-image.s3.ap-northeast-2.amazonaws.com/site/3278/3f1bbeb0-578a-44ed-847a-16a72fb0a169.png,partner_meta:[],verification_duration:120,is_auto_verification:0,auto_verification_update_time:2022-02-15T05:12:43.000Z,auto_verification_hold_off_time:0,account_number_bak:null,country_code:KR,sms_platform_type:1,armipartition_number:0,address1:xebx8cx80xedx95x9cxebxafxbcxeaxb5xad xecx84x9cxecx9axb8xedx8axb9xebxb3x84xecx8bx9c xeaxb0x95xecx84x9cxeaxb5xac xebxa7x88xeaxb3xa1xebx8fx99,address2:717xedx98xb8,zipcode:,lat:null,lng:null,virtual_zone:900,timezone:America/Chicago,timezone_offset:null,invitation_status:1,invitation_time:2021-11-29T06:00:16.000Z,device_count:12,blueprint_url:https://chektdev-service-image.s3.ap-northeast-2.amazonaws.com/site/3278/3f1bbeb0-578a-44ed-847a-16a72fb0a169.png,partner_meta:[],verification_duration:120,is_auto_verification:0,auto_verification_update_time:2022-02-15T05:12:43.000Z,auto_verification_hold_off_time:0,account_number_bak:null,country_code:KR,sms_platform_type:1,arming_source:3,arming_source_updated_at:2023-07-25T14:01:51.000Z,arming_schedule_enabled:1,dnis:123,contact_verify_delay_time:600,is_activated:1,activated_at:2022-03-03T12:36:40.000Z,deactivated_at:2022-03-03T12:36:40.000Z,activated_by:DS Lee,show_arming_config_enduser_app:1,show_event_config_enduser_app:1,show_bypass_config_enduser_app:1,show_device_connection_config_enduser_app:1,show_talkdown_config_enduser_app:1,event_storage_id:5,guard_tour_schedule_enabled:1,updated_at:2023-11-30T15:36:42.000Z,created:2018-10-24T10:55:28.000Z,is_dealer_activated:1,dealer_type:3,company_name:DoSung,company_phone:,site_videoai_enabled:0,site_alarm_signal_suppression_enabled:1,site_mobile_app_notification_suppression_enabled:1,site_automation_rule_suppression_enabled:1 `;
    await client.set(key, value);
    // const values = await client.get(key)
    // console.log(values)
  }
  console.log('host : 127.0.0.1, port : 6379 >>  10000개')
  const startDelete = process.hrtime();

    for (let i = 1; i <= 10000; i++) {
      const key = `key${i}`;
      await client.del(key);
    }
    const end = process.hrtime(startDelete);
    const deletionTimeInSeconds = end[0] + end[1] / 1e9;
    const check = await client.get('key1')
    console.log(check)
    console.log('Deletion time:', deletionTimeInSeconds, 'seconds');

    await client.disconnect()
}  catch(err) {
  throw new Error(err)
}
}

start()


/*Failed codes

const client = redis.createClient(6379, bastion.chektdev.com)
const client = redis.createClient({port : 6379, host: 'bastion.chektdev.com'})

const start = async () => {
  client.on('error', err => console.log('Redis Client Error', err))
  await client.connect();
  const myKeyValue = await client.get('test');
  console.log(myKeyValue,??);
  await client.disconnect()
}
*/

