var query;
var SWSearchTerm;
var SWAPIURL = "https://swapi.co/api/people/";
var WIKIAURLID = "https://starwars.wikia.com/api/v1/Articles/AsSimpleJson";
var WIKIAURLSearch = "https://starwars.wikia.com/api/v1/Search/List";
//Loading List each time takes some time
var charList = ["Luke Skywalker", "C-3PO", "R2-D2", "Darth Vader", "Leia Organa", "Owen Lars", "Beru Whitesun lars", 
"R5-D4", "Biggs Darklighter", "Obi-Wan Kenobi", "Anakin Skywalker", "Wilhuff Tarkin", "Chewbacca", "Han Solo", "Greedo", 
"Jabba Desilijic Tiure", "Wedge Antilles", "Jek Tono Porkins", "Yoda", "Palpatine", "Boba Fett", "IG-88", "Bossk", 
"Lando Calrissian", "Lobot", "Ackbar", "Mon Mothma", "Arvel Crynyd", "Wicket Systri Warrick", "Nien Nunb", "Qui-Gon Jinn", 
"Nute Gunray", "Finis Valorum", "Jar Jar Binks", "Roos Tarpals", "Rugor Nass", "Ric Olié", "Watto", "Sebulba", "Quarsh Panaka", 
"Shmi Skywalker", "Darth Maul", "Bib Fortuna", "Ayla Secura", "Dud Bolt", "Gasgano", "Ben Quadinaros", "Mace Windu", 
"Ki-Adi-Mundi", "Kit Fisto", "Eeth Koth", "Adi Gallia", "Saesee Tiin", "Yarael Poof", "Plo Koon", "Mas Amedda", "Gregar Typho", 
"Cordé", "Cliegg Lars", "Poggle the Lesser", "Luminara Unduli", "Barriss Offee", "Dormé", "Dooku", "Bail Prestor Organa", 
"Jango Fett", "Zam Wesell", "Dexter Jettster", "Lama Su", "Taun We", "Jocasta Nu", "Ratts Tyerell", "R4-P17", "Wat Tambor", 
"San Hill", "Shaak Ti", "Grievous", "Tarfful", "Raymus Antilles", "Sly Moore", "Tion Medon", "Finn", "Rey", "Poe Dameron", 
"BB8", "Captain Phasma", "Padmé Amidala"];


function getDataFromSWAPI(callback) {
	var settings = {
		search: query
	};
	$.getJSON(SWAPIURL, settings, callback);
}

function getCharacterList(URL, callback) {
	var settings = {
		search: ""
	};
	$.getJSON(URL, callback);
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
		if(key === "name" || key === "height" || key === "mass" || key === "hair_color" || key === "skin_color" || key === "eye_color" || key === "birth_year" || key === "gender")
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
function appendCharacters(data) {
	for(var i=0; i<data.results.length; i++) {
		charList.push(data.results[i].name);
	}
	if(data.next) {
		getCharacterList(data.next, appendCharacters);
	}
}
function displayCharacterList() {
	console.log(charList.length);
	var divisor = charList.length/3;
	var list1= "<ul class='column-one'>";
	var list2= "<ul class='column-two'>";
	var list3= "<ul class='column-three'>";
	for(var j=0; j<charList.length; j++) {
		if(j<divisor) {
			list1 += "<li><a href='#'>"+charList[j]+"</a></li>";
		}
		else if(j<divisor*2) {
			list2 += "<li><a href='#'>"+charList[j]+"</a></li>";	
		}
		else {
			list3 += "<li><a href='#'>"+charList[j]+"</a></li>";
		}
	}
	list1 += "</ul>";
	list2 += "</ul>";
	list3 += "</ul>";
	$(".column-one").html(list1);
	$(".column-two").html(list2);
	$(".column-three").html(list3);
	console.log(charList);
}

function getImage(data) {
	$('.character-image').html('<img src="'+data.value[0].contentUrl+'">');
}

function onSearch() {
	// getCharacterList(SWAPIURL, appendCharacters);
	$(".view-list").click(function(event) {
		event.preventDefault();
		displayCharacterList();
		$(".character-list").css("visibility","visible");
		$(".content-overlay-list").css("visibility","visible");
		$(".overlay-large-list").css("visibility","visible");
	});
	$(".character-list").on("click","a", function(event) {
		event.preventDefault();
		query = $(this).text();
		getDataFromSWAPI(displaySWAPI);
		$(".character-list").css("visibility","hidden");
		$(".content-overlay-list").css("visibility","hidden");
		$(".overlay-large-list").css("visibility","hidden");
		$(".content-overlay").css("visibility","visible");
		$(".overlay-large").css("visibility","visible");

	});
	$(".js-search-form").submit(function(event) {
		event.preventDefault();
		query = $("input").val();
		getDataFromSWAPI(displaySWAPI);
		$(".character-list").css("visibility","hidden");
		$(".content-overlay").css("visibility","visible");
		$(".overlay-large").css("visibility","visible");
	});
	$(".close-box").click(function(event) {
	    event.stopPropagation();
	    $(".character-list").css("visibility","hidden");
		$(".overlay-large").css("visibility","hidden");
		$(".content-overlay").css("visibility","hidden");
		$(".overlay-large-list").css("visibility","hidden");
		$(".content-overlay-list").css("visibility","hidden");
		$("img, ul, p").remove();
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