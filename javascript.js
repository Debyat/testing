let map;
let markers = [];
var bounds;
let locations = [];
let search = false;
let week;
let center = { lat: 37.09024, lng: -95.712891 };
let homeCode = 'locations';
let qouteCode = 'locations/request-a-quote';
let aboutCode = 'locations/about-us';
let printerCode = 'locations/printer-program';
let serviceCode = 'locations/managed-print-services';
let suppliesCode = 'locations/supplies';
let maintenanceCode = 'locations/maintenance';
let contactUs = 'locations/contact-us';
let tonerQuote = 'locations/toner-cartridge-quote';
let freePrinterForm = 'locations/free-printer-form';

var apiKey = 'pat7QGpbYAI2kQUtC.007621f5174e24ec34eaf5d035fac28f7ec4a0a0c3c497f52e9470cf5851a84f';
var baseId = 'appAxTtyFXwXnIshY';

var tableName = 'Locations';
var allRecords = [];
var searchMarkers = [];

// Header
let headerText = '#1058823884';
let logoLink = '#1254713442';
let tabletLogo = '#1573522578';
let mobileLogo = '#1185451536';
let desktopNav = '#1137544060';
let tabletNav = '#1144820115';
let mobileNav = '#1544203479';

// Footer
let footerLabelId = '#1489500817';
let footerDescId = '#1384037069';
let zipCodeId = '#1088568367';

// Responsiveness
// Mobile
let headCon = '#1420336568';
let sidNavCon = '#1939231103';
let sidNavEm = '#1796843737';

