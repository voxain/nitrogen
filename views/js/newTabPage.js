$(document).ready(() => {
    let request = $.ajax({
        url: 'https://api.github.com/repos/rmcproductions/nitrogen/commits',
        async: false
    });
    
    request.responseJSON.forEach((c, i) => {
        if(i > 5) return;
        let newsEntry = `<a href="::URL::">
            <div class="qa-item"><h3>::TITLE::</h3>::MESSAGE::</div>
        </a>`.replace(/::MESSAGE::/g, c.commit.message).replace(/::TITLE::/g, c.commit.author.name).replace(/::URL::/g, c.html_url);
        let feed = new DOMParser().parseFromString(newsEntry, 'text/html');
    
        $('#append-news').append(feed.body.children);
    });
    
});