require('./connector');
let SearchRecList = []; //录像存放列表
let playerList = []; //播放器存放列表
let sessionList = []; //连接对象列表
let useHttps = true; //是否使用https和wss
let isremoteing = false;

let lastTimeWhenFrameReceived = Date.now() / 1000;
let configReceivedTimeElapsed = Date.now() / 1000;

let interval;
let interval2;
let videoStartTime;
let videoEndTime;
let frameCount;
let frameTimestamps = [];
let _isGetDeviceMediaConfigsViaPlayback = false;
let deviceFpsWhileDownloading;

let cameraFps = '-',
  cameraEnc = '-',
  cameraResolution = '-',
  offset = '-';

let _deviceId;
let _chunkId;

let ConnectApi = {};
let remoteDeviceData = {
  //远处设置返回存储
  setConfigStatu: {},
  deviceInfo: {},
};
/**
 * ConnectApi p2p连接控制对象，通过配置回调方法接收p2p回调数据
 *
 * kp2pPlayer 播放器构造函数，传入canvas元素创建播放器
 * 参数1 canvas 用于显示画面的画布
 * 参数2 直接指定为false即可
 * 参数3 用于回调的上下文，从0开始，每创建一个都需要加1
 */
const Player = {};
global.ConnectApi.onRemoteSetup = (remote_str) => {
  // console.log(remote_str);
  var config = JSON.parse(remote_str);

  if (config.option) {
    if (config.option == 'success') {
      // alert('设置成功');
    } else {
      // alert('设置失败');
    }
  }

  if (_isGetDeviceMediaConfigsViaPlayback) {
    const { TotalSpacesize: totalStorage, LeaveSpacesize: remainingStorage } =
      config.IPCam.TfcardManager;
    const { AudioEnabled: audioEnabled } = config.IPCam.ModeSetting;
    console.log('========configData', config.IPCam);
    interval2 && clearInterval(interval2);

    Player.checkMediaConfigsOfNextDevice(
      _deviceId,
      cameraFps,
      cameraResolution,
      '-',
      '-',
      cameraEnc,
      totalStorage,
      remainingStorage,
      offset,
      audioEnabled
    );
  } else {
    console.log('Set config result', config.option);
    if (config.option) {
      if (config.option == 'success') {
        restartDeviceAfterSetConfig();
        Player.isConfigSetSuccessfully();
      }
    } else {
      Player.skipCurrentDeviceAndSetConfigForNext();
    }
  }

  return;
  if (config.IPCam) {
    if (config.IPCam.videoManager) {
      if (config.IPCam.videoManager.streamId == 1) {
        var streamType = document.getElementById('streamType');
        streamType.innerText = '主码流：' + config.IPCam.videoManager.encType;
      }
      if (config.IPCam.videoManager.streamId == 2) {
        var streamType = document.getElementById('streamType');
        streamType.innerText = '子码流：' + config.IPCam.videoManager.encType;
      }
    }
    if (config.IPCam.ModeSetting) {
      if (config.IPCam.ModeSetting.AudioVolume) {
        var obj_out = document.getElementById('device_VolumeInput');
        obj_out.innerText =
          config.IPCam.ModeSetting.AudioVolume.AudioInputVolume;

        var obj_out = document.getElementById('device_VolumeOutput');
        obj_out.innerText =
          config.IPCam.ModeSetting.AudioVolume.AudioOutputVolume;
      }

      document.getElementById('AudioEnabled').checked =
        config.IPCam.ModeSetting.AudioEnabled;

      if (config.IPCam.ModeSetting.IRCutFilterMode) {
        switch (config.IPCam.ModeSetting.IRCutFilterMode) {
          case 'ir':
            document.getElementById('ir').checked =
              config.IPCam.ModeSetting.IRCutFilterMode == 'ir';
            break;
          case 'light':
            document.getElementById('light').checked =
              config.IPCam.ModeSetting.IRCutFilterMode == 'light';
            break;
          case 'auto':
            document.getElementById('autolight').checked =
              config.IPCam.ModeSetting.IRCutFilterMode == 'auto';
            break;
        }
      }
      if (config.IPCam.ModeSetting.usageScenario) {
        document.getElementById('usageScenario').value =
          config.IPCam.ModeSetting.usageScenario;
      }
    }

    if (config.IPCam.videoManager) {
      document.getElementById('flipEnabled').checked =
        config.IPCam.videoManager.flipEnabled;
      document.getElementById('mirrorEnabled').checked =
        config.IPCam.videoManager.mirrorEnabled;
    }

    if (config.IPCam.WorkMode) {
      document.getElementById('rec_mode_list').value =
        config.IPCam.WorkMode.Mode;
    }

    if (config.IPCam.AlarmSetting) {
      if (config.IPCam.AlarmSetting.MotionDetection) {
        document.getElementById('warningTone').checked =
          config.IPCam.AlarmSetting.MotionDetection.MotionWarningTone;
        document.getElementById('motionTrackEnabled').checked =
          config.IPCam.AlarmSetting.MotionDetection.motionTrackEnabled;
        if (config.IPCam.AlarmSetting.MotionDetection.MdRecDuration) {
          document.getElementById('alarm_rec_time').value =
            config.IPCam.AlarmSetting.MotionDetection.MdRecDuration;
        }

        if (
          JSON.stringify(config.IPCam.AlarmSetting.MotionDetection.grid) !=
          JSON.stringify([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0,
          ])
        ) {
          console.log('设置了网格区域侦测');
          window.girdData = JSON.parse(
            JSON.stringify(config.IPCam.AlarmSetting.MotionDetection.grid)
          );
        }
      }
    }
    if (config.IPCam.TfcardManager) {
      var tf_status = document.getElementById('tf_status');
      var tf_totalSize = document.getElementById('tf_totalSize');
      var tf_leaveSize = document.getElementById('tf_leaveSize');
      tf_status.innerText = config.IPCam.TfcardManager.Status;
      tf_totalSize.innerText = config.IPCam.TfcardManager.TotalSpacesize + 'M';
      tf_leaveSize.innerText = config.IPCam.TfcardManager.LeaveSpacesize + 'M';
    }
    if (config.IPCam.Lte) {
      var OperatorsName = document.getElementById('OperatorsName');
      var Signal = document.getElementById('Signal');
      OperatorsName.innerText = config.IPCam.Lte.OperatorsName;
      Signal.innerText = config.IPCam.Lte.Signal;
    }
    if (config.IPCam?.V2?.Network) {
      // console.log(config.IPCam.V2.Network.Rtmp.Stream);
      var RTMP = config.IPCam.V2?.Network?.Rtmp;
      var rtmp = document.getElementById('rtmp');
      var rtmpMobile = document.getElementById('rtmpMobile');
      var rtmpbox = document.getElementById('rtmpbox');
      var radioElements = document.getElementsByName('rtmpStream');
      rtmpMobile.checked = RTMP?.OnlyMotDet;
      rtmp.value = RTMP?.RtmpUrl;
      rtmpbox.checked = RTMP?.Enabled;
      for (var i = 0; i < radioElements.length; i++) {
        if (radioElements[i].value == RTMP?.Stream) {
          radioElements[i].checked = true;
          break;
        }
      }
    }
    if (config.IPCam?.V2?.System) {
      var UploadCustomHealth =
        config.IPCam.V2.System.SoftProbe.UploadCustomHealth;
      var serverbox = document.getElementById('serverbox');
      var serverUrl = document.getElementById('serverUrl');
      var pushTime = document.getElementById('pushTime');
      var pushPort = document.getElementById('pushPort');
      serverbox.checked = UploadCustomHealth.Enabled;
      serverUrl.value = UploadCustomHealth.Server;
      pushTime.value = UploadCustomHealth.UploadPeriod;
      pushPort.value = UploadCustomHealth.Port;
    }
    if (config.IPCam.videoManagerV2) {
      // 主码流参数
      // var selectElement = document.getElementById('mySelect');
      var opt = config.IPCam.videoManagerV2[0].resolutionProperty.opt;
      // selectElement.value = config.IPCam.videoManagerV2[0].resolution
      // selectElement.innerHTML = opt
      //   .map(
      //     (v) =>
      //       `<option ${
      //         config.IPCam.videoManagerV2[0].resolution == v ? 'selected' : ''
      //       } value="${v}">${v}</option>`
      //   )
      //   .join('');
      // var bitRateType = document.getElementById('bitRateType');
      // var bitRateTypeOpt =
      //   config.IPCam.videoManagerV2[0].bitRateTypeProperty.opt;
      // bitRateType.value = config.IPCam.videoManagerV2[0].bitRateType
      // bitRateType.innerHTML = bitRateTypeOpt
      //   .map(
      //     (v) =>
      //       `<option ${
      //         config.IPCam.videoManagerV2[0].bitRateType == v ? 'selected' : ''
      //       } value="${v}">${v == 'CBR' ? 'ABR' : v}</option>`
      //   )
      //   .join('');
      // var codeRrate1 = document.getElementById('codeRrate1');
      // codeRrate1.value = config.IPCam.videoManagerV2[0].bitRate;
      // var frameRate1 = document.getElementById('frameRate1');
      // frameRate1.value = config.IPCam.videoManagerV2[0].frameRate;
      // // 次码流参数获取赋值
      // var selectElementTwo = document.getElementById('mySelectTwo');
      // var optTwo = config.IPCam.videoManagerV2[1].resolutionProperty.opt;
      // selectElementTwo.value = config.IPCam.videoManagerV2[1].resolution;
      // selectElementTwo.innerHTML = optTwo
      //   .map(
      //     (v) =>
      //       `<option ${
      //         config.IPCam.videoManagerV2[1].resolution == v ? 'selected' : ''
      //       } value="${v}">${v}</option>`
      //   )
      //   .join('');
      // var bitRateTypeTwo = document.getElementById('bitRateTypeTwo');
      // var bitRateTypeOptTwo =
      //   config.IPCam.videoManagerV2[1].bitRateTypeProperty.opt;
      // bitRateTypeTwo.value = config.IPCam.videoManagerV2[1].bitRateType;
      // bitRateTypeTwo.innerHTML = bitRateTypeOptTwo
      //   .map(
      //     (v) =>
      //       `<option ${
      //         config.IPCam.videoManagerV2[1].bitRateType == v ? 'selected' : ''
      //       } value="${v}">${v == 'CBR' ? 'ABR' : v}</option>`
      //   )
      //   .join('');
      // var codeRrate2 = document.getElementById('codeRrate2');
      // codeRrate2.value = config.IPCam.videoManagerV2[1].bitRate;
      // var frameRate2 = document.getElementById('frameRate2');
      // frameRate2.value = config.IPCam.videoManagerV2[1].frameRate;
    }
  }
};

