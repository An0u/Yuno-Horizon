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
    noise: false,
    newTabLink: true,
    themeBaseURI: `https://${document.location.hostname}/yunohost/sso/assets/themes/Yuno-Horizon`,
    // ? Change to True if you want to use Term of Service Modal Feature
    tosModal: true,
    tosFeature: {
        // ! Change to the url of the file !
        markdownFile: `https://${document.location.hostname}/yunohost/sso/assets/themes/Yuno-Horizon/README.md`,
        // ! Change to true if you want to redirect users rejecting the TOS.
        redirectRejected: false,
        rejectURL: "about:blank",
        modal: {
            title: 'TOS Yuno-Horizon Feature Title',
            bottomMessage: "Modify this texte in your config file."
        },
    }
}

// Function to write a value to local storage
function writeToLocalStorage(value) {
    localStorage.setItem('tosAgree', JSON.stringify(value));
}

// Function to read a value from local storage
function readFromLocalStorage() {
    const value = localStorage.getItem('tosAgree');
    return value ? JSON.parse(value) : null;
}

function acceptTOS () {
    writeToLocalStorage(true)
}

function rejectTOS() {
    writeToLocalStorage(false);
    window.modal.close("modal-tos");
    if (config.tosFeature.redirectRejected) {
        window.location.href = config.tosFeature.rejectURL;
    }
    
}

function addModal() {
    return new Promise( (resolve, reject) => {

        try {
            let showdownScript = document.createElement('script')
            showdownScript.src = `${config.themeBaseURI}/libs/showdown.min.js`
            document.head.appendChild(showdownScript)
    
            showdownScript.onload = async function () {
                let resp = await fetch(`${config.tosFeature.markdownFile}`)
                let markdown = await resp.text();
                let tos = new showdown.Converter().makeHtml(markdown)
    
                let modalScript = document.createElement('script')
                modalScript.src = `${config.themeBaseURI}/libs/micromodal.min.js`
                document.head.appendChild(modalScript)
    
                modalScript.onload = function () {
                    let modal = document.createElement('div')
                    modal.id = "modal-tos"
                    modal.setAttribute('aria-hidden', true)
                    modal.className = "modal micromodal-slide"
                    modal.innerHTML = `
                    <div class="modal__overlay" tabindex="-1">
                      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
                        <header class="modal__header">
                          <h2 class="modal__title" id="modal-1-title">
                            ${config.tosFeature.modal.title}
                          </h2>
                          <button class="modal__close" data-micromodal-close aria-label="Close modal"></button>
                        </header>
                        <main class="modal__content" id="modal-tos-content">
                          <p>
                            ${tos}
                          </p>
                        </main>
                        <footer class="modal__footer">
                            <p id="bottomMessage">${config.tosFeature.modal.bottomMessage}</p>
                            <button class="modal__btn modal__btn-primary" data-micromodal-close onClick="acceptTOS()">Accept</button>
                            <button class="modal__btn modal__btn-secondary data-micromodal-close" aria-label="Reject TOS" onClick="rejectTOS()">Decline</button>
                        </footer>
                      </div>
                    </div>
                    `
                    document.body.appendChild(modal)
                    window.modal = MicroModal
                    window.modal.init()
                    window.modal.show("modal-tos");
                    resolve()
                };
            }
        } catch (error) {
            writeToLocalStorage(false)
            console.log("Error with TOS Modal Creation", error);
        }

    })
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

        const imgUrl = `${config.themeBaseURI}/pictures/apps/${name}.svg`
        
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

        let avatarUrl = `${config.themeBaseURI}/pictures/avatars/${targetAvatar}`
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
    if (config.noise) {
        let noise = document.createElement('div')
        noise.className = "noise"
        document.body.appendChild(noise);
    }

    if (document.body.className.indexOf("logged") == -1) {

        if (config.tosModal) {
            let checkTOS = readFromLocalStorage()
            if (checkTOS == null || checkTOS === false) {
                await addModal()
            }
        }
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

