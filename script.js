require('./CameraSDK/play');

const Player = global.VideoPlayer;

const devices = require('./amanDeviceList').DEVICES;
// const devices = require('./setDeviceList').DEVICES;

let startTime1,
  endTime1,
  chunkDuration,
  numberOfChunks,
  chunksToDownload = [];

let overTime;
const fs = require('fs');

let chunkCounter = 0;

let startTimeOfVideo;

Player.startDownloadingNext = () => {
  chunkCounter += 1;
  console.log('====== chunkCounter', chunkCounter);
  if (chunkCounter <= chunksToDownload.length - 1) {
    console.log('====== chunkCounter <= chunksToDownload.length - 1');
    startPlaybackToDownload();
  } else {
    console.log('====== Disconnecting Device...');
    Player.DisConnectDevice(devices[0]);
    devices.splice(0, 1);
    chunkCounter = 0;
    connectDeviceAndDownload();
  }
};

const startPlaybackToDownload = () => {
  Player.StartPlayBack(
    devices[0],
    '',
    0,
    chunksToDownload[chunkCounter].start_ts,
    chunksToDownload[chunkCounter].end_ts,
    18,
    0,
    false,
    chunksToDownload[chunkCounter].chunk_id
  );
  overTime = chunksToDownload[chunkCounter].end_ts;
  global.overTime = overTime;
};

Player.getBlobUrl = (
  deviceId,
  combinedVideo,
  begintime,
  endTime,
  chunkId,
  frameCount,
  frameTimestamps,
  deviceFpsWhileDownloading
) => {
  console.log('======received Uint8Array', {
    deviceId,
    chunkId,
    combinedVideo,
    begintime,
    endTime,
    frameCount,
    deviceFpsWhileDownloading,
  });

  const data = combinedVideo;

  let tempVideofilePath = __dirname + `/file_${deviceId}-${chunkId}`;
  let frameDataFilePath = __dirname + `/frameData/file_${deviceId}-${chunkId}`;

  tempVideofilePath += '.mp4';
  frameDataFilePath += '.txt';
  const _frameTimestamps = frameTimestamps.join('\n');
  const fps = deviceFpsWhileDownloading;

  const textContent =
    `${deviceId}\n${frameCount}\n${fps}\n${begintime}\n${endTime}\n${_frameTimestamps}`.toString();

  fs.writeFile(frameDataFilePath, textContent, (err) => {
    if (err) console.error('Error writing the FrameData file:', err);
    else console.log('FrameData file saved successfully.');
  });

  fs.writeFile(tempVideofilePath, data, (err) => {
    if (err) {
      console.error('Error writing the file:', err);
    } else {
      console.log('Temp video file saved successfully');
    }
  });
};

const searchRecordAfterConnect = () => {
  console.log('==========DEVICE CONNECTED');
  let currentDate = new Date();

  let today = new Date(currentDate);
  // yesterday.setDate(yesterday.getDate() - 1);

  let begintime = new Date(
    today.getFullYear().toString() +
      '-' +
      (today.getMonth() + 1).toString() +
      '-' +
      (today.getDate() - 1).toString() +
      ' 00:00:00'
  );
  let endtime = new Date(
    today.getFullYear().toString() +
      '-' +
      (today.getMonth() + 1).toString() +
      '-' +
      (today.getDate() - 1).toString() +
      ' 23:59:59'
  );

  begintime =
    parseInt(begintime.getTime() / 1000) - new Date().getTimezoneOffset() * 60;
  endtime =
    parseInt(endtime.getTime() / 1000) - new Date().getTimezoneOffset() * 60;
  console.log('=======date of sd card data', { begintime, endtime });

  Player.SreachRecord(devices[0], '', 0, begintime, endtime, 15);
};