function sendRemoteConfig(config) {
  var id = _deviceId;
  let session = null;
  session = GetSessionById(id);
  var str = JSON.stringify(config);
  if (session) {
    console.log('****session****');
    global.ConnectApi.remote_setup2(session, str);
  }
}

function getMediaConfigs() {
  interval2 = setInterval(() => {
    console.log(
      'configReceivedTimeElapsed',
      configReceivedTimeElapsed,
      Date.now() / 1000 - configReceivedTimeElapsed
    );
    if (Math.floor(Date.now() / 1000 - configReceivedTimeElapsed) >= 15) {
      console.log('=====time up check another cam');
      interval2 && clearInterval(interval2);
      Player.checkMediaConfigsOfNextDevice(
        _deviceId,
        cameraFps,
        cameraResolution,
        '-',
        '-',
        cameraEnc,
        '-',
        '-',
        offset,
        '-'
      );
    }
  }, 10000);

  // get sd card status and audio status
  console.log('****getMediaConfigs****');
  let config = {
    Version: '1.0.0',
    Method: 'get',
    IPCam: {
      ModeSetting: {},
      TfcardManager: {},
    },
    Authorization: {
      Verify: '',
      username: 'admin',
      password: '',
    },
  };

  sendRemoteConfig(config);
}

function setMediaConfigs() {
  let config = {
    Version: '1.0.0',
    Method: 'set',
    IPCam: {
      SystemOperation: {
        TimeSync: {
          TimeZone: 530,
        },
      },
      videoManagerV2: [
        {
          id: 0,
          resolution: '640x360',
          bitRateType: 'CBR',
          bitRate: 128,
          frameRate: 5,
        },
        {
          id: 1,
          resolution: '640x360',
          bitRateType: 'CBR',
          bitRate: 128,
          frameRate: 5,
        },
      ],
      // main stream
      videoManager: {
        streamId: 1,
        encType: 'H.265',
        flipEnabled: false,
        mirrorEnabled: false,
      },
      ModeSetting: {
        AudioEnabled: false,
      },
      TfcardManager: {
        Operation: 'format',
      },
    },
    Authorization: {
      Verify: '',
      username: 'admin',
      password: '',
    },
  };

  console.log('======setting config', JSON.stringify(config));

  sendRemoteConfig(config);
}
function restartDeviceAfterSetConfig() {
  let config = {
    Version: '1.3.0',
    Method: 'set',
    IPCam: {
      SystemOperation: {
        Reboot: true,
      },
    },
    Authorization: {
      Verify: '',
      username: 'admin',
      password: '',
    },
  };

  console.log('======setting config', JSON.stringify(config));

  sendRemoteConfig(config);
}

