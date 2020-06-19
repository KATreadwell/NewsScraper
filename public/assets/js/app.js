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

    // to Make Note
    $(document).on("click", "#makeNotes", function(){
        console.log($(this).attr("data-id"))
        $("#saveNote").attr("data-id", $(this).attr("data-id"))
    });

    // To Save Note
    $(document).on("click", "#saveNote", function(){
        let thisId = $(this).attr("data-id");
        console.log($(this).attr("data-id"))
        let note = {
            title: $(".noteTitle").val(),
            body: $(".noteBody").val(),
            articleId: thisId
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
