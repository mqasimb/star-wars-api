var query;
var SWSearchTerm;
var SWAPIURL = "https://swapi.co/api/people/";
var BINGURL;
var WIKIAURLID = "https://starwars.wikia.com/api/v1/Articles/AsSimpleJson";
var WIKIAURLSearch = "https://starwars.wikia.com/api/v1/Search/List";



function getDataFromSWAPI(callback) {
	var settings = {
		search: query
	};
	$.getJSON(SWAPIURL, settings, callback);
}

function getDataFromBING(callback) {
        var params = {
            q: SWSearchTerm
        };
      
        $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","multipart/form-data");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","9863db6f1b7d41a8ad47fa015969167e");
            },
            type: "POST",
            // Request body
            data: "{body}",
        })
        .done(function(data) {
            callback(data);
        })
        .fail(function() {
            alert("error");
        });
}

function getArticleIDFromWIKIA(callback) {
    var settings = {
		query: SWSearchTerm
	};
	$.getJSON(WIKIAURLSearch, settings, callback);
}

function getArticleFromWIKIA(articleID, callback) {
    var settings = {
        id: articleID
    };
    $.getJSON(WIKIAURLID, settings, callback);
}
function displaySWAPI(data) {
    SWSearchTerm = data.results[0].name;
    getDataFromBING(getImage);
    getArticleIDFromWIKIA(articleIDDisplay);
	var listofData = "<ul>";
	for (var key in data.results[0]) {
		if(typeof(data.results[0][key])==="string") {
			listofData += '<li>'+key.toTitleCase()+': '+data.results[0][key].toTitleCase()+'</li>';
	}
		else {
			listofData += '<li>'+key.toTitleCase()+': '+data.results[0][key]+'</li>';
		}
	}
	listofData += "</ul>";
	htmlList = listofData.replace(/_/g, " ");
	$('.character-details').html(htmlList);
}

function articleIDDisplay(data) {
    getArticleFromWIKIA(data.items[0].id,displayArticle);
}

function displayArticle(data) {
    Title = "<h1>"+data.sections[0].title+"</h1>";
    Article = "";
    data.sections[0].content.forEach(function(item) {
        Article += "<p>"+item.text+"</p>";
    });
    $(".content-title").html(Title);
    $(".article").html(Article);
}

function getImage(data) {
	$('.character-image').html('<img src="'+data.value[0].contentUrl+'">');
}

function onSearch() {
	$(".js-search-form").submit(function(event) {
		event.preventDefault();
		query = $("input").val();
		getDataFromSWAPI(displaySWAPI);
		$(".content-overlay").css("visibility","visible");
		$(".overlay-large").css("visibility","visible");
	});
	$(".overlay-large").click(function(event) {
	    event.stopPropagation();
		$(".overlay-large").css("visibility","hidden");
		$(".content-overlay").css("visibility","hidden");
		$("img ul").remove();
	});
}
String.prototype.toTitleCase = function(){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (match.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};

onSearch();