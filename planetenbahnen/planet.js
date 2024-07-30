console.log("PLANETENPOSITIONEN");

planetaryOrbitConfiguration = {
    Mercury: {
        tropical: 0.24085,
        epsilon: 75.5671,
        omega_p: 77.612,
        e: 0.205627,
        a: 0.387098,
        i: 7.0051,
        omega_a: 48.449,
        theta_0: 6.74,
        ny_0: -0.42,
    },
    Venus: {
        tropical: 0.615207,
        epsilon: 272.30044,
        omega_p: 131.54,
        e: 0.006812,
        a: 0.723329,
        i: 3.3947,
        omega_a: 76.769,
        theta_0: 16.92,
        ny_0: -4.40
    },
    Earth: {
        tropical: 0.999996,
        epsilon: 99.556772,
        omega_p: 103.2055,
        e: 0.016671,
        a: 0.999985,
        i: null,
        omega_a: null,
        theta_0: null,
        ny_0: null
    },
    Mars: {
        tropical: 1.880765,
        epsilon: 109.09646,
        omega_p: 336.217,
        e: 0.093348,
        a: 1.523689,
        i: 1.8497,
        omega_a: 49.632,
        theta_0: 9.36,
        ny_0: -1.52
    },
    Jupiter: {
        tropical: 11.857911,
        epsilon: 337.917132,
        omega_p: 14.6633,
        e: 0.048907,
        a: 5.20278,
        i: 1.3035,
        omega_a: 100.595,
        theta_0: 196.74,
        ny_0: -9.40
    },
    Saturn: {
        tropical: 29.310579,
        epsilon: 172.398316,
        omega_p: 89.567,
        e: 0.053853,
        a: 9.51134,
        i: 2.4873,
        omega_a: 113.752,
        theta_0: 165.60,
        ny_0: -8.88
    },
    Uranus: {
        tropical: 84.039492,
        // wrong value in book. correct value in errata : see next line. epsilon: 271.063148,
        epsilon: 356.1354000,
        omega_p: 172.884833,
        e: 0.046321,
        a: 19.21814,
        i: 0.773059,
        omega_a: 73.926961,
        theta_0: 65.80,
        ny_0: -7.19
    },
    Neptune: {
        tropical: 165.84539,
        epsilon: 326.895127,
        omega_p: 23.07,
        e: 0.010483,
        a: 30.1985,
        i: 1.7673,
        omega_a: 131.879,
        theta_0: 62.20,
        ny_0: -6.87
    }
}

// console.log(planetaryOrbitConfiguration.Earth.epsilon);
var epoch2010 = new Date(2010, 0, 0, 0, 0, 0, 0);

function daysEpoch2010(y, m, d) {

    let actualDate = new Date(y, m - 1, d, 0, 0, 0, 0);

    return (actualDate.getTime() - epoch2010.getTime()) / (1000. * 60. * 60. * 24.);
}

function daysToEpoch2010(date) {
    return (date.getTime() - epoch2010.getTime()) / (1000. * 60. * 60. * 24.);
}


// console.log(daysEpoch2010(2010, 1, 1)); // 0
// console.log(daysEpoch2010(2010, 1, 2)); // 1
// console.log(daysEpoch2010(2012, 1, 1)); // 730


function heliocentricLongitude(days, planet) {

    T = planet.tropical;
    epsilon = planet.epsilon;
    omega = planet.omega_p;
    e = planet.e;

    // console.log(days, T, epsilon, omega, e);

    let m = (360. / 365.242191 * days / T) % 360;
    if (m < 0) { m += 360; }
    // console.log("m,m);

    let mp = m + epsilon - omega;
    // console.log("mp,mp);

    let nyp = (mp + 360. / Math.PI * e * Math.sin(mp * Math.PI / 180)) % 360;
    if (nyp < 0) { nyp += 360; }
    // console.log("nyp,nyp);

    let lp = (nyp + omega) % 360;
    if (lp < 0) { lp += 360; }
    // console.log("lp,lp);

    let r = planet.a * (1. - planet.e * planet.e) / (1 + planet.e * Math.cos(nyp * Math.PI / 180.));
    return { lp, r };
}

