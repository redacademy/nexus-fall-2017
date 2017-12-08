(function ($) {
  console.log('whatever');
  // Ajax functions
  function ajaxGet(request) {
    console.log(api_vars.root_url + request);
    $.ajax({
        method: 'get',
        // Go to the wordpress rest api and get the request
        url: api_vars.root_url + request,
      })
      .done(function (data) {
        // Loop through the returned results
        for (var i = 0; i < data.length; i++){
          
          // Construct an article from each returned Object
          var post = data[i];
          var image = '';
          var school = post['_nexus_program_school'];
          var title = post['_nexus_program_title'];
          var programContainer = 'program-container-' + i;
          var programType = post['_nexus_program_type'];
          var link = api_vars.home_url + '/' + post['slug'];
        
          if (post['featured_media']){
            image = post['_embedded']['wp:featuredmedia'][0]['source_url'];
          }
          var article = '<article class=program-container "' + programContainer + '">';
          article += '<div class="program-link"><a href="' + link + '">'
          article += '<div class="program-image"><img src="' + image + '"></div>'
          article += '<div class="program-school">' + school + '</div>'; 
          article += '<div class="program-title">' + title + '</div>';
          for (var program in programType){
            article += '<div class ="program-type">' + programType[program] + '</div>'
          }
          article += '</a></div></article>'

          $('.search-results').append(article);

        } // for loop
      });
  }

  function requestFilter () {
    var program = $('select[name*="programfilter"').val();
    var province = $('select[name*="provincefilter"').val();
    var request = 'wp/v2/nexus_program/?_embed&filter';
    if (program === 'program' && province === 'province') {
      return;
    } else if (program === 'program') {
      request += '[provinces]=' + province;
    } else if (province === 'province') {
      request += '[program_type]=' + program;
    } else {
      request += '[program_type]=' + program + '&filter[provinces]=' + province;
    }
    return request;
  }


  var submitted = false;
  $('.program-filter-submit').on('click', function (event){
    event.preventDefault();
    submitted = true;
    $('.search-results').empty();
    var request = requestFilter();

    ajaxGet(request);
  });

//single-nexus_faq dropdown menus
$(function () {
  $('.homestay-button').click(function () {
      $(this).next('.faq-dropdown').slideToggle("swing");
      
      $(this).parent().next().slideToggle();
      return false;
  });
});


  $('select').on('change', function() {
    if (submitted) {
       $('.search-results').empty();
      var request = requestFilter();
      if (request === undefined) {
        return true;
      }
      ajaxGet(request);
    }
  })

})(jQuery);


