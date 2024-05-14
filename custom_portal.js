/*
===============================================================================
 This JS file may be used to customize the YunoHost user portal *and* also
 will be loaded in all app pages if the app nginx's conf does include the
 appropriate snippet.

 You can monkeypatch init_portal (loading of the user portal) and
 init_portal_button_and_overlay (loading of the button and overlay...) to do
 custom stuff
===============================================================================
*/
const config = {
    baseAvatar: 'base.png',
    avatars: { // if you want to specified a specific file for an user
        yuno: 'yuno.gif'
    },
    customIcons: true,
    customAvatars: true,
    newTabLink: true,
    themeBaseURI: `https://${document.location.hostname}/yunohost/sso/assets/themes/Yuno-Horizon/pictures`
}

async function addAppsLogo() {
    const allApps = document.getElementsByClassName('app-tile')

    for (let index = 0; index < allApps.length; index++) {
        let app = allApps[index]
        let name = app.getAttribute('data-appname')

        if (config.newTabLink) {
            app.dataset.link = allApps[index].href;
            app.href = "";

            app.addEventListener("click", (event) => {
                const link = event.currentTarget.dataset.link;
                if (link) window.openApp(link)
            });
        }

        const svg = document.createElement('img')
        svg.className = 'appLogo'

        const imgUrl = `${config.themeBaseURI}/apps/${name}.svg`
        
        // Check if the URL of the logo exist.
        await fetch(imgUrl)
            .then(response => {
                if (response.ok) {
                    svg.src = imgUrl;
                    if (app.firstElementChild) {
                        app.replaceChild(svg, app.firstElementChild);
                    } else {
                        app.appendChild(svg);
                    }
                } else {
                    console.warn(`Invalid URL: ${imgUrl}`);
                }
            })
            .catch(error => {
                console.warn(`Error fetching URL: ${imgUrl}`, error);
            });
    }
}

async function useCustomAvatar() {
    let currentUser = document.getElementsByClassName('user-username')[0];
    let username = currentUser.innerText
    
    if(currentUser) {
        let targetAvatar;

        if (config.avatars[username]) targetAvatar = config.avatars[username]
        else targetAvatar = `${username}.png`

        let avatarUrl = `${config.themeBaseURI}/avatars/${targetAvatar}`
        var style = document.createElement('style');

        // Check if the URL of the avatar exist.
        await fetch(avatarUrl)
            .then(response => {
                if (response.ok) {
                    var cssRule = `.user-container .user-username:before { content: url('${avatarUrl}'); opacity: 1;}`;

                    style.appendChild(document.createTextNode(cssRule));
                    document.head.appendChild(style);
                } else {
                    var cssRule = `.user-container .user-username:before { 
                        content: url('${config.themeBaseURI}/avatars/${config.baseAvatar}'); 
                        opacity: 1;
                    }`;

                    style.appendChild(document.createTextNode(cssRule));
                    document.head.appendChild(style);
                }
            })
    }
}

init_portal_original = init_portal;
init_portal = async function()
{
    init_portal_original();

    // Don't wait if logged
    if (document.body.className.indexOf("logged") == -1) {
        document.body.style.opacity  = 1.0;
    } else { // handle custom UI only if logged 
        window.openApp = (link) => window.open(link, "_blank");
        if (config.customIcons) await addAppsLogo()
        if (config.customAvatars) await useCustomAvatar()

        // links menu
        let footerNav = 'div.ynh-wrapper:nth-child(3) > nav:nth-child(1)'
        var target = document.getElementsByClassName('user')[0];
        target.id = "user"

        let mainNav = document.querySelector(footerNav)
        let clonedMenu = mainNav.cloneNode(true);
        clonedMenu.id = "mainmenu"

        target.appendChild(clonedMenu);
        mainNav.remove()
    }

    document.body.style.opacity  = 1.0;
}

/*
 * Monkey patching example to do custom stuff when loading inside an app
 *
 * */

init_portal_button_and_overlay_original = init_portal_button_and_overlay;
init_portal_button_and_overlay = function()
{
    init_portal_button_and_overlay_original();
    // Custom stuff to do when loading inside an app
}

