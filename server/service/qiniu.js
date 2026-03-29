import qiniu from 'qiniu';

async function getSign(req) {
    var accessKey = 'omRKBrSZesAegfkmaFD-RK7QLSpQVNYjj4sAnjzb';
    var secretKey = 'ABKgEBrcFGcOya7yjcJEkrZI0Ph14cZ0FOF9-ROW';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
        scope: 'daydaylove',
      };
      var putPolicy = new qiniu.rs.PutPolicy(options);
      var uploadToken = putPolicy.uploadToken(mac);
      return {
        token: uploadToken
      };
}


export {getSign}