/**
 * 根据设备ID获取设备连接状态
 * @method GetSessionById
 * @param {string} devid 设备ID
 *
 * 返回
 * @return {object} session 连接状态对象
 */
function GetSessionById(devid) {
  // console.log('GetSessionById进来了', sessionList);
  for (let i = 0; i < sessionList.length; i++) {
    // console.log("GetSessionById进来了", sessionList);

    if (sessionList[i].deviceid == devid) {
      // console.log(sessionList[i]);
      return sessionList[i];
    }
  }
  return null;
}
/**
 * 根据设备ip获取设备连接状态
 * @method GetSessionByIp
 * @param {string} ip 设备ip
 *
 * 返回
 * @return {object} session 连接状态对象
 */
function GetSessionByIp(ip) {
  for (let i = 0; i < sessionList.length; i++) {
    if (sessionList[i].ip == ip) {
      // console.log(sessionList[i]);
      return sessionList[i];
    }
  }
  return null;
}
/**
 *
 * 根据窗体索引获取设备连接状态
 * @method GetSessionByWinindex
 * @param {number} winindex 窗体索引
 *
 * 返回
 * @return {object} session 连接状态对象
 */
function GetSessionByWinindex(winindex) {
  // console.log(sessionList);
  for (let i = 0; i < sessionList.length; i++) {
    for (let j = 0; j < sessionList[i].streamlist.length; j++) {
      if (sessionList[i].streamlist[j].winindex == winindex) {
        return sessionList[i];
      }
    }
  }
  return null;
}
/**
 * 根据窗体索引获取设备通道
 * @method GetChannelByWinindex
 * @param {number} winindex 窗体索引
 *
 * 返回
 * @return {number} channel 通道
 */
function GetChannelByWinindex(winindex) {
  for (let i = 0; i < sessionList.length; i++) {
    for (let j = 0; j < sessionList[i].streamlist.length; j++) {
      if (sessionList[i].streamlist[j].winindex == winindex) {
        return j; //channel
      }
    }
  }
  return -1;
}
function getRecordList(params) {
  return SearchRecList;
}
//初始化p2p方法
/**
 * 视频流回调
 * @method onrecvframeex
 * @param {object} api_conn 	连接状态对象
 * @param {number} frametype 	视频帧类型
 * @param {Buffer} data 		视频帧数据
 * @param {number} channel 		通道值
 * @param {number} width 		画面宽
 * @param {number} height 		画面高
 */
global.ConnectApi.onrecvframeex = function (
  api_conn,
  frametype,
  data,
  datalen,
  channel,
  width,
  height,
  enc,
  fps,
  timestamp
) {
  // console.log('1111111111111111111111111');
  //窗口已经被关闭
  if (api_conn.streamlist[channel].winindex == -1) {
    return;
  }
  //判断流的类型，0为音频帧
  if (frametype != 0) {
    data.recvtime = new Date().getTime();

    // playerList[api_conn.streamlist[channel].winindex].fillframe_v2(
    //   data,
    //   datalen,
    //   enc,
    //   timestamp,
    //   width,
    //   height,
    //   frametype
    // );
    // player1.fillframe_v2(data, datalen, enc, timestamp);
  } else {
    if (api_conn.streamlist[channel].isSound) {
      audioPlay(data, enc, datalen, width);
    }
  }
};

async function downloadVideo(deviceId, begintime, endTime, chunkId) {
  const totalLength = chunks.reduce((total, frame) => total + frame.length, 0);
  console.log('======length', chunks.length, { totalLength });
  const combinedData = new Uint8Array(totalLength);
  let offset = 0;

  for (const frame of chunks) {
    combinedData.set(frame, offset);
    offset += frame.length;
  }

  // Create a Blob from the combined Uint8Array data
  // const combinedVideo = new Blob([combinedData], { type: 'blob' });
  // const url = URL.createObjectURL(combinedVideo);
  console.log('===clear chunk');
  chunks = [];
}

/**
 * 回放视频流回调  Playbackplay
 * @method onrecvrecframe
 * @param {object} api_conn     连接状态对象
 * @param {number} frametype    视频帧类型
 * @param {Buffer} data         视频帧数据
 * @param {number} channel      通道值
 * @param {number} width        画面宽
 * @param {number} height 		画面高
 * @param {number} enc 			编码格式
 * @param {number} fps 			帧率
 * @param {number} ts_ms 		这一帧的时间长度
 */
var executed;
var doOnceCode = (function (ts_ms, overTime, uid, channel) {
  executed = false;
  return function (ts_ms, overTime, uid, channel) {
    if (!executed) {
      // console.log('executed', ts_ms > overTime, { ts_ms, overTime });
      if (ts_ms > overTime) {
        console.log('=====here');

        executed = true;

        clearInterval(interval);
        downloadVideo(_deviceId, videoStartTime, videoEndTime, _chunkId);

        // var s = new Date(
        //   global.beginTime + new Date().getTimezoneOffset() * 60 * 1000
        // );

        // var m = s.getMonth() + 1;
        // if (m < 10) {
        //   m = '0' + m.toString();
        // } else {
        //   m = m.toString();
        // }
        // var d = s.getDate();
        // if (d < 10) {
        //   d = '0' + d.toString();
        // } else {
        //   d = d.toString();
        // }
        // var h = s.getHours();
        // if (h < 10) {
        //   h = '0' + h.toString();
        // } else {
        //   h = h.toString();
        // }
        // var minute = s.getMinutes();
        // if (minute < 10) {
        //   minute = '0' + minute.toString();
        // } else {
        //   minute = minute.toString();
        // }
        // var secs = s.getSeconds();
        // if (secs < 10) {
        //   secs = '0' + secs.toString();
        // } else {
        //   secs = secs.toString();
        // }
        // a.download =
        //   s.getFullYear().toString() +
        //   m +
        //   d +
        //   h +
        //   minute +
        //   secs +
        //   '_' +
        //   ((global.overTime - global.beginTime) / 1000).toString() +
        //   '.mp4';
        // document.body.appendChild(a);
        // a.click();
        Player.StopPlayBack(uid, '', channel);
        executed = false;
        chunks = JSON.parse(JSON.stringify([]));
        global.overTime = null;
      }
    }
  };
})();

function myFunction(ts_ms, overTime, uid, channel) {
  doOnceCode(ts_ms, overTime, uid, channel);
}