const connectDeviceAndDownload = () => {
  if (devices.length === 0) {
    setTimeout(() => {
      console.log('DEVICES EMPTY kill process after 5s');
      process.exit(0);
    }, 5000);
    return;
  }

  console.log('=====devices download', devices);

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
  Player.isDeviceConnected = () => {
    searchRecordAfterConnect();
  };
  Player.getRecordList = (recordings) => {
    console.log('=======1st recording download', recordings[0]);

    startPlaybackToDownload();
  };
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
  offset,
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
      offset,
      preIssue,
    });

    console.log('====== Disconnecting Device...');
    Player.DisConnectDevice(devices[0]);
    devices.splice(0, 1);
    getMediaConfigsOfDevices();

    let mediaConfigsFilePath = __dirname + `/mediaConfig/file`;

    mediaConfigsFilePath += '.csv';
    let cameraInstallationQCPassed = true;
    let errors = '';
    // pass - no error
    // pre issues - offline, auth, no rec | config issues - fps, res, codec, timezone | no frame
    if (
      fps === '-' ||
      resolution === '-' ||
      encType === '-' ||
      offset === '-'
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
      if (encType !== 'H264') {
        errors += 'encoding,';
        cameraInstallationQCPassed = false;
      }
      if (offset < 19700 || offset > 19900) {
        errors += 'timezone wrong';
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
      offset,
      cameraInstallationQCPassed ? 'Pass' : 'Fail',
      cameraInstallationQCPassed ? [] : preIssue ? [preIssue] : [errors],
      '\n',
    ];

    const textContent = arr.join(',').toString();

    fs.appendFile(mediaConfigsFilePath, textContent, (err) => {
      if (err) console.error('Error writing the FrameData file:', err);
      else console.log('FrameData file saved successfully.');
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
  overTime = startTimeOfVideo + 300;
  // global.overTime = overTime;
};

const getMediaConfigsOfDevices = () => {
  if (devices.length === 0) {
    setTimeout(() => {
      const csvFile = __dirname + '/mediaConfig/file.csv';
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
          if (ele.split(',')[8]) {
            let trimCommas = ele.replace(/,+$/, '');
            const newArr = trimCommas.split(',');
            for (let i = 8; i < newArr.length; i++) {
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
            qc_status: ele.split(',')[7],
            // errors: [ele.split(',')[8]],
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
      startTimeOfVideo = recordings[0].file_begintime;
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
        'No recordings'
      );
    }
  };
};

module.exports.analyzeDownload = function (
  start_time,
  end_time,
  chunk_duration
) {
  console.log('analyzeDownload');
  try {
    startTime1 = start_time; // epoch 1716375600
    endTime1 = end_time; // epoch 1716379200
    chunkDuration = chunk_duration; // mins
    numberOfChunks = (endTime1 - startTime1) / (chunkDuration * 60); // duration (min)/chunkDuration

    for (let i = 0; i < numberOfChunks; i++) {
      let timing = {
        chunk_id: i + 1,
        start_ts: startTime1,
        end_ts: startTime1 + chunkDuration * 60,
      };
      startTime1 = startTime1 + chunkDuration * 60;
      chunksToDownload.push(timing);
    }
    console.log('===== chunksToDownload', chunksToDownload);
    connectDeviceAndDownload();
  } catch (error) {
    console.log('Error in script:', error);
  }
};

module.exports.getMediaConfigs = function () {
  // Given IST date and time
  // const today = new Date();
  // const year = today.getFullYear();
  // const month = String(today.getMonth() + 1).padStart(2, '0');
  // const day = String(today.getDate()).padStart(2, '0');

  // let hr = today.getHours();
  // hr -= 4;
  // hr = String(hr).padStart(2, '0');

  // const newDateTime = new Date(`${year}-${month}-${day}T${hr}:00:00`);

  // const epochTime = newDateTime.getTime() + 19800000; // Epoch time in milliseconds

  // startTimeOfVideo = Math.floor(epochTime / 1000);
  // console.log('======start time', Math.floor(epochTime / 1000));
  try {
    console.log('getMediaConfigs');

    let mediaConfigsFilePath = __dirname + `/mediaConfig/file.csv`;
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
