/* =========================================================================
   Kurds for Christ — prototype script (front-end only).
   1. Renders shared layout (header, mega menu, drawer, footer, dialogs)
   2. Renders brand illustrations (emblem, hero, scenes, dot world map)
   3. Simulated interactions (language preview, filters, donation, demo forms)
   Nothing typed into this prototype is ever sent or stored.
   ========================================================================= */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  var prefs = { /* remembered across visits (language choice) */
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var C = { gold: "#E0A526", gold2: "#F2C14E", green: "#17573A", green2: "#0F3F29", green3: "#0A2B1C", ivory: "#FBF8F2", red: "#A8231B" };
  var current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (current.indexOf(".html") === -1) current = "index.html";

  function ic(name) { return '<i data-lucide="' + name + '" aria-hidden="true"></i>'; }
  function icoBox(name, mod) { return '<span class="ico ' + (mod || "") + '">' + ic(name) + "</span>"; }

  /* ---------------------------------------------------------- geometry */
  var uidN = 0;
  function uid(p) { uidN += 1; return p + uidN; }
  function rays(cx, cy, r1, r2, n, frac, fill, opacity) {
    n = n || 21; frac = frac || 0.42;
    var step = 2 * Math.PI / n, half = step * frac / 2, d = "";
    for (var i = 0; i < n; i++) {
      var a = -Math.PI / 2 + i * step;
      d += "M" + (cx + r1 * Math.cos(a - half)).toFixed(2) + " " + (cy + r1 * Math.sin(a - half)).toFixed(2) +
        "L" + (cx + r2 * Math.cos(a)).toFixed(2) + " " + (cy + r2 * Math.sin(a)).toFixed(2) +
        "L" + (cx + r1 * Math.cos(a + half)).toFixed(2) + " " + (cy + r1 * Math.sin(a + half)).toFixed(2) + "Z";
    }
    return '<path d="' + d + '" fill="' + fill + '"' + (opacity != null ? ' opacity="' + opacity + '"' : "") + "/>";
  }

  function markSvg() {
    var id = uid("mk");
    return '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><clipPath id="' + id + '"><circle cx="32" cy="32" r="17"/></clipPath></defs>' +
      rays(32, 32, 19.5, 31, 21, 0.5, C.gold) +
      '<circle cx="32" cy="32" r="17" fill="' + C.gold + '"/>' +
      '<g clip-path="url(#' + id + ')"><path d="M12 50 L21 38 L26 42 L32 34.5 L38 41.5 L42.5 37 L54 50Z" fill="' + C.green + '"/></g>' +
      '<path d="M30.4 16.5h3.2v18.5h-3.2z M25.8 21.6h12.4v3.1H25.8z" fill="' + C.ivory + '"/></svg>';
  }

  function emblemSvg() {
    var id = uid("em");
    return '<svg viewBox="0 0 400 400" aria-hidden="true" focusable="false">' +
      '<circle cx="200" cy="200" r="196" fill="none" stroke="' + C.gold2 + '" stroke-opacity=".45"/>' +
      '<circle cx="200" cy="200" r="150" fill="none" stroke="' + C.gold2 + '" stroke-opacity=".3" stroke-dasharray="2 6"/>' +
      rays(200, 200, 98, 186, 21, 0.36, C.gold2, 0.95) +
      '<circle cx="200" cy="200" r="88" fill="' + C.gold + '"/>' +
      '<clipPath id="' + id + '"><circle cx="200" cy="200" r="88"/></clipPath>' +
      '<g clip-path="url(#' + id + ')"><path d="M80 320 L150 240 L180 262 L200 236 L232 266 L254 246 L330 320Z" fill="' + C.green + '"/></g>' +
      '<path d="M192 138h16v100h-16z M168 164h64v15h-64z" fill="' + C.ivory + '"/></svg>';
  }

  function heroArt() {
    var g = uid("hg"), s = uid("hs");
    return '<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><defs>' +
      '<linearGradient id="' + s + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B2419"/><stop offset=".45" stop-color="#1B4532"/><stop offset=".72" stop-color="#7C6A33"/><stop offset=".86" stop-color="#D49B3A"/><stop offset="1" stop-color="#F0C46A"/></linearGradient>' +
      '<radialGradient id="' + g + '" cx="1120" cy="600" r="520" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFE3A1" stop-opacity=".75"/><stop offset=".35" stop-color="#F2C14E" stop-opacity=".25"/><stop offset="1" stop-color="#F2C14E" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="1600" height="900" fill="url(#' + s + ')"/><circle cx="1120" cy="600" r="520" fill="url(#' + g + ')"/>' +
      rays(1120, 600, 130, 760, 21, 0.16, "#FBE3A6", 0.13) +
      '<circle cx="1120" cy="600" r="96" fill="#FBE3A6"/><circle cx="1120" cy="600" r="80" fill="#FFF3D1"/>' +
      '<path d="M0 640 L120 566 L210 600 L330 506 L450 580 L560 522 L700 598 L820 540 L960 590 L1080 528 L1200 572 L1330 486 L1460 560 L1600 520 V900 H0Z" fill="#5B6B4B" opacity=".75"/>' +
      '<path d="M0 700 L140 636 L260 688 L400 606 L520 668 L640 626 L780 700 L900 650 L1040 702 L1180 622 L1300 680 L1440 640 L1600 690 V900 H0Z" fill="#2F4F3A"/>' +
      '<path d="M0 780 L180 718 L320 768 L470 698 L620 760 L760 728 L900 790 L1060 742 L1220 790 L1380 728 L1600 782 V900 H0Z" fill="#183626"/>' +
      '<g fill="#183626"><path d="M1377.5 690h5v40h-5z"/><path d="M1368 702h24v4.5h-24z"/></g>' +
      '<path d="M0 860 Q400 800 800 850 T1600 836 V900 H0Z" fill="#0B2419"/></svg>';
  }

  var PAL = {
    green: ["#123A28", "#2A5A42", "#1C4431", "#0E2E20", "#F2C14E"],
    dawn: ["#3A3220", "#6E5A2E", "#3C4A33", "#1E3326", "#FBE3A6"],
    ink: ["#1A1E1B", "#3A3A30", "#2B2B24", "#151815", "#E0A526"],
    sand: ["#B9A985", "#8E7F5C", "#6F6448", "#4A4231", "#FBE3A6"],
    red: ["#3B1512", "#6E2A20", "#4C1E18", "#2A0E0B", "#F2C14E"]
  };
  function scene(kind, palette, sun) {
    var p = PAL[palette] || PAL.green, sky = p[0], far = p[1], mid = p[2], near = p[3], sc = p[4];
    var sx = Math.round(800 * sun[0]), sy = Math.round(600 * sun[1]), extra = "";
    if (kind === "church") {
      extra = '<g fill="' + near + '"><path d="M330 420 L330 300 L400 250 L470 300 L470 420Z"/><path d="M392 180h16v40h-16z M380 196h40v12h-40z"/><path d="M380 220h40v40h-40z"/><path d="M470 420 V330 H600 V420Z"/></g>' +
        '<g fill="' + sc + '" opacity=".85"><path d="M388 340 a12 12 0 0 1 24 0 v34 h-24z"/><path d="M500 350 a10 10 0 0 1 20 0 v26 h-20z M545 350 a10 10 0 0 1 20 0 v26 h-20z"/></g>';
    } else if (kind === "people") {
      var figs = [[300, 1], [360, 1.15], [420, 0.8], [470, 1.05], [530, 0.95], [585, 0.7]], gg = "";
      figs.forEach(function (f) {
        var x = f[0], k = f[1], h = 120 * k;
        gg += '<circle cx="' + x + '" cy="' + Math.round(470 - h - 18 * k) + '" r="' + (16 * k).toFixed(1) + '"/>' +
          '<path d="M' + Math.round(x - 26 * k) + " 470 Q" + Math.round(x - 26 * k) + " " + Math.round(470 - h) + " " + x + " " + Math.round(470 - h) +
          " Q" + Math.round(x + 26 * k) + " " + Math.round(470 - h) + " " + Math.round(x + 26 * k) + ' 470Z"/>';
      });
      extra = '<g fill="' + near + '">' + gg + "</g>";
    } else if (kind === "book") {
      extra = '<g transform="translate(400 330)"><path d="M-150 40 Q-75 0 0 30 Q75 0 150 40 V140 Q75 100 0 130 Q-75 100 -150 140Z" fill="' + C.ivory + '" opacity=".92"/>' +
        '<path d="M0 30 V130" stroke="' + near + '" stroke-width="3"/><path d="M-9 -70h18v70h-18z M-34 -48h68v16h-68z" fill="' + sc + '"/></g>';
    } else if (kind === "hands") {
      extra = '<g fill="' + C.ivory + '" opacity=".9"><path d="M250 470 Q260 360 340 330 L420 320 Q440 322 436 340 L380 360 L470 352 Q490 356 480 376 L360 410 Q320 430 300 470Z"/>' +
        '<path d="M550 470 Q540 360 460 330 L380 320 Q360 322 364 340 L420 360 L330 352 Q310 356 320 376 L440 410 Q480 430 500 470Z" opacity=".7"/></g>';
    } else if (kind === "mic") {
      extra = '<g transform="translate(400 300)"><rect x="-34" y="-110" width="68" height="130" rx="34" fill="' + C.ivory + '" opacity=".92"/>' +
        '<path d="M-62 -10 a62 62 0 0 0 124 0" fill="none" stroke="' + C.ivory + '" stroke-width="10" opacity=".85"/><path d="M-5 52h10v50h-10z" fill="' + C.ivory + '"/></g>';
    } else if (kind === "tent") {
      extra = '<path d="M260 470 L370 330 L480 470Z" fill="' + C.ivory + '" opacity=".9"/><path d="M370 330 L370 470" stroke="' + near + '" stroke-width="4"/><path d="M430 470 L520 360 L610 470Z" fill="' + C.ivory + '" opacity=".7"/>';
    } else if (kind === "lamp") {
      extra = '<g transform="translate(400 380)"><path d="M-110 30 Q-60 -40 60 -10 L120 -40 L100 0 Q80 50 -40 50 Q-100 50 -110 30Z" fill="' + sc + '"/><path d="M120 -40 Q140 -110 110 -150 Q150 -110 128 -40Z" fill="#FFF3D1"/></g>';
    } else if (kind === "city") {
      extra = '<g fill="' + near + '"><path d="M120 470V360h50v110z M180 470V320h40v150z M230 470V380h60v90z M300 470V300h24l6-30 6 30h24v170z M370 470V350h70v120z M450 470V330h30v-30h20v30h30v140z M540 470V370h60v100z M610 470V340h40v130z"/></g>' +
        '<path d="M0 480 H800 V600 H0Z" fill="' + mid + '" opacity=".8"/>';
    }
    return '<svg class="photo__art" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
      '<rect width="800" height="600" fill="' + sky + '"/>' + rays(sx, sy, 70, 620, 21, 0.14, sc, 0.12) +
      '<circle cx="' + sx + '" cy="' + sy + '" r="58" fill="' + sc + '" opacity=".9"/>' +
      '<path d="M0 400 L110 330 L200 372 L320 290 L430 360 L540 312 L660 372 L800 320 V600 H0Z" fill="' + far + '"/>' +
      '<path d="M0 470 L150 410 L280 458 L420 400 L560 452 L700 418 L800 450 V600 H0Z" fill="' + mid + '"/>' + extra +
      '<path d="M0 530 Q200 480 400 520 T800 510 V600 H0Z" fill="' + near + '"/></svg>';
  }

  /* ---------------------------------------------------------- world map
     Equirectangular dot grid: column = (lon+180)/4.5, row = (84-lat)/4. Land only; no borders drawn. */
  var LAND = [
    [[20, 27], [30, 37]],
    [[14, 27], [29, 38], [43, 44], [52, 56], [62, 66]],
    [[12, 26], [29, 37], [56, 72]],
    [[3, 27], [30, 36], [43, 79]],
    [[2, 26], [31, 37], [42, 79]],
    [[4, 21], [24, 27], [32, 34], [41, 78]],
    [[7, 10], [12, 21], [23, 27], [38, 39], [41, 44], [45, 74], [75, 77]],
    [[12, 27], [38, 40], [41, 77]],
    [[12, 29], [39, 72]],
    [[12, 27], [39, 49], [51, 73]],
    [[12, 26], [38, 41], [42, 50], [51, 69], [71, 72]],
    [[13, 25], [38, 40], [46, 69], [70, 72]],
    [[13, 24], [38, 68], [70, 71]],
    [[14, 23], [37, 68]],
    [[15, 21], [36, 47], [48, 53], [55, 67]],
    [[16, 20], [21, 23], [36, 48], [49, 53], [56, 66]],
    [[18, 21], [36, 52], [57, 60], [62, 65], [67, 67]],
    [[19, 22], [36, 50], [57, 59], [62, 64], [67, 68]],
    [[22, 28], [37, 51], [57, 58], [62, 62], [68, 68]],
    [[23, 29], [38, 50], [62, 63], [65, 66]],
    [[23, 31], [42, 50], [61, 63], [64, 68]],
    [[22, 32], [42, 49], [62, 63], [65, 66], [72, 74]],
    [[22, 33], [43, 49], [63, 65], [71, 75]],
    [[23, 33], [43, 49], [69, 72]],
    [[24, 32], [43, 49], [50, 51], [68, 73]],
    [[24, 31], [43, 48], [50, 51], [67, 74]],
    [[25, 31], [43, 48], [50, 50], [65, 74]],
    [[25, 30], [43, 47], [65, 74]],
    [[25, 29], [43, 47], [65, 74]],
    [[25, 28], [44, 46], [66, 73], [78, 78]],
    [[25, 27], [71, 73], [77, 78]],
    [[25, 27], [72, 72], [76, 77]],
    [[25, 27]],
    [[25, 26]],
    [[26, 26]]
  ];
  var HUBS = [
    // n, label, lon, lat, dx, dy, anchor
    [1, "Liverpool (HQ)", -3.0, 53.4, -14, -12, "end", true],
    [2, "Europe", 10.0, 50.5, 14, 18, "start"],
    [3, "Kurdistan Region of Iraq", 45.0, 37.5, 14, 22, "start"],
    [4, "Syria", 36.0, 35.0, -14, 18, "end"],
    [5, "United States", -86.8, 36.2, 0, 30, "middle"],
    [6, "Diaspora", 151.0, -33.8, 0, -18, "middle"],
    [6, "", -79.4, 43.7, 0, 0, "start"],
    [6, "", 18.0, 59.3, 0, 0, "start"]
  ];
  function xy(lon, lat) { return [(lon + 180) / 4.5 * 10 + 5, (84 - lat) / 4 * 10 + 5]; }
  function worldMap() {
    var id = uid("map"), dots = "";
    LAND.forEach(function (ranges, r) {
      ranges.forEach(function (ab) { for (var c = ab[0]; c <= ab[1]; c++) dots += '<circle cx="' + (c * 10 + 5) + '" cy="' + (r * 10 + 5) + '" r="2.6"/>'; });
    });
    var hq = xy(-3.0, 53.4), arcs = "", hubs = "";
    HUBS.forEach(function (h) {
      var p = xy(h[2], h[3]), x = p[0], y = p[1];
      if (!h[7]) {
        var mx = (hq[0] + x) / 2, my = Math.min(hq[1], y) - 40 - Math.abs(x - hq[0]) * 0.12;
        arcs += '<path class="arc" d="M' + hq[0].toFixed(1) + " " + hq[1].toFixed(1) + " Q" + mx.toFixed(1) + " " + my.toFixed(1) + " " + x.toFixed(1) + " " + y.toFixed(1) + '"/>';
      }
      hubs += '<g class="hub' + (h[7] ? " hub--hq" : "") + '"><circle class="halo" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="13"/>' +
        '<circle class="core" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="8"/>' +
        '<text class="num" x="' + x.toFixed(1) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="middle">' + h[0] + "</text>" +
        (h[1] ? '<text x="' + (x + h[4]).toFixed(1) + '" y="' + (y + h[5]).toFixed(1) + '" text-anchor="' + h[6] + '">' + h[1] + "</text>" : "") + "</g>";
    });
    return '<svg class="map" viewBox="0 0 800 350" role="img" aria-labelledby="' + id + '"><title id="' + id + '">Stylised dot map of the world showing land only, with no borders. Numbered points mark where Kurds for Christ hopes to connect Kurdish Christian communities: 1 Liverpool headquarters, 2 Europe, 3 Kurdistan Region of Iraq, 4 Kurdish communities in Syria, 5 United States, 6 the global diaspora.</title>' +
      '<g class="land">' + dots + "</g>" + arcs + hubs + "</svg>";
  }
  var LEGEND = [
    [1, "United Kingdom", "Headquarters in Liverpool, England", true],
    [2, "Europe", "Kurdish Christian fellowships across the continent"],
    [3, "Iraq & the Kurdistan Region of Iraq", "Churches, families and partners in the homeland"],
    [4, "Syria", "Kurdish communities in Syria"],
    [5, "United States", "Kurdish Christian believers and churches"],
    [6, "Global Kurdish diaspora", "Canada, Scandinavia, Australia and beyond"]
  ];
  function mapLegend() {
    return '<ul class="map-legend" aria-label="Regions in our long-term vision">' + LEGEND.map(function (l) {
      return '<li><span class="n' + (l[3] ? " n--hq" : "") + '" aria-hidden="true">' + l[0] + "</span><div><strong>" + l[1] + "</strong><span>" + l[2] + "</span></div></li>";
    }).join("") + "</ul>";
  }

  /* ---------------------------------------------------------- layout data */
  var PROGRAMMES = [
    ["Faith &amp; Mission", "faith-mission.html", "cross", "Evangelism, Bible teaching, prayer, worship and discipleship."],
    ["Missionary Support", "mission-partners.html", "compass", "Supporting missionaries, pastors and Christian workers."],
    ["Churches", "churches.html", "church", "Supporting Kurdish Christian churches, fellowships and future church development."],
    ["Community", "community.html", "users", "Practical support, integration and community development."],
    ["Relief", "relief.html", "hand-heart", "Humanitarian assistance for people facing hardship, displacement or crisis."],
    ["Education &amp; Skills", "community.html#education", "graduation-cap", "Language, employability, digital skills, mentoring and vocational education."],
    ["Kurdish Christian Heritage", "heritage.html", "mountain-snow", "Language, history, testimony, culture and intergenerational heritage."],
    ["Digital Mission", "faith-mission.html#digital", "podcast", "Christian media, video, podcasts, Kurdish resources and online outreach."]
  ];
  var NAV = [["About", "about.html"], ["What We Do", "what-we-do.html"], ["Faith &amp; Mission", "faith-mission.html"], ["Community", "community.html"],
    ["Heritage", "heritage.html"], ["Global", "global.html"], ["Get Involved", "get-involved.html"], ["News", "news.html"], ["Contact", "contact.html"]];
  var WWD = ["what-we-do.html", "mission-partners.html", "churches.html", "relief.html", "stories.html"];
  var LANGS = [["EN", "English", "en"], ["KU", "Kurdî — Kurmanji", "kmr"], ["SO", "کوردی — Sorani", "ckb"], ["AR", "العربية — Arabic", "ar"]];

  function langSelector(labelledBy) {
    return '<div class="lang" role="group" ' + (labelledBy ? 'aria-labelledby="' + labelledBy + '"' : 'aria-label="Language"') + ">" +
      LANGS.map(function (l) {
        return '<button type="button" data-lang="' + l[0] + '" aria-pressed="' + (l[0] === "EN") + '" title="' + l[1] + '"><span aria-hidden="true">' + l[0] + '</span><span class="visually-hidden">' + l[1] + "</span></button>";
      }).join("") + "</div>";
  }

  function headerHtml() {
    var items = NAV.map(function (n) {
      if (n[1] === "what-we-do.html") {
        return '<li><button class="nav-btn' + (WWD.indexOf(current) > -1 ? " is-current" : "") + '" type="button" aria-expanded="false" aria-controls="mega-wwd">' + n[0] + " " + ic("chevron-down") + "</button></li>";
      }
      return '<li><a href="' + n[1] + '"' + (n[1] === current ? ' aria-current="page"' : "") + ">" + n[0] + "</a></li>";
    }).join("");
    var mega = PROGRAMMES.map(function (p) {
      return '<li><a href="' + p[1] + '">' + icoBox(p[2], "ico--sm") + '<span><strong>' + p[0] + '</strong><span class="d">' + p[3] + "</span></span></a></li>";
    }).join("") + '<li><a href="stories.html">' + icoBox("quote", "ico--sm ico--green") + '<span><strong>Stories &amp; Testimonies</strong><span class="d">Faith, community, mission and heritage stories.</span></span></a></li>';
    var dnav = NAV.map(function (n) {
      return '<li><a href="' + n[1] + '"' + (n[1] === current ? ' aria-current="page"' : "") + ">" + n[0] + ic("arrow-right") + "</a></li>";
    }).join("");
    var dsub = PROGRAMMES.map(function (p) { return '<li><a href="' + p[1] + '">' + p[0] + "</a></li>"; }).join("") +
      '<li><a href="stories.html">Stories</a></li><li><a href="governance.html">Governance</a></li>';
    return '<a class="skip-link" href="#main">Skip to main content</a>' +
      '<div class="proto-bar" id="proto-bar" role="region" aria-label="Prototype notice"><div class="container">' +
      '<span class="proto-bar__tag">' + ic("lock") + ' Private preview</span>' +
      '<p>Pre-launch design prototype for trustee review. <span class="long">Not indexed by search engines. Donations and forms are demonstration only.</span></p>' +
      '<button type="button" data-dismiss-proto>Hide</button></div></div>' +
      '<header class="site-header" id="site-header"><div class="container header-inner">' +
      '<a class="brand" href="index.html" aria-label="Kurds for Christ — home"><span class="brand__mark"><img src="assets/logo-emblem.png" alt="" width="79" height="46"></span>' +
      '<span class="brand__text"><span class="brand__name">Kurds for Christ</span><span class="brand__tag">Faith • Community • Heritage • Hope</span></span></a>' +
      '<nav class="primary-nav" aria-label="Main"><ul>' + items + "</ul></nav>" +
      '<div class="header-actions">' + langSelector() +
      '<a class="btn btn--outline btn--sm btn--partner" href="get-involved.html#partner">Partner With Us</a>' +
      '<a class="btn btn--gold btn--sm btn--donate" href="donate.html">' + ic("heart") + " Donate</a>" +
      '<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="drawer">' + ic("menu") + " Menu</button></div></div>" +
      '<div class="mega" id="mega-wwd" hidden><div class="container mega__inner"><div class="mega__intro"><p class="eyebrow">What We Do</p>' +
      "<h2>Faith expressed in words and action.</h2><p>Eight areas of Christian mission and charitable service, developed responsibly with clear separation of funds.</p>" +
      '<a class="link-arrow" href="what-we-do.html">Overview of our work ' + ic("arrow-right") + "</a></div>" +
      '<ul class="mega__grid">' + mega + "</ul></div></div></header>" +
      '<div class="drawer" id="drawer" hidden role="dialog" aria-modal="true" aria-label="Site menu"><div class="drawer__top">' +
      '<a class="brand" href="index.html"><span class="brand__mark"><img src="assets/logo-emblem.png" alt="" width="79" height="46"></span><span class="brand__text"><span class="brand__name">Kurds for Christ</span></span></a>' +
      '<button class="drawer__close" type="button" data-close-drawer aria-label="Close menu">' + ic("x") + "</button></div>" +
      '<div class="drawer__body"><div class="drawer__ctas"><a class="btn btn--gold btn--lg" href="donate.html">' + ic("heart") + ' Donate</a><a class="btn btn--outline" href="get-involved.html#partner">Partner With Us</a></div>' +
      '<nav aria-label="Mobile"><ul class="drawer__nav">' + dnav + "</ul></nav>" +
      '<div><p class="drawer__label">Our work</p><ul class="drawer__sub">' + dsub + "</ul></div>" +
      '<div><p class="drawer__label" id="drawer-lang">Language</p>' + langSelector("drawer-lang") + "</div>" +
      '<p class="drawer__foot">Liverpool, England · info@kurdsforchrist.org<br>Charity registration pending.</p></div></div>';
  }

  function footerHtml() {
    function col(t, links) {
      return '<div class="footer-col"><h2>' + t + "</h2><ul>" + links.map(function (l) { return '<li><a href="' + l[1] + '">' + l[0] + "</a></li>"; }).join("") + "</ul></div>";
    }
    var socials = [["Facebook", "facebook"], ["Instagram", "instagram"], ["YouTube", "youtube"], ["X (Twitter)", "twitter"], ["LinkedIn", "linkedin"]].map(function (s) {
      return '<a href="#" data-demo="Social media profiles will be linked after launch." aria-label="' + s[0] + ' (placeholder)">' + ic(s[1]) + "</a>";
    }).join("");
    return '<footer class="site-footer on-dark"><img class="footer-sun" src="assets/sun-large.svg" alt=""><div class="container"><div class="footer-top">' +
      '<div class="footer-brand"><a class="brand" href="index.html"><span class="brand__mark"><img src="assets/logo-emblem.png" alt="" width="79" height="46"></span><span class="brand__text"><span class="brand__name">Kurds for Christ</span><span class="brand__tag">Kurdish Christian charity</span></span></a>' +
      '<p class="footer-word">KURDS FOR CHRIST</p><p class="footer-tag">Faith • Community • Heritage • Hope</p>' +
      '<address class="footer-address">Liverpool, England<br>United Kingdom</address>' +
      '<div class="footer-contact"><a href="mailto:info@kurdsforchrist.org">' + ic("mail") + ' info@kurdsforchrist.org</a><a href="index.html">' + ic("globe") + " kurdsforchrist.org</a></div>" +
      '<div class="socials" role="group" aria-label="Social media (placeholders)">' + socials + "</div></div>" +
      col("Organisation", [["About", "about.html"], ["Governance", "governance.html"], ["Trustees", "governance.html#trustees"], ["Policies", "governance.html#policies"], ["Contact", "contact.html"]]) +
      col("Our Work", [["Faith &amp; Mission", "faith-mission.html"], ["Community", "community.html"], ["Relief", "relief.html"], ["Heritage", "heritage.html"], ["Mission Partners", "mission-partners.html"], ["Churches", "churches.html"]]) +
      col("Get Involved", [["Donate", "donate.html"], ["Volunteer", "get-involved.html#volunteer"], ["Partner", "get-involved.html#partner"], ["Pray", "get-involved.html#pray"], ["Fundraise", "get-involved.html#fundraise"]]) +
      col("Legal", [["Privacy", "legal.html#privacy"], ["Cookies", "legal.html#cookies"], ["Safeguarding", "legal.html#safeguarding"], ["Terms", "legal.html#terms"]]) +
      '</div><div class="footer-bottom"><div><span class="reg-pending">' + ic("clock") + " Charity registration pending</span>" +
      '<p class="footer-statement">Intended to be established in England and Wales as a Charitable Incorporated Organisation. Kurds for Christ is not affiliated with any political party, armed organisation or political movement.</p></div>' +
      "<p>© " + new Date().getFullYear() + " Kurds for Christ · Private prototype — not for public distribution</p></div></div></footer>" +
      (current === "donate.html" ? "" : '<div class="mobile-bar" role="region" aria-label="Quick actions"><a class="btn btn--outline" href="get-involved.html">Get Involved</a><a class="btn btn--gold" href="donate.html">' + ic("heart") + " Donate</a></div>") +
      '<dialog class="dialog" id="demo-dialog" aria-labelledby="demo-dialog-title"><div class="dialog__body"><div class="dialog__icon">' + icoBox("info") + "</div>" +
      '<h2 id="demo-dialog-title">Prototype preview</h2><p id="demo-dialog-text"></p>' +
      '<p class="small muted">No information has been sent, stored or processed. Live functionality will be built in a later phase after trustee approval.</p>' +
      '<div class="btn-row"><button class="btn" type="button" data-close-dialog>Close</button></div></div></dialog>' +
      '<div class="toast" id="toast" role="status" aria-live="polite">' + ic("info") + '<span id="toast-text"></span></div>';
  }

  /* ---------------------------------------------------------- render */
  var hSlot = $("#kfc-header"), fSlot = $("#kfc-footer");
  if (hSlot) hSlot.outerHTML = headerHtml();
  if (fSlot) fSlot.outerHTML = footerHtml();
  if (current === "donate.html") document.body.classList.add("no-mobile-bar");

  $$("[data-hero-art]").forEach(function (el) { el.innerHTML = heroArt(); });
  $$("[data-emblem]").forEach(function (el) { el.innerHTML = emblemSvg(); });
  $$("[data-mark]").forEach(function (el) { el.innerHTML = markSvg(); });
  $$("[data-map]").forEach(function (el) { el.innerHTML = worldMap(); });
  $$("[data-map-legend]").forEach(function (el) { el.outerHTML = mapLegend(); });
  $$("[data-scene]").forEach(function (el) {
    var sun = (el.getAttribute("data-sun") || "0.72,0.4").split(",").map(parseFloat);
    el.insertAdjacentHTML("afterbegin", scene(el.getAttribute("data-scene"), el.getAttribute("data-palette") || "green", sun));
  });

  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons({ icons: window.lucide.icons, attrs: { "stroke-width": 1.75 } });
  }

  /* Re-apply #anchor scrolling now that the header has been inserted above the content */
  if (location.hash.length > 1) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) window.requestAnimationFrame(function () { target.scrollIntoView(); });
  }

  /* ---------------------------------------------------------- interactions */
  var bar = $("#proto-bar");
  if (bar && store.get("kfc-proto-hidden") === "1") bar.hidden = true;
  $$("[data-dismiss-proto]").forEach(function (b) {
    b.addEventListener("click", function () { bar.hidden = true; store.set("kfc-proto-hidden", "1"); });
  });

  var header = $("#site-header");
  var onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 8); };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Mega menu */
  var megaBtn = $(".nav-btn"), mega = $("#mega-wwd");
  function setMega(open) {
    if (!megaBtn || !mega) return;
    megaBtn.setAttribute("aria-expanded", open ? "true" : "false");
    mega.hidden = !open;
  }
  if (megaBtn && mega) {
    megaBtn.addEventListener("click", function (e) { e.stopPropagation(); setMega(mega.hidden); });
    document.addEventListener("click", function (e) { if (!mega.hidden && !mega.contains(e.target)) setMega(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mega.hidden) { setMega(false); megaBtn.focus(); } });
    mega.addEventListener("focusout", function (e) { if (e.relatedTarget && !mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false); });
  }

  /* Mobile drawer */
  var drawer = $("#drawer"), toggle = $(".menu-toggle"), lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.hidden = false; document.body.style.overflow = "hidden";
    toggle.setAttribute("aria-expanded", "true");
    $(".drawer__close", drawer).focus();
  }
  function closeDrawer() {
    if (drawer.hidden) return;
    drawer.hidden = true; document.body.style.overflow = "";
    toggle.setAttribute("aria-expanded", "false");
    if (lastFocus) lastFocus.focus();
  }
  if (drawer && toggle) {
    toggle.addEventListener("click", openDrawer);
    $$("[data-close-drawer]", drawer).forEach(function (b) { b.addEventListener("click", closeDrawer); });
    drawer.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab") {
        var f = $$("a, button", drawer).filter(function (x) { return x.offsetParent !== null; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { if (a.hash && a.pathname === location.pathname) closeDrawer(); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1160) closeDrawer(); });
  }

  /* Toast */
  var toast = $("#toast"), toastText = $("#toast-text"), toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toastText.textContent = msg;
    toast.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-shown"); }, 4200);
  }

  /* Language selector: swaps every visible string using the dictionaries in i18n/<code>.js.
     The English text in the HTML is the key; anything without a translation stays in English. */
  var I18N = window.KFC_I18N = window.KFC_I18N || {};
  var LANG = "EN";
  var LANG_FILE = { KU: "kmr", SO: "ckb", AR: "ar" };
  var HTML_LANG = { EN: "en", KU: "kmr", SO: "ckb", AR: "ar" };
  var I18N_ATTRS = ["aria-label", "title", "alt", "placeholder", "data-demo", "data-demo-form", "data-label"];
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function t(s) { var d = I18N[LANG]; return (d && d[norm(s)]) || s; }
  function swapText(orig) {
    var key = norm(orig), d = I18N[LANG], tr = key && d && d[key];
    if (!tr) return orig;
    return orig.match(/^\s*/)[0] + tr + orig.match(/\s*$/)[0];
  }
  function translateDom() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) { var p = n.parentNode && n.parentNode.nodeName; return p === "SCRIPT" || p === "STYLE" ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
    });
    var n;
    while ((n = walker.nextNode())) {
      if (n.__en === undefined) n.__en = n.nodeValue;
      n.nodeValue = LANG === "EN" ? n.__en : swapText(n.__en);
    }
    $$("[" + I18N_ATTRS.join("],[") + "]").forEach(function (el) {
      el.__enAttr = el.__enAttr || {};
      I18N_ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        if (el.__enAttr[a] === undefined) el.__enAttr[a] = el.getAttribute(a);
        el.setAttribute(a, LANG === "EN" ? el.__enAttr[a] : swapText(el.__enAttr[a]));
      });
    });
    if (document.__enTitle === undefined) document.__enTitle = document.title;
    document.title = LANG === "EN" ? document.__enTitle : swapText(document.__enTitle);
  }
  function loadLang(code, cb) {
    if (code === "EN" || I18N[code]) { cb(); return; }
    var s = document.createElement("script");
    s.src = "i18n/" + LANG_FILE[code] + ".js?v=1";
    s.onload = cb;
    s.onerror = function () { showToast("Translation could not be loaded."); };
    document.head.appendChild(s);
  }
  function applyLang(code) {
    if (!HTML_LANG[code]) code = "EN";
    loadLang(code, function () {
      LANG = code;
      document.documentElement.setAttribute("lang", HTML_LANG[code]);
      document.documentElement.setAttribute("dir", code === "SO" || code === "AR" ? "rtl" : "ltr");
      $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === code ? "true" : "false"); });
      prefs.set("kfc-lang", code);
      translateDom();
      document.dispatchEvent(new CustomEvent("kfc:lang"));
    });
  }
  $$(".lang button").forEach(function (b) { b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); }); });
  var QMAP = { EN: "EN", KU: "KU", KMR: "KU", SO: "SO", CKB: "SO", AR: "AR" };
  var startLang = QMAP[(new URLSearchParams(location.search).get("lang") || "").toUpperCase()] || prefs.get("kfc-lang");
  if (startLang && startLang !== "EN") applyLang(startLang);

  /* Demo dialog */
  var dialog = $("#demo-dialog");
  function openDialog(msg, title) {
    if (!dialog) { window.alert(msg); return; }
    $("#demo-dialog-text").textContent = t(msg);
    $("#demo-dialog-title").textContent = t(title || "Prototype preview");
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
  }
  function closeDialog() { if (dialog.close) dialog.close(); else dialog.removeAttribute("open"); }
  if (dialog) {
    $$("[data-close-dialog]", dialog).forEach(function (b) { b.addEventListener("click", closeDialog); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) closeDialog(); });
  }
  $$("[data-demo]").forEach(function (el) {
    el.addEventListener("click", function (e) { e.preventDefault(); openDialog(el.__enAttr && el.__enAttr["data-demo"] || el.getAttribute("data-demo")); });
  });
  $$("form[data-demo-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) { e.preventDefault(); openDialog(f.__enAttr && f.__enAttr["data-demo-form"] || f.getAttribute("data-demo-form"), "Thank you — demo only"); f.reset(); });
  });

  /* Filters (stories, news, archive) */
  $$("[data-filter-group]").forEach(function (group) {
    var list = $('[data-filter-list="' + group.getAttribute("data-filter-group") + '"]');
    $$("button[data-filter]", group).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter"), shown = 0;
        $$("button[data-filter]", group).forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        $$("[data-filter-item]", list).forEach(function (item) {
          var match = f === "all" || item.getAttribute("data-filter-item") === f;
          item.hidden = !match; if (match) shown++;
        });
        showToast(shown + " " + t(shown === 1 ? "item shown" : "items shown"));
      });
    });
  });

  /* Query-string prefill (?topic= on contact, ?fund= on donate) */
  var params = new URLSearchParams(location.search);
  var topicSel = $("#c-topic");
  if (topicSel && params.get("topic") && topicSel.querySelector('option[value="' + params.get("topic") + '"]')) topicSel.value = params.get("topic");

  /* Donation interface (no payment processing) */
  var form = $("#donate-form");
  if (form) {
    var customWrap = $("#custom-wrap"), customInput = $("#custom-amt");
    var IMPACT = {
      10: "£10 could help provide Christian literature in Kurdish.",
      25: "£25 could help towards essentials for a family facing hardship.",
      50: "£50 could help fund a session of English or digital-skills learning.",
      100: "£100 could help equip a mission partner with ministry resources."
    };
    var fp = params.get("fund");
    if (fp) { var fr = form.querySelector('input[name="fund"][value="' + fp + '"]'); if (fr) fr.checked = true; }
    var fmt = function (n) { return "£" + (Math.round(n * 100) / 100).toLocaleString("en-GB"); };
    var update = function () {
      var a = form.querySelector('input[name="amount"]:checked').value;
      var monthly = form.querySelector('input[name="freq"]:checked').value === "monthly";
      var fundEl = form.querySelector('input[name="fund"]:checked'), fund = t(fundEl.__enAttr && fundEl.__enAttr["data-label"] || fundEl.getAttribute("data-label"));
      customWrap.hidden = a !== "custom";
      var amt = a === "custom" ? parseFloat(customInput.value) : parseFloat(a);
      var ok = amt && amt > 0;
      $("#sum-amount").textContent = ok ? fmt(amt) : "£—";
      $("#sum-freq").textContent = t(monthly ? "Monthly gift" : "One-time gift");
      $("#sum-fund").textContent = fund;
      $("#donate-btn-text").textContent = ok ? t("Donate") + " " + fmt(amt) + (monthly ? " " + t("monthly") : "") : t("Enter an amount");
      $("#impact-line").textContent = a === "custom" ? t("Every gift, of any size, is recorded and used responsibly.") : t(IMPACT[a]) + " " + t("(Illustrative example, not a costed figure.)");
    };
    form.addEventListener("change", function (e) {
      update();
      if (e.target.name === "amount" && e.target.value === "custom") customInput.focus();
    });
    customInput.addEventListener("input", update);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      openDialog(t("Donation processing is not active in this private prototype. No payment has been taken and no details have been stored. Your selection:") + " " +
        $("#sum-amount").textContent + " · " + $("#sum-freq").textContent + " · " + $("#sum-fund").textContent + ".", "Donation not processed");
    });
    update();
    document.addEventListener("kfc:lang", update);
  }
})();
