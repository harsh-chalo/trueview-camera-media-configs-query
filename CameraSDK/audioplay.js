(() => {
  'use strict';
  const e = [
      -5504, -5248, -6016, -5760, -4480, -4224, -4992, -4736, -7552, -7296,
      -8064, -7808, -6528, -6272, -7040, -6784, -2752, -2624, -3008, -2880,
      -2240, -2112, -2496, -2368, -3776, -3648, -4032, -3904, -3264, -3136,
      -3520, -3392, -22016, -20992, -24064, -23040, -17920, -16896, -19968,
      -18944, -30208, -29184, -32256, -31232, -26112, -25088, -28160, -27136,
      -11008, -10496, -12032, -11520, -8960, -8448, -9984, -9472, -15104,
      -14592, -16128, -15616, -13056, -12544, -14080, -13568, -344, -328, -376,
      -360, -280, -264, -312, -296, -472, -456, -504, -488, -408, -392, -440,
      -424, -88, -72, -120, -104, -24, -8, -56, -40, -216, -200, -248, -232,
      -152, -136, -184, -168, -1376, -1312, -1504, -1440, -1120, -1056, -1248,
      -1184, -1888, -1824, -2016, -1952, -1632, -1568, -1760, -1696, -688, -656,
      -752, -720, -560, -528, -624, -592, -944, -912, -1008, -976, -816, -784,
      -880, -848, 5504, 5248, 6016, 5760, 4480, 4224, 4992, 4736, 7552, 7296,
      8064, 7808, 6528, 6272, 7040, 6784, 2752, 2624, 3008, 2880, 2240, 2112,
      2496, 2368, 3776, 3648, 4032, 3904, 3264, 3136, 3520, 3392, 22016, 20992,
      24064, 23040, 17920, 16896, 19968, 18944, 30208, 29184, 32256, 31232,
      26112, 25088, 28160, 27136, 11008, 10496, 12032, 11520, 8960, 8448, 9984,
      9472, 15104, 14592, 16128, 15616, 13056, 12544, 14080, 13568, 344, 328,
      376, 360, 280, 264, 312, 296, 472, 456, 504, 488, 408, 392, 440, 424, 88,
      72, 120, 104, 24, 8, 56, 40, 216, 200, 248, 232, 152, 136, 184, 168, 1376,
      1312, 1504, 1440, 1120, 1056, 1248, 1184, 1888, 1824, 2016, 1952, 1632,
      1568, 1760, 1696, 688, 656, 752, 720, 560, 528, 624, 592, 944, 912, 1008,
      976, 816, 784, 880, 848,
    ],
    a = [
      -32124, -31100, -30076, -29052, -28028, -27004, -25980, -24956, -23932,
      -22908, -21884, -20860, -19836, -18812, -17788, -16764, -15996, -15484,
      -14972, -14460, -13948, -13436, -12924, -12412, -11900, -11388, -10876,
      -10364, -9852, -9340, -8828, -8316, -7932, -7676, -7420, -7164, -6908,
      -6652, -6396, -6140, -5884, -5628, -5372, -5116, -4860, -4604, -4348,
      -4092, -3900, -3772, -3644, -3516, -3388, -3260, -3132, -3004, -2876,
      -2748, -2620, -2492, -2364, -2236, -2108, -1980, -1884, -1820, -1756,
      -1692, -1628, -1564, -1500, -1436, -1372, -1308, -1244, -1180, -1116,
      -1052, -988, -924, -876, -844, -812, -780, -748, -716, -684, -652, -620,
      -588, -556, -524, -492, -460, -428, -396, -372, -356, -340, -324, -308,
      -292, -276, -260, -244, -228, -212, -196, -180, -164, -148, -132, -120,
      -112, -104, -96, -88, -80, -72, -64, -56, -48, -40, -32, -24, -16, -8, 0,
      32124, 31100, 30076, 29052, 28028, 27004, 25980, 24956, 23932, 22908,
      21884, 20860, 19836, 18812, 17788, 16764, 15996, 15484, 14972, 14460,
      13948, 13436, 12924, 12412, 11900, 11388, 10876, 10364, 9852, 9340, 8828,
      8316, 7932, 7676, 7420, 7164, 6908, 6652, 6396, 6140, 5884, 5628, 5372,
      5116, 4860, 4604, 4348, 4092, 3900, 3772, 3644, 3516, 3388, 3260, 3132,
      3004, 2876, 2748, 2620, 2492, 2364, 2236, 2108, 1980, 1884, 1820, 1756,
      1692, 1628, 1564, 1500, 1436, 1372, 1308, 1244, 1180, 1116, 1052, 988,
      924, 876, 844, 812, 780, 748, 716, 684, 652, 620, 588, 556, 524, 492, 460,
      428, 396, 372, 356, 340, 324, 308, 292, 276, 260, 244, 228, 212, 196, 180,
      164, 148, 132, 120, 112, 104, 96, 88, 80, 72, 64, 56, 48, 40, 32, 24, 16,
      8, 0,
    ];
  const n = {
    decodeAlaw: function (t) {
      const a = new Uint8Array(2 * t.length);
      let n = 0,
        r = 0;
      for (; n < t.length; ) {
        const i = e[t[n]];
        if (void 0 === i) throw new Error('can not decode g711 alaw data!');
        (a[r] = 255 & i), (a[r + 1] = i >> 8), (n += 1), (r += 2);
      }
      return a;
    },
    decodeUlaw: function (t) {
      const e = new Uint8Array(2 * t.length);
      let n = 0,
        r = 0;
      for (; n < t.length; ) {
        const i = a[t[n]];
        if (void 0 === i) throw new Error('can not decode g711 ulaw data!');
        (e[r] = 255 & i), (e[r + 1] = i >> 8), (n += 1), (r += 2);
      }
      return e;
    },
  };
  class r {
    constructor(t, e) {
      (this._samples = new Float32Array()),
        (this._flushingTime = 200),
        (this._channels = t),
        (this._sampleRate = e),
        (this._flush = this._flush.bind(this)),
        (this._audioCtx = new (global.AudioContext ||
          global.webkitAudioContext)()),
        (this._gainNode = this._audioCtx.createGain()),
        (this._gainNode.gain.value = 1),
        this._gainNode.connect(this._audioCtx.destination),
        (this._startTime = this._audioCtx.currentTime),
        (this._interval = setInterval(this._flush, this._flushingTime)),
        (this.pause = !1);
    }
    setVolume(t) {
      this._gainNode.gain.value = t;
    }
    close() {
      this._samples = new Float32Array();
    }
    pauseAudio() {
      this.pause = !0;
    }
    continueAudio() {
      this.pause = !1;
    }
    feed(t) {
      let e = new Float32Array(this._samples.length + t.length);
      e.set(this._samples, 0),
        e.set(t, this._samples.length),
        (this._samples = e);
    }
    _flush() {
      if (
        !this._channels ||
        !this._sampleRate ||
        !this._samples.length ||
        this.pause
      )
        return;
      let t = this._audioCtx.createBufferSource(),
        e = this._samples.length / this._channels,
        a = this._audioCtx.createBuffer(this._channels, e, this._sampleRate);
      for (let t = 0; t != this._channels; ++t) {
        let n = a.getChannelData(t),
          r = t,
          i = 50;
        for (let t = 0; t != e; ++t)
          (n[t] = this._samples[r]),
            t < 50 && (n[t] = (n[t] * t) / 50),
            t >= e - 51 && (n[t] = (n[t] * i--) / 50),
            (r += this._channels);
      }
      this._startTime < this._audioCtx.currentTime &&
        (this._startTime = this._audioCtx.currentTime),
        (t.buffer = a),
        t.connect(this._gainNode),
        t.start(this._startTime),
        (this._startTime += a.duration),
        (this._samples = new Float32Array());
    }
  }
  class i {
    constructor() {}
    static memmem(t, e, a) {
      for (let n = 0; n <= t.byteLength - a.byteLength - e; ++n) {
        let r = 0;
        for (; r != a.byteLength && t[n + r + e] == a[r]; ++r);
        if (r >= a.byteLength) return n + e;
      }
      return -1;
    }
    static memcmp(t, e, a) {
      for (let n = 0; n != a.byteLength; ++n) if (t[n + e] != a[n]) return -1;
      return 0;
    }
    static memcpy(t, e, a, n, r) {
      t.set(a.subarray(n, r), e);
    }
    static milliSecondTime() {
      return new Date().getTime();
    }
    static shortToFloatData(t) {
      let e = t.length,
        a = new Float32Array(e);
      for (let n = 0; n != e; ++n) a[n] = t[n] / 32768;
      return a;
    }
    static floatToShortData(t) {
      let e = t.length,
        a = new Int16Array(e);
      for (let n = 0; n != e; ++n) a[n] = 32768 * t[n];
      return a;
    }
    static downsampleBuffer(t, e, a) {
      if (e == a) return t;
      if (e > a) throw 'rate > sampleRate error !!';
      let n = a / e,
        r = 65532 & Math.ceil(t.length / n),
        i = new Float32Array(r),
        s = 0,
        o = 0;
      for (; s != i.length; ) {
        let e = o + n,
          a = 0,
          r = 0,
          l = Math.ceil(o),
          u = Math.ceil(e);
        for (let e = l; e != u && e != t.length; ++e) (a += t[e]), ++r;
        (i[s] = a / r), ++s, (o = e);
      }
      return i;
    }
  }
  class s {
    constructor(t, e, a, n, r = 20) {
      (this.data = t),
        (this.type = e),
        (this.time = a),
        (this.duration = r),
        (this.errorCode = n);
    }
    static makeErrorResult(t) {
      return new s(null, -1, -1, t);
    }
  }
  (s.ErrorCode = class {
    constructor() {}
  }),
    (s.ErrorCode.SUCCESS = 0),
    (s.ErrorCode.PARAM_ERROR = 1e3),
    (s.ErrorCode.PARAM_CHANGE = 2e3),
    (s.ErrorCode.FAIL = 3e3),
    (s.ErrorCode.NO_INIT_ERROR = s.ErrorCode.FAIL + 1),
    (s.ErrorCode.CACHE_MAX_ERROR = s.ErrorCode.FAIL + 2),
    (s.Type = class {
      constructor() {}
    }),
    (s.Type.H264_I_FRAME = 0),
    (s.Type.H264_P_FRAME = 1),
    (s.Type.H264_B_FRAME = 2),
    (s.Type.AUDIO = 3),
    (s.Type.TRANS_DATA = 4),
    (s.Type.FMP4_HEAD = 5),
    (s.Type.FMP4_BODY = 6);
  var o = {
    BIAS: 132,
    CLIP: 32635,
    tables: {
      ulaw: {
        compress: [
          0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4,
          4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
          5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6,
          6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
          6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
          6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7,
        ],
        decompress: [
          -32124, -31100, -30076, -29052, -28028, -27004, -25980, -24956,
          -23932, -22908, -21884, -20860, -19836, -18812, -17788, -16764,
          -15996, -15484, -14972, -14460, -13948, -13436, -12924, -12412,
          -11900, -11388, -10876, -10364, -9852, -9340, -8828, -8316, -7932,
          -7676, -7420, -7164, -6908, -6652, -6396, -6140, -5884, -5628, -5372,
          -5116, -4860, -4604, -4348, -4092, -3900, -3772, -3644, -3516, -3388,
          -3260, -3132, -3004, -2876, -2748, -2620, -2492, -2364, -2236, -2108,
          -1980, -1884, -1820, -1756, -1692, -1628, -1564, -1500, -1436, -1372,
          -1308, -1244, -1180, -1116, -1052, -988, -924, -876, -844, -812, -780,
          -748, -716, -684, -652, -620, -588, -556, -524, -492, -460, -428,
          -396, -372, -356, -340, -324, -308, -292, -276, -260, -244, -228,
          -212, -196, -180, -164, -148, -132, -120, -112, -104, -96, -88, -80,
          -72, -64, -56, -48, -40, -32, -24, -16, -8, 0, 32124, 31100, 30076,
          29052, 28028, 27004, 25980, 24956, 23932, 22908, 21884, 20860, 19836,
          18812, 17788, 16764, 15996, 15484, 14972, 14460, 13948, 13436, 12924,
          12412, 11900, 11388, 10876, 10364, 9852, 9340, 8828, 8316, 7932, 7676,
          7420, 7164, 6908, 6652, 6396, 6140, 5884, 5628, 5372, 5116, 4860,
          4604, 4348, 4092, 3900, 3772, 3644, 3516, 3388, 3260, 3132, 3004,
          2876, 2748, 2620, 2492, 2364, 2236, 2108, 1980, 1884, 1820, 1756,
          1692, 1628, 1564, 1500, 1436, 1372, 1308, 1244, 1180, 1116, 1052, 988,
          924, 876, 844, 812, 780, 748, 716, 684, 652, 620, 588, 556, 524, 492,
          460, 428, 396, 372, 356, 340, 324, 308, 292, 276, 260, 244, 228, 212,
          196, 180, 164, 148, 132, 120, 112, 104, 96, 88, 80, 72, 64, 56, 48,
          40, 32, 24, 16, 8, 0,
        ],
      },
      alaw: {
        compress: [
          1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5,
          5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
          6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
          7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
        ],
        decompress: [
          -5504, -5248, -6016, -5760, -4480, -4224, -4992, -4736, -7552, -7296,
          -8064, -7808, -6528, -6272, -7040, -6784, -2752, -2624, -3008, -2880,
          -2240, -2112, -2496, -2368, -3776, -3648, -4032, -3904, -3264, -3136,
          -3520, -3392, -22016, -20992, -24064, -23040, -17920, -16896, -19968,
          -18944, -30208, -29184, -32256, -31232, -26112, -25088, -28160,
          -27136, -11008, -10496, -12032, -11520, -8960, -8448, -9984, -9472,
          -15104, -14592, -16128, -15616, -13056, -12544, -14080, -13568, -344,
          -328, -376, -360, -280, -264, -312, -296, -472, -456, -504, -488,
          -408, -392, -440, -424, -88, -72, -120, -104, -24, -8, -56, -40, -216,
          -200, -248, -232, -152, -136, -184, -168, -1376, -1312, -1504, -1440,
          -1120, -1056, -1248, -1184, -1888, -1824, -2016, -1952, -1632, -1568,
          -1760, -1696, -688, -656, -752, -720, -560, -528, -624, -592, -944,
          -912, -1008, -976, -816, -784, -880, -848, 5504, 5248, 6016, 5760,
          4480, 4224, 4992, 4736, 7552, 7296, 8064, 7808, 6528, 6272, 7040,
          6784, 2752, 2624, 3008, 2880, 2240, 2112, 2496, 2368, 3776, 3648,
          4032, 3904, 3264, 3136, 3520, 3392, 22016, 20992, 24064, 23040, 17920,
          16896, 19968, 18944, 30208, 29184, 32256, 31232, 26112, 25088, 28160,
          27136, 11008, 10496, 12032, 11520, 8960, 8448, 9984, 9472, 15104,
          14592, 16128, 15616, 13056, 12544, 14080, 13568, 344, 328, 376, 360,
          280, 264, 312, 296, 472, 456, 504, 488, 408, 392, 440, 424, 88, 72,
          120, 104, 24, 8, 56, 40, 216, 200, 248, 232, 152, 136, 184, 168, 1376,
          1312, 1504, 1440, 1120, 1056, 1248, 1184, 1888, 1824, 2016, 1952,
          1632, 1568, 1760, 1696, 688, 656, 752, 720, 560, 528, 624, 592, 944,
          912, 1008, 976, 816, 784, 880, 848,
        ],
      },
    },
    encode: function (t, e) {
      e = e || {};
      for (
        var a = new ArrayBuffer(t.byteLength / 2),
          n = new Int8Array(a),
          r = e.alaw ? 'alaw' : 'ulaw',
          i = o[r],
          s = 0;
        s < t.byteLength / 2;
        s++
      )
        n[s] = i(t[s]);
      return n;
    },
    decode: function (t, e) {
      for (
        var a,
          n = !!(e = e || {}).floating_point,
          r = new ArrayBuffer(t.byteLength * (n ? 4 : 2)),
          i = n ? new Float32Array(r) : new Int16Array(r),
          s = o[(e.alaw ? 'alaw' : 'ulaw') + '_dec'],
          l = 0;
        l < t.byteLength;
        l++
      )
        (a = s(t[l])), (i[l] = n ? a / 32768 : a);
      return i;
    },
    alaw: function (t) {
      var e,
        a,
        n,
        r = new ArrayBuffer(2),
        i = new ArrayBuffer(1),
        s = new Int16Array(r),
        l = new Int8Array(i);
      return (
        128 != (e = (~t >> 8) & 128) && ((s[0] = -t), (t = s[0])),
        t > o.CLIP && (t = o.CLIP),
        t >= 256
          ? ((n =
              (t >> ((a = o.tables.alaw.compress[(t >> 8) & 127]) + 3)) & 15),
            (l[0] = (a << 4) | n))
          : (l[0] = t >> 4),
        (l[0] ^= 85 ^ e),
        l[0]
      );
    },
    alaw_dec: function (t) {
      var e = new ArrayBuffer(2),
        a = new Int8Array(e),
        n = o.tables.alaw.decompress[255 & t];
      return (a[0] = n), (a[1] = n >> 8), new Int16Array(a.buffer)[0];
    },
    alawdecode: function (t) {
      for (var e = new Int16Array(t.length), a = 0; a < t.length; a++)
        e[a] = o.alaw_dec(t[a]);
      return e;
    },
    alawencode: function (t) {
      for (var e = new Int8Array(t.length), a = 0; a < t.length; a++)
        e[a] = o.alaw(t[a]);
      return e;
    },
    ulaw: function (t) {
      var e,
        a,
        n = new ArrayBuffer(2),
        r = new ArrayBuffer(1),
        i = new Int16Array(n),
        s = new Int8Array(r);
      return (
        t < 0
          ? ((i[0] = o.BIAS - t), (t = i[0]), (e = 127))
          : ((t += o.BIAS), (e = 255)),
        (a = o.tables.ulaw.compress[(t >> 8) & 127]) >= 8
          ? 127 ^ e
          : ((s[0] = (a << 4) | ((t >> (a + 3)) & 15)), s[0] ^ e)
      );
    },
    ulaw_dec: function (t) {
      var e = new ArrayBuffer(2),
        a = new Int8Array(e),
        n = o.tables.ulaw.decompress[255 & t];
      return (a[0] = n), (a[1] = n >> 8), new Int16Array(a.buffer)[0];
    },
    ulaw_dec_slow: function (e) {
      var a = new ArrayBuffer(2),
        n = new Int16Array(a);
      (n[0] = ~e),
        (e = n[0]),
        (t = ((15 & e) << 3) + o.BIAS),
        (t <<= (112 & e) >> 4);
      var r = 128 == (128 & e),
        i = new ArrayBuffer(2),
        s = new Int16Array(i);
      return (s[0] = r ? o.BIAS - t : t - o.BIAS), s[0];
    },
  };
  const l = o;
  (global.URL = global.URL || global.webkitURL),
    void 0 === navigator.mediaDevices && (navigator.mediaDevices = {}),
    (global.G711 = l),
    (global.audioBufferSouceNode = null);
  new r(1, 8e3);
  let u = function (t, e) {
    const a = new (global.AudioContext || global.webkitAudioContext)({
      sampleRate: 8e3,
    });
    ((e = e || {}).channelCount = 1),
      (e.numberOfInputChannels = e.channelCount),
      (e.numberOfOutputChannels = e.channelCount),
      (e.sampleBits = e.sampleBits || 16),
      (e.sampleRate = e.sampleRate || 8e3),
      (e.bufferSize = 4096);
    let n = a.createMediaStreamSource(t),
      r = a.createGain();
    n.connect(r);
    let s = a.createScriptProcessor(
        e.bufferSize,
        e.channelCount,
        e.channelCount
      ),
      o = {
        size: 0,
        buffer: [],
        buffer2: [],
        inputSampleRate: a.sampleRate,
        inputSampleBits: 16,
        outputSampleRate: e.sampleRate,
        oututSampleBits: e.sampleBits,
        input: function (t) {
          let a = i.floatToShortData(new Float32Array(t));
          console.log(t), console.log(a);
          let n = l.encode(a, { alaw: !0 });
          console.log(n);
          let r = l.decode(n, { alaw: !0 }),
            s = r,
            o = i.shortToFloatData(s);
          console.log(r), console.log(o), e.inputCallback && e.inputCallback(n);
        },
        getRawData: function () {
          let t = new Float32Array(this.size),
            e = 0;
          for (let a = 0; a < this.buffer.length; a++)
            t.set(this.buffer[a], e), (e += this.buffer[a].length);
          let a = parseInt(this.inputSampleRate / this.outputSampleRate),
            n = t.length / a,
            r = new Float32Array(n),
            i = 0,
            s = 0;
          for (; i < n; ) (r[i] = t[s]), (s += a), i++;
          return r;
        },
        covertWav: function () {
          let t = Math.min(this.inputSampleRate, this.outputSampleRate),
            a = Math.min(this.inputSampleBits, this.oututSampleBits),
            n = this.getRawData(),
            r = n.length * (a / 8),
            i = new ArrayBuffer(44 + r),
            s = new DataView(i),
            o = 0,
            l = function (t) {
              for (var e = 0; e < t.length; e++)
                s.setUint8(o + e, t.charCodeAt(e));
            };
          return (
            l('RIFF'),
            (o += 4),
            s.setUint32(o, 36 + r, !0),
            (o += 4),
            l('WAVE'),
            (o += 4),
            l('fmt '),
            (o += 4),
            s.setUint32(o, 16, !0),
            (o += 4),
            s.setUint16(o, 1, !0),
            (o += 2),
            s.setUint16(o, e.channelCount, !0),
            (o += 2),
            s.setUint32(o, t, !0),
            (o += 4),
            s.setUint32(o, e.channelCount * t * (a / 8), !0),
            (o += 4),
            s.setUint16(o, e.channelCount * (a / 8), !0),
            (o += 2),
            s.setUint16(o, a, !0),
            (o += 2),
            l('data'),
            (o += 4),
            s.setUint32(o, r, !0),
            (o += 4),
            (s = this.reshapeWavData(a, o, n, s))
          );
        },
        getFullWavData: function () {
          const t = this.covertWav();
          return new Blob([t], { type: 'audio/wav' });
        },
        closeContext: function () {
          a.close();
        },
        reshapeWavData: function (t, e, a, n) {
          if (8 === t)
            for (let t = 0; t < a.length; t++, e++) {
              let r = Math.max(-1, Math.min(1, a[t])),
                i = r < 0 ? 32768 * r : 32767 * r;
              (i = parseInt(255 / (65535 / (i + 32768)))), n.setInt8(e, i, !0);
            }
          else
            for (let t = 0; t < a.length; t++, e += 2) {
              let r = Math.max(-1, Math.min(1, a[t]));
              n.setInt16(e, r < 0 ? 32768 * r : 32767 * r, !0);
            }
          return n;
        },
        getWavBuffer: function () {
          return this.covertWav().buffer;
        },
        getPcmBuffer: function () {
          let t = this.getRawData(),
            e = 0,
            a = this.oututSampleBits,
            n = t.length * (a / 8),
            r = new ArrayBuffer(n),
            i = new DataView(r);
          for (var s = 0; s < t.length; s++, e += 2) {
            var o = Math.max(-1, Math.min(1, t[s]));
            i.setInt16(e, o < 0 ? 32768 * o : 32767 * o, !0);
          }
          return new Blob([i]);
        },
        getPcmData: function () {
          let t = this.getRawData(),
            e = 0,
            a = this.oututSampleBits,
            n = t.length * (a / 8),
            r = new ArrayBuffer(n),
            i = new DataView(r);
          for (var s = 0; s < t.length; s++, e += 2) {
            var o = Math.max(-1, Math.min(1, t[s]));
            i.setInt16(e, o < 0 ? 32768 * o : 32767 * o, !0);
          }
          return i;
        },
        getframeData: function (t) {
          let e = new Float32Array(t.length),
            a = 0;
          e.set(t, a), (a += t.length);
          let n = parseInt(this.inputSampleRate / this.outputSampleRate),
            r = e.length / n,
            i = new Float32Array(r),
            s = 0,
            o = 0;
          for (; s < r; ) (i[s] = e[o]), (o += n), s++;
          let l = 0,
            u = this.oututSampleBits,
            h = i.length * (u / 8),
            c = new ArrayBuffer(h),
            f = new DataView(c);
          for (var w = 0; w < i.length; w++, l += 2) {
            var d = Math.max(-1, Math.min(1, i[w]));
            f.setInt16(l, d < 0 ? 32768 * d : 32767 * d, !0);
          }
          return f;
        },
        concatenate(t) {
          let e = 0;
          for (let a of t) e += a.byteLength;
          let a = new Uint8Array(e),
            n = 0;
          for (let e of t) {
            let t = new Uint8Array(e);
            a.set(t, n), (n += e.byteLength);
          }
          return a.buffer;
        },
      };
    (this.start = () => {
      n.connect(s), s.connect(a.destination);
    }),
      (this.getBlob = () => (this.stop(), o.getFullWavData())),
      (this.getBuffer = () => (this.stop(), o.getPcmBuffer())),
      (this.play = (t, e) => {
        (t.src = global.URL.createObjectURL(this.getBlob())),
          t.addEventListener('play', () => {
            this.draw(e);
          });
      }),
      (this.wavSrc = () => global.URL.createObjectURL(this.getBlob())),
      (this.aacSrc = () => o.getPcmData()),
      (this.getWavBuffer = () => o.getWavBuffer()),
      (this.pcmSrc = () => (
        this.stop(), global.URL.createObjectURL(this.getBuffer())
      )),
      (this.stop = () => {
        s.disconnect();
      }),
      (this.close = function () {
        o.closeContext(), t.getTracks()[0].stop();
      }),
      (this.draw = function (t) {
        const e = o.getWavBuffer();
        a.decodeAudioData(e, (e) => {
          null != global.audioBufferSouceNode &&
            global.audioBufferSouceNode.stop(),
            (global.audioBufferSouceNode = a.createBufferSource()),
            (audioBufferSouceNode.buffer = e),
            (gainNode = a.createGain()),
            (gainNode.gain.value = 2),
            audioBufferSouceNode.connect(gainNode);
          let n = a.createAnalyser();
          (n.fftSize = 256),
            gainNode.connect(n),
            n.connect(a.destination),
            audioBufferSouceNode.start(0);
          let r = new Uint8Array(n.frequencyBinCount),
            i = t.createLinearGradient(0, 0, 4, 200);
          i.addColorStop(1, 'pink'),
            i.addColorStop(0.5, 'blue'),
            i.addColorStop(0, 'red');
          let s = function () {
            let e = new Uint8Array(n.frequencyBinCount);
            n.getByteFrequencyData(e), t.clearRect(0, 0, 600, 200);
            for (let a = 0; a < e.length; a++) {
              let n = e[a];
              !r[a] || n > r[a] ? (r[a] = n) : (r[a] -= 1),
                t.fillRect(20 * a, 200 - n, 4, n),
                t.fillRect(20 * a, 200 - r[a] - 6.6, 4, 3.3),
                (t.fillStyle = i);
            }
            requestAnimationFrame(s);
          };
          s();
        });
      }),
      (s.onaudioprocess = (t) => {
        console.log('录音音频流生成'), o.input(t.inputBuffer.getChannelData(0));
      });
  };
  u.get = (t, e) => {
    t &&
      (navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        ? navigator.mediaDevices
            .getUserMedia({ audio: !0 })
            .then((a) => {
              const n = new u(a, e);
              t(n);
            })
            .catch((t) => {
              console.log(t);
            })
        : alert('麦克风获取失败'));
  };
  const h = u;
  (global.JARecorder = h),
    (global.JASplitData = class {
      constructor() {
        (this._samples = new Uint8Array()),
          (this._flushingTime = 20),
          (this.getDataCallback = null),
          (this.outputData = null),
          (this._flush = this._flush.bind(this)),
          (this._interval = setInterval(this._flush, this._flushingTime)),
          (this.pause = !1);
      }
      close() {
        this._samples = new Uint8Array();
      }
      pauseAudio() {
        this.pause = !0;
      }
      continueAudio() {
        this.pause = !1;
      }
      feed(t) {
        let e = new Uint8Array(this._samples.length + t.length);
        e.set(this._samples, 0),
          e.set(t, this._samples.length),
          (this._samples = e);
      }
      _flush() {
        if (this._samples && this._samples.length < 160) return;
        let t = new Uint8Array(this._samples.length - 160),
          e = new Uint8Array(this._samples.subarray(0, 160));
        t.set(this._samples.subarray(160), 0),
          (this._samples = t),
          this.outputData && this.outputData(e);
      }
      setDataCallback(t) {
        this.outputData = t;
      }
    });
  let c = global.AudioContext || global.webkitAudioContext,
    f = c ? new c({ sampleRate: 8e3, latencyHint: 'interactive' }) : '',
    w = null,
    d = [];
  (w = new r(1, 8e3)),
    (global.audioPlay = function (t, e, a, r) {
      if (e.indexOf('G711') > -1) {
        let e = new Uint8Array(t);
        320 != e.length && 160 != e.length && (e = e.subarray(36));
        let a = n.decodeAlaw(e),
          r = i.shortToFloatData(a);
        w.feed(r);
      } else if ((249 == t[1] && (t[1] = 241), d.length))
        if (d[0].length < 8) {
          let e = new Uint8Array(d[0].buffer),
            a = new ArrayBuffer(t.length + e.length),
            n = new Uint8Array(a);
          for (s = 0; s < e.length; s++) n[s] = e[s];
          for (s = e.length; s < n.length; s++) n[s] = t[s - e.length];
          (d[0].buffer = a), (d[0].length = d[0].length + 1);
        } else {
          let t = d[0].buffer;
          f.decodeAudioData(t).then(function (t) {
            let e = t.getChannelData(0);
            w.feed(e);
          }),
            (d = []);
        }
      else {
        let e = new ArrayBuffer(t.length),
          a = new Uint8Array(e);
        for (var s = 0; s < a.length; s++) a[s] = t[s];
        d.push({ buffer: e, length: 1 });
      }
    }),
    (global.audioStop = function () {
      w && w.close();
    });
})();
