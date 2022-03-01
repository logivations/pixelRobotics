const template = `<div class="col-md-6 col-12 event-container <%= type %>">
    <div class="image-holder">
        <img class="event-image" src="<%= posterURL %>">
        <% if (isUpcomingEvent) { %>
            <div class="announcement-container">
                <p class="announcement-title">EVENT</p>
                <span class="announcement-date"> <%= eventTime %></span>
            </div>
        <% } %>
    </div>
    <div class="info-holder">
        <% if (isUpcomingEvent) { %>
            <p class="sub-title">Upcoming Event</p>
        <% } %>
        <p class="title"><%= title %></p>
        <% if (eventPlace) { %>
            <p class="event-place"><%= eventPlace %></p>
        <% } %>
        <p class="date"> <%= createdAt %> </p>
    </div>
</div>`;

const showHideElement = (element, show) => {
  if (Array.isArray(element)) {
    [...element].forEach((element) => $(element)[show ? 'show' : 'hide']());
  } else {
    $(element)[show ? 'show' : 'hide']();
  }
};

const changePageTitle = (title) => {
  document.getElementById('page-title').innerText = title;
};

$(document).ready(async () => {
  const eventsContainer = document.querySelector('.events-list-container');
  await fetch('common/getSortedByDateNewsAndEvents', {
    method: 'GET',
  })
    .then((res) => res.json())
    .then((data) => {
      eventsContainer.innerHTML = data.reduce((templates, item) => {
        const isUpcomingEvent = item.eventTime && (new Date(item.eventTime)).getTime() > Date.now();
        const html = ejs.render(template, {...item, isUpcomingEvent});
        return templates + html;
      }, '');
  });

  const showLatestNewsAndEventsBtn = document.getElementById('latest-news-and-events');
  const showLatestNewsBtn = document.getElementById('latest-news');
  const showLatestEventBtn = document.getElementById('latest-events');
  const newsBlocks = document.getElementsByClassName('news');
  const eventsBlocks = document.getElementsByClassName('event');

  showHideElement(showLatestNewsAndEventsBtn, false);

  showLatestNewsBtn.addEventListener('click', () => {
    [...newsBlocks].forEach((block) => showHideElement(block, true));
    [...eventsBlocks].forEach((block) => showHideElement(block, false));
    showHideElement(showLatestNewsBtn, false);
    showHideElement([showLatestNewsAndEventsBtn, showLatestEventBtn], true);
    changePageTitle('Latest News');
  });
  showLatestEventBtn.addEventListener('click', () => {
    [...newsBlocks].forEach((block) => showHideElement(block, false));
    [...eventsBlocks].forEach((block) => showHideElement(block, true));
    showHideElement(showLatestEventBtn, false);
    showHideElement([showLatestNewsAndEventsBtn, showLatestNewsBtn], true);
    changePageTitle('Upcoming Events');
  });
  showLatestNewsAndEventsBtn.addEventListener('click', () => {
    [...newsBlocks].forEach((block) => showHideElement(block, true));
    [...eventsBlocks].forEach((block) => showHideElement(block, true));
    showHideElement(showLatestNewsAndEventsBtn, false);
    showHideElement([showLatestEventBtn, showLatestNewsBtn], true);
    changePageTitle('News & Events');
  });
});