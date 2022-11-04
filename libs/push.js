var pathFn = require('path');
var fs = require('fs');
module.exports = function (args) {
    const qcloudSDK = require('qcloud-cdn-node-sdk');
    var config = this.config;
    var cdn_file = config.tencentcdn.path
    var log = this.log;
    var secret_Id = config.tencentcdn.secretId;
    var secret_Key = config.tencentcdn.secretKey;

    qcloudSDK.config({
        secretId: secret_Id,
        secretKey: secret_Key
    })

    var publicDir = this.public_dir;
    var cdnUrlsFile = pathFn.join(publicDir, cdn_file);
    var urls = fs.readFileSync(cdnUrlsFile, 'utf8').split("\n")
    var params = {};
    for (var i = 0; i < urls.length; i++) {
        params['urls.' + i] = urls[i];
    }

    log.info("refreshed urls:")
    console.log(params)

    qcloudSDK.request('RefreshCdnUrl', params, (json) => {
        var obj = JSON.parse(json);
        console.log('Tencent CDN Result:');
        if (obj.code === 0) {
            console.log("\tcodeDesc:", obj.codeDesc);
        } else {
            console.log("\tcode:", obj.code);
            console.log("\tmessage:", obj.message);
            console.log("\tcodeDesc:", obj.codeDesc);
        }
    })

    fs.unlink(cdnUrlsFile, function (err) {
        // 判断 如果有错 抛出错误 否则 打印删除成功
        if (err) {
            throw err;
        }
    });
}