let chunks = [];
global.ConnectApi.onrecvrecframe = function (
  api_conn,
  frametype,
  data,
  datalen,
  channel,
  width,
  height,
  enc,
  fps,
  ts_ms,
  tasktype
) {
  // console.log(`【SDK ISSUE :(】 PlayBack Callback Params, current time is: ${new Date().toLocaleTimeString()}\n params from callback is`,{api_conn, frametype, data, datalen, channel, width, height, enc, fps, ts_ms, tasktype, overTime})

  if (api_conn.streamlist[channel].winindex == -1) {
    return;
  }
  if (!api_conn.streamlist[channel].firstFrame) {
    api_conn.streamlist[channel].firstFrame = true;
  }

  if (frametype != 0) {
    console.log('====== frame fps of', _deviceId, fps, width, height, {
      ts_ms,
      offset: videoStartTime - Math.floor(ts_ms / 1000),
    });
    cameraFps = fps;
    cameraResolution = `${width}x${height}`;
    cameraEnc = enc;
    offset = videoStartTime - Math.floor(ts_ms / 1000);
    clearInterval(interval);
    Player.StopPlayBack(_deviceId, '', channel);
    configReceivedTimeElapsed = Date.now() / 1000;
    getMediaConfigs();
    return;
  }
  const tsms = Math.floor(ts_ms / 1000 + 19800);
  const tsmsInMilliseconds = Math.floor(ts_ms + 19800000);

  //   console.log('data && frametype != 0',data && frametype != 0)

  // tsms >= videoStartTime
  if (
    global.overTime &&
    data &&
    frametype != 0 &&
    tsms >= videoStartTime &&
    tsms <= videoEndTime
  ) {
    deviceFpsWhileDownloading = fps;
    console.log('====== push timestamp', { tsms });
    frameCount += 1;
    frameTimestamps.push(tsmsInMilliseconds);
    chunks.push(data);
  }
  if (global.overTime) {
    var tmpTs = new Date(
      ts_ms - new Date().getTimezoneOffset() * 60 * 1000
    ).valueOf();

    myFunction(
      Math.floor(tmpTs / 1000),
      global.overTime,
      api_conn.deviceid,
      channel
    );
    // var d = document.getElementById('process');

    // var p =
    //   ((tmpTs - global.beginTime) / (global.overTime - global.beginTime)) * 100;
    // if (p > 100) p = 100;
    // d.style.width = p + '%';
    // var useTime = (Date.now() - global.useTimeStart) / 1000;

    // global.downloadSize += data.length;
    // var speed = 0;
    // if (useTime > 0) {
    //   speed = parseInt(global.downloadSize / useTime / 1000);
    // }
    // d.innerText = useTime + 's';
    // document.getElementById('downSpeed').innerText =
    //   'Speed: ' + speed + ' kbps';
  }

  if (frametype != 0) {
    data.recvtime = new Date().getTime();
    lastTimeWhenFrameReceived = Date.now() / 1000;
    // if (playerList[api_conn.streamlist[channel].winindex]) {
    //   playerList[api_conn.streamlist[channel].winindex].fillframe_v2(
    //     data,
    //     datalen,
    //     enc,
    //     ts_ms,
    //     width,
    //     height,
    //     frametype
    //   );
    // }
  } else {
    if (api_conn.streamlist[channel].isSound) {
      audioPlay(data, enc, datalen, width);
    }
  }
};

/**
 * 设备连接回调
 * @method onconnect
 * @param {object} api_conn 连接状态对象
 * @param {number} code 连接状态码 0:成功， 其他：失败
 */
