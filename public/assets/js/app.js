$(document).ready(function(){




// Scrape New Articles
$(document).on("click", "#scrape", function () {
    $.ajax({
        method: "GET",
        url: "/scrape",
        success: function(){
            if(data){
                Swal.fire(
                    'Good job!',
                    'Articles Scrapped Successfully!',
                    'success'
                  )
            }
          
              

        }
    })
})


// $.getJSON("/", function (data) {
//     for (let i = 0; i < data.length; i++) {
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + data[i].summary);
//     }
// });


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
        success: function(data){
            if(data){
                Swal.fire(
                    'Good job!',
                    'Articles Deleted Successfully!',
                    'success'
                  )
            }
         
        }
    })
});
})
