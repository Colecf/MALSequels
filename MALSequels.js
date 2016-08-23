(function() {
  if(window.location.href.indexOf('myanimelist.net/animelist/') == -1) {
    alert('Must be run on myanimelist.net/animelist/username');
    return;
  }

  function getUsername() {
    var url = window.location.href;
    return url.substring(url.lastIndexOf('/')+1);
  }

  function displayData(results) {
    var hud = $('#colecf-hud');
    hud.empty();
    hud.css('padding', '0px');
    hud.css('height', '600px');
    hud.css('border', '1px solid black');

    var saveData = "<h2>Related to what "+getUsername()+" has watched</h2>";

    for(var type in results) {
      saveData += type+'<br/><br/>';
      var sectionTitle = $('<div style="color: blue; margin: 5px;">'+type+'</div>');
      var section = $('<div style="margin: 5px; background-color: grey; padding: 2px;" id="colecf-section-'+type.replace(/\s/g, '')+'"></div>');
      sectionTitle.click(function() {
        $(this).parent().find('a.colecf-relatedanimelink').toggle();
      });
      section.append(sectionTitle);
      for(var i=0; i<results[type].length; i++) {
        section.append('<a class="colecf-relatedanimelink" target="_blank" style="padding: 2px; display: block; background-color: lightgrey; border-radius: 5px; margin: 1px;" href="'+results[type][i].link+'">'+results[type][i].title+'</a>');
        saveData += '<a target="_blank" href="http://myanimelist.net'+results[type][i].link+'">'+results[type][i].title+'</a><br/>';
      }
      saveData += '<br/>';
      hud.append(section);
    }
    hud.find('a.colecf-relatedanimelink').hide();

    var saveButton = $('<button id="colecf-savebutton">Save</button>');
    saveButton.click(function() {
      window.open('data:text/html;encoding=utf-8,'+
                  encodeURIComponent(saveData));
    });
    hud.prepend(saveButton);
  }

  if($('#colecf-hud')) {
    $('#colecf-hud').remove();
  }
  var hud = $('<div id="colecf-hud" style="position: fixed; top: 50px; left: 50px; width: 300px; background-color: green; padding: 5px; font-size: 20px; overflow: auto;">Loading... <span id="colecf-loadingcompleted">0</span>/?</div>');
  $('body').append(hud);

  var completedAnime = $([]);
  var done = false;
  $('table.header_completed ~ table').each(function() {
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
    completedAnimeTitles.push($(this).find('a.animetitle').text().trim());
  });

  var results = {};
  function loadThese(toLoad, start, cb) {
    var completed = 0;
    toLoad.each(function() {
      var a = $(this).find('a.animetitle');
      $.get(a.attr('href'), function(result) {
        var relatedTable = $(result).find('table.anime_detail_related_anime');
        relatedTable.find('tr').each(function() {
          var type = $(this).find('td:first-child').text();
          type = type.substring(0, type.length-1);
          $(this).find('td:last-child a').each(function() {
            var title = $(this).text().trim();
            var link = $(this).attr('href');
            
            //In case we've already watched it
            if($.inArray(title, completedAnimeTitles) > -1)
              return;
            
            //In case this anime is related to multiple other anime
            if(results[type] && $.inArray(title, results[type].map(function(obj){return obj.title;})) > -1)
              return;
            if(!results[type])
              results[type] = [];
            results[type].push({title: title, link: link});
          });
        });
        completed++;
        hud.find('#colecf-loadingcompleted').text(completed+start);
        if(completed == toLoad.length) {
          cb();
        }
      });
    });
  }
  
  var start = 0;
  function loadAll() {
    if(start <= completedAnime.length-5) {
      setTimeout(function() {
        loadThese(completedAnime.slice(start, start+5), start, loadAll);
        start += 5;
      }, start === 0 ? 0 : 3000);
    } else {
      displayData(results);
    }
  }
  loadAll();
})();
