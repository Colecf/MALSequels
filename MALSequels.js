(function() {
  console.log('run');
  if(window.location.href.indexOf('myanimelist.net') == -1) {
    alert('Must be run on myanimelist.net/animelist/username');
    return;
  }

  var completedAnime = $([]);
  $('table.header_completed ~ table').each(function() {
    if($(this).text().replace(/\s/g, '').indexOf('AnimeTitle') != -1 ||
       $(this).find('td.category_totals').length != 0 ||
       $(this).nextAll('table.header_ptw').length === 0) {
      return;
    }
    completedAnime = completedAnime.add(this);
  });
  var hud = $('<div style="position: fixed; top: 50px; left: 50px; width: 300px; height: 200px; background-color: green; padding: 5px; font-size: 20px;">Loading... <span id="colecf-loadingcompleted">0</span>/'+completedAnime.length+'</div>');
  $('body').append(hud);

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
        if(!results[type])
          results[type] = [];
        results[type].push($(this).find('td:last-child').text());
      });
      completed++;
      hud.find('#colecf-loadingcompleted').text(completed);
      if(completed == completedAnime.length) {
        console.log(results);
      }
    });
  });
})();