global.ConnectApi.onconnect = function (api_conn, code) {
  console.log('========onconnect result', {
    code,
  });
  // console.log(api_conn);
  if (code == 0) {
    console.log(
      (api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + '连接成功'
    );

    // console.log('=======api_conn', api_conn.iot);

    global.ConnectApi.login(api_conn, api_conn.user, api_conn.pwd);
  } else {
    console.log(
      (api_conn.deviceid ? api_conn.deviceid : api_conn.ip) +
        '连接失败 ' +
        '错误码：' +
        code
    );

    if (_isGetDeviceMediaConfigsViaPlayback) {
      // return get configs of device
      interval2 && clearInterval(interval2);
      Player.checkMediaConfigsOfNextDevice(
        _deviceId,
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        code === -13 ? 'Offline' : `Connect failed: ${code}`
      );
      return;
    }
    // move to next for setting config
    Player.skipCurrentDeviceAndSetConfigForNext();
  }
};
/**
 * 设备登录回调
 * @method onloginresult
 * @param {object} api_conn 连接状态对象
 * @param {number} result 登录状态码 0:成功， 其他：失败
 */
global.ConnectApi.onloginresult = function (api_conn, result) {
  console.log(result);
  if (result == 0) {
    api_conn.logined = true;
    Player.isDeviceConnected();
    if (!_isGetDeviceMediaConfigsViaPlayback) {
      setMediaConfigs();
    }
    console.log(api_conn.deviceid + '登录成功');
    for (let i = 0; i < api_conn.streamlist.length; i++) {
      if (api_conn.streamlist[i].winindex >= 0 && api_conn.connectType == 1) {
        global.ConnectApi.open_stream(
          api_conn,
          i,
          api_conn.streamlist[i].streamid
        );
        // playerList[api_conn.streamlist[i].winindex].open();
      }
    }
  } else {
    console.log(
      (api_conn.deviceid ? api_conn.deviceid : api_conn.ip) +
        '登录失败 ' +
        '错误码：' +
        result
    );
    // return get configs of device
    if (_isGetDeviceMediaConfigsViaPlayback) {
      interval2 && clearInterval(interval2);
      Player.checkMediaConfigsOfNextDevice(
        _deviceId,
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        '-',
        'Auth issue'
      );
      return;
    }
    // move to next for setting config
    Player.skipCurrentDeviceAndSetConfigForNext();
  }
};
/**
 * p2p错误回调
 * @method onp2perror
 * @param {object} api_conn 连接状态对象
 * @param {number} code 错误状态码
 */
global.ConnectApi.onp2perror = function (api_conn, code) {
  console.log(code);
  console.log(
    (api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + '设备p2p错误'
  );
};

/**
 * p2p连接断开回调
 * @method ondisconnect
 * @param {object} api_conn 连接状态对象
 * @param {number} code 错误状态码
 */
global.ConnectApi.ondisconnect = function (api_conn, code) {
  // console.log('======ondisconnect', api_conn.deviceid, code);
  console.log(
    (api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + '设备断开连接'
  );

  // console.log('p2p连接断开回调', api_conn, sessionList);
  if (api_conn) {
    // let remoteModal = document.querySelector('.remote-Modal');
    // if (remoteModal) {
    // let loading = document.querySelector('.loading-view');
    // loading.style.display = 'none';
    // remoteModal.remove();
    for (let i = 0; i < sessionList.length; i++) {
      if (sessionList[i].deviceid === api_conn.deviceid) {
        sessionList.splice(i, 1);
        break;
      }
    }
    // }
  }
};

/**
 * 打开码流回调
 * @method onopenstream
 * @param {object} api_conn 连接状态对象
 * @param {number} channel 通道
 * @param {number} streamid 码流值 0/主码流 1/子码流
 * @param {number} result 登录状态码
 */
global.ConnectApi.onopenstream = function (
  api_conn,
  channel,
  streamid,
  result,
  cam_desc
) {
  // console.log('=====onopenstream success');
  console.log(
    api_conn.deviceid + '打开码流成功,通道' + channel + '码流' + streamid
  );
  // console.log(cam_desc);
  // console.log(result);
  if (result != 0) {
  }
};
/**
 * 云台控制回调
 * @method onptzresult
 * @param {object} api_conn 连接状态对象
 * @param {number} result 状态码
 */
global.ConnectApi.onptzresult = function (api_conn, result) {
  console.log('云台控制回调');

  // console.log(api_conn);
  // console.log(result);
};

/**
 * 查询回放返回数据
 * @method onsearchrec
 * @param {object} api_conn 连接状态对象
 * @param {number} channel 通道
 * @param {string} file_type 类型
 * @param {string} file_begintime 开始时间
 * @param {string} file_endtime 结束时间
 * @param {string} file_total 数量
 */
global.ConnectApi.onsearchrec = function (
  api_conn,
  channel,
  file_type,
  file_begintime,
  file_endtime,
  file_total
) {
  // console.log(new Date(file_begintime * 1000) + new Date(file_endtime * 1000));
  // global.ConnectApi.onRecordFetch(
  //   file_type,
  //   file_begintime,
  //   file_endtime,
  //   SearchRecList.length
  // );
  let data = {};
  data.eseeid = api_conn.deviceid;
  data.ip = api_conn.ip;
  data.channel = channel;
  data.file_type = file_type;
  data.file_begintime = file_begintime;
  data.file_endtime = file_endtime;
  data.file_total = file_total;
  SearchRecList.push(data);
  // console.log(SearchRecList);
};

/**
 * 查询完成，抛出回调函数通知已结束
 * @method onsearchrecend
 * @param {object} api_conn 连接状态对象
 */
global.ConnectApi.onsearchrecend = function (api_conn) {
  // console.log('搜索录像回调停止', SearchRecList);
  //排序以及去重
  function flieSort(list) {
    let file = JSON.parse(JSON.stringify(list));
    //冒泡排序，时间最晚的最上面
    for (let i = 0; i < file.length; i++) {
      for (let j = 0; j < file.length - i - 1; j++) {
        if (file[j].file_begintime < file[j + 1].file_begintime) {
          let t = JSON.parse(JSON.stringify(file[j]));
          file[j] = JSON.parse(JSON.stringify(file[j + 1]));
          file[j + 1] = JSON.parse(JSON.stringify(t));
        }
      }
    }
    for (let i = 0; i < file.length; i++) {
      for (let j = 0; j < file.length - i - 1; j++) {
        if (file[j].file_begintime === file[j + 1].file_begintime) {
          file.splice(j + 1, 1);
          j--;
        }
      }
    }
    return file;
  }
  Player.getRecordList(SearchRecList);
  SearchRecList = flieSort(SearchRecList);
};

/**
 * 关闭码流回调
 * @method onclosestream
 * @param {object} api_conn 连接状态对象
 * @param {number} channel 通道
 * @param {number} streamid 码流值 0/主码流 1/子码流
 * @param {number} result 登录状态码
 */
global.ConnectApi.onclosestream = function (
  api_conn,
  channel,
  streamid,
  result
) {};

/**
 * 远程设置回调
 * @method onremotesetup
 * @param {object} api_conn 连接状态对象
 * @param {string} str 远程设置返回数据
 * @param {number} data_size 数据长度
 * @param {number} result 状态码
 */
global.ConnectApi.onremotesetup = function (api_conn, str, data_size, result) {
  // console.log('远程设置回调', api_conn, str);
  if (str) {
    global.ConnectApi.onRemoteSetup(str);
  }
  if (str || result == 0) {
    try {
      // console.log('远程设置回调成功', api_conn, JSON.parse(str), result);
      let data = JSON.parse(str);
      data.deviceid = api_conn.deviceid;
      // console.log('isremoteing', isremoteing);
      // console.log(data.option);
      if (isremoteing) {
        isremoteing = false;
        remoteDeviceStore.setConfigStatu = data;
        onRemoteFunc();
      } else {
        data.success = true;
        remoteDeviceStore.deviceInfo = { ...data };
      }
      // Object.keys(data).forEach((item, index) => {
      // 	listenersRemoteDeviceInfo[item] = data[item]
      // })
    } catch (error) {
      str = str.substring(0, str.length - 1);
      // console.log('远程设置回调，设置错误，数据出错无法解析');
    }
  } else {
    if (result == -70) {
      // console.log('远程设置回调，设置错误，错误码：' + result, api_conn, str);
    }
  }
};
//对讲回调onvop2pcallresult
global.ConnectApi.onvop2pcallresult = function (api_conn, result) {
  if (result === 0) {
    // console.log('=====onopenstream success');
    console.log('发起/断开对讲成功');
  } else {
    console.log('发起/断开对讲失败，错误码：' + result, api_conn);
  }
};
/**
 * 播放器初始化
 * @method init
 * @param {array} playerArr 播放器数组，里面存放canvas元素，每个元素代表一个播放窗体
 */
Player.init = function (playerArr) {
  console.log('playerArr', playerArr);
  // for(var i = 0; i< playerArr.length; i++){
  // 	var w = playerArr[i].width;
  // 	var h = playerArr[i].height;
  // 	var context = playerArr[i].getContext("2d");
  // 	context.clearRect(0, 0, w, h);
  // }

  // for(var i = 0; i< playerList.length; i++){
  // 	playerList[i].close();
  // 	playerList[i].deinit();
  // 	delete playerList[i];
  // }
  playerList = [];
  for (let i = 0; i < playerArr.length; i++) {
    //初始化canvas播放器
    //参数1 canvas 用于显示画面的画布
    //参数2 直接指定为false即可
    //参数3 用于回调的上下文，从0开始，每创建一个都需要加1
    let player = new kp2pPlayer(playerArr[i], false, i, true);
    playerList.push(player);
  }
};
/**
 * 连接设备
 * @method ConnectDevice
 * @param {string} devid 设备ID
 * @param {string} ip 设备ip
 * @param {string} user 设备用户名
 * @param {string} pwd 设备密码
 * @param {number} winindex 窗体索引
 * @param {number} port ip端口
 * @param {number} connectType 连接方式 0：预连接 1：连接并打开码流
 * @param {number} channel 通道
 * @param {number} streamid 码流类型，连接方式为1时有效
 *
 * 注:ID和IP至少要有一个，优先使用ID连接，有IP则port必传
 */
Player.ConnectDevice = function (
  devid,
  ip,
  user,
  pwd,
  winindex,
  port,
  connectType,
  channel,
  streamid,
  wss,
  cb,
  isGetDeviceMediaConfigsViaPlayback = false,
  turnIp,
  turnPort
) {
  console.log('Connect Device 1', devid, user, pwd);
  _isGetDeviceMediaConfigsViaPlayback = isGetDeviceMediaConfigsViaPlayback;
  _deviceId = devid;
  //ID连接
  if (devid) {
    let session = GetSessionById(devid);
    let bConnect = false;
    //初始化连接对象
    if (session == null) {
      session = global.ConnectApi.create(winindex, CryptoJS);
      session.refs = 0;
      session.logined = false;
      session.user = user;
      session.pwd = pwd;
      session.connectType = connectType;
      session.connectStatus = 0;
      session.streamlist = new Array(128);
      for (let i = 0; i < session.streamlist.length; i++) {
        session.streamlist[i] = {
          winindex: -1,
          streamid: -1,
          isSound: false,
          firstFrame: false,
        };
      }
      sessionList.push(session);
      bConnect = true;
    }
    if (connectType === 1) {
      session.refs++;
      session.streamlist[channel].winindex = winindex;
      session.streamlist[channel].streamid = streamid;
    }

    if (bConnect) {
      if (wss == 'wss') {
        useHttps = true;
      } else {
        useHttps = false;
      }
      console.log('Connect Device 2');
      global.ConnectApi.connectbyid(session, devid, useHttps, cb);
      // global.ConnectApi.connectbyid(session, devid, useHttps, cb, turnIp, turnPort);
    }
    // else {
    //     global.ConnectApi.open_stream(session, channel, streamid);
    // }
  } else {
    let session = GetSessionByIp(ip);
    let bConnect = false;
    if (session == null) {
      session = global.ConnectApi.create(winindex, CryptoJS);
      session.refs = 0;
      session.logined = false;
      session.user = user;
      session.pwd = pwd;
      session.connectType = connectType;
      session.connectStatus = 0;
      session.streamlist = new Array(128);
      for (let i = 0; i < session.streamlist.length; i++) {
        session.streamlist[i] = {
          winindex: -1,
          streamid: -1,
          isSound: false,
          firstFrame: false,
        };
      }
      sessionList.push(session);
      bConnect = true;
    }
    if (connectType === 1) {
      session.refs++;
      session.streamlist[channel].winindex = winindex;
      session.streamlist[channel].streamid = streamid;
    }

    if (bConnect) {
      global.ConnectApi.connectbyip(session, ip, port);
    }
    // else {
    //     global.ConnectApi.open_stream(session, channel, streamid);
    // }
  }
};

/**
 * 打开码流
 * @method OpenStream
 * @param {number} deviceid 设备id
 * @param {number} ip 设备ip
 * @param {number} channel 通道
 * @param {number} streamid 码流 主码流0，子码流1
 * @param {number} winindex 窗体索引
 */
Player.OpenStream = function (deviceid, ip, channel, streamid, winindex) {
  let session = null;
  if (deviceid) {
    session = GetSessionById(deviceid);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session != null && session.logined) {
    session.refs++;
    session.streamlist[channel].winindex = winindex;
    session.streamlist[channel].streamid = streamid;
    global.ConnectApi.open_stream(session, channel, streamid);
    playerList[winindex].open();
    // player1.open()
  }
};
/**
 * 关闭码流
 * @method CloseStream
 * @param {number} keyindex 窗体索引
 */
Player.CloseStream = function (keyindex) {
  let session = GetSessionByWinindex(keyindex);
  if (session != null) {
    let channel = GetChannelByWinindex(keyindex);
    if (channel >= 0) {
      global.ConnectApi.close_stream(
        session,
        channel,
        session.streamlist[channel].streamid
      );
      playerList[keyindex].close();
      // player1.close()
      session.refs--;
      session.streamlist[channel] = {
        winindex: -1,
        streamid: -1,
        isSound: false,
        firstFrame: false,
      };
    }
    // console.log(session.deviceid + ' 关闭码流 窗体：' + keyindex);

    // if (session.refs <= 0) {
    //     global.ConnectApi.close_socket(session);
    //     sessionList.pop(session);
    // }
  }
};
/**
 * 断开设备连接
 * @method DisConnectDevice
 * @param {string} deviceid 设备ID
 * @param {string} ip 设备IP
 * 注:ID和IP至少要有一个
 */
Player.DisConnectDevice = function (deviceid, ip) {
  if (deviceid) {
    console.log('=====disconnect', deviceid);
    let session = GetSessionById(deviceid);
    if (session) {
      global.ConnectApi.close_socket(session);
      console.log(deviceid + ' 断开连接');

      for (let i = 0; i < sessionList.length; i++) {
        if (sessionList[i].deviceid === session.deviceid) {
          sessionList.splice(i, 1);
          break;
        }
      }
    }
  } else if (ip) {
    let session = GetSessionByIp(ip);
    if (session) {
      global.ConnectApi.close_socket(session);
      console.log(ip + ' 断开连接');
      for (let i = 0; i < sessionList.length; i++) {
        if (sessionList[i].ip === session.ip) {
          sessionList.splice(i, 1);
          break;
        }
      }
    }
  }
};
/**
 * 打开音频
 * @method OpenAudio
 * @param {number} keyindex 窗体索引
 */
Player.OpenAudio = function (keyindex) {
  let session = GetSessionByWinindex(keyindex);
  if (session != null) {
    let channel = GetChannelByWinindex(keyindex);
    if (channel >= 0) {
      console.log('打开音频');

      session.streamlist[channel].isSound = true;
    }
  }
  console.log(session);
};
/**
 * 关闭音频
 * @method CloseAudio
 * @param {number} keyindex 窗体索引
 */
Player.CloseAudio = function (keyindex) {
  let session = GetSessionByWinindex(keyindex);
  console.log(session);
  if (session != null) {
    let channel = GetChannelByWinindex(keyindex);
    if (channel >= 0) {
      console.log('关闭音频');
      session.streamlist[channel].isSound = false;
    }
  }
};

/**
 * 启动云台
 * @method ptz_ctrl
 * @param {number} id 设备id
 * @param {number} channel 云台通道
 * @param {string} type 云台动作    0：停止 1：自动水平旋转 2：上 3：下 4：左 5：右 6：光圈加 7：光圈减 8：缩放增 9：缩放减 10：焦距加 11：焦距减 12:辅助开关 13:设置预置点 14:调用预置点 15:清空预置点
 * @param {string} param 云台控制参数，根据动作设定,传1-5时代表速度，13和14是传预置位
 */
Player.ptz_ctrl = function (id, ip, channel, type, param) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session) {
    global.ConnectApi.ptz_ctrl(session, channel, type, param, 0);
  }
};

/**
 * 视频回放检索
 * @function SreachRecord
 * 开始查询录像，注意不能同时执行两次执行，调用者注意在查询时阻止用户进行其它操作
 * @param {string} id 设备id
 * @param {string} ip 设备ip
 * @param {number} channel 通道
 * @param {number} begintime 开始时间 秒级时间戳
 * @param {number} endtime 结束时间 秒级时间戳
 * @param {number} type 录像类型，15为全部
 */

Player.SreachRecord = function (id, ip, channel, begintime, endtime, type) {
  // console.log(id, ip, channel, begintime, endtime, type);

  SearchRecList = [];
  let session = null;
  let chnlist = new Array(128);

  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  for (let i = 0; i < chnlist.length; i++) {
    chnlist[i] = 0;
    if (i == channel) {
      chnlist[i] = 1;
    }
  }
  if (session) {
    global.ConnectApi.find_file_start_2(
      session,
      chnlist,
      begintime,
      endtime,
      type
    );
  }
};

/**
 * 停止录像查询
 * * @function Stopsearch
 * @param {number} id 设备id
 * @param {number} ip 设备ip
 */
Player.Stopsearch = function (id, ip) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session) {
    global.ConnectApi.find_file_stop_2(session);
  }
};

