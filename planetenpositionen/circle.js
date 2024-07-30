// Planetenbewegung

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

var canvasdate = new Date();

var days = daysToEpoch2010(canvasdate);

function formattedDate() {
    let year = canvasdate.getFullYear(); // 2019
    let month = canvasdate.getMonth() + 1;
    let date = canvasdate.getDate(); // 23

    if (month < 10) {
        month = "0" + month;
    }

    if (date < 10) {
        date = "0" + date;
    }

    return year + "-" + month + "-" + date;
}


function updateCanvasDate() {
    let year = canvasdate.getFullYear(); // 2019
    let month = canvasdate.getMonth() + 1;
    let date = canvasdate.getDate(); // 23

    if (month < 10) {
        month = "0" + month;
    }

    if (date < 10) {
        date = "0" + date;
    }

    // document.getElementById('datum').innerHTML = new Intl.DateTimeFormat('de').format(canvasdate);
    document.getElementById('datum').innerHTML = year + "-" + month + "-" + date;
}



function draw() {
    updateCanvasDate();
    // context.clearRect(0, 0, canvas.width, canvas.height);

    drawPlanet(center, { "planetcolor": "#fff", "planetsize": 2 });
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Mercury));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Venus));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Earth), { "planetcolor": "#1c91eb", "planetsize": 4 });
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Mars));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Jupiter), { "planetcolor": "#a66226", "planetsize": 7 });
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Saturn));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Uranus));
    drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Neptune), { "planetcolor": "#aaf", "planetsize": 6 });

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
    context.fillRect(x - planetsize / 2, y - planetsize / 2, planetsize, planetsize);
}




const svg = document.querySelector("svg");

// variable for the namespace 
const svgns = "http://www.w3.org/2000/svg";


// make a simple rectangle
// let newRect = document.createElementNS(svgns, "rect");

// newRect.setAttribute("x", "150");
// newRect.setAttribute("y", "150");
// newRect.setAttribute("width", "100");
// newRect.setAttribute("height", "100");
// newRect.setAttribute("fill", "#5cceee");

// // append the new rectangle to the svg
// svg.appendChild(newRect);

// let newCircle = document.createElementNS(svgns, "ellipse");
// newCircle.setAttribute("cx", "50%");
// newCircle.setAttribute("cy", "50%");
// newCircle.setAttribute("rx", "40%");
// newCircle.setAttribute("ry", "40%");
// newCircle.setAttribute("fill", "rgba(100,150,0,0.5)");

// svg.appendChild(newCircle);

const border = 2;
const width = 4;
for (i = 0; i < 9; i++) {
    let clearCircle = document.createElementNS(svgns, "ellipse");

    radius = 50 - border - i * width;
    clearCircle.setAttribute("cx", "50%");
    clearCircle.setAttribute("cy", "50%");
    clearCircle.setAttribute("rx", radius + "%");
    clearCircle.setAttribute("ry", radius + "%");
    clearCircle.setAttribute("fill", "rgba(0,0,0,1)");

    // svg.appendChild(clearCircle);

    let newCircle = document.createElementNS(svgns, "ellipse");
    newCircle.setAttribute("cx", "50%");
    newCircle.setAttribute("cy", "50%");
    newCircle.setAttribute("rx", radius + "%");
    newCircle.setAttribute("ry", radius + "%");

    // green
    // newCircle.setAttribute("fill", "rgba(0, " + (i * 20 + 100) + ", 0, 1)");

    // grey
    // let c = (i * 20 + 50);
    // newCircle.setAttribute("fill", "rgba("+(c-0)+","+(c-0)+","+(c+0)+", 1 )");

    // darkblue
    c = ((i % 2) * 20 + 80);
    newCircle.setAttribute("fill", "rgba(" + (0) + "," + (5) + "," + (c) + ", 1)");

    svg.appendChild(newCircle);
}


// for (i = 0; i < 9; i++) {

//     radius = 50 - border - i * width;

//     if (i != 0) {

//         addLabel((radius + width / 2 - 13), "text");
//         addPlanet(radius + width / 2, 0.5, Math.round(Math.random() * 360), "rgba(100, 100 , 100, 1)");
//     }


// }

let record;