async function initMap() {
    if (window.location.href.includes('store-locator')) {
        var maxBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(-85.10122762537281, -180),
          new google.maps.LatLng(85.18101358266105, 180)
        );
        
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 5,
            center: center,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            minZoom: 3,
            restriction: {
                latLngBounds: maxBounds,
                strictBounds: true
              },
            options: {
                gestureHandling: 'greedy'
            }
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: "",
            disableAutoPan: true,
        });
        
        async function fetchRecords(offset) {
            var url = `https://api.airtable.com/v0/${baseId}/${tableName}?sort%5B0%5D%5Bfield%5D=id&sort%5B0%5D%5Bdirection%5D=asc&fields%5B%5D=id&fields%5B%5D=location_url&fields%5B%5D=complete_address&fields%5B%5D=Sunday&fields%5B%5D=Monday&fields%5B%5D=Tuesday&fields%5B%5D=Wednesday&fields%5B%5D=Thursday&fields%5B%5D=Friday&fields%5B%5D=Saturday&fields%5B%5D=Sunday&fields%5B%5D=Friday&fields%5B%5D=label&fields%5B%5D=state&fields%5B%5D=country&fields%5B%5D=contact_number&fields%5B%5D=email&fields%5B%5D=direct_location_url&fields%5B%5D=lat&fields%5B%5D=lng&fields%5B%5D=redirect_link&offset=${offset}`;

            return await fetch(url, {
                headers: {
                'Authorization': 'Bearer ' + apiKey
                }
            })
            .then(response => response.json())
            .then(data => {
            allRecords.push(...data.records);

            if (data.offset) {
                return fetchRecords(data.offset);
            } else {
                return allRecords;
            }
            });
        }

        fetchRecords('')
            .then(records => {
                locations = records.map((record) => {
                    record.fields.lat = parseFloat(record.fields.lat)
                    record.fields.lng = parseFloat(record.fields.lng)
                    
                    record.fields.itemLink = window.location.href.includes('9068a585') ? `/site/9068a585/${homeCode}/${record.fields.location_url}?preview=true&insitepreview=true&dm_device=desktop` : `/${homeCode}/${record.fields.location_url}`;
                    record.fields.quote = window.location.href.includes('9068a585') ? `/site/9068a585/${qouteCode}/${record.fields.location_url}?preview=true&insitepreview=true&dm_device=desktop` : `/${qouteCode}/${record.fields.location_url}`;
               
                    return record.fields; 
                });
                    
                insertBoth(locations)
            })
            .catch(error => {
                console.error(error);
            });
        
        bounds = new google.maps.LatLngBounds();

        function insertBoth(locations) {
            let sub = map.getBounds();
            let counter = 0;
            
            locations.forEach((location) => {
                
                if (sub && sub.contains(new google.maps.LatLng(location.lat, location.lng))) {
                    counter = insertLeftSideData(counter, location)
                }

                insertContent(location)
                
            });

            $('.count-locations').html(counter + ' Locations Found') 
                            
            let markerCluster = new markerClusterer.MarkerClusterer({map, markers});
        }
        
        // Map View
        $('#1644502329').attr('href', '#');
        $('#1644502329').click(() => {
            map.setCenter({ lat: 37.09024, lng: -95.712891 })
            map.setZoom(5);
        })
        
        // Mobile View Map
        $('#state-province').on('change', (e) => {
            let value = $('#state-province').val();
            let state = $(e.target).find("option:selected").text();
            
            $('.search-state-province').text(state)
            $('.results-container .card-mobile').remove();
            
            if (value == '') {
                $('.search-state-province').text('')
            } else {
                locations.forEach(location => {
                    if (location.state == value || location.country == value) { 
                        week = [
                            `${location.Sunday}`,
                            `${location.Monday}`,
                            `${location.Tuesday}`, 
                            `${location.Wednesday}`, 
                            `${location.Thursday}`,
                            `${location.Friday}`, 
                            `${location.Saturday}`
                            ];
                    
                        d = new Date();
                        day = d.getDay();
                    
                        let today;
                    
                        for (let i = 0; i < week.length; i++) {
                            if (day == i) {
                                today = `${week[i]}`;
                            }
                        }
    
                        let content = `<div class="card-mobile">
                                     <div class="card-title">
                                      <h3>${location.label}</h3>
                                      <p class="details today"><i class="fa fa-map-marker" style="color:red"></i> ${location.complete_address}</p>
                                      <p class="details today"><i class="fa fa-clock-o" style="color:red"></i> ${today}</p>
                                      <p class="details"><i class="fa fa-phone" style="color:red"></i> ${location.contact_number}
                                        <span><a href="${location.quote}"> Request Quote </a> </span> <span><a href="${location.itemLink}">Website</span>
                                      </p>
                                     </div>
                                    </div>`;
    
                        $('.results-container').append(content);
                    }
                });
            }
        }); 

        // Get User's Location
         if (navigator.geolocation) {
            $('#clear').click(() => {
                navigator.geolocation.getCurrentPosition(
                  function(position) {
                    var userLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    };
            
                    // Center the map on the user's location
                    map.setCenter(userLocation);
            
                    // Place a marker at the user's location
                    new google.maps.Marker({
                      position: userLocation,
                      map: map
                    });
                  },

                  function(error) {
                    console.error('Error getting user location:', error);
                  }

                );
            });
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
        
         // Calculate Distance to Miles
        function calculateDistance(lat1, lon1, lat2, lon2) {
          const R = 3959; // Earth's radius in miles
          const dLat = degToRad(lat2 - lat1);
          const dLon = degToRad(lon2 - lon1);
          
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
            
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;
          
          return distance;
        }
        
        function degToRad(deg) {
          return deg * (Math.PI / 180);
        }
        
        function calculateAndDisplayDistance(location, center) {
          const distance = calculateDistance(
            location.lat,
            location.lng,
            center.lat(),
            center.lng()
          );

          return Math.round(distance);
        }

        let throttledEventHandler;
        
        // Function to be throttled
        function handleBoundsChange() {
            const bounds = map.getBounds();
            
            const visibleLocations = locations.filter((location) => {
                return bounds.contains(new google.maps.LatLng(location.lat, location.lng));
            });
            
            if (search && visibleLocations.length <= 0) {
                map.setZoom(8);
            }
            
            $('.locations ul li').remove()
            $('.locations ul hr').remove()
            
            let counter = 0;
            let temp = [];
            
            visibleLocations.forEach((location, ndx) => {
                if (search) {
                    let distance = calculateAndDisplayDistance(location, center);
                    let newLocation = location
                    newLocation.distance = distance
                    temp.push(newLocation)
                } else {
                    counter = insertLeftSideData(counter, location)
                }
        
            })
            
            if(temp.length > 0) {
                temp.sort((a, b) => {
                    return a.distance - b.distance
                });
                temp.forEach((location) => {
                    counter = insertLeftSideData(counter, location, location.distance)
                })
            }
            
            $('.count-locations').html(counter + ' Locations Found')
        }

        // Throttle the event handler function
        function throttle(fn, delay) {
            let lastCall = 0;
            return function (...args) {
                const now = new Date().getTime();
                if (now - lastCall < delay) {
                clearTimeout(throttledEventHandler);
                }
                lastCall = now;
                throttledEventHandler = setTimeout(() => {
                fn(...args);
                }, delay);
            };
        }

        // Attach the throttled event handler to the bounds change event
        const throttledBoundsChangeHandler = throttle(handleBoundsChange, 500); // Set your desired delay (in milliseconds)

        // Example: Adding event listener to Google Map bounds change event
        google.maps.event.addListener(map, 'bounds_changed', throttledBoundsChangeHandler);

        function insertContent(location) {
            
            let append = `<div class="child-informations map-content" style="width: 85%;">
                            <div class="request-child"><i class="fa fa-phone"></i> ${location.contact_number}</div>
                            <div class="request-child"> <a  href="${location.quote}"> Request Quote </a> </div>
                            <div class="request-child last-element-child"><a  href="${location.itemLink}">Website</a></div>`
                            
            if (location.redirect_link) {
               append =  `<div class="child-informations map-content" style="width: 85%;">
                            <div class="request-child"><i class="fa fa-phone"></i> ${location.contact_number}</div>
                            <div class="request-child last-element-child"><a  href="${location.redirect_link}">Website</a></div>`
            } 
            
            const content = `<div class="content-title mb-15">${location.label}</div>
                    <div class="informations"> 
                        <div class="location">
                            <i class="fa fa-map-marker"></i> ${location.complete_address}
                        </div>
                        ${append}`;
                            
            const image = "https://irp.cdn-website.com/9068a585/dms3rep/multi/location-pin_svgrepo.com+%287%29.svg";                        
            
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: map,
                title: location.label,
                content: content,
                draggable: false,
                icon: image,
            });

            marker.addListener("click", (e) => {
                map.panTo(e.latLng)
                setTimeout(() => {
                    infoWindow.setContent(content);
                    infoWindow.open(map, marker);
                }, 500);
            });
            
            // Add Marker Pointer in Map
            markers.push(marker);
        }

        function insertLeftSideData(counter, location, distance = 0) {
            let dsply = search ? 'block' : 'none';
            let append = `<div class="request-child link-q"> <a href="${location.quote}"> Request Quote </a> </div>
                        <div class="request-child last-child"> <a href="${location.itemLink}">Website</a>`
                        
            if (location.redirect_link) {
                append = `<div class="request-child last-child"> <a href="${location.redirect_link}">Website</a>`
            }
            
            let displayLocations = `<li class="${location.id}"> <div class="content-title" style="font-size:18px;"> Cartridge World of ${location.label}</div>
                        <span class="distance" style="display: ${dsply}">${distance} miles </span>
                        <div class="informations side-location-names"> <div class="contact-info">
                        <i class="fa fa-map-marker"></i>
                        ${location.complete_address}</div>
                        <div class="child-informations">
                        <div class="request-child"><i class="fa fa-phone"></i>${location.contact_number}</div>
                        ${append}
                        </div> </li><hr style="border:solid 1px rgb(190, 190, 190) !important;width:90%">`;
            
            $('.locations ul').append(displayLocations)

            counter++
            
            // if (search && distance == 0) {
            //     let foundContent = null;
            //     let mark = null;
                
            //     markers.forEach(function(marker) {
            //         if (marker.getTitle() === location.label) {
            //           foundContent = marker.content;
            //           mark = marker;
            //         }
            //      });
                 
            //     infoWindow.setContent(foundContent);
            //     infoWindow.open(map, mark);
            // }
            
            $('.' + location.id).click((e) => {
                locations.forEach((location) => {
                    if (location.id == $(e.currentTarget).attr('class')) {
                        map.panTo(new google.maps.LatLng(location.lat, location.lng))
                        
                        let currentZoom = map.getZoom();
    
                        // Increase the zoom level by one
                        if (currentZoom <= 6) {
                            map.setZoom(currentZoom + 6);
                        }
                        
                        setTimeout(() => {
                            let foundContent = null;
                            let mark = null;
                            
                            markers.forEach(function(marker) {
                                if (marker.getTitle() === location.label) {
                                  foundContent = marker.content;
                                  mark = marker;
                                }
                             });
                             
                            infoWindow.setContent(foundContent);
                            infoWindow.open(map, mark); 
                        }, 500);
                    }
                })
            })

            return counter;
        }
        
        // Trigger search button
        $('.search').click(() => { 
            searchMarkers.forEach((marker) => {
                marker.setMap(null);
            })
            
            var input = $('#pac-input').val();
            
            
            if (input.length > 0) {
                searchLocation(input)
            }
            
                
            // if (input.length > 0) {
            //     const request = {
            //         query: input,
            //         fields: ['name', 'geometry']
            //     }
                
            //     let service = new google.maps.places.PlacesService(map);
            //     service.findPlaceFromQuery(request, callback);
            // }
        });
        
        if (localStorage.getItem('_z')) {
            $('#pac-input').val(localStorage.getItem('_z'));
            
            searchLocation(localStorage.getItem('_z'))
            
            // const request = {
            //     query: localStorage.getItem('_z'),
            //     fields: ['name', 'geometry']
            // }
        
            // let service = new google.maps.places.PlacesService(map);
            // service.findPlaceFromQuery(request, callback);
            
            localStorage.removeItem('_z')
        }
        
        function searchLocation(input){
            var geocoder = new google.maps.Geocoder();
            
            geocoder.geocode({ address: input }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    createMarker(results[0]);
                    
                    map.setCenter(results[0].geometry.location);
                    center = results[0].geometry.location;
                    map.setZoom(10)
                    
                } else {
                  console.log("Geocode was not successful for the following reason: " + status);
                }
                
                if (status == 'ZERO_RESULTS') {
                    $('.locations ul li').remove()
                    $('.locations ul hr').remove()
                    
                    let displayLocations = `<li> 
                            <div class="informations side-location-names"> 
                            <div class="child-informations">
                            <div class="request-child">Sorry no locations found.</div>
                          </li>`;
                
                    $('.locations ul').append(displayLocations)
                    $('.count-locations').html(0 + ' Locations Found')
                }
            });
        }
        
        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    createMarker(results[i]);
                }
        
                map.setCenter(results[0].geometry.location);
                center = results[0].geometry.location;
            }
            
            if (status == 'ZERO_RESULTS') {
                $('.locations ul li').remove()
                $('.locations ul hr').remove()
                
                let displayLocations = `<li> 
                        <div class="informations side-location-names"> 
                        <div class="child-informations">
                        <div class="request-child">Sorry no locations found.</div>
                      </li>`;
            
                $('.locations ul').append(displayLocations)
                $('.count-locations').html(0 + ' Locations Found')
            }
        }
        
        function createMarker(place) {
            if (!place.geometry || !place.geometry.location) return;
            
            
            const image = "https://irp.cdn-website.com/9068a585/dms3rep/multi/location-pin_svgrepo.com+%282%29.svg";
            
            const search_marker = new google.maps.Marker({
                map,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP,
                icon: image,
                // icon: {
                //     path: google.maps.SymbolPath.CIRCLE,
                //     fillColor: '#ffff',  // Custom marker color
                //     fillOpacity: 1,
                //     strokeWeight: 1,
                //     scale: 15  // Custom marker size
                //   }
            });
        
            map.fitBounds(bounds);
            search = true;
            searchMarkers.push(search_marker)
        
            search_marker.addListener('click', function () {
                if (search_marker.getAnimation() !== null) {
                    search_marker.setAnimation(null)
                } else {
                    search_marker.setAnimation(google.maps.Animation.BOUNCE)
                }
            })
        }

    }
    
}