/**
 * 开始回放 onrecvrecframe
 * * @function Playbackplay
 
 * @param {number} id 设备id
* @param {number} ip 设备ip
* @param {string} channel 通道
* @param {string} begintime 开始时间 10位的时间戳
* @param {string} endtime 结束时间 10位的时间戳
* @param {string} type 录像类型，15为全部
* @param {string} winindex 窗体索引
* @param {string} isSound 是否开启音频
* @param {int} tasktype 是否下载
 */
Player.StartPlayBack = function (
  id,
  ip,
  channel,
  begintime,
  endtime,
  type,
  winindex,
  isSound,
  chunkId,
  tasktype
) {
  // resetting values
  cameraFps = '-';
  cameraEnc = '-';
  cameraResolution = '-';
  offset = '-';
  deviceFpsWhileDownloading = undefined;
  frameCount = 0;
  frameTimestamps = [];
  videoStartTime = begintime;
  videoEndTime = endtime;
  _deviceId = id;
  _chunkId = chunkId;
  const filetype = type ? 0xffff : 0x0f;
  interval && clearInterval(interval);
  interval2 && clearInterval(interval2);
  // playerList[winindex].playbackPause = false;

  interval = setInterval(() => {
    console.log(
      '20 sec interval',
      Date.now() / 1000 - lastTimeWhenFrameReceived
    );
    if (
      lastTimeWhenFrameReceived &&
      Date.now() / 1000 - lastTimeWhenFrameReceived >= 40 &&
      !executed &&
      chunks.length > 0
    ) {
      // lastTimeWhenFrameReceived = Date.now() / 1000;
      clearInterval(interval);
      console.log('======Download incomplete video');
      Player.StopPlayBack(id, '', channel);
      executed = true;
      downloadVideo(id, begintime, endtime, chunkId);
    } else if (
      lastTimeWhenFrameReceived &&
      Date.now() / 1000 - lastTimeWhenFrameReceived >= 40 &&
      !executed &&
      chunks.length === 0
    ) {
      // lastTimeWhenFrameReceived = Date.now() / 1000;
      clearInterval(interval);
      console.log('====== 0 chunk stored');
      if (_isGetDeviceMediaConfigsViaPlayback) {
        configReceivedTimeElapsed = Date.now() / 1000;
        getMediaConfigs();
      } else {
        downloadVideo(id, begintime, endtime, chunkId);
      }
    }
  }, 20000);

  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session != null && session.logined) {
    //回放强制第一个窗口回放
    session.refs++;
    session.streamlist[channel].winindex = winindex;
    session.streamlist[channel].streamid = 0;
    if (isSound) {
      session.streamlist[channel].isSound = true;
    }
    global.ConnectApi.replay_start(
      session,
      channel,
      begintime,
      endtime,
      filetype,
      tasktype
    );
    console.log(
      '===== StartPlayBack',
      channel,
      begintime,
      endtime,
      type,
      filetype
    );
    if (tasktype == 1) {
      global.initFlv = 0;
      return;
    }
    // commenting this
    // console.log('回放播放');
    // playerList[winindex].open();
    // player1.open()
  }

  // global.ConnectApi.replay_start(session, channel, starttime, endtime, type)
};

