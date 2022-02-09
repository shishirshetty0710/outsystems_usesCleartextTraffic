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
		var platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
		var manifestFile = path.join(platformRoot, 'AndroidManifest.xml');
		
		if (fs.existsSync(manifestFile)) {
			fs.readFile(manifestFile, 'utf8', function (err,data) {
				if (err) {
					throw new Error('Unable to find AndroidManifest.xml: ' + err);
				}
				var allowBackup = 'android:allowBackup=';
				var allowBackupVal = 'false';
				var allowBackupOrig = 'android:allowBackup="true"';
				var result = '';
				if(data.indexOf(allowBackup) == -1) {
					 result = data.replace(/<application/g, '<application android:allowBackup="' + allowBackupVal + '"');
				} else{
					result = data.replace(allowBackupOrig, 'android:allowBackup="' + allowBackupVal + '"');
				}
				fs.writeFile(manifestFile, result, 'utf8', function (err) {
                        if (err) {
                            throw new Error('Unable to write into AndroidManifest.xml: ' + err);
                        }
                    })
			});
		}
		

        return resolve();
    });
};
