# Yuno Horizon
A simple horizon Color theme for [Yunohost](https://yunohost.org), based on the excellent [Nature Mount Theme](https://github.com/yunohost-themes/Nature-Mount).

- [x] Added Custom app icons support ([custom_portal.js](https://github.com/niemes/yuno-Horizon/blob/master/custom_portal.js)).
- [x] Added Custom Avatar support based on username.
- [x] Open link in new tabs by default.
- [x] Mobile / Tablette Column layout.
- [x] Added color theme configuration css root variables.
- [x] Small sidebar
- [x] Add Terms of Service Modal Feature.

## Info :

### Avatar:

Since Avatars are'nt supported by the yunohost portal but quite useful and nice to have. I added a custom script to load avatar pictures. For a small self hosted bunch of users it's alright.

- Avatar images must be 142X142px.
    - Add an image with the name of the user:  <username>.png in the /pictures/avatars folder.
- Avatar images must be a .png file or specify the username and file in the custom_portal.js file. (config object).

### App Icons:
- to deactivate custom icons put customIcons: false in the config object of custom_portal.js 
- Add the app icon in the /pictures/apps folder.
- Icon must be an .svg file.

### Terms Of Service Modal Feature : 

Please Modify the config found in the custom_portal.js file.

```
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
```

![Yunohost-tos](https://raw.githubusercontent.com/niemes/yuno-Horizon/master/pictures/preview-tos.png)

## How to install

You can follow the instructions explained here:
https://yunohost.org/#/theming

## Screenshots

![Yunohost-login](https://raw.githubusercontent.com/niemes/yuno-Horizon/master/pictures/preview-login.png)

![Yunohost-portal](https://raw.githubusercontent.com/niemes/yuno-Horizon/master/pictures/preview-portal2.png)

![Yunohost-resp](https://raw.githubusercontent.com/niemes/yuno-Horizon/master/pictures/preview-resp.png)


## Credits: 

- Base avatar [avataaars](https://github.com/fangpenlin/avataaars-generator)
- Theme based on [Nature Mount Theme](https://github.com/yunohost-themes/Nature-Mount)

Icon Credits:

The icons used in this project are sourced from various open-source projects. We do not claim ownership of these icons. All credit for the respective icons goes to their original creators and their projects. We are grateful for their contributions to the open-source community.
