require('./CameraSDK/play');

const Player = global.VideoPlayer;

const devices = require('./deviceList').DEVICES;

const fs = require('fs');

let startTimeOfVideo;
let searchRecordDay = 0;
let devicesForSetConfig = [];

const searchRecordAfterConnect = () => {
  console.log('==========DEVICE CONNECTED');
  let currentDate = new Date();

  let today = new Date(currentDate);

  let begintime = new Date(
    today.getFullYear().toString() +
      '-' +
      (today.getMonth() + 1).toString() +
      '-' +
      (today.getDate() - searchRecordDay).toString() +
      ' 00:00:00'
  );
  let endtime = new Date(
    today.getFullYear().toString() +
      '-' +
      (today.getMonth() + 1).toString() +
      '-' +
      (today.getDate() - searchRecordDay).toString() +
      ' 23:59:59'
  );

  begintime =
    parseInt(begintime.getTime() / 1000) - new Date().getTimezoneOffset() * 60;
  endtime =
    parseInt(endtime.getTime() / 1000) - new Date().getTimezoneOffset() * 60;
  console.log('=======date of sd card data', { begintime, endtime });

  Player.SreachRecord(devices[0], '', 0, begintime, endtime, 15);
};

Player.checkMediaConfigsOfNextDevice = (
  deviceId,
  fps,
  resolution,
  bitRate,
  bitRateType,
  encType,
  totalStorage,
  remainingStorage,
  timezone,
  audioEnabled,
  preIssue // 3rd param for any preIssue - offline/auth/no_recordings
) => {
  if (deviceId && fps) {
    console.log('=====device media configs', {
      deviceId,
      fps,
      resolution,
      bitRate,
      bitRateType,
      encType,
      totalStorage,
      remainingStorage,
      timezone,
      audioEnabled,
      preIssue,
    });

    console.log('====== Disconnecting Device...');
    Player.DisConnectDevice(devices[0]);
    devices.splice(0, 1);
    getMediaConfigsOfDevices();

    let mediaConfigsFilePath = __dirname + `/mediaConfig/getConfigData.csv`;

    let cameraInstallationQCPassed = true;
    let errors = '';
    // pass - no error
    // pre issues - offline, auth, no rec | config issues - fps, res, codec, timezone, audioEnabled | no frame
    if (
      fps === '-' ||
      resolution === '-' ||
      encType === '-' ||
      timezone === '-'
    ) {
      errors += 'No frame received,';
      cameraInstallationQCPassed = false;
    } else {
      if (fps !== 5) {
        errors += 'fps,';
        cameraInstallationQCPassed = false;
      }
      if (resolution !== '640x360') {
        errors += 'resolution,';
        cameraInstallationQCPassed = false;
      }
      if (encType !== 'H264' && encType !== 'H265') {
        errors += 'encoding,';
        cameraInstallationQCPassed = false;
      }
      if (timezone < 19700 || timezone > 19900) {
        errors += 'timezone wrong';
        cameraInstallationQCPassed = false;
      }
      if (audioEnabled) {
        errors += 'audio enabled';
        cameraInstallationQCPassed = false;
      }
    }

    if (preIssue) {
      cameraInstallationQCPassed = false;
    }

    const arr = [
      deviceId,
      fps,
      resolution,
      encType,
      totalStorage,
      remainingStorage,
      timezone,
      audioEnabled,
      cameraInstallationQCPassed ? 'Pass' : 'Fail',
      cameraInstallationQCPassed ? [] : preIssue ? [preIssue] : [errors],
      '\n',
    ];

    const textContent = arr.join(',').toString();

    fs.appendFile(mediaConfigsFilePath, textContent, (err) => {
      if (err) console.error('Error writing the csv file:', err);
      else console.log('getConfigData file saved successfully.');
    });
  } else {
    console.log('====== Disconnecting Device...');
    Player.DisConnectDevice(devices[0]);
    devices.splice(0, 1);
    getMediaConfigsOfDevices();
  }
};

const startPlaybackToGetConfigs = () => {
  Player.StartPlayBack(
    devices[0],
    '',
    0,
    startTimeOfVideo,
    startTimeOfVideo + 300,
    18,
    0,
    false
  );
};

