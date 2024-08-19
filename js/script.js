// Config Firebase 
let firebaseConfig = {
    apiKey: "AIzaSyBQdYwq_0SrcwNTF5nVHKF-NH7XeYl1Ebc",
    authDomain: "web-app-b753a.firebaseapp.com",
    databaseURL: "https://web-app-b753a-default-rtdb.firebaseio.com",
    projectId: "web-app-b753a",
    storageBucket: "web-app-b753a.appspot.com",
    messagingSenderId: "345442976434",
    appId: "1:345442976434:web:f2b22ef5e1809811063fab",
    measurementId: "G-DV6KJSY0E5"
};

// Firebase
let app = firebase.initializeApp(firebaseConfig);
let analytics = firebase.analytics();

function ontapButton(buttonType){
    logEventWithDetails(buttonType,{
    
})
}
// Event detail
function logEventWithDetails(eventName, additionalParams = {}) {
    // Lấy thông tin thiết bị và trình duyệt
    let platformInfo = platform.parse(navigator.userAgent);
    let platformName = platformInfo.os.family;
    let osVersion = platformInfo.os.version;
    let deviceName = platformInfo.name;
    let userAgent = navigator.userAgent;
    let language = navigator.language;
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;
    let locationCountry = "unknown";

    // Get info device
    let mobileModelName = platformInfo.product;
    let description = platformInfo.description;
    let layout = platformInfo.layout;
    let brand = platformInfo.manufacturer;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let { latitude, longitude } = position.coords;
            locationCountry = `Lat: ${latitude}, Lon: ${longitude}`;

            sendLogEvent(eventName, platformName, osVersion, deviceName, userAgent, language, screenWidth,
                screenHeight, locationCountry, mobileModelName, description, layout, brand, additionalParams);
        }, (error) => {
            sendLogEvent(eventName, platformName, osVersion, deviceName, userAgent, language, screenWidth,
                screenHeight, locationCountry, mobileModelName, description, layout, brand, additionalParams);
        });
    } else {
        sendLogEvent(eventName, platformName, osVersion, deviceName, userAgent, language, screenWidth,
            screenHeight, locationCountry, mobileModelName, description, layout, brand, additionalParams);
    }
}

function sendLogEvent(eventName, platform, osVersion, deviceName, userAgent, language, screenWidth,
     screenHeight,locationCountry, mobileModelName, description,layout,brand,additionalParams) {
    let eventParams = {
        platform: platform,
        os_version: osVersion,
        device_name: deviceName,
        user_agent: userAgent,
        language: language,
        screen_width: screenWidth,
        screen_height: screenHeight,
        location_country: locationCountry,
        mobile_model_name: mobileModelName,
        description: description,
        layout: layout,
        brand: brand,
        ...additionalParams
    };

    firebase.analytics().logEvent(eventName, eventParams);
    console.log(`${eventName} event logged with details:`, eventParams);
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Event click image
    let images = document.querySelectorAll('img');
    images.forEach((img, index) => {
        img.addEventListener('click', () => logEventWithDetails('image_click', {
            content_type: 'image',
            content_id: `image${index + 1}`
        }));
    });

    // Event scroll
    let lastRecordedScrollPercent = 0;
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollHeight = document.documentElement.scrollHeight;
        let scrollPercent = (scrollTop / (scrollHeight - window.innerHeight)) * 100;

        // Scroll 10% page
        if (Math.abs(scrollPercent - lastRecordedScrollPercent) >= 10) {
            lastRecordedScrollPercent = Math.floor(scrollPercent / 10) * 10;
            logEventWithDetails('scroll_event', {
                scroll_top: scrollTop,
                scroll_percent: scrollPercent
            });
        }
    });
});
