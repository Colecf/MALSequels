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
  completedAnime.each(function() {
    console.log($(this).find('a.animetitle').text());
  });
})();