let days20031122 = daysEpoch2010(2003, 11, 22);
// console.log(days20031122); // -2231

let l = heliocentricLongitude(days20031122, planetaryOrbitConfiguration.Jupiter);
console.log(l);

let center = { "lp": 0, "r": 0 };

// let days = daysEpoch2010(2020,11,13);
// var days = daysEpoch2010(2020, 11, 16);


// let days = daysEpoch2010(2019, 1, 1);
// console.log("Merkur ", heliocentricLongitude(days, planetaryOrbitConfiguration.Mercury));
// console.log("Venus  ", heliocentricLongitude(days, planetaryOrbitConfiguration.Venus));
// console.log("Erde   ", heliocentricLongitude(days, planetaryOrbitConfiguration.Earth));
// console.log("Mars   ", heliocentricLongitude(days, planetaryOrbitConfiguration.Mars));
// console.log("Jupiter", heliocentricLongitude(days, planetaryOrbitConfiguration.Jupiter));
// console.log("Saturn ", heliocentricLongitude(days, planetaryOrbitConfiguration.Saturn));
// console.log("Uranus ", heliocentricLongitude(days, planetaryOrbitConfiguration.Uranus));
// console.log("Neptun ", heliocentricLongitude(days, planetaryOrbitConfiguration.Neptune));

var faktor = 10;


var canvas = document.getElementById('planetcanvas');
var context = canvas.getContext('2d');

var canvasdate = new Date();

var days = daysToEpoch2010(canvasdate);

function updateCanvasDate() {
    let year = canvasdate.getFullYear(); // 2019
    let month = canvasdate.getMonth() + 1;
    let date = canvasdate.getDate(); // 23

    if(month < 10) {
        month = "0"+month;
    }

    if(date < 10) {
        date = "0"+date;
    }

    // document.getElementById('datum').innerHTML = new Intl.DateTimeFormat('de').format(canvasdate);
    document.getElementById('datum').innerHTML = year+"-"+month+"-"+date;
}


function addDaysToDate(date, daystoadd) {
    var result = new Date(date);
    result.setDate(result.getDate() + daystoadd);
    return result;
}

function addDays(numberOfDays) {
    canvasdate = addDaysToDate(canvasdate, numberOfDays);
    days = daysToEpoch2010(canvasdate);
    //days += numberOfDays;
    draw();
}

function today(){
    canvasdate = new Date();
    days = daysToEpoch2010(canvasdate);
    redraw();
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    draw();
}

function zoomIn() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    faktor *= 2;
    draw();
}

function zoomOut() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    faktor /= 2;
    draw();
}


function draw() {
    updateCanvasDate();
    // context.clearRect(0, 0, canvas.width, canvas.height);

    drawPlanet(center, {"planetcolor":"#fff", "planetsize":2});
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Mercury));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Venus));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Earth), {"planetcolor":"#1c91eb", "planetsize":4});
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Mars));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Jupiter),{"planetcolor":"#a66226", "planetsize":7});
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Saturn));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Uranus));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Neptune),{"planetcolor":"#aaf", "planetsize":6});

}

function drawPlanet(position, options) {
    let x = parseInt(faktor * position.r * Math.sin(position.lp * Math.PI / 180.) + canvas.width / 2);
    let y = parseInt(faktor * position.r * Math.cos(position.lp * Math.PI / 180.) + canvas.height / 2);

    let planetsize;

    if (options) {
        context.fillStyle = options.planetcolor;
        planetsize = options.planetsize;
    } else {
        context.fillStyle = "#FF0000";
        planetsize = 2;
    }
    context.fillRect(x - planetsize/2, y - planetsize/2, planetsize, planetsize);
}


window.addEventListener("load", function () {

    function resize() {
        let canvasRatio = canvas.height / canvas.width;
        let windowRatio = window.innerHeight / window.innerWidth;
        let width;
        let height;

        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        } else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width;
        canvas.height = height;
        draw();
    }
    window.addEventListener("resize", resize);
    resize();
});