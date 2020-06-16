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
            url: "/articles/" + thisId,
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
})
