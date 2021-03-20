// -- tapeSerializer2 by yunyl, used for serializing and deserializing UbiArt Framework tape files that is used in 
// Just Dance 2014 and above (including spin-offs and online files)
console.log("\n[tapeSerializer2] tapeSerializer2 by yunyl, used for serializing and deserializing\n[tapeSerializer2] UbiArt Framework tape files that is used in Just Dance 2014 and above.")

let mapName = process.argv[2]

// -- MODULES

    // - Public modules
    let fs = require("fs")
    const chalk = require('chalk');
    // -

    // - TS2 local modules
    let ts2serialize = require("./dist/ts2_Serializer.js")
    // -

// --


let mainSettings = require("./settings.json")


// -- FUNCTIONS

function getSettings(setting) {
    if (setting.includes("/")) return mainSettings[setting.split("/")[0]][setting.split("/")[1]]
    else return mainSettings[setting]
}

// - isSerialized function is for checking if the file is a JSON or serialized.
function isSerialized(data) {
    try {
        JSON.parse(data)
        return false
    } catch (err) {
        return true
    }
}

// - getHex function is for generating hex by binary.
function getHex(num) {
    return (`00000000` + num.toString(16)).substr(-8);
}

// - generateHexParameter is for returning length, string or length + string or float in hex.
function generateHexParameter(value, type) {
    if (type === "length") return getHex((value).length.toString(16))
	else if (type === "string") return Buffer.from(value, "utf8").toString("hex")
    else if (type === "lenstr") return getHex((value).length.toString(16)) + Buffer.from(value, "utf8").toString("hex")
    else if (type === "int") {
        if (value < 0) {
            value = 0xFFFFFFFF + value + 1;
            return value.toString(16).toUpperCase();
        }
        else if (value > -1) {
            return getHex((value).toString(16))
        }
    }
    else if (type === "float") {
        const getHex = i => ('00' + i.toString(16)).slice(-2);

        var view = new DataView(new ArrayBuffer(4)),
            result;
        
        view.setFloat32(0, value);
        
        result = Array
            .apply(null, { length: 4 })
            .map((_, i) => getHex(view.getUint8(i)))
            .join('');
        
        return result
    }
}

// --


// Where all the process happens.
function init() {

    // -- Song Description (songDesc.tpl.ckd // songdesc.main_legacy.tpl.ckd) 
    let songdescFile;
    let musictrackFile;
    if (fs.existsSync(`./input/songdesc.tpl.ckd`)) songdescFile = fs.readFileSync(`./input/songdesc.tpl.ckd`)
    else console.log("\n" +chalk.yellow(`WARNING! `) + `[INIT] Your songdesc file is either empty or missing.`)
    if (fs.existsSync(`./input/${mapName.toLowerCase()}_musictrack.tpl.ckd`)) musictrackFile = fs.readFileSync(`./input/${mapName}_musictrack.tpl.ckd`) 
    else console.log("\n" +chalk.yellow(`WARNING! `) + `[INIT] Your musictrack file is either empty or missing.`)
    // Statements to check if file is serialized or not.

        // - File is not serialized, which means it's UbiArt new-gen JSON.
        try {
            if (fs.existsSync(`${getSettings("outputFolder")}/${getSettings("songDesc/filename")}`)) fs.unlinkSync(`${getSettings("outputFolder")}/${getSettings("songDesc/filename")}`)
            
            songdescFile = JSON.parse(songdescFile)
            musictrackFile = JSON.parse(musictrackFile)
            console.log(`\n[INIT] Starting the serializion of ${songdescFile["COMPONENTS"][0]["MapName"]}.\n`)
            let songDescSerialized = ts2serialize.songdesc(songdescFile, musictrackFile)
            
            Object.values(songDescSerialized).forEach(compEn => {
                fs.appendFileSync(`${getSettings("outputFolder")}/${getSettings("songDesc/filename")}`, Buffer.from(compEn, "hex"))
            })
            console.log(`\n${chalk.green(`SUCCESS! `)} ${songdescFile["COMPONENTS"][0]["MapName"]} was converted successfully.`)
        }
        catch (e) {
         console.log("\n" + chalk.red(`ERROR! `) + `[INIT] An error occured with songdesc serializer. The error was: \n${chalk.red(`ERROR! `)}${e}`)
        }
}
init()