async function getData() {
    let id = localStorage.getItem('data-id');
    let location_url = localStorage.getItem('data-url');
    
    function notDynamicUrl(base) {
        return window.location.href.includes('9068a585') ? `/site/9068a585/${base}?preview=true&amp;nee=true&amp;showOriginal=true&amp;dm_checkSync=1&amp;dm_try_mode=true&amp;dm_device=desktop` : `/${base}`;
    }
    
    let storeLocator = notDynamicUrl('store-locator');
        
    if (id != null && location_url != null) {  
        // let careers = notDynamicUrl('careers');
        let green = notDynamicUrl('go-green');
        let resources = notDynamicUrl('articles');
        
        function getUrl(base) {
            return window.location.href.includes('9068a585') ? `/site/9068a585/${base}/${location_url}?preview=true&insitepreview=true&dm_device=desktop` : `/${base}/${location_url}`;
        }

        let dynamicHome = getUrl(homeCode)
        let aboutUs = getUrl(aboutCode);
        let printerProgram = getUrl(printerCode);
        let servicesUrl = getUrl(serviceCode);
        let supplies = getUrl(suppliesCode);
        let maintenance = getUrl(maintenanceCode);
        let contact = getUrl(qouteCode);
        let cont = getUrl(contactUs)
        let selected;
        let careers = getUrl('locations/careers')
        let toner = getUrl(tonerQuote);
        freePrinterForm = getUrl(freePrinterForm);
        
        var ApiUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;
        
        await fetch(`${ApiUrl}?fields%5B%5D=id&fields%5B%5D=order_supplies_link&fields%5B%5D=location_url&fields%5B%5D=complete_address&fields%5B%5D=Sunday&fields%5B%5D=Monday&fields%5B%5D=Tuesday&fields%5B%5D=Wednesday&fields%5B%5D=Thursday&fields%5B%5D=Friday&fields%5B%5D=Saturday&fields%5B%5D=Sunday&fields%5B%5D=Friday&fields%5B%5D=label&fields%5B%5D=state&fields%5B%5D=country&fields%5B%5D=contact_number&fields%5B%5D=email&fields%5B%5D=redirect_link&fields%5B%5D=has_free_printers&fields%5B%5D=testimonials&filterByFormula=id=${id}`, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            })
            .then(response => response.json())
            .then(data => {
                selected = data.records.map((parentRecord) => {
                    return parentRecord.fields;
                })[0];
            })
            .catch(error => {
                console.error(error);
            });

        week = [
                `${selected.Sunday}`, 
                `${selected.Monday}`, 
                `${selected.Tuesday}`, 
                `${selected.Wednesday}`, 
                `${selected.Thursday}`, 
                `${selected.Friday}`, 
                `${selected.Saturday}`
            ];

        d = new Date();
        day = d.getDay();

        for (let i = 0; i < week.length; i++) {
            if (day == i) {
                hours = `${week[i]}`;

                if (window.location.href.includes('home')) {
                    $('#1497765275').text(`${week[i]}`).css('color', '#0000')
                }

                if (window.location.href.includes('store-contact')) {
                    $('#1082602098').text(`${week[i]}`)
                }

            }
        }
        
        //  Footer Text
        let phone = `<p style="color:#ffff;font-size:18px;font-weight: bold;">${selected.contact_number}</p>`;
        let ad = `<p style="color:#ffff;font-size:16px;">${selected.complete_address}</p>`;
        let currentHour = `<p style="color:#ffff; font-size:16px;">Today's Hours: ${hours}</p>`

        $(footerLabelId).text(selected.label).css({
            'color': '#ffff',
            'font-size': '24px',
            'font-weight': 'bold',
        });
        
        $(footerDescId).html(phone);
        $(footerDescId).append(ad);
        $(footerDescId).append(currentHour);
        $(zipCodeId).hide();
        
        // Header Text
        let change = `
                <i class="fa fa-map-marker" style="font-size:35px;color:#c72e2e; position:absolute;"></i>
                 <p style="line-height: initial; margin-left: 30px; font-size:13px;color:#1D1D1B;font-weight:bold;" no_space_b="true" no_space_e="true">
                   CARTRIDGE® ${selected.label}
                </p>
                
                <p style="font-size:13px;margin-left:30px;color:#1D1D1B">
                    <a href="tel:${selected.contact_number}" 
                        target="_blank" 
                        type="call" class="m-font-size-13" 
                        style="text-decoration: none;color:#1D1D1B; font-weight: bold;">
                        ${selected.contact_number}
                    </a>
                    
                    <span class="ml-15" style="color:#1D1D1B">
                        ${hours} 
                    </span>
                    <span class="dropdown ml-15">
                      <button class="dropbtn" id="drop" style="color:#1D1D1B">Office Hours</button>
                      <div class="dropdown-content" id="content-drop">
                        <div class="row">
                          <div class="column">
                            <p class="days">Monday</p>
                            <p class="days">Tuesday</p>
                            <p class="days">Wednesday</p>
                            <p class="days">Thursday</p>
                            <p class="days">Friday</p>
                            <p class="days">Saturday</p>
                            <p class="days">Sunday</p>
                          </div>
                          <div class="column">
                            <p class="days">${selected.Monday}</p>
                            <p class="days">${selected.Tuesday}</p>
                            <p class="days">${selected.Wednesday}</p>
                            <p class="days">${selected.Thursday}</p>
                            <p class="days">${selected.Friday}</p>
                            <p class="days">${selected.Saturday}</p>
                            <p class="days">${selected.Sunday}</p>
                          </div>
                        </div>
                      </div>
                    </span>
                    </p>`;

        // Location Name Header
        $(headerText).html(change).css('color', 'black')
        $('#drop').click(() => {
            $('#content-drop').toggle();
        })

        // Logo Link
        $(logoLink).attr('href', dynamicHome);
        
        // Tablet
        let tab = window.location.href.includes('9068a585') ? `/site/9068a585/${homeCode}/${location_url}?preview=true&insitepreview=true&dm_device=tablet` : `/${homeCode}/${location_url}`;
        $(tabletLogo).attr('href', tab);
        // Mobile
        let mob = window.location.href.includes('9068a585') ? `/site/9068a585/${homeCode}/${location_url}?preview=true&insitepreview=true&dm_device=mobile` : `/${homeCode}/${location_url}`;
        $(mobileLogo).attr('href', mob);
        
        // Career Link
        $($('.m-size-13.text-align-center.size-16 .m-font-size-13.font-size-16')[1]).attr('href', careers)
            
        // Navigation Links
        let center = `<ul role="menubar" class="unifiednav__container " data-auto="navigation-pages"> 
            <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="0"> 
                    <a href="${aboutUs}" class="unifiednav__item dmUDNavigationItem_010101823300" target="" data-target-page-alias="" raw_url="/site/9068a585/store-locator" tabindex="-1"> 
                        <span class="nav-item-text " data-link-text="Store Locator" data-auto="page-text-style">
                            About
                            <span no_space_b="true" class="icon icon-angle-down"></span> 
                        </span> 
                    </a> 
                </li>
                
                <li role="menuitem" aria-haspopup="true" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="0"> 
                    <a href="#" class="unifiednav__item dmUDNavigationItem_010101577089 unifiednav__item_has-sub-nav" 
                        target="" data-target-page-alias="" tabindex="0">
                        <span class="nav-item-text " data-link-text="Service" data-auto="page-text-style">
                            Services
                            <span no_space_b="true" class="icon icon-angle-down">
                            </span> 
                        </span> 
                    </a> 
                    <ul role="menu" aria-expanded="false" class="unifiednav__container unifiednav__container_sub-nav" data-depth="0" 
                      data-auto="sub-pages"> 
                        <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="1"> 
                            <a href="${printerProgram}" class="unifiednav__item dmUDNavigationItem_010101177689" target="" data-target-page-alias="" raw_url="/site/9068a585/printer-service/free-printer-program" tabindex="-1">
                                <span class="nav-item-text " data-link-text="Career" data-auto="page-text-style">
                                    Printer Program
                                    <span no_space_b="true" class="icon icon-angle-right"></span> 
                                </span> 
                            </a> 
                        </li>
                    <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="1"> 
                        <a href="${servicesUrl}" class="unifiednav__item dmUDNavigationItem_010101177689" target="" data-target-page-alias="" raw_url="/site/9068a585/printer-service/free-printer-program" tabindex="-1">
                            <span class="nav-item-text " data-link-text="Career" data-auto="page-text-style">
                                Managed Print Services
                                <span no_space_b="true" class="icon icon-angle-right"></span> 
                            </span> 
                        </a> 
                    </li>
                    <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="1"> 
                        <a href="${supplies}" class="unifiednav__item dmUDNavigationItem_010101177689" target="" data-target-page-alias="" raw_url="/site/9068a585/printer-service/free-printer-program" tabindex="-1">
                            <span class="nav-item-text " data-link-text="Career" data-auto="page-text-style">
                                Supplies
                                <span no_space_b="true" class="icon icon-angle-right"></span> 
                            </span> 
                        </a> 
                    </li>
                    <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="1"> 
                        <a href="${maintenance}" class="unifiednav__item dmUDNavigationItem_010101177689" target="" data-target-page-alias="" raw_url="/site/9068a585/printer-service/free-printer-program" tabindex="-1">
                            <span class="nav-item-text " data-link-text="Career" data-auto="page-text-style">
                                Maintenance
                                <span no_space_b="true" class="icon icon-angle-right"></span> 
                            </span> 
                        </a> 
                    </li>
                    </ul> 
                </li> 
            
                <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="0"> <a
                href="${green}"
                class="unifiednav__item dmUDNavigationItem_010101199878" target="" data-target-page-alias=""
                raw_url="${green}" tabindex="-1">
                    <span class="nav-item-text " data-link-text="Go &amp; Green" data-auto="page-text-style">
                        Go &amp; Green<span no_space_b="true" class="icon icon-angle-down"></span>
                    </span>
                </a>
            </li>
                
            <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="0"> <a
                href="${resources}"
                class="unifiednav__item dmUDNavigationItem_010101177689" target="" data-target-page-alias=""
                raw_url="${resources}" tabindex="-1"> 
                    <span class="nav-item-text " data-link-text="Free Printers" data-auto="page-text-style">
                        Resources
                    <span no_space_b="true" class="icon icon-angle-down"></span>
                </span>
                </a>
            </li>

            <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="0"> 
                    <a href="${cont}" class="unifiednav__item dmUDNavigationItem_010101823300" target="" data-target-page-alias="" raw_url="/site/9068a585/store-locator" tabindex="-1"> 
                        <span class="nav-item-text " data-link-text="Store Locator" data-auto="page-text-style">
                            Contact
                            <span no_space_b="true" class="icon icon-angle-down"></span> 
                        </span> 
                    </a> 
                </li> 
        
                <li role="menuitem" class="unifiednav__item-wrap" data-auto="more-pages" data-depth="0"> 
                    <a href="${storeLocator}" class="unifiednav__item dmUDNavigationItem_010101823300" target="" data-target-page-alias="" raw_url="/site/9068a585/store-locator" tabindex="-1"> 
                        <span class="nav-item-text " data-link-text="Store Locator" data-auto="page-text-style">
                            Store Locator
                            <span no_space_b="true" class="icon icon-angle-down"></span> 
                        </span> 
                    </a> 
                </li> 
            </ul>`
            
            // Desktop
            $($(`${desktopNav} .unifiednav__container`)[0]).html(center)
            // Tablet
            $($(`${tabletNav} .unifiednav__container`)[0]).html(center)
            // Mobile
            $($(`${mobileNav} .unifiednav__container`)[0]).html(center)

            let con = `tel:${selected.contact_number}`;

            // Email
            $(sidNavEm).attr('href', `mailto:${selected.email}`);
            // Contact
            $(sidNavCon).attr('href', con);

            // Header Contact
            $(headCon).attr('href', con);
            
            $('#1567194747 p a').attr('href', contact)
            $('#1406580398 p a').attr('href', careers)
            
            // Location Home Page Toner Link
            $('#1828887239').attr('href', toner)
            
            // Location Home Page Free Printer Form Link
            $('#1408106118').attr('href', freePrinterForm)
            $('#1851255921').attr('href', freePrinterForm)
            $('#1268978895').attr('href', freePrinterForm)
            $('#1979693477 a').attr('href', freePrinterForm)
            
            if (selected.has_free_printers == 'false') {
                $('#1821327914').hide()
                $('#1017122900').hide()
                $('*#dm *.dmBody #1274571965 a.u_1268978895').attr('style', 'display: none !important')
                $('#1075403645').hide()
                $('#1935424567').hide()
            }
            
            if (selected.testimonials) {
                let link = selected.testimonials
                console.log(link)
                // $('#1079519405').attr('src', link)
                // console.log($('#1079519405').attr('src', link))
                $('#1236340878').show()
            } else {
                $('#1236340878').hide()
            }
           
            //About
            $('#1081335850').attr('href', freePrinterForm)
            
            // Printer Program Free Printer Form
            $('#1669250657').attr('href', freePrinterForm)
            $('#1382238282').attr('href', freePrinterForm)
            
            // Supplies
            $('#1206039002').attr('href', freePrinterForm)
            $('#1190220175').attr('href', freePrinterForm)
            
            // Maintenance
            $('#1920414730').attr('href', freePrinterForm)
            
            // Printer Program - Ask About
            $('#1571407278').attr('href', cont)
            
            // Managed Print Services Buttons
            $('#1236476113').attr('href', contact)
            $('#1754601381').attr('href', contact)
            $('#1758297542').attr('href', contact)
            $('#1200055532').attr('href', contact)
            
            // Maintenance Free Printer Link
            $('#1778806020 a').attr('href', printerProgram)
            
            // Go Green
            $('#1954202742').attr('href', contact)
            $('#1266525087').attr('href', contact)
            
            $('#1497765275 p.size-16.m-size-13').text(hours).css({
                'color': '#00000',
                'font-size': '16px'
            })
            
            $('#1098876547').text(hours).css({
                'color' : '#00000',
                'font-size': '14px',
            });
            $('#1435303763').text(hours).css({
                'color' : '#00000',
                'font-size': '14px',
            });
            $('#1068274788').text(hours).css({
                'color' : '#00000',
                'font-size': '14px',
                'text-align': 'center',
            });
            
            // Location Home Page for Supplies
            if (selected.order_supplies_link) {
                $('#1837908438').attr('href', selected.order_supplies_link)
                $('*#dm *.dmBody a.u_1831027025').attr('href', selected.order_supplies_link)
                
                // Supplies
                
                $('#1827567364 a').attr('href', selected.order_supplies_link)
                $('*#dm *.dmBody a#1206039002').attr('href', selected.order_supplies_link);
                $('*#dm *.dmBody a.u_1190220175').attr('href', selected.order_supplies_link)
                
            } else {
                $('#1837908438').hide()
                $('*#dm *.dmBody a.u_1831027025').attr('style', 'display: none !important');
                
                // Supplies
                $('*#dm *.dmBody a.u_1206039002').attr('style', 'display: none !important');
                $('*#dm *.dmBody a.u_1190220175').attr('style', 'display: none !important');
            }
            
            // Footer 
            // Quick Links
            $('#1130662595 p a').text('Printer Program')
            $('#1130662595 p a').attr('href', printerProgram)
            
            $('#1683614859 p a').text('Managed Print Services')
            $('#1683614859 p a').attr('href', servicesUrl)
            
            $('#1740716833 p a').text('Supplies')
            $('#1740716833 p a').attr('href', supplies)
            
            $('#1040556649 p a').text('Maintenance')
            $('#1040556649 p a').attr('href', maintenance)
            
            $('#1103496623').hide()
            $('#1933398275').hide()
            
            // Contact
            $('#1482664482 p a').attr('href', contact)
            $('#1283517832 p a').attr('href', cont)
            $('#1322079146 p a').attr('href', aboutUs)
        } 
        else {
            let remain = `<p style="line-height: initial; 
            font-size:15px;
            color:#000000" 
            no_space_b="true" no_space_e="true">
            
                <a href="${storeLocator}" id="store-locator"
                    raw_url="${storeLocator}" runtime_url="/store-locator" 
                    type="page" style="display: unset; text-decoration: none;
                        color: #1D1D1B;
                        font-weight: bold;
                        padding: 7px;"><i class="fa fa-map-marker" style="font-size:24px;color:#c72e2e !important"></i>&nbsp;Find a location</a>
            </p>`
            
            // Header Text
            $(headerText).html(remain)
        }
    }

getData();

$(window).on("load", function(){
    if (window.location.href.includes('store-locator')) {
        window.initMap = initMap;
    }
    $('#loader').hide();
});