const getMediaConfigsOfDevices = () => {
  if (devices.length === 0) {
    setTimeout(() => {
      const csvFile = __dirname + '/mediaConfig/getConfigData.csv';
      console.log('DEVICES EMPTY kill process after 5s', csvFile);
      fs.readFile(csvFile, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const eachCamData = data.trim().split('\n');
        let json = {};
        eachCamData.forEach((ele) => {
          const camId = ele.split(',')[0];
          let configIssues = [];
          console.log('check', ele);
          if (ele.split(',')[9]) {
            let trimCommas = ele.replace(/,+$/, '');
            const newArr = trimCommas.split(',');
            for (let i = 9; i < newArr.length; i++) {
              configIssues.push(newArr[i]);
            }
          }
          json[camId] = {
            fps: ele.split(',')[1],
            resolution: ele.split(',')[2],
            codec: ele.split(',')[3],
            totalSdSize: ele.split(',')[4],
            remainingSdSize: ele.split(',')[5],
            timezone: ele.split(',')[6],
            audioEnabled: ele.split(',')[7],
            qc_status: ele.split(',')[8],
            errors: configIssues,
          };
        });

        let mediaConfigsFilePath = __dirname + `/mediaConfig/qcData`;
        mediaConfigsFilePath += '.json';
        fs.writeFile(mediaConfigsFilePath, JSON.stringify(json), (err) => {
          if (err) console.error('Error writing the json file:', err);
          else console.log('json file saved successfully.');
          process.exit(0);
        });
      });
    }, 10000);
    return;
  }

  console.log('=====devices', devices);

  Player.ConnectDevice(
    devices[0],
    '',
    'admin',
    '',
    0,
    80,
    0,
    0,
    1,
    'wss',
    null,
    true //isGetDeviceMediaConfigsViaPlayback
  );
  Player.isDeviceConnected = () => {
    searchRecordAfterConnect();
  };
  Player.getRecordList = (recordings) => {
    console.log('=======1st recording', recordings.length);
    if (recordings.length > 0) {
      if (searchRecordDay === 0) {
        // fetch current day latest recording
        startTimeOfVideo = recordings[recordings.length - 1].file_begintime;
      } else startTimeOfVideo = recordings[0].file_begintime;
      startPlaybackToGetConfigs();
    } else {
      Player.checkMediaConfigsOfNextDevice(
        devices[0],
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        'No recordings'
      );
    }
  };
};

const setMediaConfigsOfDevices = () => {
  if (devices.length === 0) {
    setTimeout(() => {
      console.log('DEVICES EMPTY kill process after 5s');
      process.exit(0);
    }, 5000);
    return;
  }

  console.log('=====devices', devices);

  Player.ConnectDevice(
    devices[0],
    '',
    'admin',
    '',
    0,
    80,
    0,
    0,
    1,
    'wss',
    null
  );

  Player.isDeviceConnected = () => {};
  Player.isConfigSetSuccessfully = () => {
    console.log('========== Config set successfully for', devices[0]);
    let mediaConfigsFilePath = __dirname + `/mediaConfig/setConfigData.csv`;
    devicesForSetConfig.push(`${devices[0]}: success`);
    fs.writeFile(
      mediaConfigsFilePath,
      devicesForSetConfig.join('\n'),
      (err) => {
        if (err) console.error('Error writing the log file:', err);
        else console.log('Log file saved successfully.');
      }
    );
    console.log('====== Disconnecting Device...');
    Player.DisConnectDevice(devices[0]);
    devices.splice(0, 1);
    setMediaConfigsOfDevices();
  };
  Player.skipCurrentDeviceAndSetConfigForNext = () => {
    console.log('========== SKIP', devices[0]);
    let mediaConfigsFilePath = __dirname + `/mediaConfig/setConfigData.csv`;
    devicesForSetConfig.push(`${devices[0]}: fail`);
    fs.writeFile(
      mediaConfigsFilePath,
      devicesForSetConfig.join('\n'),
      (err) => {
        if (err) console.error('Error writing the log file:', err);
        else console.log('Log file saved successfully.');
      }
    );
    devices.splice(0, 1);
    setMediaConfigsOfDevices();
  };
};

module.exports.getMediaConfigs = function (day = 0) {
  try {
    console.log('getMediaConfigs', day);
    searchRecordDay = day;

    let mediaConfigsFilePath = __dirname + `/mediaConfig/getConfigData.csv`;
    if (fs.existsSync(mediaConfigsFilePath)) {
      console.log('/tmp/myfile exists!');
      fs.unlink(mediaConfigsFilePath, (err) => {
        if (err) {
          console.log('=====err', err);
          return;
        }
        getMediaConfigsOfDevices();
      });
    } else {
      console.log('/tmp/myfile does not exist!');
      getMediaConfigsOfDevices();
    }
  } catch (error) {
    console.log('Error in script:', error);
  }
};

module.exports.setMediaConfigs = function () {
  try {
    console.log('setMediaConfigs');
    setMediaConfigsOfDevices();
  } catch (error) {
    console.log('Error in script:', error);
  }
};
