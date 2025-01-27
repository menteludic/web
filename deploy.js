const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const cliProgress = require('cli-progress');

require('dotenv').config();

const config = {
    user: process.env.FTP_USER,
    // Password optional, prompted if none given
    password: process.env.FTP_PASSWORD,
    host: process.env.FTP_HOST,
    port: 21,
    localRoot: `${__dirname}/_build`,
    remoteRoot: process.env.ROOT_FOLDER,
    include: ["*", "**/*"],      // this would upload everything except dot files
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    exclude: [
        "dist/**/*.map",
        "node_modules/**",
        "node_modules/**/.*",
        ".git/**",
        ".env"
    ],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: true,
    // use sftp or ftp
    sftp: false,
};

const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
let barInit = false;

ftpDeploy.on("uploading", function (data) {
    if(!barInit) {
        bar1.start(data.totalFilesCount, 1);
        barInit = true;
    }
    bar1.update(data.transferredFileCount);
    // console.log(data.totalFilesCount); // total file count being transferred
    // console.log(data.transferredFileCount); // number of files transferred
    // console.log(data.filename); // partial path with filename being uploaded
});
// ftpDeploy.on("uploaded", function (data) {
//     console.log(data); // same data as uploading event
// });
// ftpDeploy.on("log", function (data) {
//     console.log(data); // same data as uploading event
// });
// ftpDeploy.on("upload-error", function (data) {
//     console.log(data.err); // data will also include filename, relativePath, and other goodies
// });

ftpDeploy
    .deploy(config)
    .then((res) => {
        bar1.stop();
        console.log("finished");
    }).catch((err) => console.log(err));
    // .then((res) => console.log("finished:", res))
