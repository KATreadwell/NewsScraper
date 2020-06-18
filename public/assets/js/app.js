$(document).ready(function () {
    // Scrape Articles
    $(document).on("click", "#scrape", function () {
        $.ajax({
            method: "GET",
            url: "/scrape",
            success: function (data) {
                if (data) {
                    if (data) {
                        Swal.fire({
                            title: 'Good job!',
                            text: 'Articles Scrapped Successfully!',
                            icon: 'success'
                        }).then((result) => {
                            location.reload();
                        })
                    }
                }
            }
        })
    })

    // To Save Article
    $(document).on("click", "#saveArticle", function () {
        let thisId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/savedArticles/" + thisId,
        })
    });


    // Saved Articles
    $(document).on("click", "#savedArticles", function () {

        $.ajax({
            method: "GET",
            url: "/savedArticles"
        })
    });

    // Clear Articles
    $(document).on("click", "#clear", function () {

        $.ajax({
            method: "GET",
            url: "/clearArticles",
            success: function (data) {
                if (data) {
                    if (data) {
                        Swal.fire({
                            title: 'Good job!',
                            text: 'Articles Deleted Successfully!',
                            icon: 'success'
                        }).then((result) => {
                            location.reload();
                        })
                    }
                }
            }
        })
    });

    //Notes Mess
    $(document).on("click", "#makeNotes", function () {
        $("#notes").empty();
        let thisId = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/articles/" + thisId,
            success: function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
                if (data) {
                    if (data) {
                        Swal.mixin({
                            input: 'text',
                            confirmButtonText: 'Next &rarr;',
                            showCancelButton: true,
                            // progressSteps: ['1', '2', '3']
                          }).queue([
                            {
                              title: 'Title',
                              text: 'Title'
                            },
                            'Body',
                          ]).then((result) => {
                            if (result.value) {
                              const body = JSON.stringify(result.value)
                              Swal.fire({
                                title: 'Hope these notes were worth it!',
                                html: `
                                  Your notes:
                                  <pre><code>${title}</code></pre>
                                  <pre><code>${answers}</code></pre>
                                `,
                                confirmButtonText: 'Lovely!'
                              })
                            }
                          })
                    }
                }
            }
        })
    })
    $(document).on("click", #)
})
