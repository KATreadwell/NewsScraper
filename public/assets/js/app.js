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

    // To Make Note
    $(document).on("click", "#saveNote", function(){
        let thisId = $(this).attr("data-id");
        console.log(thisId)
        let note = {
            title: $(".noteTitle").val(),
            body: $(".noteBody").val()
        }

        $.ajax({
            method: "POST",
            url: "/note/" + thisId,
            data: note,
        }).then(()=>{
            $("textarea").val("")
            $("input").val("")
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
})
