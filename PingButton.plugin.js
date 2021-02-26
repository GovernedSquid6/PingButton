/**
 * @name PingButton
 * @invite undefined
 * @authorLink undefined
 * @donate undefined
 * @patreon undefined
 * @website https://github.com/GovernedSquid6/PingButton
 * @source https://raw.githubusercontent.com/GovernedSquid6/PingButton/main/PingButton.plugin.js
 */
/*@cc_on
@if (@_jscript)
	
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

module.exports = (() => {
    const config = {"info":{"name":"PingButton","authors":[{"name":"Grant","discord_id":"664959346681315334","github_username":"GovernedSquid6","twitter_username":"TheGayMankini"}],"version":"1.0.0","description":"Adds a clickable ping button.","github":"https://github.com/GovernedSquid6/PingButton","github_raw":"https://raw.githubusercontent.com/GovernedSquid6/PingButton/main/PingButton.plugin.js"},"changelog":[],"main":"index.js"};

    return !global.ZeresPluginLibrary ? class {
        constructor() {this._config = config;}
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
        load() {
            BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                    require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                    });
                }
            });
        }
        start() {}
        stop() {}
    } : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
    const buttonHTML = `<div class="buttonContainer-28fw2U da-buttonContainer send-button">
    <button aria-label="Send Message" tabindex="0" type="button" class="buttonWrapper-1ZmCpA da-buttonWrapper button-38aScr da-button lookBlank-3eh9lL colorBrand-3pXr91 grow-q77ONN da-grow noFocus-2C7BQj da-noFocus">
        <div class="contents-18-Yxp da-contents button-3AYNKb da-button button-318s1X da-button">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-3D60ES da-icon" viewBox="0 0 24 24" aria-hidden="false" fill="currentColor" width="24px" height="24px">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
        </div>
    </button>
</div>`;

    const press = new KeyboardEvent("keydown", {key: "Enter", code: "Enter", which: 13, keyCode: 13, bubbles: true});
    Object.defineProperties(press, {keyCode: {value: 13}, which: {value: 13}});
	

    const {DiscordSelectors, PluginUtilities, DOMTools, Logger} = Api;
    return class SendButton extends Plugin {
        onStart() {
            const form = document.querySelector("form");
            if (form) this.addButton(form);
        }
        
        onStop() {
            const button = document.querySelector(".send-button");
            if (button) button.remove();
            PluginUtilities.removeStyle(this.getName());
        }

        addButton(form) {
            if (form.querySelector(".send-button")) return;
            const button = DOMTools.createElement(buttonHTML);
            form.querySelector(DiscordSelectors.Textarea.buttons).append(button);
            button.addEventListener("click", async() => {
                const textareaWrapper = form.querySelector(DiscordSelectors.Textarea.textArea);
                if (!textareaWrapper) return Logger.warn("Could not find textarea wrapper");
                const textarea = textareaWrapper.children && textareaWrapper.children[0];
                if (!textarea) return Logger.warn("Could not find textarea");
				//var div = document.querySelector('.textArea-12jD-V');
				let thisChannel = new ZLibrary.DiscordAPI.Channel(ZLibrary.DiscordAPI.currentChannel)
				//let thisGuild = new ZLibrary.DiscordAPI.Guild(thisChannel.guild)

				const target2 = thisChannel.discordObject.guild.members
				//const target2 = await target.filter(member => !member.hasPermission('KICK_MEMBERS') && !member.hasPermission('BAN_MEMBERS'))
				const array = await target2.map(a => `<@${a.userId}>`);
				var bufferStr = ''
				array.forEach(async(tag, i, a) => {
					if(bufferStr.length + tag.length <= 2000) bufferStr += tag
					if (i + 1 === a.length){
						thisChannel.sendMessage(bufferStr)
					}
					else if(bufferStr.length + tag.length >= 2000){
						thisChannel.sendMessage(bufferStr)
						bufferStr = ''
						bufferStr += tag
					}
				})
				console.dir(thisChannel.discordObject.guild.members)
            });
        }//document.execCommand

        observer(e) {
            if (!e.addedNodes.length || !e.addedNodes[0] || !e.addedNodes[0].querySelector) return;
            const form = e.addedNodes[0].querySelector(DiscordSelectors.Textarea.inner);
            if (form) this.addButton(form);
        }

    };
};
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/