Player.SetStreamMode = function (id, ip, channel, streaMode) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session != null && session.logined) {
    var winIndex = session.streamlist[channel].winindex;

    playerList[winIndex].SetStreamMode(streaMode);
  }
};

Player.PlayFast = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session != null && session.logined) {
    var winIndex = session.streamlist[channel].winindex;
    playerList[winIndex].fast();
  }
};

Player.PlaySlow = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session != null && session.logined) {
    var winIndex = session.streamlist[channel].winindex;
    playerList[winIndex].slow();
  }
};

Player.PlayNormal = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session != null && session.logined) {
    var winIndex = session.streamlist[channel].winindex;
    playerList[winIndex].reset();
  }
};

/**
 * 暂停
 * @function Playbacksuspended
 * @param {number} id 设备id
 * @param {number} ip 设备ip
 *  @param {number} winIndex 播放窗口
 */

Player.PausePlayBack = function (id, ip, winIndex) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    playerList[winIndex].playbackPause = true;
    global.ConnectApi.replay_pause(session);
  }
};

/**
 * 继续
 * @function Playbackcontinue
 * @param {number} id 设备id
 * @param {number} ip 设备ip
 * @param {number} winIndex 播放窗口
 */

Player.ContinuePlayBack = function (id, ip, winIndex) {
  // console.log(1111111111111111111111111111);

  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    playerList[winIndex].playbackPause = false;
    global.ConnectApi.replay_continue(session);
  }
};

/**
 * 停止回放
 * @function Playbackstop
 * @param {number} id 设备id
 * @param {number} ip 设备ip
 * @param {number} channel 设备通道
 */
