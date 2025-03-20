# Frontend
https://mindhive-assessement-frontend.onrender.com 
A Vue3 single page application to display all the Subway branches located in Kuala Lumpur hosted on Render. Loads a Google Map to display current location as well as all branches. Subway branches are also displayed on a list which can be filtered, and a chatbot to ask any questions.

NOTE: If you happen to see the subway list blank or a slow UI rendering, it is most likely cause Render throttled the APIs and rendering due to it being in the free tiers, so it may take some time for it to fully load.

### How to locally run
<ol>
    <li>Clone and cd into the repo</li>
    <li>`npm i`</li>
    <li>`npm run dev`</li>
    <li>Webpage should be accessible at http://localhost:3000 (default port), but enviromental files will still be needed as well as location access from browser (anti viruses and trackers may affect functionaility of map)</li>
</ol>


### Libraries
Vue3 - JS frontend framework, used cause I'm most familliar with it\
Tailwind - Styling framework to ease styling work\
vue3-tabs-component - A tab component to swap between filters and chatbot to avoid flooding the sidebar\
vue3-google-map - Renders the map component to display geolocation of Subway branches

### Enviromental Files
VITE_API_URL\
VITE_MAPS_API_KEY
