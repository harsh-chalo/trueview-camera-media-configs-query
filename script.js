require('./CameraSDK/play');
//
const Player = global.VideoPlayer;

const devices = require('./deviceList').DEVICES;
let startTime1,
  endTime1,
  chunkDuration,
  numberOfChunks,
  chunksToDownload = [];

let overTime;
const fs = require('fs');

let chunkCounter = 0;
let devicesFpsReceived = [];
let fpsData = [];
let resolutionData = [];
let bitRateData = [];
let bitRateTypeData = [];
let encTypeData = [];
let totalStorageData = [];
let remainingStorageData = [];

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
    // if (devices.length === 0) {
    //   console.log('=====kill process');
    //   process.exit(0);
    // }
  });
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
    console.log('==========DEVICE CONNECTED');
    let currentDate = new Date();

    let today = new Date(currentDate);
    // yesterday.setDate(yesterday.getDate() - 1);

    let begintime = new Date(
      today.getFullYear().toString() +
        '-' +
        (today.getMonth() + 1).toString() +
        '-' +
        today.getDate().toString() +
        ' 00:00:00'
    );
    let endtime = new Date(
      today.getFullYear().toString() +
        '-' +
        (today.getMonth() + 1).toString() +
        '-' +
        today.getDate().toString() +
        ' 23:59:59'
    );

    begintime =
      parseInt(begintime.getTime() / 1000) -
      new Date().getTimezoneOffset() * 60;
    endtime =
      parseInt(endtime.getTime() / 1000) - new Date().getTimezoneOffset() * 60;
    console.log('=======date of sd card data', { begintime, endtime });

    Player.SreachRecord(devices[0], '', 0, begintime, endtime, 15);
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
  remainingStorage
) => {
  if (deviceId && fps) {
    console.log('=====device media configs', {
      deviceId,
      fps,
      // resolution,
      // totalStorage,
      // remainingStorage,
    });
    devicesFpsReceived.push(deviceId);
    fpsData.push(fps);
    resolutionData.push(resolution);
    bitRateData.push(bitRate);
    bitRateTypeData.push(bitRateType);
    encTypeData.push(encType);
    totalStorageData.push(totalStorage);
    remainingStorageData.push(remainingStorage);

    console.log('====== Disconnecting Device...');
    Player.DisConnectDevice(devices[0]);
    devices.splice(0, 1);
    getMediaConfigsOfDevices();

    let mediaConfigsFilePath = __dirname + `/mediaConfig/file`;

    mediaConfigsFilePath += '.csv';

    const textContent =
      `${devicesFpsReceived}\n${fpsData}\n${resolutionData}\n${bitRateData}\n${bitRateTypeData}\n${encTypeData}\n${totalStorageData}\n${remainingStorageData}`.toString();

    fs.writeFile(mediaConfigsFilePath, textContent, (err) => {
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

const getMediaConfigsOfDevices = () => {
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
    null,
    true
  );
  Player.isDeviceConnected = () => {};
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

module.exports.analyzeMediaConfigs = function () {
  try {
    console.log('analyzeMediaConfigs');
    getMediaConfigsOfDevices();
  } catch (error) {
    console.log('Error in script:', error);
  }
};