Player.StopPlayBack = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    // console.log("停止回放02");

    global.ConnectApi.replay_stop(session);
    console.log('===stop playback');
    // playerList[session.streamlist[channel].winindex].close();
    // player1.close()
    session.streamlist[channel].firstFrame = false;
    session.streamlist[channel].isSound = false;
    session.streamlist[channel].winindex = -1;
  }
};

/**
 * 远程设置
 * @method RemoteSetting
 * @param { number } id 窗体索引定
 * @param { number } ip 窗体索引定
 * @param { number } str 远程设置内容
 */

Player.RemoteSetting = function (id, ip, str) {
  console.log('开始远处设置', id, ip, str);
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session) {
    if (str.length > 2000) {
      global.ConnectApi.remote_setup2(session, str);
    } else {
      global.ConnectApi.remote_setup2(session, str);
    }
  }
};
/**
 * 切换码流
 * @function ChangeStream
 * @param {string} id 设备id
 * @param {string} ip 设备ip
 * @param {number} channel 通道
 * @param {number} newstreamid 新码流值 0/主码流 1/次码流
 */
Player.ChangeStream = function (id, ip, channel, newstreamid) {
  // console.log('切换码流', id, ip, channel, newstreamid);

  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    session.streamlist[channel].firstFrame = false;
    global.ConnectApi.change_stream(session, channel, newstreamid);
  }
};
/**
 * @description: 发起对讲
 * @param {String} id 设备ID
 * @param {String} ip 设备ID
 * @param {Number} channel 对讲的通道
 * @return {*}
 */
Player.OpenCall = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    session.streamlist[channel].calling = true;
    global.ConnectApi.vop2p_call(session, channel);
  }
};
//传输对讲音频
/**
 * @description: 传输对讲音频
 * @param {String} id 设备ID
 * @param {String} ip 设备IP
 * @param {Number} channel 对讲的通道
 * @param {Number} time_stamp 当前的时间戳
 * @param {String} enc 音频类型，默认是G711A
 * @param {Number} sample_rate 采样率，默认8K
 * @param {Number} sample_width 音频位数，默认16
 * @param {Number} channels 音频通道，需要传单声道的音频，所以默认1
 * @param {Number} compress_ratio 音频类型，默认1
 * @param {Uint8Array} voice_data 音频数据
 * @param {Number} voice_data_size 音频数据长度
 * @return {*}
 */
Player.CallSend = function (
  id,
  ip,
  channel,
  time_stamp,
  enc,
  sample_rate,
  sample_width,
  channels,
  compress_ratio,
  voice_data,
  voice_data_size
) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    session.streamlist[channel].calling = true;
    global.ConnectApi.vop2p_send(
      session,
      channel,
      time_stamp,
      enc,
      sample_rate,
      sample_width,
      channels,
      compress_ratio,
      voice_data,
      voice_data_size
    );
  }
};
/**
 * @description: 关闭对讲
 * @param {String} id 设备ID
 * @param {String} ip 设备IP
 * @param {Number} channel 对讲的通道
 * @return {*}
 */
Player.CallHangup = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }

  if (session) {
    session.streamlist[channel].calling = false;
    global.ConnectApi.vop2p_hangup(session, channel);
  }
};
/**
 * 获取当前窗口的码流,默认返回次码流
 * @function ChangeStream
 * @param {string} id 设备id
 * @param {string} ip 设备ip
 * @param {number} channel 当前设备通道
 */
Player.GetWindowStream = function (id, ip, channel) {
  let session = null;
  if (id) {
    session = GetSessionById(id);
  } else {
    session = GetSessionByIp(ip);
  }
  if (session) {
    return session.streamlist[channel].streamid;
  } else {
    return 1;
  }
};
/**
 * 截图
 * @method Snapshot
 * @param { number }     winindex 窗体索引值，必填
 * @param { mode }       mode 截图方式 0：使用指定窗口的canvas画布进行截图 1：使用指定窗口的下一帧码流数据进行截图
 * @param { string }     name 文件名称，需要带格式，目前支持png和jpeg，默认值：snapshot.png
 * @param { number }     width 生成的图片宽度 传空则根据截图方式使用canvas宽度或使用码流宽度，需要和图片高度一起传
 * @param { number }     height 生成的图片高度 传空则根据截图方式使用canvas高度或使用码流高度，需要和图片宽度一起传
 * @param { function }   callback 截图回调，需要图片数据时通过回调获取，不进行图片下载，传空默认直接下载图片
 * callback param 回调内的参数，callback回调后传入的参数
 * @param { string } 	dataURL 以dataURL的形式保存的图片数据，通过回调获取
 */
Player.Snapshot = function (winindex, mode, name, width, height, callback) {
  let session = GetSessionByWinindex(winindex);
  if (session != null) {
    playerList[winindex].Snapshot(mode, name, width, height, callback);
  }
};
/**
 * @method: RenderBackground
 * @description: 初始化渲染窗口画面
 * @param {number} winindex	窗体索引
 * @return {*}
 */
Player.RenderBackground = function (winindex) {
  playerList[winindex].renderBackground();
};
/**
 * @method: CleanFrame
 * @description: 清空帧缓存
 * @param {number} winindex	窗体索引
 * @return {*}
 */
Player.CleanFrame = function name(winindex) {
  playerList[winindex].cleanFrame();
};
/**
 * @method: SetPlaybackTimeCallback
 * @description: 设置回放当前渲染帧的时间戳回调
 * @param {*} winindex
 * @param {*} callback
 * @return {*}
 * callback param 回调参数，callback回调后传进去的参数
 * @param { number } time 当前渲染帧的时间戳
 */
Player.SetPlaybackTimeCallback = function (winindex, callback) {
  playerList[winindex].setPlaybackTimeCallback(callback);
};

/**
 * 开始录像
 * @method ctrlRecordOn
 * @param { number }     winindex 窗体索引值，必填
 * @param { string }     name 文件名称，需要带格式，目前支持MP4和webm
 * @param { number }     width 生成的视频宽度 传空则使用canvas宽度或使用码流宽度
 * @param { number }     height 生成的视频高度 传空则使用canvas高度或使用码流高度
 */

Player.ctrlRecordOn = function (winindex, name, width, height) {
  let session = GetSessionByWinindex(winindex);
  if (session != null) {
    playerList[winindex].ctrlRecord(name, width, height);
  }
};
/**
 * 结束录像
 * @method ctrlRecordOn
 * @param { number }     winindex 窗体索引值，必填
 */
Player.ctrlRecordOff = function (winindex) {
  let session = GetSessionByWinindex(winindex);
  if (session != null) {
    playerList[winindex].ctrlRecordOff();
  }
};
global.VideoPlayer = Player;