i = 1;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Neptune);
addLabel((radius + width / 2 - 13), "Merkur");
addPlanet(radius + width / 2, 2, record["lp"], "rgba(3, 182, 252, 1)");
i = 2;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Uranus);
addLabel((radius + width / 2 - 13), "Venus");
addPlanet(radius + width / 2, 1.8, record["lp"], "rgba(3, 98, 252, 1)");
i = 3;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Saturn);
addLabel((radius + width / 2 - 13), "Erde");
addPlanet(radius + width / 2, 1.5, record["lp"], "rgba(200, 200, 150, 1)");
addPlanet(radius + width / 2, 0.8, record["lp"], "rgba(185, 154, 108, 1)");
i = 4;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Jupiter);
addLabel((radius + width / 2 - 13), "Mars");
addPlanet(radius + width / 2, 2, record["lp"], "rgba(213, 154, 113, 1)");
addPlanet(radius + width / 2 + 0.5, 0.5, record["lp"], "rgba(143, 29, 1, 1)");
i = 5;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Mars);
addLabel((radius + width / 2 - 13), "Jupiter");
addPlanet(radius + width / 2, 0.8, record["lp"], "rgba(203, 50, 24, 1)");
i = 6;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Earth);
addLabel((radius + width / 2 - 13), "Saturn");
addPlanet(radius + width / 2, 1, record["lp"], "rgba(3, 107, 252, 1)");
i = 7;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Venus);
addLabel((radius + width / 2 - 13), "Uranus");
addPlanet(radius + width / 2, 1, record["lp"], "rgba(215, 214, 210)");
i = 8;
radius = 50 - border - i * width;
record = heliocentricLongitude(days, planetaryOrbitConfiguration.Mercury);
addLabel((radius + width / 2 - 13), "Neptun");
addPlanet(radius + width / 2, 0.5, record["lp"], "rgba(136, 134, 137, 1)");


//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Mercury));
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Venus));
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Earth), {"planetcolor":"#1c91eb", "planetsize":4});
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Mars));
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Jupiter),{"planetcolor":"#a66226", "planetsize":7});
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Saturn));
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Uranus));
//drawPlanet(heliocentricLongitude(days, planetaryOrbitConfiguration.Neptune),{"planetcolor":"#aaf", "planetsize":6});






// black hole
let newCircle = document.createElementNS(svgns, "ellipse");
newCircle.setAttribute("cx", "50%");
newCircle.setAttribute("cy", "50%");
newCircle.setAttribute("rx", radius + "%");
newCircle.setAttribute("ry", radius + "%");
newCircle.setAttribute("fill", "rgba(0, 0 , 0, 1)");

svg.appendChild(newCircle);

// sun
radius = 6;
let sun = document.createElementNS(svgns, "ellipse");
sun.setAttribute("cx", "50%");
sun.setAttribute("cy", "50%");
sun.setAttribute("rx", radius + "%");
sun.setAttribute("ry", radius + "%");
sun.setAttribute("fill", "rgba(250, 250 , 0, 1)");

svg.appendChild(sun);

addDate(formattedDate());

// addPlanet(40, 0.5, 90, "rgba(255, 0 , 0, 1)");
// addPlanet(30, 1.5, 190, "rgba(200, 0 , 0, 1)");

// // planets
// radius = 0.5;
// let p = document.createElementNS(svgns, "ellipse");
// // x [ 0 ... 50 ... 100% ]
// // y [ 0 ... 50 ... 100% ]
// // center: 50%/50%
// let arc = 190.0;
// let bahnradius = 40;
// let x = 50 + bahnradius * Math.cos(degree2rad(arc - 90));
// let y = 50 + bahnradius * Math.sin(degree2rad(arc - 90));
// console.log(x, y);
// p.setAttribute("cx", x + "%");
// p.setAttribute("cy", y + "%");
// p.setAttribute("rx", radius + "%");
// p.setAttribute("ry", radius + "%");
// p.setAttribute("fill", "rgba(255, 0 , 0, 1)");

// svg.appendChild(p);

function degree2rad(x) {
    return x * Math.PI / 180.0;
}

function addPlanet(bahnradius, radius, winkel, color) {
    let p = document.createElementNS(svgns, "ellipse");
    // x [ 0 ... 50 ... 100% ]
    // y [ 0 ... 50 ... 100% ]
    // center: 50%/50%
    console.log(winkel);
    // let x = 50 + bahnradius * Math.cos(degree2rad(winkel - 90));
    // let y = 50 + bahnradius * Math.sin(degree2rad(winkel - 90));
    let x = 50 + bahnradius * Math.sin(degree2rad(winkel));
    let y = 50 + bahnradius * Math.cos(degree2rad(winkel));
    p.setAttribute("cx", x + "%");
    p.setAttribute("cy", y + "%");
    p.setAttribute("rx", radius + "%");
    p.setAttribute("ry", radius + "%");
    p.setAttribute("fill", color);
    svg.appendChild(p);
}

function addLabel(y, text) {
    let label = document.createElementNS(svgns, "text");
    label.setAttribute("x", "50%");
    label.setAttribute("y", (radius + width / 2 - 13) + "%");
    label.setAttribute("fill", "grey");
    label.setAttribute("font-size", "8");
    label.setAttribute("font-family", "sans-serif");
    label.setAttribute("text-anchor", "middle");
    label.textContent = text;
    svg.appendChild(label);
}

function addDate(text) {
    let label = document.createElementNS(svgns, "text");
    label.setAttribute("x", "50%");
    label.setAttribute("y", "50%");
    label.setAttribute("fill", "grey");
    label.setAttribute("font-size", "8");
    label.setAttribute("font-family", "sans-serif");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dy", "3px");
    label.textContent = text;
    svg.appendChild(label);
}

