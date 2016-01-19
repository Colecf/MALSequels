(function() {

  function displayData(results) {
    var hud = $('#colecf-hud');
    hud.empty();
    hud.css('padding', '0px');
    
    for(var type in results) {
      var sectionTitle = $('<div style="color: blue; margin: 5px;">'+type+'</div>');
      var section = $('<div style="margin: 5px; background-color: grey; padding: 2px;" id="colecf-section-'+type.replace(/\s/g, '')+'"></div>');
      sectionTitle.click(function() {
        $(this).parent().find('a.colecf-relatedanimelink').toggle();
      });
      section.append(sectionTitle);
      for(var i=0; i<results[type].length; i++) {
        section.append('<a class="colecf-relatedanimelink" target="_blank" style="padding: 2px; display: block; background-color: lightgrey; border-radius: 5px; margin: 1px;" href="'+results[type][i].link+'">'+results[type][i].title+'</a>');
      }
      section.find('a.colecf-relatedanimelink').toggle();
      hud.append(section);
    }
  }

  if(window.location.href.indexOf('myanimelist.net/animelist/') == -1) {
    alert('Must be run on myanimelist.net/animelist/username');
    return;
  }

  $('#colecf-hud').remove();
  var hud = $('<div id="colecf-hud" style="position: fixed; top: 50px; left: 50px; width: 300px; height: 600px; background-color: green; padding: 5px; font-size: 20px; overflow: auto;">Loading... <span id="colecf-loadingcompleted">0</span>/?</div>');
  $('body').append(hud);

  var completedAnime = $([]);
  var done = false;
  $('table.header_completed ~ table').each(function() {
    console.log($(this).nextAll('table td.category_totals').length);
    if($(this).text().replace(/\s/g, '').indexOf('AnimeTitle') != -1) {
      return;
    }
    if($(this).find('td.category_totals').length != 0 || done) {
      done = true;
      return;
    }
    completedAnime = completedAnime.add(this);
  });
  hud.html('Loading... <span id="colecf-loadingcompleted">0</span>/'+completedAnime.length);

  var completedAnimeTitles = [];
  completedAnime.each(function() {
    completedAnimeTitles.push($(this).find('a.animetitle').text());
    console.log(completedAnimeTitles.length);
  });
  completedAnimeTitles.contains = function(search) {
    for(var i=0; i< completedAnimeTitles.length; i++) {
      if(completedAnimeTitles[i] === search)
        return true;
    }
    return false;
  };

  var completed = 0;
  var results = {};
  completedAnime.each(function() {
    var a = $(this).find('a.animetitle');
    console.log(a.text());
    $.get(a.attr('href'), function(result) {
      var relatedTable = $(result).find('table.anime_detail_related_anime');
      relatedTable.find('tr').each(function() {
        var type = $(this).find('td:first-child').text();
        type = type.substring(0, type.length-1);
        $(this).find('td:last-child a').each(function() {
          var title = $(this).text();
          var link = $(this).attr('href');
          if(completedAnimeTitles.contains(title))
            return;
          if(!results[type])
            results[type] = [];
          results[type].push({title: title, link: link});
        });
      });
      completed++;
      hud.find('#colecf-loadingcompleted').text(completed);
      if(completed == completedAnime.length) {
        displayData(results);
      }
    });
  });
})();
