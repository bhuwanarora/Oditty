function handle_quotes(quotes, index){
  if(index<quotes.length){
    quote = quotes[index].quote
    author = quotes[index].author
    $('.quote').html("\""+quote.trim()+"\"")
    $('.author').html(author)
    $('.quotes').fadeIn(2000, 'linear')
    // return false
    $('.quotes').fadeOut(15000, 'swing', function(){
      index = index + 1
      handle_quotes(quotes, index)
    })
  }
}

function quote_display(){
  $.ajax({
    url: $('.quotes').data('href'),
    success: function(data, textStatus, jqXHR){
      handle_quotes(data.quotes, 0)
    },
    error: function(jqXHR, textStatus, error){
      quote_display();
    }
  })
}