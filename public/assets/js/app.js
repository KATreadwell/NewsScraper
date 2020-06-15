$.getJSON("/articles", function (data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + data[i].summary);
    }
});

$.ajax({
    method: "GET",
    url: "/articles/" + thisId
})

$(document).on("click", "#saveArticle", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
    })
});
