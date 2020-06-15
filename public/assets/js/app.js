// Scrape New Articles
$.getJSON("/articles", function (data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + data[i].summary);
    }
});

// Save Article
$(document).on("click", "#saveArticle", function () {
    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
    })
});

// Clear Articles
$(document).on("click", "#clear", function () {
    let thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
    })
});
