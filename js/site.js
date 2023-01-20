var events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
},
];

function buildDropDown() {
    // get the dropdown menu
    let dropDownMenu = document.getElementById('eventDropDown');
    // reset the dropdown menu to empty
    dropDownMenu.innerHTML = '';
    // pull object from storage
    let currentEvents = getEventData();

    // pull out just city names
    let eventCities = currentEvents.map((event) => event.city);
    // filter the cities to only the DISTINCT city names
    let distinctCities = [...new Set(eventCities)];

    // get the template
    const template = document.getElementById('dropdownItemTemplate');

    // copy the child content from the node
    let dropDownTemplateNode = document.importNode(template.content, true);
    // grab the a tag from the template
    let menuItem = dropDownTemplateNode.querySelector('a');
    // change the inner text inside the a tag of the template
    menuItem.innerHTML = 'All Cities';
    // add an attribute to the a tag
    menuItem.setAttribute('data-string', "All")
    // append menuItem to dropdown menu
    dropDownMenu.appendChild(menuItem);

    for (let i = 0; i < distinctCities.length; i++) {
        let cityMenuItem = document.importNode(template.content, true);
        let cityBtn = cityMenuItem.querySelector('a');

        cityBtn.innerHTML = distinctCities[i];
        cityBtn.setAttribute("data-string", distinctCities[i]);

        dropDownMenu.appendChild(cityMenuItem);
    }

    displayStats(currentEvents);
    displayEventData(currentEvents)
}

function displayStats(eventsArr) {
    let stats = calculateStats(eventsArr);

    // quick maths

    document.getElementById('total').innerHTML = stats.totalAttendance.toLocaleString();
    document.getElementById('average').innerHTML = stats.averageAttendance.toLocaleString(
        'en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    }
    );
    document.getElementById('most').innerHTML = stats.maximumAttendance.toLocaleString();
    document.getElementById('least').innerHTML = stats.minimumAttendance.toLocaleString();
}

function calculateStats(eventsArr) {

    let sum = 0;
    let average = 0;
    let max = eventsArr[0].attendance;
    let min = eventsArr[0].attendance;

    for (let i = 0; i < eventsArr.length; i++) {
        let currentEvent = eventsArr[i];

        sum += currentEvent.attendance;

        if (max < currentEvent.attendance) {
            max = currentEvent.attendance;
        }

        if (min > currentEvent.attendance) {
            min = currentEvent.attendance;
        }
    }

    average = sum / eventsArr.length;

    let stats = {
        totalAttendance: sum,
        averageAttendance: average,
        minimumAttendance: min,
        maximumAttendance: max
    }

    return stats;

}

function displayEventData(eventsArr) {

    let tableBody = document.getElementById('eventTableBody');
    const tableRowTemplate = document.getElementById('eventTableRowTemplate');

    tableBody.innerHTML = '';

    for (let i = 0; i < eventsArr.length; i++) {
        let currentEvent = eventsArr[i];
        let eventRow = document.importNode(tableRowTemplate.content, true);

        let tableCells = eventRow.querySelectorAll('td');

        tableCells[0].innerHTML = currentEvent.event;
        tableCells[1].innerHTML = currentEvent.city;
        tableCells[2].innerHTML = currentEvent.state;
        tableCells[3].innerHTML = currentEvent.attendance.toLocaleString();
        tableCells[4].innerHTML = currentEvent.date;

        tableBody.appendChild(eventRow);
    }
}

function getEventData() {
    let currentEvents = JSON.parse(localStorage.getItem('soiree-eventData'));

    if (currentEvents == null) {
        currentEvents = events;
        localStorage.setItem('soiree-eventData', JSON.stringify(currentEvents))
    }

    return currentEvents;
}

function getEvents(element) {
    let currentEvents = getEventData();
    let cityName = element.getAttribute('data-string');
    let filteredEvents = currentEvents;

    if (cityName != 'All') {
        filteredEvents = currentEvents.filter((event) => {
            if (cityName == event.city) {
                return event
            }
        });
    }

    document.getElementById('statsHeader').innerHTML = cityName;

    displayStats(filteredEvents);
    displayEventData(filteredEvents);
}

function saveEventData() {
    let eventName = document.getElementById('newEventName').value;
    let eventCity = document.getElementById('newEventCity').value;
    let eventAttendance = parseInt(document.getElementById('newEventAttendance').value);
    let eventDate = document.getElementById('newEventDate').value;

    eventDate = `${eventDate} 00:00`;
    eventDate = new Date(eventDate).toLocaleDateString();
    
    let stateSelect = document.getElementById('newEventState');
    let state = stateSelect.options[stateSelect.selectedIndex].text;

    let newEvent = {
        event: eventName,
        city: eventCity,
        state: state,
        attendance: eventAttendance,
        date: eventDate,
    };

    let currentEvents = getEventData();

    currentEvents.push(newEvent);

    localStorage.setItem('soiree-eventData', JSON.stringify(currentEvents));


    // update the page

    buildDropDown();
    document.getElementById('statsHeader').innerHTML = 'All';
    document.getElementById('newEventForm').reset();
}
