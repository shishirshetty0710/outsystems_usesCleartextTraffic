var fs = require('fs'),
    path = require('path');

const ANDROID_PREFERENCE_NAME = 'cleartextTrafficPermitted';

module.exports = function(context) {
    return new Promise(function(resolve) {
        console.log('Enabling ' + ANDROID_PREFERENCE_NAME + ' option');

        var projectRoot = context.opts.projectRoot;
        var config = path.join(projectRoot, 'res', 'android', 'xml', 'network_security_config.xml');

        if (fs.existsSync(config)) {
            fs.readFile(config, 'utf8', function (err, data) {
                if (err) {
                    throw new Error('Unable to find network_security_config.xml: ' + err);
                }

                if (data.indexOf(ANDROID_PREFERENCE_NAME) == -1) {
                    var result = data.replace(/<base-config/g, '<base-config ' + ANDROID_PREFERENCE_NAME + '="false"');

                    fs.writeFile(config, result, 'utf8', function (err) {
                        if (err) {
                            throw new Error('Unable to write into network_security_config.xml: ' + err);
                        }
                    })
                }
            });
        }
		
        return resolve();
    });
};
