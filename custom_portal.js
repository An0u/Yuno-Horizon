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
    customIcons: true,
    newTabLink: true,
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
                let link = event.currentTarget.dataset.link;
                console.log(link);
                if (link) window.openApp(link)
            });
        }

        const img = document.createElement('img')
        img.className = 'appLogo'
        imgUrl = `${app.baseURI.replace('#', '')}assets/themes/Nature-Mount/pictures/${name}.png`
        
        // Check if the URL of the logo exist.
        await fetch(imgUrl)
            .then(response => {
                if (response.ok) {
                    img.src = imgUrl;
                    if (app.firstElementChild) {
                        app.replaceChild(img, app.firstElementChild);
                    } else {
                        app.appendChild(img);
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

init_portal_original = init_portal;
init_portal = async function()
{
    init_portal_original();

    window.openApp = (link) => window.open(link, "_blank");
    if (config.customIcons) await addAppsLogo()
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

