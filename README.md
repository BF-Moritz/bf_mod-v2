# bf_mod-v2

Die 2. Version meines Twitch Chat Bots, jetzt auch komplett in Typescript.
Das UI wird noch komplett durch die [BF_Lib-Vue-v2](https://github.com/BF-Moritz/bf_lib-vue-v2) ersetzt.

---

Zuerst unter `src/config/credentials` die `credentials.dist.json` nach `credentials.json` umbennenen und Informationen ausfüllen

Zum starten des TS Compilers und des Bots:

```Bash
npm run build & npm run dev
```

Alle JavaScript Dateien löschen:

```Bash
npm run clear
```

---

# Ressourcen & Links

-   http://badges.twitch.tv/v1/badges/channels/118863395/display
-   http://badges.twitch.tv/v1/badges/global/display
-   https://fontawesome.com/cheatsheet/free/brands
-   ...

# services:

-   [x] Twitch
-   [x] Discord
-   [x] Spotify
-   [ ] Streamelements
-   [x] Teamspeak
-   [ ] PUBG https://documentation.pubg.com/en/status-endpoint.html
-   [ ] Battlefield https://www.reddit.com/r/BattlefieldV/comments/9yiysd/battlefield_5_stats_api_question_any_software/
-   [ ] OBS https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/
-   [ ] Streamlabs
-   [ ] Youtube

---

# TODOs:

-   badges als array in user: `[{name, version}]`
-   README in englisch

-   [ ] Activities

    -   [x] Streamelements
        -   [ ] Follower
        -   [ ] Donations
    -   [ ] Subs
    -   [x] Cheers
    -   [ ] Host
    -   [ ] Raid
    -   [ ] Stream Sessions
        -   [ ] New Viewer

-   [ ] Overlay
    -   [ ] Alerts für Activities
    -   [ ] Activity Feed
